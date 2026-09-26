export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  name: string;
  nickname: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  classId?: string;
  teacherId?: string;
  grade?: number; // 1 ao 5
  avatar: string;
  mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
  mascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';
  mascotBackground?: string;
  equippedAccessories?: {
    hat?: string;
    back?: string;
    tool?: string;
  };
  xp: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  adminIds: string[];
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string; // Ex: "3º Ano A"
  grade: number; // 1 a 5
  schoolId: string;
  teacherId: string;
  classCode: string; // Ex: "ROB-4821"
  settings: {
    showLeaderboard: boolean;
  };
  createdAt: string;
}

export interface ClassMember {
  id: string;
  classId: string;
  studentId: string;
  studentNickname: string;
  studentAvatar: string;
  totalXP: number;
  joinedAt: string;
}

export interface World {
  id: string;
  grade: number; // 1 a 5
  title: string;
  order: number;
  icon: string;
  description: string;
  themeColor: string;
}

export interface Unit {
  id: string;
  worldId: string;
  title: string;
  order: number;
  description: string;
}

export type LessonStatus = 'locked' | 'available' | 'completed' | 'perfect';

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  order: number;
  totalXpReward: number;
  type: 'quiz' | 'programming' | 'circuit' | 'gears' | 'runner' | 'robot_builder';
  activities: Activity[];
}

export type ActivityType = 
  | 'multiple-choice'
  | 'true-false'
  | 'image-choice'
  | 'drag-drop'
  | 'ordering'
  | 'matching'
  | 'fill-slot'
  | 'programming'
  | 'circuit'
  | 'gears';

export interface Activity {
  id: string;
  type: ActivityType;
  question: string;
  explanation?: string;
  imageUrl?: string;
  xp: number;
  options?: string[];
  correctAnswer?: string | string[] | boolean | object;
  initialItems?: any[];
  targetSlot?: any;
  gameData?: any; // Para fases dos jogos de programação, circuitos e engrenagens
}

export interface UserProgress {
  id: string;
  studentId: string;
  lessonId: string;
  unitId: string;
  status: LessonStatus;
  stars: number; // 1 a 3
  score: number; // Porcentagem
  completedAt?: string;
}

export interface XPEvent {
  id: string;
  studentId: string;
  amount: number;
  reason: 'lesson_completed' | 'first_attempt' | 'unit_completed' | 'perfect_score' | 'game_level';
  sourceId: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'xp' | 'lessons' | 'circuit' | 'gears' | 'programming' | 'streak';
  requirement: number;
}

export interface UserAchievement {
  id: string;
  studentId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  studentId: string;
  nickname: string;
  avatar: string;
  mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
  mascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';
  mascotBackground?: string;
  equippedAccessories?: {
    hat?: string;
    back?: string;
    tool?: string;
  };
  xp: number;
  position: number;
  level?: number;
  grade?: number;
}

// ============================================================================
// OFICINA & REDE SOCIAL DE BLOCOS LEGO
// ============================================================================
export type LegoBrickType = '1x1' | '2x1' | '2x2' | '2x4' | '4x4' | 'window' | 'slope' | 'roof' | 'robot_head';

export interface LegoBrick {
  id: string;
  type: LegoBrickType;
  x: number; // Coluna (0 a 11)
  y: number; // Linha (0 a 11)
  z: number; // Camada / Altura (0, 1, 2...)
  color: string; // 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'white' | 'gray' | 'cyber'
  rotation: number; // 0, 90, 180, 270
}

export interface LegoPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorMascot: string;
  authorMascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';
  authorMascotBackground?: string;
  authorEquippedAccessories?: {
    hat?: string;
    back?: string;
    tool?: string;
  };
  classId?: string;
  grade: number;
  title: string;
  bricks: LegoBrick[];
  likes: string[]; // uids dos alunos que curtiram
  commentsCount?: number;
  createdAt: string;
}


