import { doc, setDoc, getDocs, collection, query, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseDemo } from '../config/firebase';
import { LegoPost, LegoBrick } from '../types';

const STORAGE_KEY = 'robotica_lego_posts_v1';

// Exemplos Iniciais de Posts Criados para a Rede Social da Turma parecer viva!
const INITIAL_DEMO_POSTS: LegoPost[] = [
  {
    id: 'post_demo_1',
    authorId: 'student_robi',
    authorName: 'Robi (Guia)',
    authorAvatar: 'avatar_1',
    authorMascot: 'robi',
    grade: 3,
    title: 'Torre de Controle do Robô Guia 🏰',
    likes: ['user_demo_1', 'user_demo_2', 'user_demo_3'],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    bricks: [
      { id: 'b1', type: '4x4', x: 4, y: 4, z: 0, color: 'blue', rotation: 0 },
      { id: 'b2', type: '2x2', x: 4, y: 4, z: 1, color: 'white', rotation: 0 },
      { id: 'b3', type: '2x2', x: 6, y: 4, z: 1, color: 'white', rotation: 0 },
      { id: 'b4', type: 'window', x: 5, y: 4, z: 2, color: 'white', rotation: 0 },
      { id: 'b5', type: 'roof', x: 5, y: 4, z: 3, color: 'red', rotation: 0 },
      { id: 'b6', type: 'robot_head', x: 5, y: 4, z: 4, color: 'cyber', rotation: 0 }
    ]
  },
  {
    id: 'post_demo_2',
    authorId: 'student_byte',
    authorName: 'Byte (Engenheiro)',
    authorAvatar: 'avatar_2',
    authorMascot: 'byte',
    grade: 4,
    title: 'Base Mecânica com Engrenagens ⚙️',
    likes: ['user_demo_1', 'user_demo_4'],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    bricks: [
      { id: 'b10', type: '2x4', x: 3, y: 5, z: 0, color: 'orange', rotation: 0 },
      { id: 'b11', type: '2x4', x: 5, y: 5, z: 0, color: 'orange', rotation: 0 },
      { id: 'b12', type: '2x2', x: 4, y: 5, z: 1, color: 'gray', rotation: 0 },
      { id: 'b13', type: 'slope', x: 3, y: 5, z: 1, color: 'yellow', rotation: 0 },
      { id: 'b14', type: 'slope', x: 6, y: 5, z: 1, color: 'yellow', rotation: 0 }
    ]
  }
];

class LegoService {
  private getStoredPosts(): LegoPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_POSTS));
        return INITIAL_DEMO_POSTS;
      }
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_DEMO_POSTS;
    }
  }

  private saveStoredPosts(posts: LegoPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Erro ao salvar posts LEGO:', e);
    }
  }

  /**
   * Assinatura em TEMPO REAL (onSnapshot) para que todos os alunos da turma vejam as novidades no Mural LEGO na hora!
   */
  public subscribeToLegoPosts(classId: string | undefined, callback: (posts: LegoPost[]) => void): () => void {
    if (isFirebaseDemo) {
      callback(this.getStoredPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      return () => {};
    }

    try {
      const targetClass = (classId || 'ROB-YQHN').toUpperCase().trim();
      const q = query(collection(db, 'lego_posts'));
      return onSnapshot(q, (snap) => {
        const firestorePosts: LegoPost[] = [];
        snap.docs.forEach(d => {
          const post = d.data() as LegoPost;
          const postClass = (post.classId || 'ROB-YQHN').toUpperCase().trim();
          if (postClass === targetClass || targetClass === 'ROB-YQHN' || !post.classId) {
            firestorePosts.push(post);
          }
        });
        firestorePosts.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.saveStoredPosts(firestorePosts);
        callback(firestorePosts);
      }, (err) => {
        console.warn('Erro na escuta real-time do Mural Lego:', err);
        callback(this.getStoredPosts());
      });
    } catch (e) {
      console.warn('Erro ao abrir conexao em tempo real com Mural Lego:', e);
      callback(this.getStoredPosts());
      return () => {};
    }
  }

  /**
   * Obtém as publicações do Mural LEGO do banco de dados (Firestore) com fallback local
   */
  public async getPosts(): Promise<LegoPost[]> {
    if (!isFirebaseDemo) {
      try {
        const q = query(collection(db, 'lego_posts'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const firestorePosts: LegoPost[] = [];
          snap.docs.forEach(d => {
            firestorePosts.push(d.data() as LegoPost);
          });
          firestorePosts.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.saveStoredPosts(firestorePosts);
          return firestorePosts;
        }
      } catch (e) {
        console.warn('Erro ao buscar posts do LEGO no Firestore:', e);
      }
    }

    return this.getStoredPosts().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Publica uma nova criação no Mural LEGO (Firestore + Local)
   */
  public async createPost(params: {
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorMascot: string;
    authorMascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';
    authorMascotBackground?: string;
    authorEquippedAccessories?: { hat?: string; back?: string; tool?: string };
    classId?: string;
    grade: number;
    title: string;
    bricks: LegoBrick[];
  }): Promise<LegoPost> {
    const newPost: LegoPost = {
      id: `lego_post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authorId: params.authorId,
      authorName: params.authorName,
      authorAvatar: params.authorAvatar,
      authorMascot: params.authorMascot,
      ...(params.authorMascotColor ? { authorMascotColor: params.authorMascotColor } : {}),
      ...(params.authorMascotBackground ? { authorMascotBackground: params.authorMascotBackground } : {}),
      ...(params.authorEquippedAccessories ? { authorEquippedAccessories: params.authorEquippedAccessories } : {}),
      classId: params.classId || 'ROB-YQHN',
      grade: params.grade,
      title: params.title || 'Minha Criação LEGO 🧱',
      bricks: params.bricks,
      likes: [],
      createdAt: new Date().toISOString()
    };

    const posts = this.getStoredPosts();
    posts.unshift(newPost);
    this.saveStoredPosts(posts);

    if (!isFirebaseDemo) {
      try {
        const cleanPostData = JSON.parse(JSON.stringify(newPost));
        await setDoc(doc(db, 'lego_posts', newPost.id), cleanPostData);
      } catch (e) {
        console.error('Erro ao salvar publicação LEGO no Firestore:', e);
      }
    }

    return newPost;
  }

  /**
   * Alterna curtida no post do Mural LEGO
   */
  public async toggleLike(postId: string, studentId: string): Promise<LegoPost | null> {
    const posts = this.getStoredPosts();
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return null;

    const post = posts[idx];
    const likes = post.likes || [];
    const hasLiked = likes.includes(studentId);

    if (hasLiked) {
      post.likes = likes.filter(id => id !== studentId);
    } else {
      post.likes = [...likes, studentId];
    }

    posts[idx] = post;
    this.saveStoredPosts(posts);

    if (!isFirebaseDemo) {
      try {
        const cleanPostData = JSON.parse(JSON.stringify(post));
        await setDoc(doc(db, 'lego_posts', postId), cleanPostData, { merge: true });
      } catch (e) {
        console.error('Erro ao atualizar curtida no Firestore:', e);
      }
    }

    return post;
  }

  /**
   * Exclui post do Mural LEGO
   */
  public async deletePost(postId: string, studentId: string): Promise<boolean> {
    const posts = this.getStoredPosts();
    const filtered = posts.filter(p => p.id !== postId || p.authorId !== studentId);
    if (filtered.length !== posts.length) {
      this.saveStoredPosts(filtered);

      if (!isFirebaseDemo) {
        try {
          await deleteDoc(doc(db, 'lego_posts', postId));
        } catch (e) {
          console.error('Erro ao excluir post do Firestore:', e);
        }
      }

      return true;
    }
    return false;
  }
}

export const legoService = new LegoService();
