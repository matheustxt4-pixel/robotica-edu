# ARQUITETURA DA PLATAFORMA GAMIFICADA DE ROBÓTICA

## 1. VISÃO GERAL
A plataforma é uma Aplicação Web Progressiva (PWA) de aprendizado de Robótica e Computação para crianças do 1º ao 5º ano do Ensino Fundamental. Desenvolvida com **React 19**, **TypeScript**, **Vite** e **Firebase**, ela combina navegação gamificada em mapas de missões, motor universal de atividades interativas e simuladores 2D leves de robótica (programação visual, circuitos e engrenagens).

---

## 2. ARQUITETURA DO SYSTEMA & CAMADAS

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              CAMADA DE INTERFACE                       │
 │    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
 │    │   Área do Aluno  │    │ Área Professor  │    │  Área da Escola │  │
 │    └─────────┬────────┘    └────────┬────────┘    └────────┬────────┘  │
 └──────────────│──────────────────────│──────────────────────│───────────┘
                │                      │                      │
 ┌──────────────▼──────────────────────▼──────────────────────▼───────────┐
 │                            MOTORES & JOGOS 2D                          │
 │  ┌─────────────────┐ ┌────────────────┐ ┌───────────────────────────┐  │
 │  │ ActivityEngine  │ │ Prog. Engine   │ │ Circuit & Gears Engines   │  │
 │  └────────┬────────┘ └───────┬────────┘ └─────────────┬─────────────┘  │
 └───────────│──────────────────│────────────────────────│────────────────┘
             │                  │                        │
 ┌───────────▼──────────────────▼────────────────────────▼────────────────┐
 │                            SERVIÇOS DE NEGÓCIO                         │
 │  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────────┐  │
 │  │  xpService   │  │ progressService  │  │   leaderboardService     │  │
 │  └───────┬──────┘  └────────┬─────────┘  └────────────┬─────────────┘  │
 └──────────│──────────────────│─────────────────────────│────────────────┘
            │                  │                         │
 ┌──────────▼──────────────────▼─────────────────────────▼────────────────┐
 │                            CAMADA DE DADOS & BAAS                      │
 │    Firebase Authentication  │  Cloud Firestore  │  Firebase Hosting    │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. DESIGN SYSTEM & IDENTIDADE VISUAL
- **Target Audience:** Crianças de 6 a 11 anos.
- **Paleta de Cores Primárias:**
  - `RoboYellow` (#FFD166) - Energia e Gamificação
  - `RoboBlue` (#118AB2) - Tecnologia e Confiança
  - `RoboGreen` (#06D6A0) - Acertos e Sucesso
  - `RoboOrange` (#F78C6C) - Destaque e Interação
  - `RoboPurple` (#073B4C / #7209B7) - Programação e Circuitos
- **Componentes Base Reutilizáveis:**
  - `<Button />`: Botões 3D amigáveis com respostas táteis.
  - `<Card />`: Containers com cantos arredondados e bordas destacadas.
  - `<ProgressBar />`: Barra de progresso de lições e XP animada.
  - `<XPBar />`: Indicador permanente de nível e XP do aluno.
  - `<Avatar />`: Seletor e renderizador de avatares infantis seguros.
  - `<FeedbackModal />`: Modal educativo de acerto/erro amigável.
  - `<GameCard />` e `<LessonNode />`: Nós do mapa de aprendizagem com estados visuais (Bloqueado, Disponível, Concluído, Perfeito).

---

## 4. ESTRUTURA MODULAR DOS JOGOS
Cada mini-jogo no diretório `src/games/` segue o padrão **MVC desacoplado**:
1. **Engine:** Lógica de execução do jogo (ex: interpretador de comandos do robô, verificador de circuito elétrico fecho/aberto).
2. **State:** Gerenciamento do estado local da tentativa (comandos inseridos, posição do robô, estado das engrenagens).
3. **Renderer:** Componente React/Canvas responsável pela apresentação gráfica 2D leve.
4. **Validation:** Função pura que avalia se a solução do aluno atende ao objetivo da fase.
5. **Level Data:** Arquivo JSON declarativo com o mapa, peças disponíveis e condição de vitória.

---

## 5. ROLES E CONTROLE DE ACESSO (RBAC)
1. **Super Admin:** Acesso total à plataforma, criação de conteúdos, escolas e métricas globais.
2. **School Admin:** Gestão de professores, turmas e alunos da sua própria instituição escolar.
3. **Teacher:** Criação de salas/turmas, geração de códigos de acesso, acompanhamento do progresso, ranking e dificuldades da turma.
4. **Student:** Navegação pelo mapa, execução de missões e jogos, acúmulo de XP, subida de nível e conquistas.

