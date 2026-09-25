import { UserProfile } from '../types';
import { authService } from './authService';

class StreakService {
  /**
   * Obtém a data local atual no formato YYYY-MM-DD
   */
  private getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcula a diferença em dias de calendário entre duas datas no formato YYYY-MM-DD
   */
  private getCalendarDaysDiff(dateStr1: string, dateStr2: string): number {
    const d1 = new Date(`${dateStr1}T00:00:00`);
    const d2 = new Date(`${dateStr2}T00:00:00`);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 3600 * 24));
  }

  /**
   * Atualiza e calcula a sequência de dias consecutivos de estudo (Streak)
   */
  public async updateStreak(user: UserProfile): Promise<UserProfile> {
    const todayStr = this.getLocalDateString();

    if (!user.lastActiveDate) {
      const updated = { ...user, streak: user.streak || 1, lastActiveDate: todayStr };
      await authService.saveUserProfile(updated);
      return updated;
    }

    const lastDateStr = user.lastActiveDate.includes('T')
      ? user.lastActiveDate.split('T')[0]
      : user.lastActiveDate;

    // Se já esteve ativo hoje, mantém a sequência atual
    if (todayStr === lastDateStr) {
      return user;
    }

    const diffInDays = this.getCalendarDaysDiff(lastDateStr, todayStr);

    let newStreak = user.streak || 1;
    if (diffInDays === 1) {
      // Dia consecutivo seguinte: incrementa streak!
      newStreak += 1;
    } else if (diffInDays > 1) {
      // Perdeu mais de 1 dia inteiro: reinicia streak em 1 no novo dia de estudos
      newStreak = 1;
    }

    const updatedUser: UserProfile = {
      ...user,
      streak: newStreak,
      lastActiveDate: todayStr
    };

    await authService.saveUserProfile(updatedUser);
    return updatedUser;
  }

  /**
   * Verifica se a ofensiva expirou (ficou mais de 1 dia sem estudar) ao carregar o perfil
   */
  public checkStreakExpiration(user: UserProfile): UserProfile {
    if (!user.lastActiveDate || !user.streak) return user;

    const todayStr = this.getLocalDateString();
    const lastDateStr = user.lastActiveDate.includes('T')
      ? user.lastActiveDate.split('T')[0]
      : user.lastActiveDate;

    const diffInDays = this.getCalendarDaysDiff(lastDateStr, todayStr);

    if (diffInDays > 1) {
      // Passou mais de 1 dia sem estudar: reseta a ofensiva para 0 visualmente
      return { ...user, streak: 0 };
    }

    return user;
  }
}

export const streakService = new StreakService();


