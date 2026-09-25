export interface MascotAccessory {
  id: string;
  name: string;
  category: 'hat' | 'back' | 'tool';
  icon: string;
  unlockedLevel: number;
  unlockedUnits: number;
  description: string;
  badge?: string;
}

export const MASCOT_ACCESSORIES: MascotAccessory[] = [
  // 1. CHAPÉUS E CAPACETES (HEADWEAR)
  {
    id: 'hat_crown',
    name: 'Coroa de Ouro',
    category: 'hat',
    icon: '👑',
    unlockedLevel: 4,
    unlockedUnits: 12,
    description: 'Reservada para os mestres campeões da robótica!',
    badge: 'LENDÁRIO'
  },
  {
    id: 'hat_goggles',
    name: 'Óculos Cyberpunk',
    category: 'hat',
    icon: '🥽',
    unlockedLevel: 1,
    unlockedUnits: 2,
    description: 'Visão infravermelha para analisar circuitos e LEDs.'
  },
  {
    id: 'hat_capelo',
    name: 'Capelo Acadêmico',
    category: 'hat',
    icon: '🎓',
    unlockedLevel: 3,
    unlockedUnits: 8,
    description: 'Símbolo de conhecimento avançado em lógica e programação.'
  },
  {
    id: 'hat_helmet',
    name: 'Capacete de Engenheiro',
    category: 'hat',
    icon: '👷',
    unlockedLevel: 1,
    unlockedUnits: 1,
    description: 'Proteção essencial para experimentos na oficina.'
  },
  {
    id: 'hat_headset',
    name: 'Headset Gamer Neon',
    category: 'hat',
    icon: '🎧',
    unlockedLevel: 2,
    unlockedUnits: 5,
    description: 'Comunicação direta com a central da aventura.'
  },
  {
    id: 'hat_wizard',
    name: 'Cartola Futurista',
    category: 'hat',
    icon: '🎩',
    unlockedLevel: 5,
    unlockedUnits: 16,
    description: 'Magia da tecnologia e códigos complexos.'
  },

  // 2. ACESSÓRIOS DE COSTAS (BACK & JETPACKS)
  {
    id: 'back_jetpack',
    name: 'Mochila a Jato',
    category: 'back',
    icon: '🚀',
    unlockedLevel: 2,
    unlockedUnits: 4,
    description: 'Propulsores de plasma para voar entre os nós do mapa.',
    badge: 'ÉPICO'
  },
  {
    id: 'back_shield',
    name: 'Escudo Titanium',
    category: 'back',
    icon: '🛡️',
    unlockedLevel: 3,
    unlockedUnits: 10,
    description: 'Proteção total contra curto-circuitos.'
  },
  {
    id: 'back_wings',
    name: 'Asas Energéticas',
    category: 'back',
    icon: '🪽',
    unlockedLevel: 5,
    unlockedUnits: 18,
    description: 'Asas de energia cyber que brilham no escuro.'
  },
  {
    id: 'back_cape',
    name: 'Capa do Super Robô',
    category: 'back',
    icon: '🦸',
    unlockedLevel: 4,
    unlockedUnits: 14,
    description: 'Flutua ao vento ao completar missões com 3 estrelas.'
  },

  // 3. INSTRUMENTOS E FERRAMENTAS (HAND TOOLS)
  {
    id: 'tool_wrench',
    name: 'Chave Inglesa Dourada',
    category: 'tool',
    icon: '🛠️',
    unlockedLevel: 1,
    unlockedUnits: 2,
    description: 'Aperta e ajusta qualquer engrenagem do sistema.'
  },
  {
    id: 'tool_wand',
    name: 'Varinha de Solda Laser',
    category: 'tool',
    icon: '🪄',
    unlockedLevel: 4,
    unlockedUnits: 15,
    description: 'Soldagem a laser com precisão atômica.'
  },
  {
    id: 'tool_glass',
    name: 'Lupa de Inspeção',
    category: 'tool',
    icon: '🔍',
    unlockedLevel: 1,
    unlockedUnits: 1,
    description: 'Detecta pequenos erros em sequências de comandos.'
  },
  {
    id: 'tool_arcade',
    name: 'Controle Arcade Retro',
    category: 'tool',
    icon: '🎮',
    unlockedLevel: 3,
    unlockedUnits: 7,
    description: 'Garante pontuação máxima nos minigames.'
  },
  {
    id: 'tool_flask',
    name: 'Frasco de Plasma',
    category: 'tool',
    icon: '🧪',
    unlockedLevel: 5,
    unlockedUnits: 20,
    description: 'Combustível limpo para alimentar circuitos elétricos.'
  }
];

