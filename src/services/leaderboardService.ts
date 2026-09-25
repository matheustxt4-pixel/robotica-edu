import { LeaderboardEntry, UserProfile } from '../types';
import { authService } from './authService';
import { classService } from './classService';

class LeaderboardService {
  private globalMockLeaderboard: LeaderboardEntry[] = [
    {
      studentId: 'st_1',
      nickname: 'AnaRobô',
      avatar: 'avatar_bot_blue',
      mascot: 'robi',
      mascotColor: 'gold',
      mascotBackground: 'cosmic_galaxy',
      equippedAccessories: { hat: 'hat_crown', back: 'back_wings', tool: 'tool_wand' },
      xp: 10500,
      position: 1,
      level: 10,
      grade: 3
    },
    {
      studentId: 'st_2',
      nickname: 'LucasRobô',
      avatar: 'avatar_bot_yellow',
      mascot: 'byte',
      mascotColor: 'cyber_purple',
      mascotBackground: 'cyber_city',
      equippedAccessories: { hat: 'hat_helmet', tool: 'tool_wrench' },
      xp: 5400,
      position: 2,
      level: 7,
      grade: 3
    },
    {
      studentId: 'st_3',
      nickname: 'PedroTech',
      avatar: 'avatar_bot_green',
      mascot: 'volt',
      mascotColor: 'emerald',
      mascotBackground: 'space_station',
      equippedAccessories: { hat: 'hat_goggles', back: 'back_jetpack' },
      xp: 3200,
      position: 3,
      level: 5,
      grade: 3
    },
    {
      studentId: 'st_4',
      nickname: 'MariBot',
      avatar: 'avatar_bot_purple',
      mascot: 'spark',
      mascotColor: 'ruby_red',
      mascotBackground: 'lab_robotics',
      equippedAccessories: { hat: 'hat_headset', tool: 'tool_arcade' },
      xp: 1800,
      position: 4,
      level: 4,
      grade: 3
    },
    {
      studentId: 'st_5',
      nickname: 'GabiMascote',
      avatar: 'avatar_bot_orange',
      mascot: 'wizard',
      mascotColor: 'dark_shadow',
      mascotBackground: 'magical_temple',
      equippedAccessories: { hat: 'hat_wizard', tool: 'tool_glass' },
      xp: 1200,
      position: 5,
      level: 3,
      grade: 3
    },
    {
      studentId: 'st_6',
      nickname: 'LeoTech',
      avatar: 'avatar_gear_master',
      mascot: 'scientist',
      mascotColor: 'gold',
      mascotBackground: 'circuit_board',
      equippedAccessories: { tool: 'tool_wand' },
      xp: 950,
      position: 6,
      level: 3,
      grade: 4
    },
    {
      studentId: 'st_7',
      nickname: 'SofiaCyber',
      avatar: 'avatar_circuit_wiz',
      mascot: 'bmo',
      mascotColor: 'cyber_purple',
      mascotBackground: 'cyber_city',
      equippedAccessories: { hat: 'hat_headset' },
      xp: 880,
      position: 7,
      level: 2,
      grade: 2
    }
  ];

  /**
   * Obtém a classificação de acordo com o período e o escopo:
   * - 'weekly' e 'monthly': Apenas alunos da TURMA do usuário logado.
   * - 'allTime': Ranking Geral de TODO O JOGO (Global).
   */
  public async getLeaderboard(period: 'weekly' | 'monthly' | 'allTime' = 'weekly'): Promise<LeaderboardEntry[]> {
    const localUser = authService.getLocalUser();
    let entries: LeaderboardEntry[] = [];

    if (period === 'allTime') {
      // 🌐 RANKING GERAL DE TODO O JOGO (GLOBAL)
      const globalMap = new Map<string, LeaderboardEntry>();

      // Adiciona entradas mock de topo global
      this.globalMockLeaderboard.forEach(e => globalMap.set(e.studentId, { ...e }));

      // Adiciona todos os alunos registrados localmente
      const registeredMap = authService.getRegisteredStudentsMap();
      Object.values(registeredMap).forEach(item => {
        const p = item.profile;
        globalMap.set(p.uid, this.profileToEntry(p));
      });

      // Adiciona / Atualiza o usuário local se for aluno
      if (localUser && localUser.role === 'student') {
        globalMap.set(localUser.uid, this.profileToEntry(localUser));
      }

      entries = Array.from(globalMap.values());
    } else {
      // 🏫 RANKING SEMANAL E MENSAL (APENAS A TURMA DO ALUNO)
      const classId = localUser?.classId || 'class_demo_3a';
      const classStudents = await classService.getStudentsByClass(classId);

      const classMap = new Map<string, LeaderboardEntry>();

      classStudents.forEach(st => {
        classMap.set(st.uid, this.profileToEntry(st));
      });

      // Garantir que o usuário atual logado esteja no mapa da turma
      if (localUser && localUser.role === 'student') {
        classMap.set(localUser.uid, this.profileToEntry(localUser));
      }

      entries = Array.from(classMap.values());
    }

    // Ordena por XP em ordem decrescente
    const sorted = entries.sort((a, b) => b.xp - a.xp).map((entry, idx) => ({
      ...entry,
      position: idx + 1
    }));

    return sorted;
  }

  private profileToEntry(profile: UserProfile): LeaderboardEntry {
    return {
      studentId: profile.uid,
      nickname: profile.nickname || profile.name,
      avatar: profile.avatar || 'avatar_bot_blue',
      mascot: profile.mascot || 'robi',
      mascotColor: profile.mascotColor,
      mascotBackground: profile.mascotBackground,
      equippedAccessories: profile.equippedAccessories,
      xp: profile.xp || 100,
      position: 0,
      level: profile.level || 1,
      grade: profile.grade || 3
    };
  }
}

export const leaderboardService = new LeaderboardService();
