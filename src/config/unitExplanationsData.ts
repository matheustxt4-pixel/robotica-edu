export interface UnitExplanation {
  title: string;
  gradeText: string;
  summary: string;
  theory: string;
  keyConcepts: string[];
  realWorldExample: string;
  mascotTip: string;
}

export const UNIT_EXPLANATIONS: Record<string, UnitExplanation> = {
  unit_1: {
    title: "Unidade 1: O que é um Robô?",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Um robô é uma máquina programável capaz de realizar tarefas de forma automática.",
    theory: "Robôs combinam componentes físicos (peças, sensores, luzes) com instruções lógicas (programação). Diferente de um brinquedo comum, o robô consegue perceber o ambiente e responder sozinho de acordo com o que foi ensinado!",
    keyConcepts: ["Sensores (Sentidos)", "Processador (Cérebro)", "Atuadores (Músculos)"],
    realWorldExample: "O robô aspirador limpa a casa e desvia dos móveis sozinho usando sensores!",
    mascotTip: "Um robô precisa de comandos claros! Você é o programador que ensina cada passo a ele."
  },
  unit_2: {
    title: "Unidade 2: Máquinas Simples",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Máquinas simples nos ajudam a multiplicar força e facilitar o movimento.",
    theory: "Alavancas, rodas, eixos e polias são invenções fundamentais. Na robótica, a combinação de rodas com eixos permite que os robôs se locomovam suavemente com menos energia.",
    keyConcepts: ["Roda & Eixo", "Alavanca", "Ponto de Apoio"],
    realWorldExample: "A roda do carrinho de mão ou a tesoura usada na escola são máquinas simples!",
    mascotTip: "Girar um eixo grande faz uma roda menor girar com muita força!"
  },
  unit_3: {
    title: "Unidade 3: Sequências & Passos",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Uma sequência é uma lista ordenada de passos para cumprir uma tarefa.",
    theory: "Para um robô caminhar até um objetivo, precisamos especificar exatamente cada movimento na ordem certa: Dar 2 passos à frente, virar à direita e dar mais 1 passo.",
    keyConcepts: ["Ordem dos Passos", "Instrução Direta", "Passo a Passo"],
    realWorldExample: "A receita de um bolo é uma sequência: se você assar antes de misturar, não vai dar certo!",
    mascotTip: "Robôs cumprem tudo ao pé da letra. Verifique sempre se nenhum passo ficou de fora!"
  },
  unit_4: {
    title: "Unidade 4: Luzes & Sinais do Robô",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Os robôs usam luzes coloridas (LEDs) para nos comunicar seu status.",
    theory: "Assim como o semáforo usa vermelho, amarelo e verde para organizar o trânsito, os robôs usam sinais de iluminação para indicar quando estão ligados, prontos ou com algum erro.",
    keyConcepts: ["LED", "Sinal Visual", "Código de Cores"],
    realWorldExample: "A luz verde no controle da TV mostra que ele está funcionando perfeitamente.",
    mascotTip: "Luz piscando geralmente significa que o robô está pensando ou processando uma ordem!"
  },
  unit_5: {
    title: "Unidade 5: Sons & Bipes do Robô",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Buzzers e alto-falantes emitem sons de confirmação e alerta nos robôs.",
    theory: "Os sinais sonoros permitem que os robôs avisem o usuário sem que ele precise olhar para uma tela. Bipes curtos indicam sucesso e bipes longos avisam perigo.",
    keyConcepts: ["Buzzer Sonoro", "Frequência", "Alerta Auditivo"],
    realWorldExample: "O bipe do micro-ondas quando o alimento fica pronto.",
    mascotTip: "Combine luzes e sons para criar alertas super eficientes para o seu robô!"
  },
  unit_6: {
    title: "Unidade 6: Movimentos em Grade",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Navegar em uma grade quadriculada ajuda a calcular distâncias e posições.",
    theory: "Dividir o espaço em colunas e linhas (uma grade) facilita dizer ao robô exatamente em qual quadrado ele deve parar e para onde deve girar.",
    keyConcepts: ["Matriz Quadriculada", "Coordenadas (X, Y)", "Deslocamento"],
    realWorldExample: "O jogo da batalha naval ou tabuleiros de xadrez usam grades para posicionar peças.",
    mascotTip: "Conte quantos quadradinhos faltam até o destino antes de programar o movimento!"
  },
  unit_7: {
    title: "Unidade 7: Direção & Comandos",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Entender orientação relativa (frente, trás, esquerda, direita) é vital para mover robôs.",
    theory: "A esquerda do robô depende da direção para onde a frente dele está apontando! Girar 90 graus altera sua orientação no mapa.",
    keyConcepts: ["Orientação Relativa", "Giro de 90°", "Ponto de Vista do Robô"],
    realWorldExample: "Quando o motorista do ônibus vira o volante para dobrar a esquina.",
    mascotTip: "Imagine que você é o robô! Coloque-se na posição dele para não errar a esquerda e a direita."
  },
  unit_8: {
    title: "Unidade 8: Formação de Robôs Guia",
    gradeText: "1º Ano — Descobrindo os Robôs",
    summary: "Robôs guias seguem caminhos pré-determinados e conduzem pessoas com segurança.",
    theory: "Integrando movimento, som e luzes, criamos um robô completo capaz de percorrer um mapa de forma autônoma e liderar missões.",
    keyConcepts: ["Autonomia Básica", "Integração de Sistemas", "Missão Guiada"],
    realWorldExample: "Robôs guias em aeroportos que mostram aos passageiros onde fica o portão de embarque.",
    mascotTip: "Parabéns por concluir o Mundo 1! Você já domina os primeiros passos da robótica!"
  },

  unit_9: {
    title: "Unidade 9: Fontes de Energia",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "A energia elétrica faz a corrente fluir e dá vida aos componentes eletrônicos.",
    theory: "Pilhas AA, AAA e baterias de 9V armazenam energia química e a convertem em eletricidade. Sem uma fonte de energia adequada, os motores não giram e as luzes não acendem.",
    keyConcepts: ["Bateria & Pilha", "Tensão (Volts)", "Corrente Elétrica"],
    realWorldExample: "A bateria do celular armazena a energia que ele usa ao longo de todo o dia.",
    mascotTip: "Confira sempre a voltagem da pilha antes de conectar aos seus componentes!"
  },
  unit_10: {
    title: "Unidade 10: Polos Positivo e Negativo",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "A corrente elétrica flui em um sentido determinado do polo positivo para o negativo.",
    theory: "A eletricidade precisa de uma diferença de potencial para se mover. O polo positivo (+) envia os elétrons em direção ao polo negativo (-).",
    keyConcepts: ["Polo Positivo (+)", "Polo Negativo (-)", "Sentido da Corrente"],
    realWorldExample: "Colocar as pilhas do controle remoto no sentido indicado no compartimento plastificado.",
    mascotTip: "Se você inverter a pilha, o circuito não funciona ou pode danificar o componente!"
  },
  unit_11: {
    title: "Unidade 11: O Circuito do LED",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "O LED é um diodo emissor de luz que exige conexão com a polaridade correta.",
    theory: "LEDs possuem duas perninhas: o Ánodo (perna maior, positiva +) e o Cátodo (perna menor, negativa -). O LED só acende quando conectado no sentido correto!",
    keyConcepts: ["Ánodo (+)", "Cátodo (-)", "Diodo Emissor de Luz"],
    realWorldExample: "As luzes de Natal modernas utilizam leds super econômicos e duráveis.",
    mascotTip: "Perna maior no positivo, perna menor no negativo. Essa dica nunca falha!"
  },
  unit_12: {
    title: "Unidade 12: Botões & Interruptores",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "Interruptores abrem e fecham o caminho da energia elétrica manualmente.",
    theory: "Um circuito aberto é como uma ponte levantada: a energia não passa. Quando você pressiona o botão, a ponte baixa (circuito fecha) e a luz acende.",
    keyConcepts: ["Circuito Aberto", "Circuito Fechado", "Interrupção de Corrente"],
    realWorldExample: "O interruptor da lâmpada do seu quarto liga e desliga a luz!",
    mascotTip: "Apertar o botão conecta os contatos internos de metal!"
  },
  unit_13: {
    title: "Unidade 13: Condutores & Isolantes",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "Materiais condutores deixam a energia passar; isolantes bloqueiam o fluxo.",
    theory: "Metais como cobre, alumínio e ouro são excelentes condutores. Borracha, plástico e madeira são isolantes e protegem a gente contra choques elétricos.",
    keyConcepts: ["Condutores (Metais)", "Isolantes (Plástico/Borracha)", "Segurança Elétrica"],
    realWorldExample: "Os fios elétricos são de cobre por dentro e encapados por plástico por fora!",
    mascotTip: "A capa de plástico dos fios garante que a energia vá direto para o robô sem escapar!"
  },
  unit_14: {
    title: "Unidade 14: Resistores de Proteção",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "Resistores limitam a quantidade de corrente elétrica para não queimar peças.",
    theory: "Se a energia da bateria for muito forte para um LED sensível, ele queimará. O resistor funciona como uma trava de vazão que controla o fluxo elétrico seguro.",
    keyConcepts: ["Resistência (Ohms Ω)", "Proteção contra Sobrecarga", "Limitação de Corrente"],
    realWorldExample: "A torneira da pia regula a quantidade de água que sai da tubulação.",
    mascotTip: "Sempre coloque um resistor de 220Ω em série com o seu LED no laboratório!"
  },
  unit_15: {
    title: "Unidade 15: Motores DC & Rotação",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "Motores elétricos convertem energia em rotação contínua para mover as rodas.",
    theory: "Campos magnéticos dentro do motor interagem com a corrente elétrica, fazendo o eixo central girar em altíssima velocidade.",
    keyConcepts: ["Motor de Corrente Contínua (DC)", "Eixo de Rotação", "Eletroímã"],
    realWorldExample: "O ventilador de teto usa um motor elétrico para girar as pás e fazer vento.",
    mascotTip: "Inverter os polos da bateria no motor faz ele girar para o sentido oposto!"
  },
  unit_16: {
    title: "Unidade 16: Circuito Fechado Robótico",
    gradeText: "2º Ano — Energia & Componentes",
    summary: "Integrando bateria, interruptor, resistor, LED e motor em um circuito completo.",
    theory: "Quando todos os componentes estão conectados em uma malha contínua da fonte até a volta para a bateria, temos um circuito totalmente funcional.",
    keyConcepts: ["Circuito Completo", "Malha Elétrica", "Fluxo Contínuo"],
    realWorldExample: "O sistema elétrico de um carrinho de controle remoto.",
    mascotTip: "Se uma perninha soltar, o circuito todo para. Verifique sempre o aperto dos fios!"
  },

  unit_17: {
    title: "Unidade 17: Circuitos em Série",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Componentes organizados em uma única fila onde a mesma corrente passa por todos.",
    theory: "Num circuito em série, os componentes são conectados um depois do outro. Se um componente quebrar ou for desconectado, todo o circuito interrompe.",
    keyConcepts: ["Caminho Único", "Divisão de Voltagem", "Dependência em Fila"],
    realWorldExample: "Luzes pisca-pisca de Natal antigas (se uma lâmpada queimava, todas apagavam).",
    mascotTip: "Em série, quanto mais LEDs você coloca, mais fraquinha fica a luz de cada um!"
  },
  unit_18: {
    title: "Unidade 18: Circuitos em Paralelo",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Múltiplos caminhos independentes para a corrente elétrica trafegar.",
    theory: "No circuito em paralelo, cada componente recebe a voltagem inteira da fonte em seu próprio ramo. Se um ramo for desligado, os outros continuam acesos.",
    keyConcepts: ["Ramos Independentes", "Mesma Tensão", "Conexão em Paralelo"],
    realWorldExample: "As lâmpadas da sua casa: apagar a luz do quarto não apaga a luz da cozinha.",
    mascotTip: "O circuito em paralelo é o preferido na robótica para alimentar vários motores!"
  },
  unit_19: {
    title: "Unidade 19: Lógica de Comandos Blocky",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Programação visual por blocos de montar tipo encaixe perfeito.",
    theory: "Ao invés de digitar textos difíceis, encaixamos blocos coloridos de instruções que evitam erros de digitação e facilitam o raciocínio lógico.",
    keyConcepts: ["Programação em Blocos", "Estrutura Sequencial", "Encaixe Lógico"],
    realWorldExample: "Montar peças de LEGO com instruções de passo a passo.",
    mascotTip: "Encaixe os blocos de cima para baixo como quem constrói uma torre!"
  },
  unit_20: {
    title: "Unidade 20: Repetição & Loops",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Loops executam um conjunto de ações várias vezes sem precisar repeti-las no código.",
    theory: "Se precisamos que o robô dê 100 passos, não escrevemos 'passo' 100 vezes. Usamos um bloco 'Repetir 100 vezes [Passo]', economizando memória e tempo.",
    keyConcepts: ["Laço de Repetição (Loop)", "Contador de Iterações", "Otimização de Código"],
    realWorldExample: "Escovar os dentes: você repete o movimento de escovação 20 vezes até ficar limpo!",
    mascotTip: "Loops são o superpoder dos programadores para evitar trabalhos repetitivos."
  },
  unit_21: {
    title: "Unidade 21: Navegação em Matriz 5x5",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Programar rotas em um grid de 5 linhas por 5 colunas com precisão.",
    theory: "O mapa 5x5 permite criar labirintos e áreas de obstáculos onde o robô calcula a menor rota até a meta usando algoritmos simples de navegação.",
    keyConcepts: ["Grid 5x5", "Caminho Mínimo", "Desvio de Obstáculos"],
    realWorldExample: "O GPS do celular calculando o caminho para escapar do trânsito.",
    mascotTip: "Fique atento aos blocos de pedras no mapa antes de traçar a rota!"
  },
  unit_22: {
    title: "Unidade 22: Sensores de Luz LDR",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Sensores LDR medem a intensidade da luz no ambiente.",
    theory: "O LDR (Resistor Dependente de Luz) altera sua resistência elétrica conforme a luz que incide nele. No escuro a resistência é alta; na claridade ela cai.",
    keyConcepts: ["LDR (Fotoresistor)", "Entrada Sensorial", "Automação de Iluminação"],
    realWorldExample: "Os postes da rua que acendem automaticamente assim que escurece.",
    mascotTip: "Tampe o sensor LDR com o dedo no simulador para ver a lâmpada acender!"
  },
  unit_23: {
    title: "Unidade 23: Síntese de Cores RGB",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Misturando Vermelho (Red), Verde (Green) e Azul (Blue) para criar qualquer cor.",
    theory: "O LED RGB possui 3 micro-elementos dentro dele. Ajustando a intensidade de R, G e B, conseguimos produzir amarelo, roxo, ciano, branco e milhões de tons.",
    keyConcepts: ["Canais RGB", "Mistura Aditiva de Luz", "Código Hexadecimal / Valores 0-255"],
    realWorldExample: " As telas de TVs, notebooks e smartphones exibem imagens formadas por pixels RGB!",
    mascotTip: "Red 100% + Green 100% gera a cor Amarela brilhante no robô!"
  },
  unit_24: {
    title: "Unidade 24: Desafio Mestre dos Circuitos",
    gradeText: "3º Ano — Circuitos & Lógica",
    summary: "Integre circuitos em série, em paralelo, LEDs RGB e sensores em um projeto final.",
    theory: "Parabéns por chegar até aqui! Neste desafio você demonstra o domínio completo da eletrônica básica e da lógica de blocos.",
    keyConcepts: ["Projeto Integrado", "Diagnóstico de Falhas", "Sistemas Inteligentes"],
    realWorldExample: "Um sistema residencial inteligente completo automatizado por sensores.",
    mascotTip: "Revise todas as conexões antes de acionar a chave geral de energia!"
  },

  unit_25: {
    title: "Unidade 25: Engrenagens Motrizes",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Transmissão mecânica de rotação entre dentes de engrenagens interligadas.",
    theory: "A engrenagem conectada ao motor é a Motriz (Motor). Ela empurra a engrenagem Movida (Carga). Engrenagens vizinhas giram sempre em sentidos opostos!",
    keyConcepts: ["Engrenagem Motriz", "Engrenagem Movida", "Sentido Inverso de Rotação"],
    realWorldExample: "O mecanismo interno de um relógio de corda mecânico.",
    mascotTip: "Se a primeira gira no sentido horário, a segunda engrenada vai girar no anti-horário!"
  },
  unit_26: {
    title: "Unidade 26: Relação de Transmissão",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Alterando velocidade de rotação comparando o número de dentes das engrenagens.",
    theory: "Se uma engrenagem pequena de 10 dentes gira uma engrenagem grande de 30 dentes, a velocidade cai para 1/3, mas o sistema ganha muito mais força!",
    keyConcepts: ["Relação de Dentes (Z1 / Z2)", "Redução de Velocidade", "Ganho Mecânico"],
    realWorldExample: "As marchas da bicicleta: marchas leves para subir morros íngremes.",
    mascotTip: "Pequena girando Grande = Menos velocidade e MAIS FORÇA!"
  },
  unit_27: {
    title: "Unidade 27: Torque & Força",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Torque é a força rotacional necessária para mover cargas pesadas.",
    theory: "Na robótica móvel, robôs pesados precisam de caixas de redução de engrenagens para multiplicar o torque do motor e conseguir subir rampas sem travar.",
    keyConcepts: ["Torque Rotacional", "Caixa de Redução", "Força vs Velocidade"],
    realWorldExample: "O guindaste de obras ou tratores que puxam toneladas de peso.",
    mascotTip: "Não adianta ser super rápido se o robô não tiver torque para mover as rodas!"
  },
  unit_28: {
    title: "Unidade 28: Polias & Correias",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Transmitindo movimento à distância sem contato direto de dentes.",
    theory: "Polias usam correias de borracha para transferir rotação entre eixos distantes. Diferente das engrenagens diretas, ambas as polias giram no mesmo sentido!",
    keyConcepts: ["Polia Motriz / Movida", "Correia de Transmissão", "Mesmo Sentido de Giro"],
    realWorldExample: "A correia do motor do carro ou a esteira da academia.",
    mascotTip: "Ajuste o esticamento da correia para não derrapar durante a rotação."
  },
  unit_29: {
    title: "Unidade 29: Cremalheira & Pinhão",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Convertendo rotação circular em movimento retilíneo (em linha reta).",
    theory: "O pinhão (engrenagem redonda) gira sobre a cremalheira (barra dentada reta), fazendo a barra se mover para a esquerda ou para a direita.",
    keyConcepts: ["Movimento Rotacional -> Linear", "Pinhão", "Cremalheira"],
    realWorldExample: "O volante do carro girando a caixa de direção das rodas frontais.",
    mascotTip: "Esse mecanismo é perfeito para abrir e fechar portões eletrônicos deslizantes!"
  },
  unit_30: {
    title: "Unidade 30: Braços Robóticos",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Articulações mecânicas inspiradas nos ombros, cotovelos e pulsos humanos.",
    theory: "Braços robóticos usam múltiplos graus de liberdade (eixos de rotação) para alcançar objetos no espaço 3D e manipulá-los com garras.",
    keyConcepts: ["Graus de Liberdade (DoF)", "Articulações (Juntas)", "Atuadores Mecânicos"],
    realWorldExample: "Braços robóticos de montadoras de carros que soldam e pintam latarias.",
    mascotTip: "Cada junta precisa de um motor preciso para posicionar a garra sem tremer!"
  },
  unit_31: {
    title: "Unidade 31: Servo Motores & Ângulos",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Motores de posição controlada por ângulos exatos de 0° a 180°.",
    theory: "Diferente do motor DC que gira sem parar, o servomotor vai exatamente para o ângulo solicitado (ex: 90 graus) e segura essa posição com firmeza.",
    keyConcepts: ["Servomotor", "Posicionamento Angular (0-180°)", "Malha Fechada"],
    realWorldExample: "O leme de aviões de controle remoto ou o movimento dos olhos de um robô animatrônico.",
    mascotTip: "Com um servo a 90°, a garra robótica fica perfeitamente meio aberta!"
  },
  unit_32: {
    title: "Unidade 32: Robô Explorador de Rodas",
    gradeText: "4º Ano — Engrenagens & Mecanismos",
    summary: "Projeto completo combinando tração diferencial por rodas e servos articulados.",
    theory: "Exploradores autônomos usam tração em duas rodas para girar no próprio eixo e utilizar braços mecânicos para coletar amostras de terreno.",
    keyConcepts: ["Tração Diferencial", "Navegação Terrestre", "Coleta Mecânica"],
    realWorldExample: "Os rovers da NASA (Curiosity e Perseverance) explorando o solo de Marte!",
    mascotTip: "Você dominou o Mundo 4 de Mecânica e Engrenagens! Parabéns!"
  },

  unit_33: {
    title: "Unidade 33: Algoritmos & Variáveis",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Variáveis armazenam dados na memória do robô enquanto ele executa o programa.",
    theory: "Uma variável é como uma caixinha com etiqueta onde guardamos um valor que pode mudar: quantidade de moedas, vidas restantes, distância de um obstáculo.",
    keyConcepts: ["Variável", "Memória RAM", "Atribuição e Leitura"],
    realWorldExample: "O placar de um jogo de futebol que atualiza a cada gol marcado.",
    mascotTip: "Crie nomes bem explicativos para suas variáveis, como 'distanciaSensor'!"
  },
  unit_34: {
    title: "Unidade 34: Tomadas de Decisão",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Estruturas condicionais (SE / SENÃO) permitem que o robô tome decisões sozinho.",
    theory: "SE (distância < 10cm) ENTÃO { Parar e Girar } SENÃO { Continuar Em Frente }. Essa lógica condicional faz o robô parecer inteligente!",
    keyConcepts: ["Condicional IF / ELSE", "Operadores de Comparação (<, >, ==)", "Lógica Booleana"],
    realWorldExample: "SE estiver chovendo ENTÃO leve o guarda-chuva SENÃO vá de boné.",
    mascotTip: "Decisões condicionais são a chave para a inteligência artificial dos robôs!"
  },
  unit_35: {
    title: "Unidade 35: Sensores Ultrassônicos",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Medição de distância emitindo ondas sonoras de alta frequência (ecolocalização).",
    theory: "O sensor ultrassônico envia um pulso de som (trig), a onda bate no objeto e volta (echo). O robô calcula o tempo de ida e volta para saber a distância exata em cm!",
    keyConcepts: ["Sensor HC-SR04", "Trigger & Echo", "Cálculo de Distância por Som"],
    realWorldExample: "Morcegos e golfinhos navegam no escuro usando a mesma ecolocalização!",
    mascotTip: "O sensor ultrassônico funciona como os olhos do robô para evitar colisões!"
  },
  unit_36: {
    title: "Unidade 36: Robô Seguidor de Linha",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Navegação autônoma acompanhando uma pista preta no chão com sensores infravermelhos.",
    theory: "Sensores IR medem o reflexo da luz no chão. O chão branco reflete muita luz, o chão preto absorve. O robô ajusta os motores continuamente para se manter sobre a linha.",
    keyConcepts: ["Sensor Infravermelho (IR)", "Refletância", "Controle de Trajetória"],
    realWorldExample: "Robôs de logística em galpões de correio e fábricas automatizadas.",
    mascotTip: "Se o sensor da esquerda viu preto, ajuste a roda direita para corrigir o rumo!"
  },
  unit_37: {
    title: "Unidade 37: Leitura Analógica/Digital",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Compreendendo a diferença entre sinais discretos (HIGH/LOW) e contínuos (0 a 1023).",
    theory: "Sinais digitais têm apenas 2 estados: LIGADO (1) ou DESLIGADO (0). Sinais analógicos medem variações contínuas, como temperatura, pressão ou brilho de luz.",
    keyConcepts: ["Sinal Digital (HIGH/LOW)", "Sinal Analógico (ADC)", "Resolução de Leitura"],
    realWorldExample: "Um interruptor comum (digital) versus um botão dimmer giratório de lâmpada (analógico).",
    mascotTip: "Leituras analógicas nos dão valores muito mais precisos do ambiente!"
  },
  unit_38: {
    title: "Unidade 38: Comunicação Sem Fios",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Transmissão de comandos via Bluetooth e Wi-Fi entre robôs e dispositivos.",
    theory: "O robô recebe dados via ondas de rádio (pacotes de mensagens) permitindo ser controlado por um aplicativo de celular ou conversar com outros robôs da rede.",
    keyConcepts: ["Bluetooth / Wi-Fi", "Envio/Recebimento de Dados", "Controle Remoto sem Fio"],
    realWorldExample: "Drones voadores controlados à distância pelo controle remoto ou celular.",
    mascotTip: "Certifique-se de que os robôs estejam pareados no mesmo canal de comunicação!"
  },
  unit_39: {
    title: "Unidade 39: Visão Computacional",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "Reconhecimento de formas, cores e alvos através de câmeras inteligentes.",
    theory: "Algoritmos de visão processam matrizes de imagens para identificar placas de sinalização, reconhecer rostos e rastrear objetos em tempo real.",
    keyConcepts: ["Processamento de Imagem", "Reconhecimento de Padrões", "Inteligência Artificial"],
    realWorldExample: "Carros autônomos da Tesla que reconhecem pedestres e faixas de pedestres.",
    mascotTip: "A visão computacional transforma fotos em dados que a inteligência do robô entende!"
  },
  unit_40: {
    title: "Unidade 40: Grande Desafio Autônomo",
    gradeText: "5º Ano — Programação & Sensores Autônomos",
    summary: "O ápice do curso: crie um robô totalmente autônomo com múltiplos sensores e tomada de decisão!",
    theory: "Nesta última unidade, você junta programação em blocos, condicionais complexas, sensores de obstáculo, motores e comunicação sem fio para criar um sistema robótico de elite.",
    keyConcepts: ["Robótica Avançada", "Autonomia Completa", "Formação de Engenheiro Robótico"],
    realWorldExample: "Exploração de cavernas e planetas distantes por robôs super inteligentes.",
    mascotTip: "Você completou todas as 40 Unidades da Jornada de Robótica! Você é um verdadeiro Campeão Robótico! 🏆🤖✨"
  }
};

