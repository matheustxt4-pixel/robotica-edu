import { World, Unit, Lesson } from '../types';

export interface WorldGradeData {
  world: World;
  units: (Unit & { lessons: Lesson[] })[];
}

export type UnitGameType = 'circuit' | 'gears' | 'runner' | 'programming';

// Mapeamento pedagógico preciso de cada uma das 40 Unidades para o tipo de jogo correspondente ao seu tema
export const UNIT_GAME_TYPES: Record<string, UnitGameType> = {
  // Mundo 1 (1º Ano) — Descobrindo os Robôs
  unit_1: 'programming', // O que é um Robô -> Comandos do Robô
  unit_2: 'gears',       // Máquinas Simples -> Rodas, eixos e rotação
  unit_3: 'runner',      // Sequências & Passos -> Run Marco! Sequências
  unit_4: 'circuit',     // Luzes & Sinais -> Simulador de LED
  unit_5: 'circuit',     // Sons & Bipes -> Circuito de Alertas
  unit_6: 'programming', // Movimentos em Grade -> Matriz 5x5
  unit_7: 'runner',      // Direção & Comandos -> Run Marco! Curvas
  unit_8: 'runner',      // Formação Robôs Guia -> Run Marco! Desafio

  // Mundo 2 (2º Ano) — Energia & Componentes
  unit_9: 'circuit',     // Fontes de Energia -> Circuito de bateria
  unit_10: 'circuit',    // Polos Positivo e Negativo -> Polaridade +/-
  unit_11: 'circuit',    // O Circuito do LED -> LED Ánodo/Cátodo
  unit_12: 'circuit',    // Botões & Interruptores -> Fechamento de circuito
  unit_13: 'circuit',    // Condutores & Isolantes -> Passagem de corrente
  unit_14: 'circuit',    // Resistores de Proteção -> Resistor de 220Ω
  unit_15: 'gears',      // Motores DC & Rotação -> Motor + Engrenagem
  unit_16: 'circuit',    // Circuito Fechado Robótico -> Montagem de circuito

  // Mundo 3 (3º Ano) — Circuitos & Lógica
  unit_17: 'circuit',    // Circuitos em Série -> Série de LEDs
  unit_18: 'circuit',    // Circuitos em Paralelo -> Paralelo de LEDs
  unit_19: 'runner',     // Lógica Blocky -> Run Marco! Caderno de blocos
  unit_20: 'runner',     // Repetição & Loops -> Run Marco! Loops
  unit_21: 'programming',// Matriz 5x5 -> Programação em Grade
  unit_22: 'circuit',    // Sensores LDR -> Sensor de Luz e LED
  unit_23: 'circuit',    // Síntese RGB -> Mistura de cores RGB
  unit_24: 'circuit',    // Desafio Mestre dos Circuitos -> Circuito completo

  // Mundo 4 (4º Ano) — Engrenagens & Mecanismos
  unit_25: 'gears',      // Engrenagens Motrizes -> Simulador de Engrenagens
  unit_26: 'gears',      // Relação de Transmissão -> Dentes e Velocidade
  unit_27: 'gears',      // Torque & Força -> Multiplicação de Torque
  unit_28: 'gears',      // Polias & Correias -> Polias mecânicas
  unit_29: 'gears',      // Cremalheira & Pinhão -> Rotação em Linear
  unit_30: 'gears',      // Braços Robóticos -> Articulações Mecânicas
  unit_31: 'gears',      // Servo Motores & Ângulos -> Posições 0° a 180°
  unit_32: 'runner',     // Robô Explorador de Rodas -> Navegação Run Marco

  // Mundo 5 (5º Ano) — Programação & Sensores Autônomos
  unit_33: 'runner',     // Algoritmos & Variáveis -> Run Marco! Variáveis
  unit_34: 'runner',     // Tomadas de Decisão -> Run Marco! Condicionais Se/Senão
  unit_35: 'programming',// Sensores Ultrassônicos -> Desvio de Obstáculos em Grade
  unit_36: 'runner',     // Robô Seguidor de Linha -> Run Marco! Seguir Trilha
  unit_37: 'circuit',    // Leitura Analógica/Digital -> Sinal de Sensores
  unit_38: 'programming',// Comunicação Sem Fios -> Controle Remoto Matriz
  unit_39: 'runner',     // Visão Computacional -> Algoritmos Visuais
  unit_40: 'runner'      // Grande Desafio Autônomo -> Marco Run Mestre
};

export const WORLDS_BY_GRADE: Record<number, WorldGradeData> = {
  // -------------------------------------------------------------
  // 1º ANO — MUNDO 1 (8 UNIDADES - CADA UMA COM 5 LIÇÕES)
  // -------------------------------------------------------------
  1: {
    world: {
      id: 'world_grade_1',
      grade: 1,
      title: 'Mundo 1 — Descobrindo os Robôs 🤖',
      order: 1,
      icon: '🤖',
      description: 'Aprenda o que são robôs, máquinas simples e sequências de tarefas!',
      themeColor: '#FFD166'
    },
    units: [
      { id: 'unit_1', title: 'Unidade 1: O que é um Robô?', desc: 'Corpo, sensores e tarefas de robótica' },
      { id: 'unit_2', title: 'Unidade 2: Máquinas Simples', desc: 'Alavancas, rodas e eixos' },
      { id: 'unit_3', title: 'Unidade 3: Sequências & Passos', desc: 'Instruções em ordem lógica' },
      { id: 'unit_4', title: 'Unidade 4: Luzes & Sinais do Robô', desc: 'Sinais de LED e respostas visuais' },
      { id: 'unit_5', title: 'Unidade 5: Sons & Bipes do Robô', desc: 'Buzzer e sinais sonoros de alerta' },
      { id: 'unit_6', title: 'Unidade 6: Movimentos em Grade', desc: 'Deslocamento no espaço 2D' },
      { id: 'unit_7', title: 'Unidade 7: Direção & Comandos', desc: 'Frente, trás, esquerda e direita' },
      { id: 'unit_8', title: 'Unidade 8: Formação de Robôs Guia', desc: 'Acompanhando o mascote em tarefas' }
    ].map((u, uIdx) => {
      const uNum = uIdx + 1;
      const gameType = UNIT_GAME_TYPES[u.id] || 'programming';
      return {
        id: u.id,
        worldId: 'world_grade_1',
        title: u.title,
        order: uNum,
        description: u.desc,
        lessons: Array.from({ length: 5 }, (_, lIdx) => {
          const lNum = lIdx + 1;
          const isGameLesson = lNum === 2 || lNum === 3 || lNum === 4;
          return {
            id: `les_${uNum}_${lNum}`,
            unitId: u.id,
            title: `Lição ${lNum}: Desafio ${uNum}.${lNum}`,
            order: lNum,
            totalXpReward: 25,
            type: (isGameLesson ? gameType : 'quiz') as any,
            activities: []
          };
        })
      };
    })
  },

  // -------------------------------------------------------------
  // 2º ANO — MUNDO 2 (8 UNIDADES - CADA UMA COM 5 LIÇÕES)
  // -------------------------------------------------------------
  2: {
    world: {
      id: 'world_grade_2',
      grade: 2,
      title: 'Mundo 2 — Energia & Componentes ⚡',
      order: 2,
      icon: '⚡',
      description: 'Descubra como a energia faz os robôs funcionarem com pilhas e LEDs!',
      themeColor: '#06D6A0'
    },
    units: [
      { id: 'unit_9', title: 'Unidade 9: Fontes de Energia', desc: 'Pilhas AA, AAA e Baterias de 9V' },
      { id: 'unit_10', title: 'Unidade 10: Polos Positivo e Negativo', desc: 'Identificação de polaridade (+ / -)' },
      { id: 'unit_11', title: 'Unidade 11: O Circuito do LED', desc: 'Polaridade do Ánodo (+) e Cátodo (-)' },
      { id: 'unit_12', title: 'Unidade 12: Botões & Interruptores', desc: 'Abertura e fechamento de circuitos' },
      { id: 'unit_13', title: 'Unidade 13: Condutores & Isolantes', desc: 'Metais, plástico e passagem de corrente' },
      { id: 'unit_14', title: 'Unidade 14: Resistores de Proteção', desc: 'Evitando queima de LEDs por alta corrente' },
      { id: 'unit_15', title: 'Unidade 15: Motores DC & Rotação', desc: 'Transformando eletricidade em movimento' },
      { id: 'unit_16', title: 'Unidade 16: Circuito Fechado Robótico', desc: 'Montagem completa de circuitos alimentados' }
    ].map((u, uIdx) => {
      const uNum = uIdx + 9;
      const gameType = UNIT_GAME_TYPES[u.id] || 'circuit';
      return {
        id: u.id,
        worldId: 'world_grade_2',
        title: u.title,
        order: uNum,
        description: u.desc,
        lessons: Array.from({ length: 5 }, (_, lIdx) => {
          const lNum = lIdx + 1;
          const isGameLesson = lNum === 2 || lNum === 3 || lNum === 4;
          return {
            id: `les_${uNum}_${lNum}`,
            unitId: u.id,
            title: `Lição ${lNum}: Desafio ${uNum}.${lNum}`,
            order: lNum,
            totalXpReward: 30,
            type: (isGameLesson ? gameType : 'quiz') as any,
            activities: []
          };
        })
      };
    })
  },

  // -------------------------------------------------------------
  // 3º ANO — MUNDO 3 (8 UNIDADES - CADA UMA COM 5 LIÇÕES)
  // -------------------------------------------------------------
  3: {
    world: {
      id: 'world_grade_3',
      grade: 3,
      title: 'Mundo 3 — Circuitos & Lógica 💡',
      order: 3,
      icon: '💡',
      description: 'Monte circuitos fechados com botões e navegação em grade!',
      themeColor: '#118AB2'
    },
    units: [
      { id: 'unit_17', title: 'Unidade 17: Circuitos em Série', desc: 'Corrente contínua por múltiplos componentes' },
      { id: 'unit_18', title: 'Unidade 18: Circuitos em Paralelo', desc: 'Divisão de ramificações elétricas' },
      { id: 'unit_19', title: 'Unidade 19: Lógica de Comandos Blocky', desc: 'Blocos visuais de programação' },
      { id: 'unit_20', title: 'Unidade 20: Repetição & Loops', desc: 'Comandos de repetição N vezes' },
      { id: 'unit_21', title: 'Unidade 21: Navegação em Matriz 5x5', desc: 'Algoritmo de movimentação do robô' },
      { id: 'unit_22', title: 'Unidade 22: Sensores de Luz LDR', desc: 'Detecção de luminosidade ambiente' },
      { id: 'unit_23', title: 'Unidade 23: Síntese de Cores RGB', desc: 'Mistura de canais R, G e B em luz' },
      { id: 'unit_24', title: 'Unidade 24: Desafio Mestre dos Circuitos', desc: 'Integração de sensores, LEDs e lógica' }
    ].map((u, uIdx) => {
      const uNum = uIdx + 17;
      const gameType = UNIT_GAME_TYPES[u.id] || 'circuit';
      return {
        id: u.id,
        worldId: 'world_grade_3',
        title: u.title,
        order: uNum,
        description: u.desc,
        lessons: Array.from({ length: 5 }, (_, lIdx) => {
          const lNum = lIdx + 1;
          const isGameLesson = lNum === 2 || lNum === 3 || lNum === 4;
          return {
            id: `les_${uNum}_${lNum}`,
            unitId: u.id,
            title: `Lição ${lNum}: Desafio ${uNum}.${lNum}`,
            order: lNum,
            totalXpReward: 35,
            type: (isGameLesson ? gameType : 'quiz') as any,
            activities: []
          };
        })
      };
    })
  },

  // -------------------------------------------------------------
  // 4º ANO — MUNDO 4 (8 UNIDADES - CADA UMA COM 5 LIÇÕES)
  // -------------------------------------------------------------
  4: {
    world: {
      id: 'world_grade_4',
      grade: 4,
      title: 'Mundo 4 — Engrenagens & Mecanismos ⚙️',
      order: 4,
      icon: '⚙️',
      description: 'Explore como engrenagens transmitem força e velocidade!',
      themeColor: '#7209B7'
    },
    units: [
      { id: 'unit_25', title: 'Unidade 25: Engrenagens Motrizes', desc: 'Transmissão direta de movimento' },
      { id: 'unit_26', title: 'Unidade 26: Relação de Transmissão', desc: 'Velocidade de rotação e dentes' },
      { id: 'unit_27', title: 'Unidade 27: Torque & Força Mecânica', desc: 'Multiplicação de força em eixos' },
      { id: 'unit_28', title: 'Unidade 28: Polias & Correias', desc: 'Transferência de força a distância' },
      { id: 'unit_29', title: 'Unidade 29: Cremalheira & Pinhão', desc: 'Conversão de rotação em movimento linear' },
      { id: 'unit_30', title: 'Unidade 30: Braços Robóticos', desc: 'Articulações e garras de apreensão' },
      { id: 'unit_31', title: 'Unidade 31: Servo Motores & Ângulos', desc: 'Posicionamento preciso de 0° a 180°' },
      { id: 'unit_32', title: 'Unidade 32: Robô Explorador de Rodas', desc: 'Tração em múltiplas rodas e chassi' }
    ].map((u, uIdx) => {
      const uNum = uIdx + 25;
      const gameType = UNIT_GAME_TYPES[u.id] || 'gears';
      return {
        id: u.id,
        worldId: 'world_grade_4',
        title: u.title,
        order: uNum,
        description: u.desc,
        lessons: Array.from({ length: 5 }, (_, lIdx) => {
          const lNum = lIdx + 1;
          const isGameLesson = lNum === 2 || lNum === 3 || lNum === 4;
          return {
            id: `les_${uNum}_${lNum}`,
            unitId: u.id,
            title: `Lição ${lNum}: Desafio ${uNum}.${lNum}`,
            order: lNum,
            totalXpReward: 40,
            type: (isGameLesson ? gameType : 'quiz') as any,
            activities: []
          };
        })
      };
    })
  },

  // -------------------------------------------------------------
  // 5º ANO — MUNDO 5 (8 UNIDADES - CADA UMA COM 5 LIÇÕES)
  // -------------------------------------------------------------
  5: {
    world: {
      id: 'world_grade_5',
      grade: 5,
      title: 'Mundo 5 — Programação & Sensores Autônomos 🚀',
      order: 5,
      icon: '🚀',
      description: 'Crie algoritmos avançados com repetição e leitura de sensores!',
      themeColor: '#F78C6C'
    },
    units: [
      { id: 'unit_33', title: 'Unidade 33: Algoritmos & Variáveis', desc: 'Armazenamento de dados e contadores' },
      { id: 'unit_34', title: 'Unidade 34: Tomadas de Decisão (Se / Senão)', desc: 'Condicionais inteligentes para robôs' },
      { id: 'unit_35', title: 'Unidade 35: Sensores Ultrassônicos', desc: 'Medição de distância e desvio de obstáculos' },
      { id: 'unit_36', title: 'Unidade 36: Robô Seguidor de Linha', desc: 'Sensores ópticos infravermelhos' },
      { id: 'unit_37', title: 'Unidade 37: Leitura Analógica vs Digital', desc: 'Sinais contínuos e discretos' },
      { id: 'unit_38', title: 'Unidade 38: Comunicação Sem Fios', desc: 'Controle remoto por rádio e Bluetooth' },
      { id: 'unit_39', title: 'Unidade 39: Visão Computacional & IA', desc: 'Reconhecimento de padrões e gestos' },
      { id: 'unit_40', title: 'Unidade 40: Grande Desafio Autônomo', desc: 'Missão completa de navegação autônoma' }
    ].map((u, uIdx) => {
      const uNum = uIdx + 33;
      const gameType = UNIT_GAME_TYPES[u.id] || 'runner';
      return {
        id: u.id,
        worldId: 'world_grade_5',
        title: u.title,
        order: uNum,
        description: u.desc,
        lessons: Array.from({ length: 5 }, (_, lIdx) => {
          const lNum = lIdx + 1;
          const isGameLesson = lNum === 2 || lNum === 3 || lNum === 4;
          return {
            id: `les_${uNum}_${lNum}`,
            unitId: u.id,
            title: `Lição ${lNum}: Desafio ${uNum}.${lNum}`,
            order: lNum,
            totalXpReward: 45,
            type: (isGameLesson ? gameType : 'quiz') as any,
            activities: []
          };
        })
      };
    })
  }
};
