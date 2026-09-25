import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db, isFirebaseDemo } from '../config/firebase';
import { UserProfile } from '../types';
import { classService } from './classService';

class AuthService {
  private localUserKey = 'robotica_user_session';

  /**
   * Monitora mudanças no estado de autenticação do Firebase.
   */
  public subscribeToAuthChanges(callback: (user: UserProfile | null) => void) {
    if (isFirebaseDemo) {
      // Se estiver em modo demo local, busca do localStorage
      const saved = this.getLocalUser();
      callback(saved);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const profile = await this.getUserProfile(firebaseUser.uid);
        if (profile) {
          this.setLocalUser(profile);
          callback(profile);
        } else {
          callback(null);
        }
      } else {
        this.clearLocalUser();
        callback(null);
      }
    });
  }

  /**
   * Login com E-mail e Senha (Professores e Administradores)
   */
  public async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseDemo) {
      const demoTeacher: UserProfile = {
        uid: 'teacher_' + Date.now(),
        name: email.split('@')[0] || 'Professor',
        nickname: 'Prof.' + (email.split('@')[0] || 'Edu'),
        email,
        role: 'teacher',
        avatar: 'avatar_gear_master',
        xp: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      this.setLocalUser(demoTeacher);
      return demoTeacher;
    }

    const cred = await signInWithEmailAndPassword(auth, email, pass);
    let profile = await this.getUserProfile(cred.user.uid);

    if (!profile) {
      profile = {
        uid: cred.user.uid,
        name: cred.user.displayName || email.split('@')[0],
        nickname: email.split('@')[0],
        email: email,
        role: 'teacher',
        avatar: 'avatar_gear_master',
        xp: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      await this.saveUserProfile(profile);
    }

    this.setLocalUser(profile);
    return profile;
  }

  /**
   * Cadastro de Professor/Admin
   */
  public async registerTeacher(name: string, email: string, pass: string): Promise<UserProfile> {
    if (isFirebaseDemo) {
      const newTeacher: UserProfile = {
        uid: 'teacher_' + Date.now(),
        name,
        nickname: name.split(' ')[0],
        email,
        role: 'teacher',
        avatar: 'avatar_gear_master',
        xp: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      this.setLocalUser(newTeacher);
      return newTeacher;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const profile: UserProfile = {
      uid: cred.user.uid,
      name,
      nickname: name.split(' ')[0],
      email,
      role: 'teacher',
      avatar: 'avatar_gear_master',
      xp: 0,
      level: 1,
      streak: 1,
      createdAt: new Date().toISOString()
    };

    await this.saveUserProfile(profile);
    this.setLocalUser(profile);
    return profile;
  }

  /**
   * Login/Cadastro com Conta do Google (Professores)
   */
  public async loginWithGoogle(): Promise<UserProfile> {
    if (isFirebaseDemo) {
      const demoTeacher: UserProfile = {
        uid: 'teacher_google_' + Date.now(),
        name: 'Professor Google',
        nickname: 'Prof. Google',
        email: 'professor@gmail.com',
        role: 'teacher',
        avatar: 'avatar_gear_master',
        xp: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      this.setLocalUser(demoTeacher);
      return demoTeacher;
    }

    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    let profile = await this.getUserProfile(cred.user.uid);

    if (!profile) {
      profile = {
        uid: cred.user.uid,
        name: cred.user.displayName || cred.user.email?.split('@')[0] || 'Professor',
        nickname: cred.user.displayName?.split(' ')[0] || cred.user.email?.split('@')[0] || 'Prof',
        email: cred.user.email || '',
        role: 'teacher',
        avatar: 'avatar_gear_master',
        xp: 0,
        level: 1,
        streak: 1,
        createdAt: new Date().toISOString()
      };
      await this.saveUserProfile(profile);
    }

    this.setLocalUser(profile);
    return profile;
  }

  private registeredStudentsKey = 'robotica_registered_students_v1';

  /**
   * Obtém o mapa de alunos cadastrados do armazenamento local
   */
  public getRegisteredStudentsMap(): Record<string, { password: string; profile: UserProfile }> {
    try {
      const data = localStorage.getItem(this.registeredStudentsKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Salva um aluno no banco de dados local
   */
  private saveRegisteredStudentToMap(nickname: string, password: string, profile: UserProfile) {
    const store = this.getRegisteredStudentsMap();
    const key = nickname.toLowerCase().trim();
    store[key] = { password, profile };
    try {
      localStorage.setItem(this.registeredStudentsKey, JSON.stringify(store));
    } catch {}
  }

  /**
   * Login Simplificado do Aluno por Apelido, Senha e Código da Sala (ex: ROB-4821)
   */
  public async loginStudentWithCode(params: {
    nickname: string;
    password?: string;
    classCode: string;
    grade: number;
    avatar: string;
    mascot?: 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
    isRegisterMode?: boolean;
  }): Promise<UserProfile> {
    const { nickname, password = '', classCode, grade, avatar, mascot = 'robi', isRegisterMode = false } = params;
    const cleanKey = nickname.toLowerCase().trim();
    const store = this.getRegisteredStudentsMap();
    const existing = store[cleanKey];

    if (!isRegisterMode && existing) {
      // Se está tentando fazer login em uma conta existente, verifica a senha
      if (existing.password && password && existing.password !== password) {
        throw new Error('Senha incorreta para esta conta de aluno! Verifique seus dados.');
      }

      let latestProfile = existing.profile;

      // Buscar perfil mais recente no Firestore se não for demo
      if (!isFirebaseDemo) {
        const firestoreProfile = await this.getUserProfile(existing.profile.uid);
        if (firestoreProfile) {
          latestProfile = { ...existing.profile, ...firestoreProfile };
        }
      }

      this.saveRegisteredStudentToMap(nickname, existing.password, latestProfile);
      this.setLocalUser(latestProfile);
      return latestProfile;
    }

    if (isRegisterMode && existing) {
      // Se está tentando registrar um apelido que já existe
      throw new Error(`O apelido "${nickname}" já possui uma conta cadastrada! Escolha outro apelido ou clique em "Já Tenho Conta".`);
    }

    // Buscar a turma correspondente pelo código informado
    const classRoom = await classService.getClassByCode(classCode);
    if (isRegisterMode && !classRoom && classCode.toUpperCase() !== 'ROB-4821') {
      throw new Error(`A turma com código "${classCode}" não foi encontrada! Verifique o código fornecido pelo seu professor.`);
    }

    const resolvedClassId = classRoom ? classRoom.id : classCode;
    const resolvedTeacherId = classRoom ? classRoom.teacherId : undefined;
    const resolvedSchoolId = classRoom ? classRoom.schoolId : 'school_demo';
    const resolvedGrade = classRoom ? classRoom.grade : grade;

    // Criar novo perfil de aluno
    const studentProfile: UserProfile = {
      uid: existing?.profile.uid || `student_${cleanKey.replace(/\s+/g, '_')}_${Date.now()}`,
      name: nickname,
      nickname,
      email: `${cleanKey}@aluno.local`,
      role: 'student',
      classId: resolvedClassId,
      teacherId: resolvedTeacherId,
      schoolId: resolvedSchoolId,
      grade: resolvedGrade,
      avatar,
      mascot,
      xp: 100,
      level: 1,
      streak: 1,
      createdAt: new Date().toISOString()
    };

    // Salva no banco de alunos cadastrados
    this.saveRegisteredStudentToMap(nickname, password, studentProfile);

    // Registra o aluno como membro da turma no classService
    await classService.joinClass(studentProfile.uid, studentProfile.nickname, studentProfile.avatar, classCode);

    if (!isFirebaseDemo) {
      try {
        await this.saveUserProfile(studentProfile);
      } catch (err) {
        console.warn('Salvando perfil de aluno no armazenamento local devido a permissão Firestore:', err);
      }
    }

    this.setLocalUser(studentProfile);
    return studentProfile;
  }

  /**
   * Busca perfil do usuário no Firestore
   */
  public async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch {
      return this.getLocalUser();
    }
  }

  /**
   * Salva ou atualiza o perfil do usuário no Firestore
   */
  public async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, 'users', profile.uid);
      await setDoc(docRef, profile, { merge: true });
    } catch (e) {
      console.warn('Persistindo perfil offline:', e);
    }

    // Sincroniza as atualizações de XP, Nível e Streak no cadastro do aluno
    if (profile.role === 'student' && profile.nickname) {
      const cleanKey = profile.nickname.toLowerCase().trim();
      const store = this.getRegisteredStudentsMap();
      if (store[cleanKey]) {
        store[cleanKey].profile = profile;
        try {
          localStorage.setItem(this.registeredStudentsKey, JSON.stringify(store));
        } catch {}
      }
    }

    this.setLocalUser(profile);
  }

  /**
   * Realiza logout do usuário
   */
  public async logout(): Promise<void> {
    if (!isFirebaseDemo) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Erro no signOut do Firebase:', e);
      }
    }
    this.clearLocalUser();
  }

  private setLocalUser(user: UserProfile) {
    try {
      localStorage.setItem(this.localUserKey, JSON.stringify(user));
    } catch {}
  }

  public getLocalUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.localUserKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private clearLocalUser() {
    try {
      localStorage.removeItem(this.localUserKey);
    } catch {}
  }
}

export const authService = new AuthService();
