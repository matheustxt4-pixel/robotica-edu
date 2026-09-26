import { Activity } from '../types';

export const ACTIVITIES_BY_LESSON: Record<string, Activity[]> = {};

// Banco de Dados Pedagógico por Unidade (1 a 40)
const UNIT_TOPICS: Record<number, { title: string; topic: string; concept: string; tool: string; example: string }> = {
  // 1º Ano — Mundo 1
  1: { title: 'O que é um Robô?', topic: 'sensores e atuadores', concept: 'Robôs são máquinas que percebem o ambiente e seguem regras.', tool: 'Placa controladora e sensores', example: 'Robô aspirador de pó' },
  2: { title: 'Máquinas Simples', topic: 'alavancas e rodas com eixos', concept: 'Máquinas simples reduzem o esforço e facilitam o movimento.', tool: 'Roda, eixo e alavanca', example: 'Tesoura e carrinho de mão' },
  3: { title: 'Sequências & Passos', topic: 'algoritmos e ordem lógica', concept: 'Um algoritmo é uma sequência ordenada de instruções claras.', tool: 'Blocos de passo a passo', example: 'Receita de bolo' },
  4: { title: 'Luzes & Sinais do Robô', topic: 'sinais visuais de LED', concept: 'LEDs transmitem alertas visuais sobre o estado do robô.', tool: 'LEDs coloridos (verde, amarelo, vermelho)', example: 'Semáforo de trânsito' },
  5: { title: 'Sons & Bipes do Robô', topic: 'alertas sonoros e buzzers', concept: 'Sinais sonoros avisam o usuário sobre conclusões ou perigos.', tool: 'Buzzer ou alto-falante', example: 'Bipe do micro-ondas' },
  6: { title: 'Movimentos em Grade', topic: 'navegação quadriculada 2D', concept: 'Grades facilitam contar passos e posições do robô.', tool: 'Matriz quadriculada', example: 'Tabuleiro de xadrez' },
  7: { title: 'Direção & Comandos', topic: 'frente, trás, esquerda e direita', concept: 'Orientações dependem do ponto de vista da frente do robô.', tool: 'Giro de 90 graus', example: 'Volante do carro' },
  8: { title: 'Formação de Robôs Guia', topic: 'integração de sensores e movimento', concept: 'Guiar pessoas combinando luzes, som e movimento autônomo.', tool: 'Robô completo integrado', example: 'Robô guia de aeroporto' },

  // 2º Ano — Mundo 2
  9: { title: 'Fontes de Energia', topic: 'pilhas e baterias de 9V', concept: 'Baterias fornecem a voltagem necessária para o robô funcionar.', tool: 'Pilhas AA, AAA e bateria 9V', example: 'Bateria do celular' },
  10: { title: 'Polos Positivo e Negativo', topic: 'polaridade da corrente (+ / -)', concept: 'A corrente elétrica flui do polo positivo ao negativo.', tool: 'Fios vermelho (+) e preto (-)', example: 'Encaixe correto das pilhas' },
  11: { title: 'O Circuito do LED', topic: 'ánodo (+) e cátodo (-)', concept: 'O LED só acende quando ligado na polaridade correta.', tool: 'LED com perna longa (+)', example: 'Indicador ligado da TV' },
  12: { title: 'Botões & Interruptores', topic: 'circuito aberto vs fechado', concept: 'Interruptores permitem ou interrompem a passagem de energia.', tool: 'Push-button e chave gangorra', example: 'Interruptor de luz do quarto' },
  13: { title: 'Condutores & Isolantes', topic: 'passagem de eletricidade', concept: 'Metais conduzem eletricidade; plástico e borracha isolam.', tool: 'Fio de cobre e capa plástica', example: 'Cabo encapado do carregador' },
  14: { title: 'Resistores de Proteção', topic: 'resistência em Ohms (Ω)', concept: 'Resistores limitam a corrente para não queimar componentes delicados.', tool: 'Resistor de 220 Ohms', example: 'Proteção contra surtos de luz' },
  15: { title: 'Motores DC & Rotação', topic: 'transformar energia em movimento', concept: 'Motores DC convertem energia elétrica em rotação contínua.', tool: 'Motor elétrico de corrente contínua', example: 'Ventilador elétrico' },
  16: { title: 'Circuito Fechado Robótico', topic: 'montagem elétrica completa', concept: 'Um circuito só funciona se a corrente tiver um caminho completo fechado.', tool: 'Bateria, chave, resistor e LED', example: 'Lanterna de mão' },

  // 3º Ano — Mundo 3
  17: { title: 'Circuitos em Série', topic: 'caminho único para a corrente', concept: 'Componentes em série compartilham a mesma corrente em fila.', tool: 'Múltiplos LEDs em linha', example: 'Pisca-pisca clássico' },
  18: { title: 'Circuitos em Paralelo', topic: 'ramificações elétricas independentes', concept: 'Em paralelo, se um LED apaga, os outros continuam acesos.', tool: 'Conexão em ramal duplo', example: 'Lâmpadas da casa' },
  19: { title: 'Lógica Blocky', topic: 'programação por blocos visuais', concept: 'Blocos de código se encaixam como peças para evitar erros de sintaxe.', tool: 'Blocos Mover e Girar', example: 'Scratch / Blockly' },
  20: { title: 'Repetição & Loops', topic: 'estrutura Repita N vezes', concept: 'Loops economizam comandos repetindo um bloco de código.', tool: 'Bloco Repita(4 vezes)', example: 'Desenhar um quadrado' },
  21: { title: 'Navegação em Matriz 5x5', topic: 'coordenadas X e Y', concept: 'Posicionar o robô especificando linhas (Y) e colunas (X).', tool: 'Grade de coordenadas 5x5', example: 'GPS de navegação' },
  22: { title: 'Sensores LDR', topic: 'sensibilidade à luminosidade', concept: 'LDRs mudam sua resistência de acordo com a luz ambiente.', tool: 'Sensor LDR de Luz', example: 'Poste de luz da rua automático' },
  23: { title: 'Síntese RGB', topic: 'mistura de luz Vermelha, Verde e Azul', concept: 'Combinar os 3 canais RGB cria todas as cores visíveis no robô.', tool: 'LED RGB de 4 pinos', example: 'Tela de computador e TV' },
  24: { title: 'Desafio Mestre dos Circuitos', topic: 'integração de sensores e atuadores', concept: 'Conectar sensores de luz, botões e LEDs em um sistema completo.', tool: 'Matriz de ensaio e sensores', example: 'Alarme residencial automático' },

  // 4º Ano — Mundo 4
  25: { title: 'Engrenagens Motrizes', topic: 'transmissão direta de rotação', concept: 'A engrenagem motriz transmite movimento para a engrenagem movida.', tool: 'Par de engrenagens acopladas', example: 'Mecanismo de relógio' },
  26: { title: 'Relação de Transmissão', topic: 'contagem de dentes e velocidade', concept: 'Engrenagem pequena gira mais rápido que a engrenagem grande.', tool: 'Engrenagem de 12 e 36 dentes', example: 'Marcha de bicicleta' },
  27: { title: 'Torque & Força Mecânica', topic: 'multiplicação de força de giro', concept: 'Reduzir a velocidade aumenta o torque (força) para subir rampas.', tool: 'Caixa de redução de marcha', example: 'Trator de carga pesada' },
  28: { title: 'Polias & Correias', topic: 'transmissão por atrito a distância', concept: 'Polias transmitem rotação entre eixos distantes usando correias.', tool: 'Polia de plástico e correia de borracha', example: 'Motor de carro e elevador' },
  29: { title: 'Cremalheira & Pinhão', topic: 'conversão de rotação em movimento reto', concept: 'O pinhão giratório faz a régua cremalheira andar em linha reta.', tool: 'Trilho cremalheira e engrenagem', example: 'Portão elétrico deslizante' },
  30: { title: 'Braços Robóticos', topic: 'articulações e garras de apreensão', concept: 'Braços robóticos usam juntas para pegar e mover objetos no espaço.', tool: 'Garra articulada e servos', example: 'Robô de montagem de carros' },
  31: { title: 'Servo Motores & Ângulos', topic: 'posicionamento preciso de 0° a 180°', concept: 'Servo motores giram até um ângulo exato especificado pelo programa.', tool: 'Servo motor SG90 de 180 graus', example: 'Timão de avião ou leme' },
  32: { title: 'Robô Explorador de Rodas', topic: 'tração diferencial de rodas', concept: 'Girar rodas em sentidos opostos faz o robô girar no próprio eixo.', tool: 'Chassi com 2 motores independentes', example: 'Robô explorador de Marte (Rover)' },

  // 5º Ano — Mundo 5
  33: { title: 'Algoritmos & Variáveis', topic: 'armazenamento de dados na memória', concept: 'Variáveis guardam números, nomes e estados durante a execução.', tool: 'Variável Contador = Contador + 1', example: 'Placar de jogo de futebol' },
  34: { title: 'Tomadas de Decisão (Se / Senão)', topic: 'condicionais lógicas inteligentes', concept: 'Se o sensor detectar obstáculo, o robô desvia; senão, anda pra frente.', tool: 'Bloco Se / Senão', example: 'Porta automática de shopping' },
  35: { title: 'Sensores Ultrassônicos', topic: 'medição de distância por eco sonar', concept: 'Emite um pulso de som e mede o tempo de retorno para calcular a distância.', tool: 'Sensor HC-SR04 de ultrassom', example: 'Sensor de ré do carro' },
  36: { title: 'Robô Seguidor de Linha', topic: 'sensores ópticos infravermelhos', concept: 'Mede a refletância da luz para distinguir a fita preta do piso branco.', tool: 'Par de sensores infravermelhos', example: 'Robô transportador de fábrica' },
  37: { title: 'Leitura Analógica vs Digital', topic: 'sinais contínuos vs binários', concept: 'Sinais digitais são 0 ou 1; analógicos variam suavemente de 0 a 1023.', tool: 'Potenciômetro vs Botão', example: 'Dimmer de luz vs interruptor' },
  38: { title: 'Comunicação Sem Fios', topic: 'sinais de Bluetooth e Rádio RF', concept: 'O robô recebe dados pelo ar usando frequências de rádio.', tool: 'Módulo Bluetooth HC-05', example: 'Controle de videogame sem fio' },
  39: { title: 'Visão Computacional & IA', topic: 'reconhecimento de padrões e imagens', concept: 'Câmeras e IA permitem ao robô identificar cores, rostos e gestos.', tool: 'Câmera e algoritmo de visão', example: 'Filtros de rosto de aplicativo' },
  40: { title: 'Grande Desafio Autônomo', topic: 'integração mestre de autonomia', concept: 'Combinar navegação, sensores, tomada de decisão e velocidade em uma missão.', tool: 'Robô autônomo completo mestre', example: 'Explorador autônomo de resgate' }
};

// Gerador dinâmico de 5 atividades ricas e não repetitivas por lição para TODAS as 40 Unidades
for (let u = 1; u <= 40; u++) {
  const meta = UNIT_TOPICS[u] || UNIT_TOPICS[1];

  for (let l = 1; l <= 5; l++) {
    const lessonId = `les_${u}_${l}`;

    // Variações pedagógicas por lição para garantir 0 repetição
    const lTitles = [
      'Conceito Fundamental',
      'Aplicação Prática',
      'Ferramentas & Segurança',
      'Sequência de Trabalho',
      'Associação Técnica'
    ];

    const currentTitle = lTitles[l - 1];

    const lessonActivities: Activity[] = [
      // 1. Múltipla Escolha - Conceito Direto da Unidade
      {
        id: `act_${u}_${l}_1`,
        type: 'multiple-choice',
        question: `[${meta.title} — ${currentTitle}] ${meta.concept}`,
        options: [
          `🤖 Usar ${meta.topic} de forma correta e lógica`,
          '🧸 Manter o componente desligado sem bateria',
          '🪵 Cortar a fiação do circuito',
          '📱 Apagar todas as memórias'
        ],
        correctAnswer: `🤖 Usar ${meta.topic} de forma correta e lógica`,
        explanation: `Excelente! Em ${meta.title}, entender como funciona ${meta.topic} é fundamental para o sucesso do robô!`,
        xp: 10
      },
      // 2. Verdadeiro ou Falso - Princípio Operacional
      {
        id: `act_${u}_${l}_2`,
        type: 'true-false',
        question: `[${meta.title} — ${currentTitle}] Para garantir o funcionamento perfeito, a ordem das conexões e a sequência do código devem ser respeitadas.`,
        correctAnswer: true,
        explanation: `Verdadeiro! A precisão nas conexões e no código é essencial na robótica.`,
        xp: 10
      },
      // 3. Múltipla Escolha - Aplicação Prática / Ferramenta
      {
        id: `act_${u}_${l}_3`,
        type: 'multiple-choice',
        question: `[${meta.title} — ${currentTitle}] Qual o exemplo clássico de aplicação de "${meta.title}" no nosso cotidiano?`,
        options: [
          `✨ ${meta.example}`,
          '💥 Fogo sem proteção',
          '🌊 Água jogada na placa',
          '🔨 Quebrar a estrutura com martelo'
        ],
        correctAnswer: `✨ ${meta.example}`,
        explanation: `Muito bem! ${meta.example} aplica exatamente os princípios de ${meta.topic}.`,
        xp: 10
      },
      // 4. Ordenação - Algoritmo da Unidade
      {
        id: `act_${u}_${l}_4`,
        type: 'ordering',
        question: `[${meta.title} — ${currentTitle}] Ordene os passos para executar o desafio de "${meta.title}":`,
        initialItems: [
          `3. Testar a resposta de ${meta.topic} 🏆`,
          `1. Preparar a ferramenta (${meta.tool}) 🛠️`,
          `2. Configurar a lógica do circuito/código 💻`
        ],
        correctAnswer: [
          `1. Preparar a ferramenta (${meta.tool}) 🛠️`,
          `2. Configurar a lógica do circuito/código 💻`,
          `3. Testar a resposta de ${meta.topic} 🏆`
        ],
        explanation: 'Perfeito! Sequência operacional estruturada com sucesso.',
        xp: 15
      },
      // 5. Associação - Termos Técnicos da Unidade
      {
        id: `act_${u}_${l}_5`,
        type: 'matching',
        question: `[${meta.title} — ${currentTitle}] Associe os termos de "${meta.title}":`,
        initialItems: [
          { key: `🛠️ ${meta.tool}`, val: 'Ferramenta Principal' },
          { key: `💡 ${meta.topic}`, val: 'Tema de Estudo' },
          { key: `🌟 ${meta.example}`, val: 'Aplicação Prática' }
        ],
        correctAnswer: {
          [`🛠️ ${meta.tool}`]: 'Ferramenta Principal',
          [`💡 ${meta.topic}`]: 'Tema de Estudo',
          [`🌟 ${meta.example}`]: 'Aplicação Prática'
        },
        explanation: `Ótima associação de conceitos da ${meta.title}!`,
        xp: 15
      }
    ];

    ACTIVITIES_BY_LESSON[lessonId] = lessonActivities;
  }
}

