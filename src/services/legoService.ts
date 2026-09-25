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

  public getPosts(): LegoPost[] {
    return this.getStoredPosts().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createPost(params: {
    authorId: string;
    authorName: string;
    authorAvatar: string;
    authorMascot: string;
    authorMascotColor?: 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';
    authorMascotBackground?: string;
    authorEquippedAccessories?: { hat?: string; back?: string; tool?: string };
    grade: number;
    title: string;
    bricks: LegoBrick[];
  }): LegoPost {
    const newPost: LegoPost = {
      id: `lego_post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authorId: params.authorId,
      authorName: params.authorName,
      authorAvatar: params.authorAvatar,
      authorMascot: params.authorMascot,
      authorMascotColor: params.authorMascotColor,
      authorMascotBackground: params.authorMascotBackground,
      authorEquippedAccessories: params.authorEquippedAccessories,
      grade: params.grade,
      title: params.title || 'Minha Criação LEGO 🧱',
      bricks: params.bricks,
      likes: [],
      createdAt: new Date().toISOString()
    };

    const posts = this.getStoredPosts();
    posts.unshift(newPost);
    this.saveStoredPosts(posts);

    return newPost;
  }

  public toggleLike(postId: string, studentId: string): LegoPost | null {
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
    return post;
  }

  public deletePost(postId: string, studentId: string): boolean {
    const posts = this.getStoredPosts();
    const filtered = posts.filter(p => p.id !== postId || p.authorId !== studentId);
    if (filtered.length !== posts.length) {
      this.saveStoredPosts(filtered);
      return true;
    }
    return false;
  }
}

export const legoService = new LegoService();

