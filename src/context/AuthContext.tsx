import React, { createContext, useContext, useState, useEffect } from 'react';

import { authService } from '../services/authService';
import { streakService } from '../services/streakService';
import { progressService } from '../services/progressService';
import { xpService } from '../services/xpService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerTeacher: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginStudentWithCode: (params: {
    nickname: string;
    password?: string;
    classCode: string;
    grade: number;
    avatar: string;
    mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
    isRegisterMode?: boolean;
  }) => Promise<void>;
  loginAsDemoStudent: (grade?: number) => void;
  loginAsDemoTeacher: () => void;
  logout: () => Promise<void>;
  updateUserXP: (newTotalXP: number) => Promise<void>;
  updateUserStreak: () => Promise<UserProfile | null>;
  equipAccessory: (category: 'hat' | 'back' | 'tool', accessoryId: string | null) => Promise<void>;
  changeMascot: (
    mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo',
    mascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow',
    mascotBackground?: string
  ) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const local = authService.getLocalUser();
    return local ? streakService.checkStreakExpiration(local) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges(async u => {
      try {
        if (u) {
          let syncedUser = u;
          if (u.role === 'student') {
            try {
              const progressMap = await progressService.getStudentProgress(u.uid);
              const completedCount = Object.values(progressMap).filter(
                p => p && (p.status === 'completed' || p.status === 'perfect')
              ).length;
              syncedUser = xpService.syncStudentXP(u.uid, u, completedCount);
            } catch (err) {
              console.warn('Erro ao sincronizar XP:', err);
            }
          }
          try {
            syncedUser = await streakService.updateStreak(syncedUser);
          } catch (err) {
            console.warn('Erro ao atualizar streak:', err);
          }
          setUser(syncedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Erro ao verificar usuário:', err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const profile = await authService.loginWithEmail(email, pass);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const registerTeacher = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const profile = await authService.registerTeacher(name, email, pass);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const profile = await authService.loginWithGoogle();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const loginStudentWithCode = async (params: { nickname: string; classCode: string; grade: number; avatar: string; mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo' }) => {
    setIsLoading(true);
    try {
      const profile = await authService.loginStudentWithCode(params);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoStudent = (grade = 3) => {
    const demoStudent: UserProfile = {
      uid: 'student_demo_123',
      name: 'Lucas Silva',
      nickname: 'LucasRobô',
      email: 'lucas@aluno.local',
      role: 'student',
      grade,
      avatar: 'avatar_bot_blue',
      mascot: 'robi',
      xp: 120,
      level: 2,
      streak: 3,
      createdAt: new Date().toISOString()
    };
    authService.saveUserProfile(demoStudent);
    setUser(demoStudent);
  };

  const loginAsDemoTeacher = () => {
    const demoTeacher: UserProfile = {
      uid: 'teacher_demo_456',
      name: 'Profª. Ana Oliveira',
      nickname: 'ProfAna',
      email: 'ana@escola.edu.br',
      role: 'teacher',
      avatar: 'avatar_gear_master',
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: new Date().toISOString()
    };
    authService.saveUserProfile(demoTeacher);
    setUser(demoTeacher);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserXP = async (newTotalXP: number) => {
    if (!user) return;
    const updated = { ...user, xp: newTotalXP };
    setUser(updated);
    await authService.saveUserProfile(updated);
  };

  const updateUserStreak = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    const updatedUser = await streakService.updateStreak(user);
    setUser(updatedUser);
    return updatedUser;
  };

  const equipAccessory = async (category: 'hat' | 'back' | 'tool', accessoryId: string | null) => {
    if (!user) return;
    const currentAcc = user.equippedAccessories || {};
    const updatedAcc = { ...currentAcc, [category]: accessoryId || undefined };
    const updatedUser = { ...user, equippedAccessories: updatedAcc };
    setUser(updatedUser);
    await authService.saveUserProfile(updatedUser);
  };

  const changeMascot = async (
    mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo',
    mascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow',
    mascotBackground?: string
  ) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      mascot: mascot !== undefined ? mascot : user.mascot,
      mascotColor: mascotColor !== undefined ? mascotColor : user.mascotColor,
      mascotBackground: mascotBackground !== undefined ? mascotBackground : user.mascotBackground
    };
    setUser(updatedUser);
    await authService.saveUserProfile(updatedUser);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        loginWithEmail,
        registerTeacher,
        loginWithGoogle,
        loginStudentWithCode,
        loginAsDemoStudent,
        loginAsDemoTeacher,
        logout,
        updateUserXP,
        updateUserStreak,
        equipAccessory,
        changeMascot,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
