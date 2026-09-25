import { DEFAULT_XP_REWARDS } from '../config/constants';
import { calculateLevelFromXP } from '../config/xpRules';
import { XPEvent, UserProfile } from '../types';

export interface XPResult {
  xpGained: number;
  totalXP: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  event: XPEvent;
}

class XPService {
  private xpHistoryKey = 'robotica_xp_events_v1';

  /**
   * Valida e calcula o XP a ser concedido a um aluno por uma lição ou atividade.
   * Evita duplicidade de concessão para o mesmo evento/lição.
   */
  /**
   * Recalcula o XP total real do aluno somando o XP de todas as lições concluídas e eventos registrados
   */
  public syncStudentXP(studentId: string, currentProfile: UserProfile, completedLessonsCount: number): UserProfile {
    const history = this.getHistory().filter(e => e.studentId === studentId);
    const historyXP = history.reduce((sum, e) => sum + (e.amount || 0), 0);
    const lessonsXP = completedLessonsCount * 30;

    const baseXP = 100;
    const calculatedXP = baseXP + Math.max(historyXP, lessonsXP);

    const targetXP = Math.max(currentProfile.xp || 100, calculatedXP);
    const newLevel = calculateLevelFromXP(targetXP).level;

    return {
      ...currentProfile,
      xp: targetXP,
      level: newLevel
    };
  }

  public awardXP(params: {
    studentId: string;
    currentTotalXP: number;
    reason: 'lesson_completed' | 'first_attempt' | 'unit_completed' | 'perfect_score' | 'game_level';
    sourceId: string;
    customXP?: number;
  }): XPResult {
    const { studentId, currentTotalXP, reason, sourceId, customXP } = params;

    // Verificar histórico de auditoria para impedir XP duplicado na mesma lição
    const isDuplicate = this.isDuplicateEvent(studentId, sourceId, reason);
    const xpGained = isDuplicate ? 0 : (customXP ?? this.getDefaultReward(reason));

    const oldLevel = calculateLevelFromXP(currentTotalXP).level;
    const newTotalXP = currentTotalXP + xpGained;
    const newLevel = calculateLevelFromXP(newTotalXP).level;
    const leveledUp = newLevel > oldLevel;

    const event: XPEvent = {
      id: `xp_${studentId}_${sourceId}_${reason}_${Date.now()}`,
      studentId,
      amount: xpGained,
      reason,
      sourceId,
      timestamp: new Date().toISOString()
    };

    if (xpGained > 0) {
      this.recordEvent(event);
    }

    return {
      xpGained,
      totalXP: newTotalXP,
      oldLevel,
      newLevel,
      leveledUp,
      event
    };
  }

  private getDefaultReward(reason: XPEvent['reason']): number {
    switch (reason) {
      case 'lesson_completed':
        return DEFAULT_XP_REWARDS.LESSON_COMPLETED_BONUS;
      case 'first_attempt':
        return DEFAULT_XP_REWARDS.FIRST_ATTEMPT_BONUS;
      case 'perfect_score':
        return DEFAULT_XP_REWARDS.PERFECT_LESSON_BONUS;
      case 'unit_completed':
        return DEFAULT_XP_REWARDS.UNIT_COMPLETED_BONUS;
      case 'game_level':
        return DEFAULT_XP_REWARDS.GAME_LEVEL_COMPLETED;
      default:
        return DEFAULT_XP_REWARDS.ACTIVITY_CORRECT;
    }
  }

  private isDuplicateEvent(studentId: string, sourceId: string, reason: string): boolean {
    const history = this.getHistory();
    return history.some(e => e.studentId === studentId && e.sourceId === sourceId && e.reason === reason);
  }

  private recordEvent(event: XPEvent): void {
    const history = this.getHistory();
    history.push(event);
    try {
      localStorage.setItem(this.xpHistoryKey, JSON.stringify(history));
    } catch (e) {
      console.warn('Não foi possível persistir evento de XP no armazenamento local', e);
    }
  }

  public getHistory(): XPEvent[] {
    try {
      const data = localStorage.getItem(this.xpHistoryKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const xpService = new XPService();

