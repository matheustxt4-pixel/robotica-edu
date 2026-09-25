import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseDemo } from '../config/firebase';
import { UserProgress, LessonStatus } from '../types';

class ProgressService {
  private localProgressKey = 'robotica_progress_v1';

  /**
   * Obtém todo o progresso do aluno para as lições
   */
  public async getStudentProgress(studentId: string): Promise<Record<string, UserProgress>> {
    const progressMap: Record<string, UserProgress> = {};

    if (!isFirebaseDemo) {
      try {
        const q = query(collection(db, 'progress'), where('studentId', '==', studentId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          snap.docs.forEach(d => {
            const p = d.data() as UserProgress;
            progressMap[p.lessonId] = p;
          });
          return progressMap;
        }
      } catch (e) {
        console.warn('Buscando progresso local:', e);
      }
    }

    const localList = this.getLocalProgressList();
    localList.filter(p => p.studentId === studentId).forEach(p => {
      progressMap[p.lessonId] = p;
    });

    return progressMap;
  }

  /**
   * Retorna a quantidade de unidades concluídas pelo aluno
   */
  public getCompletedUnitsCount(studentId: string): number {
    const list = this.getLocalProgressList();
    const completedUnits = new Set<string>();
    list.filter(p => p.studentId === studentId && (p.status === 'completed' || p.status === 'perfect'))
        .forEach(p => completedUnits.add(p.unitId));
    return completedUnits.size;
  }

  /**
   * Avalia e retorna o status de uma lição (locked, available, completed, perfect)
   */
  public getLessonStatus(
    lessonId: string,
    isFirstLessonInWorld: boolean,
    prevLessonId: string | null,
    progressMap: Record<string, UserProgress>
  ): LessonStatus {
    const existing = progressMap[lessonId];
    if (existing) {
      return existing.status;
    }

    // Se é a primeiríssima lição do mundo, já nasce disponível
    if (isFirstLessonInWorld) {
      return 'available';
    }

    // Se a lição anterior foi concluída ou perfeita, desbloqueia esta
    if (prevLessonId && progressMap[prevLessonId]) {
      const prevStatus = progressMap[prevLessonId].status;
      if (prevStatus === 'completed' || prevStatus === 'perfect') {
        return 'available';
      }
    }

    return 'locked';
  }

  /**
   * Registra a conclusão de uma lição e concede estrelas
   */
  public async completeLesson(params: {
    studentId: string;
    lessonId: string;
    unitId: string;
    scorePercent: number; // 0 a 100
  }): Promise<UserProgress> {
    const { studentId, lessonId, unitId, scorePercent } = params;

    let stars = 1;
    if (scorePercent >= 90) stars = 3;
    else if (scorePercent >= 60) stars = 2;

    const status: LessonStatus = stars === 3 ? 'perfect' : 'completed';
    const progressId = `${studentId}_${lessonId}`;

    const progressRecord: UserProgress = {
      id: progressId,
      studentId,
      lessonId,
      unitId,
      status,
      stars,
      score: scorePercent,
      completedAt: new Date().toISOString()
    };

    if (!isFirebaseDemo) {
      try {
        await setDoc(doc(db, 'progress', progressId), progressRecord, { merge: true });
      } catch (e) {
        console.warn('Erro ao salvar progresso no Firestore:', e);
      }
    }

    this.saveLocalProgress(progressRecord);
    return progressRecord;
  }

  private getLocalProgressList(): UserProgress[] {
    try {
      const data = localStorage.getItem(this.localProgressKey);
      return data ? JSON.parse(data) : [
        {
          id: 'demo_prog_1',
          studentId: 'student_demo_123',
          lessonId: 'les_3_1_1',
          unitId: 'unit_3_1',
          status: 'completed',
          stars: 3,
          score: 100,
          completedAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  }

  private saveLocalProgress(record: UserProgress) {
    const list = this.getLocalProgressList();
    const index = list.findIndex(p => p.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.push(record);
    }
    try {
      localStorage.setItem(this.localProgressKey, JSON.stringify(list));
    } catch {}
  }
}

export const progressService = new ProgressService();
