# MODELAGEM E SEGURANÇA FIRESTORE — FIREBASE

## 1. ESTRATÉGIA DE OTIMIZAÇÃO FIRESTORE (PLANO GRATUITO / MVP)
Para garantir compatibilidade com o plano gratuito (Spark Plan do Firebase: 50k leituras/dia, 20k gravações/dia):
1. **Modelagem Pré-Agregada para Leaderboards:** Em vez de consultar e somar milhares de documentos de progresso para montar a classificação da turma, o servidor/serviço manterá um documento `leaderboards/{classId}` atualizado apenas quando o aluno conclui uma lição.
2. **Denormalização Controlada:** Dados frequentemente lidos em conjunto (ex: `userName`, `userAvatar` dentro do membro da turma) são armazenados juntos para evitar buscas N+1.
3. **Cache Local no Cliente:** Ativar persistência offline do Firestore no React/PWA (`enableIndexedDbPersistence`), permitindo reler dados do mapa e lições do cache local sem gastar cotas de leitura.

---

## 2. MODELAGEM DE COLEÇÕES

### Coleção: `users`
- **ID do Documento:** `userId` (UID do Firebase Auth)
- **Campos:**
  - `name`: string
  - `nickname`: string (para exibição em rankings de crianças)
  - `email`: string
  - `role`: 'super_admin' | 'school_admin' | 'teacher' | 'student'
  - `schoolId`: string (opcional)
  - `grade`: number (1 a 5, para alunos)
  - `avatar`: string (ID do avatar selecionado)
  - `xp`: number (total acumulado)
  - `level`: number (nível atual)
  - `streak`: number (dias consecutivos)
  - `lastActiveDate`: timestamp
  - `createdAt`: timestamp

### Coleção: `schools`
- **ID do Documento:** `schoolId`
- **Campos:**
  - `name`: string
  - `code`: string (código da escola)
  - `city`: string
  - `state`: string
  - `adminIds`: array<string>
  - `createdAt`: timestamp

### Coleção: `classes`
- **ID do Documento:** `classId`
- **Campos:**
  - `name`: string (Ex: "3º Ano A")
  - `grade`: number (3)
  - `schoolId`: string
  - `teacherId`: string
  - `classCode`: string (Ex: "ROB-4821")
  - `settings`: { `showLeaderboard`: boolean }
  - `createdAt`: timestamp

### Coleção: `classMembers`
- **ID do Documento:** `{classId}_{studentId}`
- **Campos:**
  - `classId`: string
  - `studentId`: string
  - `studentNickname`: string
  - `studentAvatar`: string
  - `totalXP`: number
  - `joinedAt`: timestamp

### Coleção: `worlds`
- **ID do Documento:** `worldId` (Ex: `world-grade3-01`)
- **Campos:**
  - `grade`: number (1 a 5)
  - `title`: string ("Descobrindo a Robótica")
  - `order`: number
  - `icon`: string
  - `description`: string

### Coleção: `units`
- **ID do Documento:** `unitId`
- **Campos:**
  - `worldId`: string
  - `title`: string ("Circuitos Básicos")
  - `order`: number

### Coleção: `lessons`
- **ID do Documento:** `lessonId`
- **Campos:**
  - `unitId`: string
  - `title`: string ("O que é um LED?")
  - `order`: number
  - `totalXpReward`: number
  - `activities`: array<object> (Esquemas JSON das atividades e fases dos jogos)

### Coleção: `progress`
- **ID do Documento:** `{studentId}_{lessonId}`
- **Campos:**
  - `studentId`: string
  - `lessonId`: string
  - `unitId`: string
  - `status`: 'locked' | 'available' | 'completed' | 'perfect'
  - `stars`: number (1 a 3)
  - `score`: number
  - `completedAt`: timestamp

### Coleção: `xpEvents`
- **ID do Documento:** `eventId` (gerado auto ou hash `{studentId}_{lessonId}_{type}`)
- **Campos:**
  - `studentId`: string
  - `amount`: number
  - `reason`: string ('lesson_completed' | 'first_attempt' | 'unit_completed' | 'perfect_score')
  - `sourceId`: string (ID da lição ou unidade)
  - `timestamp`: timestamp

### Coleção: `leaderboards`
- **ID do Documento:** `{classId}`
- **Campos:**
  - `classId`: string
  - `rankings`: array<{ `studentId`: string, `nickname`: string, `avatar`: string, `xp`: number, `position`: number }>
  - `updatedAt`: timestamp

---

## 3. REGRAS DE SEGURANÇA (FIRESTORE SECURITY RULES - ESBOÇO)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isUser(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isUser(userId) || getUserRole() == 'super_admin';
    }

    match /classes/{classId} {
      allow read: if isAuthenticated();
      allow write: if getUserRole() in ['teacher', 'school_admin', 'super_admin'];
    }

    match /progress/{progressId} {
      allow read: if isAuthenticated();
      allow write: if request.resource.data.studentId == request.auth.uid;
    }

    match /xpEvents/{eventId} {
      allow read: if isAuthenticated();
      allow create: if request.resource.data.studentId == request.auth.uid;
    }
    
    match /worlds/{worldId} {
      allow read: if isAuthenticated();
      allow write: if getUserRole() == 'super_admin';
    }
  }
}
```

