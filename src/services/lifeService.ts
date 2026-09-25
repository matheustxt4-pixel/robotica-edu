export interface StudentLives {
  studentId: string;
  lives: number; // Max 3
  maxLives: number; // 3
  lastResetDate: string; // YYYY-MM-DD
}

class LifeService {
  private localKey = 'robotica_student_lives_v1';
  public readonly MAX_DAILY_LIVES = 3;

  /**
   * Obtém as vidas atuais do aluno, renovando automaticamente para 3 se for um novo dia.
   * As vidas diárias não se acumulam de um dia para o outro.
   */
  public getStudentLives(studentId: string): StudentLives {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const data = localStorage.getItem(`${this.localKey}_${studentId}`);
      if (data) {
        const parsed: StudentLives = JSON.parse(data);
        // Se mudou o dia, renova para 3 vidas (não acumulativas)
        if (parsed.lastResetDate !== todayStr) {
          const resetLives: StudentLives = {
            studentId,
            lives: this.MAX_DAILY_LIVES,
            maxLives: this.MAX_DAILY_LIVES,
            lastResetDate: todayStr
          };
          this.saveLives(resetLives);
          return resetLives;
        }
        return parsed;
      }
    } catch {}

    const defaultLives: StudentLives = {
      studentId,
      lives: this.MAX_DAILY_LIVES,
      maxLives: this.MAX_DAILY_LIVES,
      lastResetDate: todayStr
    };
    this.saveLives(defaultLives);
    return defaultLives;
  }

  /**
   * Desconta 1 vida do aluno em caso de erro na atividade.
   */
  public deductLife(studentId: string): StudentLives {
    const current = this.getStudentLives(studentId);
    const newLives = Math.max(0, current.lives - 1);
    const updated: StudentLives = { ...current, lives: newLives };
    this.saveLives(updated);
    return updated;
  }

  /**
   * Recarrega as vidas para 3 (ao completar uma unidade ou conquista).
   */
  public refillLives(studentId: string): StudentLives {
    const todayStr = new Date().toISOString().split('T')[0];
    const refilled: StudentLives = {
      studentId,
      lives: this.MAX_DAILY_LIVES,
      maxLives: this.MAX_DAILY_LIVES,
      lastResetDate: todayStr
    };
    this.saveLives(refilled);
    return refilled;
  }

  private saveLives(data: StudentLives) {
    try {
      localStorage.setItem(`${this.localKey}_${data.studentId}`, JSON.stringify(data));
    } catch {}
  }
}

export const lifeService = new LifeService();

