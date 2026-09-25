import { doc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseDemo } from '../config/firebase';
import { ClassRoom, ClassMember, UserProfile } from '../types';

class ClassService {
  private localClassesKey = 'robotica_classes_v1';
  private localMembersKey = 'robotica_members_v1';
  private registeredStudentsKey = 'robotica_registered_students_v1';

  /**
   * Gera um código de sala aleatório amigável no formato ROB-XXXX
   */
  public generateClassCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ROB-${randomPart}`;
  }

  /**
   * Cria uma nova turma para um professor
   */
  public async createClass(params: {
    teacherId: string;
    schoolId?: string;
    name: string; // Ex: "3º Ano A"
    grade: number;
  }): Promise<ClassRoom> {
    const { teacherId, schoolId = 'school_demo', name, grade } = params;
    const classId = `class_${Date.now()}`;
    const classCode = this.generateClassCode();

    const newClass: ClassRoom = {
      id: classId,
      name,
      grade,
      schoolId,
      teacherId,
      classCode,
      settings: { showLeaderboard: true },
      createdAt: new Date().toISOString()
    };

    if (!isFirebaseDemo) {
      try {
        await setDoc(doc(db, 'classes', classId), newClass);
      } catch (e) {
        console.warn('Salvando turma localmente:', e);
      }
    }

    this.saveLocalClass(newClass);
    return newClass;
  }

  /**
   * Busca todas as turmas de um determinado professor
   */
  public async getClassesByTeacher(teacherId: string): Promise<ClassRoom[]> {
    if (!isFirebaseDemo) {
      try {
        const q = query(collection(db, 'classes'), where('teacherId', '==', teacherId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as ClassRoom);
        }
      } catch (e) {
        console.warn('Buscando turmas locais:', e);
      }
    }

    const local = this.getLocalClasses();
    return local.filter(c => c.teacherId === teacherId);
  }

  /**
   * Valida e busca uma turma pelo código da sala (ex: ROB-4821)
   */
  public async getClassByCode(classCode: string): Promise<ClassRoom | null> {
    const formattedCode = classCode.trim().toUpperCase();

    if (!isFirebaseDemo) {
      try {
        const q = query(collection(db, 'classes'), where('classCode', '==', formattedCode));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs[0].data() as ClassRoom;
        }
      } catch (e) {
        console.warn('Erro ao consultar código da sala no Firestore:', e);
      }
    }

    const local = this.getLocalClasses();
    return local.find(c => c.classCode === formattedCode) || null;
  }

  /**
   * Busca turma por ID
   */
  public async getClassById(classId: string): Promise<ClassRoom | null> {
    const local = this.getLocalClasses();
    return local.find(c => c.id === classId) || null;
  }

  /**
   * Adiciona um aluno a uma turma
   */
  public async joinClass(studentId: string, studentNickname: string, studentAvatar: string, classCode: string): Promise<boolean> {
    const classRoom = await this.getClassByCode(classCode);
    if (!classRoom) return false;

    const memberId = `${classRoom.id}_${studentId}`;
    const member: ClassMember = {
      id: memberId,
      classId: classRoom.id,
      studentId,
      studentNickname,
      studentAvatar,
      totalXP: 100,
      joinedAt: new Date().toISOString()
    };

    if (!isFirebaseDemo) {
      try {
        await setDoc(doc(db, 'classMembers', memberId), member);
      } catch (e) {
        console.warn('Erro ao salvar membro da turma no Firestore:', e);
      }
    }

    this.saveLocalMember(member);
    return true;
  }

  /**
   * Retorna os alunos vinculados a uma turma específica
   */
  public async getStudentsByClass(classId: string): Promise<UserProfile[]> {
    const studentMap = new Map<string, UserProfile>();

    // 1. Buscar do LocalStorage (registered students)
    try {
      const data = localStorage.getItem(this.registeredStudentsKey);
      if (data) {
        const parsed: Record<string, { password: string; profile: UserProfile }> = JSON.parse(data);
        const classRoom = await this.getClassById(classId);
        const targetCode = classRoom?.classCode;

        Object.values(parsed).forEach(item => {
          const p = item.profile;
          if (p.classId === classId || p.classId === targetCode) {
            studentMap.set(p.uid, { ...p, classId });
          }
        });
      }
    } catch (e) {
      console.warn('Erro ao buscar alunos cadastrados locais:', e);
    }

    // 2. Se a turma for a de demonstração e estiver vazia, carrega alunos demo padrão
    if (classId === 'class_demo_3a' && studentMap.size === 0) {
      const demoStudents: UserProfile[] = [
        {
          uid: 'student_demo_1',
          name: 'Ana Souza',
          nickname: 'AnaRobô',
          email: 'ana@aluno.local',
          role: 'student',
          classId: 'class_demo_3a',
          teacherId: 'teacher_demo_456',
          grade: 3,
          avatar: 'avatar_bot_blue',
          mascot: 'robi',
          xp: 850,
          level: 4,
          streak: 5,
          createdAt: new Date().toISOString()
        },
        {
          uid: 'student_demo_123',
          name: 'Lucas Silva',
          nickname: 'LucasRobô',
          email: 'lucas@aluno.local',
          role: 'student',
          classId: 'class_demo_3a',
          teacherId: 'teacher_demo_456',
          grade: 3,
          avatar: 'avatar_bot_yellow',
          mascot: 'byte',
          xp: 790,
          level: 3,
          streak: 3,
          createdAt: new Date().toISOString()
        },
        {
          uid: 'student_demo_3',
          name: 'Pedro Santos',
          nickname: 'PedroTech',
          email: 'pedro@aluno.local',
          role: 'student',
          classId: 'class_demo_3a',
          teacherId: 'teacher_demo_456',
          grade: 3,
          avatar: 'avatar_bot_green',
          mascot: 'volt',
          xp: 620,
          level: 3,
          streak: 2,
          createdAt: new Date().toISOString()
        },
        {
          uid: 'student_demo_4',
          name: 'Mariana Lima',
          nickname: 'MariBot',
          email: 'mariana@aluno.local',
          role: 'student',
          classId: 'class_demo_3a',
          teacherId: 'teacher_demo_456',
          grade: 3,
          avatar: 'avatar_bot_purple',
          mascot: 'spark',
          xp: 540,
          level: 2,
          streak: 1,
          createdAt: new Date().toISOString()
        }
      ];
      demoStudents.forEach(st => studentMap.set(st.uid, st));
    }

    // 3. Buscar do Firestore se não estiver em demo puro
    if (!isFirebaseDemo) {
      try {
        const q = query(collection(db, 'users'), where('classId', '==', classId));
        const snap = await getDocs(q);
        snap.docs.forEach(d => {
          const profile = d.data() as UserProfile;
          studentMap.set(profile.uid, profile);
        });
      } catch (e) {
        console.warn('Erro ao carregar alunos do Firestore:', e);
      }
    }

    return Array.from(studentMap.values());
  }

  /**
   * Retorna os alunos de todas as turmas de um determinado professor
   */
  public async getStudentsByTeacher(teacherId: string): Promise<UserProfile[]> {
    const teacherClasses = await this.getClassesByTeacher(teacherId);
    const studentMap = new Map<string, UserProfile>();

    for (const cls of teacherClasses) {
      const clsStudents = await this.getStudentsByClass(cls.id);
      clsStudents.forEach(st => studentMap.set(st.uid, st));
    }

    return Array.from(studentMap.values());
  }

  /**
   * Permite que o professor cadastre um aluno diretamente em sua turma
   */
  public async createStudentForClass(params: {
    teacherId: string;
    classId: string;
    name: string;
    nickname: string;
    password?: string;
    grade?: number;
    avatar?: string;
    mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
  }): Promise<UserProfile> {
    const { teacherId, classId, name, nickname, password = '123', grade = 3, avatar = 'avatar_bot_blue', mascot = 'robi' } = params;

    const classRoom = await this.getClassById(classId);
    const classCode = classRoom ? classRoom.classCode : 'ROB-DEMO';

    const cleanKey = nickname.toLowerCase().trim();
    const uid = `student_${cleanKey.replace(/\s+/g, '_')}_${Date.now()}`;

    const newStudentProfile: UserProfile = {
      uid,
      name,
      nickname,
      email: `${cleanKey}@aluno.local`,
      role: 'student',
      classId,
      teacherId,
      schoolId: classRoom?.schoolId || 'school_demo',
      grade: classRoom ? classRoom.grade : grade,
      avatar,
      mascot,
      xp: 100,
      level: 1,
      streak: 1,
      createdAt: new Date().toISOString()
    };

    // 1. Salvar no mapa local de alunos cadastrados
    try {
      const data = localStorage.getItem(this.registeredStudentsKey);
      const store = data ? JSON.parse(data) : {};
      store[cleanKey] = { password, profile: newStudentProfile };
      localStorage.setItem(this.registeredStudentsKey, JSON.stringify(store));
    } catch {}

    // 2. Registrar como membro da turma
    await this.joinClass(uid, nickname, avatar, classCode);

    // 3. Salvar no Firestore se aplicável
    if (!isFirebaseDemo) {
      try {
        await setDoc(doc(db, 'users', uid), newStudentProfile);
      } catch (e) {
        console.warn('Erro ao criar aluno no Firestore:', e);
      }
    }

    return newStudentProfile;
  }

  /**
   * Remove um aluno de uma turma
   */
  public async removeStudentFromClass(classId: string, studentId: string): Promise<boolean> {
    // 1. Atualizar LocalStorage de membros
    const members = this.getLocalMembers().filter(m => !(m.classId === classId && m.studentId === studentId));
    try {
      localStorage.setItem(this.localMembersKey, JSON.stringify(members));
    } catch {}

    // 2. Remover do mapa de alunos cadastrados localmente se vinculado
    try {
      const data = localStorage.getItem(this.registeredStudentsKey);
      if (data) {
        const store: Record<string, { password: string; profile: UserProfile }> = JSON.parse(data);
        for (const [key, val] of Object.entries(store)) {
          if (val.profile.uid === studentId && (val.profile.classId === classId)) {
            delete store[key];
          }
        }
        localStorage.setItem(this.registeredStudentsKey, JSON.stringify(store));
      }
    } catch {}

    // 3. Firestore
    if (!isFirebaseDemo) {
      try {
        const memberId = `${classId}_${studentId}`;
        await deleteDoc(doc(db, 'classMembers', memberId));
      } catch (e) {
        console.warn('Erro ao remover aluno do Firestore:', e);
      }
    }

    return true;
  }

  private getLocalClasses(): ClassRoom[] {
    try {
      const data = localStorage.getItem(this.localClassesKey);
      return data ? JSON.parse(data) : [
        {
          id: 'class_demo_3a',
          name: '3º Ano A — Robótica',
          grade: 3,
          schoolId: 'school_demo',
          teacherId: 'teacher_demo_456',
          classCode: 'ROB-4821',
          settings: { showLeaderboard: true },
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  }

  private saveLocalClass(cls: ClassRoom) {
    const classes = this.getLocalClasses();
    classes.push(cls);
    try {
      localStorage.setItem(this.localClassesKey, JSON.stringify(classes));
    } catch {}
  }

  private getLocalMembers(): ClassMember[] {
    try {
      const data = localStorage.getItem(this.localMembersKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalMember(member: ClassMember) {
    const members = this.getLocalMembers();
    members.push(member);
    try {
      localStorage.setItem(this.localMembersKey, JSON.stringify(members));
    } catch {}
  }
}

export const classService = new ClassService();
