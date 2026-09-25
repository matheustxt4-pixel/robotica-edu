import { Activity } from '../types';

export const ACTIVITIES_BY_LESSON: Record<string, Activity[]> = {};

// Gerador de Atividades Pedagógicas para 25 Unidades x 5 Lições (125 Lições x 5 Atividades = 625 Atividades)
for (let u = 1; u <= 25; u++) {
  const isGrade1 = u <= 5;
  const isGrade2 = u > 5 && u <= 10;
  const isGrade3 = u > 10 && u <= 15;
  const isGrade4 = u > 15 && u <= 20;

  for (let l = 1; l <= 5; l++) {
    const lessonId = `les_${u}_${l}`;

    const lessonActivities: Activity[] = [
      {
        id: `act_${u}_${l}_1`,
        type: 'multiple-choice',
        question: isGrade1
          ? `[Unidade ${u} - Lição ${l}] Qual o papel do robô na execução desta tarefa?`
          : isGrade2
          ? `[Unidade ${u} - Lição ${l}] Como a energia da bateria flui pelo circuito?`
          : isGrade3
          ? `[Unidade ${u} - Lição ${l}] Qual o efeito do circuito fechado com o interruptor?`
          : isGrade4
          ? `[Unidade ${u} - Lição ${l}] O que acontece com a velocidade nas engrenagens acopladas?`
          : `[Unidade ${u} - Lição ${l}] Como os sensores de distância auxiliam o robô autônomo?`,
        options: [
          isGrade1 ? '🤖 Executar o algoritmo automático' : isGrade2 ? '⚡ Do polo positivo para o negativo' : isGrade3 ? '💡 A energia circula e aciona o LED' : isGrade4 ? '⚙️ A engrenagem menor gira mais rápido' : '📏 Medindo a proximidade de obstáculos',
          '🧸 Ficar parado sem energia',
          '🪵 Quebrar o circuito',
          '📱 Apagar todas as luzes'
        ],
        correctAnswer: isGrade1 ? '🤖 Executar o algoritmo automático' : isGrade2 ? '⚡ Do polo positivo para o negativo' : isGrade3 ? '💡 A energia circula e aciona o LED' : isGrade4 ? '⚙️ A engrenagem menor gira mais rápido' : '📏 Medindo a proximidade de obstáculos',
        explanation: 'Excelente! A robótica combina ciência, lógica e engenharia de forma divertida!',
        xp: 10
      },
      {
        id: `act_${u}_${l}_2`,
        type: 'true-false',
        question: `[Unidade ${u} - Lição ${l}] Seguir a sequência correta dos passos garante que a máquina robótica não falhe.`,
        correctAnswer: true,
        explanation: 'Verdadeiro! A precisão dos passos é indispensável na programação.',
        xp: 10
      },
      {
        id: `act_${u}_${l}_3`,
        type: 'multiple-choice',
        question: `[Unidade ${u} - Lição ${l}] Qual das ferramentas é essencial para a montagem dos componentes?`,
        options: [
          '🔧 Conectores e cabos seguros',
          '🔨 Tesoura sem ponta',
          '💥 Fogo',
          '🛑 Água'
        ],
        correctAnswer: '🔧 Conectores e cabos seguros',
        explanation: 'Muito bem! Conexões limpas e organizadas evitam mau contato.',
        xp: 10
      },
      {
        id: `act_${u}_${l}_4`,
        type: 'ordering',
        question: `[Unidade ${u} - Lição ${l}] Ordene o fluxo de trabalho do robô:`,
        initialItems: [
          '3. Concluir a missão e acionar o alarme 🔔',
          '1. Conectar a fonte de alimentação 🔋',
          '2. Processar as informações do código 💻'
        ],
        correctAnswer: [
          '1. Conectar a fonte de alimentação 🔋',
          '2. Processar as informações do código 💻',
          '3. Concluir a missão e acionar o alarme 🔔'
        ],
        explanation: 'Perfeito! Sequência lógica estruturada com sucesso.',
        xp: 15
      },
      {
        id: `act_${u}_${l}_5`,
        type: 'matching',
        question: `[Unidade ${u} - Lição ${l}] Associe os termos de tecnologia:`,
        initialItems: [
          { key: '🔋 Bateria', val: 'Fonte de Energia' },
          { key: '⚙️ Engrenagem', val: 'Transmissão Mecânica' },
          { key: '💡 LED', val: 'Emissor de Luz' }
        ],
        correctAnswer: {
          '🔋 Bateria': 'Fonte de Energia',
          '⚙️ Engrenagem': 'Transmissão Mecânica',
          '💡 LED': 'Emissor de Luz'
        },
        explanation: 'Ótima associação de conceitos!',
        xp: 15
      }
    ];

    ACTIVITIES_BY_LESSON[lessonId] = lessonActivities;
  }
}
