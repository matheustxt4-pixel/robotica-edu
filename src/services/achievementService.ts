import { Achievement, UserAchievement } from '../types';

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'ach_first_lesson',
    title: 'Primeiros Passos',
    description: 'Completou sua primeira lição de robótica!',
    icon: '🤖',
    category: 'lessons',
    requirement: 1
  },
  {
    id: 'ach_led_master',
    title: 'Mestre do LED',
    description: 'Concluiu o desafio de circuitos elétricos',
    icon: '💡',
    category: 'circuit',
    requirement: 1
  },
  {
    id: 'ach_gears_master',
    title: 'Mestre das Engrenagens',
    description: 'Transmitiu movimento usando engrenagens',
    icon: '⚙️',
    category: 'gears',
    requirement: 1
  },
  {
    id: 'ach_coder_junior',
    title: 'Programador Iniciante',
    description: 'Criou sua primeira sequência de comandos',
    icon: '🧩',
    category: 'programming',
    requirement: 1
  },
  {
    id: 'ach_streak_3',
    title: 'Super Sequência',
    description: 'Manteve 3 dias seguidos de estudos',
    icon: '🔥',
    category: 'streak',
    requirement: 3
  },
  {
    id: 'ach_xp_500',
    title: 'Acumulador de XP',
    description: 'Alcançou a marca de 500 XP total',
    icon: '⚡',
    category: 'xp',
    requirement: 500
  }
];

class AchievementService {
  private localKey = 'robotica_user_achievements_v1';

  public getUserAchievements(studentId: string): UserAchievement[] {
    try {
      const data = localStorage.getItem(`${this.localKey}_${studentId}`);
      return data ? JSON.parse(data) : [
        {
          id: `ua_1_${studentId}`,
          studentId,
          achievementId: 'ach_first_lesson',
          unlockedAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  }

  public checkAndAward(params: {
    studentId: string;
    totalXP: number;
    streak: number;
    lessonType?: string;
  }): Achievement[] {
    const { studentId, totalXP, streak, lessonType } = params;
    const unlockedList = this.getUserAchievements(studentId);
    const unlockedIds = new Set(unlockedList.map(u => u.achievementId));
    const newUnlocked: Achievement[] = [];

    ACHIEVEMENTS_CATALOG.forEach(ach => {
      if (!unlockedIds.has(ach.id)) {
        let shouldUnlock = false;

        if (ach.category === 'xp' && totalXP >= ach.requirement) shouldUnlock = true;
        if (ach.category === 'streak' && streak >= ach.requirement) shouldUnlock = true;
        if (ach.category === 'circuit' && lessonType === 'circuit') shouldUnlock = true;
        if (ach.category === 'gears' && lessonType === 'gears') shouldUnlock = true;
        if (ach.category === 'programming' && lessonType === 'programming') shouldUnlock = true;

        if (shouldUnlock) {
          unlockedList.push({
            id: `ua_${ach.id}_${Date.now()}`,
            studentId,
            achievementId: ach.id,
            unlockedAt: new Date().toISOString()
          });
          newUnlocked.push(ach);
        }
      }
    });

    if (newUnlocked.length > 0) {
      try {
        localStorage.setItem(`${this.localKey}_${studentId}`, JSON.stringify(unlockedList));
      } catch {}
    }

    return newUnlocked;
  }
}

export const achievementService = new AchievementService();

