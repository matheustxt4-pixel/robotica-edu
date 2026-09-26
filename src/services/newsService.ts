export interface PlatformNews {
  id: string;
  version: string;
  date: string; // ex: "25/09"
  title: string;
  badge: string;
  isImportant?: boolean;
  improvements: string[];
}

const PLATFORM_NEWS_LIST: PlatformNews[] = [
  {
    id: 'news_v1_3_0',
    version: 'v1.3.0',
    date: '25/09',
    title: 'Mural LEGO em Tempo Real & Trava de Segurança por Turma 🚀',
    badge: 'ATUALIZADO AGORA',
    isImportant: true,
    improvements: [
      '🧱 Mural LEGO Reativo: Todas as construções publicadas pelos alunos aparecem em tempo real no feed da turma via WebSockets.',
      '🔑 Trava de Turma Segura: Alunos agora são vinculados à sua turma oficial e impedidos de entrar em outras salas por engano.',
      '⚡ Persistência Atômica de XP: O XP ganho nas lições é acumulado atômica e permanentemente no banco do Firestore sem resgatar.',
      '🛡️ Proteção contra Apelidos Errados: Se o aluno errar a grafia no login, o sistema alerta em vez de criar uma conta zerada.',
      '🏫 Código Padrão ROB-YQHN: Preenchimento automático do código da turma no login dos alunos.'
    ]
  },
  {
    id: 'news_v1_2_0',
    version: 'v1.2.0',
    date: '24/09',
    title: 'Login por Google & Suporte Vercel SPA ☁️',
    badge: 'ANTERIOR',
    isImportant: false,
    improvements: [
      '👨‍🏫 Acesso Fácil para Professores: Suporte a login instantâneo com 1 clique através da conta do Google.',
      '🌐 SPA Deploy Vercel: Suporte a rotas limpas sem erro de recarregamento e cache inteligente de pacotes.',
      '🔥 Banco de Dados Firestore: Salvamento global na nuvem para aulas em múltiplos computadores.'
    ]
  }
];

class NewsService {
  private readNewsKey = 'robotica_read_news_v1';

  public getNews(): PlatformNews[] {
    return PLATFORM_NEWS_LIST;
  }

  public getUnreadCount(): number {
    const readIds = this.getReadNewsIds();
    return PLATFORM_NEWS_LIST.filter(n => !readIds.includes(n.id)).length;
  }

  public getReadNewsIds(): string[] {
    try {
      const data = localStorage.getItem(this.readNewsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public markAsRead(newsId: string): void {
    const readIds = this.getReadNewsIds();
    if (!readIds.includes(newsId)) {
      readIds.push(newsId);
      try {
        localStorage.setItem(this.readNewsKey, JSON.stringify(readIds));
      } catch {}
    }
  }

  public markAllAsRead(): void {
    const allIds = PLATFORM_NEWS_LIST.map(n => n.id);
    try {
      localStorage.setItem(this.readNewsKey, JSON.stringify(allIds));
    } catch {}
  }
}

export const newsService = new NewsService();
