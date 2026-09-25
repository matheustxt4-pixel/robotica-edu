# PLANO DE DESENVOLVIMENTO — PLATAFORMA GAMIFICADA DE ROBÓTICA

## 🎯 OBJETIVO GERAL
Desenvolver uma plataforma educacional gamificada de Robótica voltada para alunos do Ensino Fundamental I (1º ao 5º ano). O aprendizado ocorrerá por meio de missões interativas, jogos 2D de lógica/programação em blocos, circuitos elétricos simplificados e engrenagens, com acompanhamento em tempo real por professores e gestores escolares.

## 🏗️ ARQUITETURA & TECNOLOGIAS
- **Frontend:** React 19 + TypeScript + Vite
- **Estilização & UI:** Tailwind CSS v3 + Lucide Icons + Animações CSS/Framer Motion
- **Backend / BaaS:** Firebase (Authentication, Cloud Firestore, Hosting)
- **PWA:** vite-plugin-pwa (suporte a computadores e tablets escolares)
- **Gerenciamento de Estado:** React Context API + Zustand
- **Gamificação:** Serviços centralizados para XP (`xpService`), Níveis, Conquistas e Rankings Otimizados

---

## 🗺️ FASES DE DESENVOLVIMENTO

### FASE 0 — Auditoria e Planejamento
- [x] Auditoria da estrutura do projeto e projeto open-source de referência (`duolingo-clone-main`)
- [x] Leitura e análise de licença do projeto de referência (MIT)
- [x] Definição da Arquitetura da Plataforma e Modelagem de Dados no Firestore
- [x] Criação do arquivo `PLANO_DESENVOLVIMENTO.md`
- [x] Validação do plano técnico e aprovação do usuário

### FASE 1 — Fundação e Design System
- [x] Configuração do projeto React + TypeScript com Vite
- [x] Configuração do Tailwind CSS e Design System Amigável (Cores, Tipografia, Tokens)
- [x] Estruturação completa das pastas do projeto em `src/`
- [x] Configuração do Firebase SDK e Variáveis de Ambiente
- [x] Criação dos Componentes do Design System (Button, Card, Modal, ProgressBar, XPBar, Avatar, Badge)

### FASE 2 — Autenticação e RBAC
- [x] Implementação do Firebase Authentication (E-mail/Senha e Login Simplificado por Código)
- [x] Gerenciamento de Sessão e AuthContext
- [x] Controle de Acesso Baseado em Funções (RBAC: Super Admin, School Admin, Teacher, Student)
- [x] Guardas de Rota Protegida (ProtectedRoutes / RoleGuard)

### FASE 3 — Gestão Escolar & Salas
- [x] Cadastro e vinculação de Escolas e Professores
- [x] Criação de Turmas/Salas (Ex: 3º Ano A) e Geração de Código da Sala (Ex: `ROB-4821`)
- [x] Entrada de Alunos via Código da Sala ou Convite
- [x] Modelo Firestore Otimizado para Membros de Turma

### FASE 4 — Mapa de Aprendizado Interativo
- [x] Estruturação dos Conteúdos por Ano (1º ao 5º ano)
- [x] Componente do Mapa Vertical Interativo (Mundos, Unidades, Lições)
- [x] Estados das Lições (Bloqueado, Disponível, Iniciado, Concluído, Perfeito)
- [x] Engine de Progressão e Desbloqueio Gradual

### FASE 5 — Sistema de Gamificação Central
- [x] Implementação do `xpService` (Cálculo centralizado, bônus, antifraude contra duplicação)
- [x] Motor de Níveis (Curva configurável de XP, barra de progresso, modal de subida de nível)
- [x] Sistema de Sequências de Estudo (Streak)
- [x] Catálogo e Motor de Conquistas/Medalhas (`achievementService`)

### FASE 6 — Activity Engine (Motor de Atividades Orientado a Dados)
- [x] Definição dos Schemas JSON de Atividades
- [x] Renderizador Universal de Atividades (`ActivityEngine`)
- [x] Módulo de Múltipla Escolha e Imagem
- [x] Módulo de Verdadeiro / Falso
- [x] Módulo de Associação (Matching) e Ordenação (Ordering)
- [x] Módulo de Arrastar e Soltar (Drag & Drop / Fill Slot)
- [x] Tela de Feedback Amigável (Acerto com Animação/Som / Erro Construtivo)

### FASE 7 — Jogos Educacionais 2D
- [x] **Jogo 1 — Programação Visual em Blocos:** Grade, Robô, Comandos (Avançar, Virar, Repetir), Execução Animada
- [x] **Jogo 2 — Simulador de Circuitos Simplificado:** Bateria, LED, Botão, Motor, Conexão de Fios
- [x] **Jogo 3 — Desafio de Engrenagens:** Arrastar engrenagens, Transmissão de movimento, Rotação animada
- [x] **Jogo 4 — Monte o Robô:** Encaixe de componentes (Corpo, Rodas, Bateria, Sensores)

### FASE 8 — Painel do Professor & Métricas
- [x] Dashboard da Turma (Progresso geral, média de XP, alunos ativos)
- [x] Relatório Individual por Aluno
- [x] Indicador Visual de Dificuldades por Conteúdo (Circuitos, Engrenagens, Programação)
- [x] Configuração da visibilidade do ranking por sala

### FASE 9 — Leaderboards & Otimização do Firestore
- [x] Modelagem de Documentos Agregados de Leaderboard (Turma, Semanal, Mensal)
- [x] Proteção de Privacidade para Crianças (Apelidos e Avatares no lugar de dados pessoais)
- [x] Atualização controlada de rankings com leitoras/gravações mínimas no Firestore

### FASE 10 — Polimento, PWA, Acessibilidade & Desempenho
- [x] Configuração do PWA (`vite-plugin-pwa`, Service Worker, suporte offline básico)
- [x] Sistema Centralizado de Áudio (Efeitos sonoros para acertos, nível, botão Mute)
- [x] Otimização de Performance (Lazy loading de jogos, code splitting, otimização de imagens)
- [x] Suporte Touch Screen (Tablets e Chromebooks escolares) e Contraste/Acessibilidade

---

## 🐞 BUGS CONHECIDOS & OBSERVAÇÕES
- Nenhum bug registrado nesta fase inicial.

## 💡 DECISÕES TÉCNICAS IMPORTANTES
1. **Isolamento do Projeto de Referência:** A pasta `duolingo-clone-main/` permanece intocada como referência conceitual read-only sob a licença MIT. A nova plataforma de Robótica terá código, arte, componentes e identidade visual 100% originais.
2. **Arquitetura Orientada a Dados para Atividades:** O `ActivityEngine` interpretará arquivos JSON, permitindo cadastrar centenas de perguntas e fases sem refatorar código React.
3. **Escalabilidade do Firestore no Plano Gratuito:** Utilização de documentos pré-agregados para leaderboards e progresso para garantir execução dentro das cotas gratuitas do Firebase.

