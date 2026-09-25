import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { classService } from '../services/classService';
import { ClassRoom, UserProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { 
  Users, 
  Trophy, 
  Plus, 
  X, 
  CheckCircle2, 
  Copy, 
  UserPlus, 
  Trash2, 
  School,
  Flame,
  Star,
  Sparkles
} from 'lucide-react';
import { GRADES } from '../config/constants';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Modal: Criar Nova Turma
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState(3);

  // Modal: Cadastrar Aluno Manualmente
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentNickname, setStudentNickname] = useState('');
  const [studentPassword, setStudentPassword] = useState('123456');
  const [studentMascot, setStudentMascot] = useState<'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo'>('robi');
  const [targetClassForStudent, setTargetClassForStudent] = useState<string>('');

  const [loadingAction, setLoadingAction] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Carrega as turmas do professor logado
  const loadClasses = async () => {
    if (!user?.uid) return;
    const list = await classService.getClassesByTeacher(user.uid);
    setClasses(list);
    if (list.length > 0 && selectedClassId === 'all') {
      setSelectedClassId(list[0].id);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  // Carrega os alunos da turma selecionada (ou de todas as turmas do professor)
  useEffect(() => {
    if (!user?.uid) return;

    setLoadingStudents(true);
    if (selectedClassId === 'all') {
      classService.getStudentsByTeacher(user.uid).then(list => {
        setStudents(list);
        setLoadingStudents(false);
      });
    } else {
      classService.getStudentsByClass(selectedClassId).then(list => {
        setStudents(list);
        setLoadingStudents(false);
      });
    }
  }, [user, selectedClassId, classes]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || null;

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !user) return;
    setLoadingAction(true);

    const created = await classService.createClass({
      teacherId: user.uid,
      name: newClassName.trim(),
      grade: newClassGrade
    });

    setClasses(prev => [...prev, created]);
    setSelectedClassId(created.id);
    setNewClassName('');
    setShowClassModal(false);
    setLoadingAction(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNickname.trim() || !user) return;
    const classIdToUse = targetClassForStudent || selectedClassId;
    if (!classIdToUse || classIdToUse === 'all') return;

    setLoadingAction(true);
    try {
      await classService.createStudentForClass({
        teacherId: user.uid,
        classId: classIdToUse,
        name: studentName.trim(),
        nickname: studentNickname.trim(),
        password: studentPassword.trim(),
        mascot: studentMascot
      });

      // Recarrega lista
      const list = selectedClassId === 'all'
        ? await classService.getStudentsByTeacher(user.uid)
        : await classService.getStudentsByClass(selectedClassId);
      
      setStudents(list);

      // Reset form
      setStudentName('');
      setStudentNickname('');
      setStudentPassword('123456');
      setShowAddStudentModal(false);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Tem certeza que deseja remover o aluno "${studentName}" da turma?`)) return;
    const classIdToUse = selectedClassId !== 'all' ? selectedClassId : 'class_demo_3a';
    await classService.removeStudentFromClass(classIdToUse, studentId);
    setStudents(prev => prev.filter(s => s.uid !== studentId));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Cálculos de métricas dinâmicas
  const totalStudents = students.length;
  const avgXP = totalStudents > 0 ? Math.round(students.reduce((sum, s) => sum + (s.xp || 0), 0) / totalStudents) : 0;
  const avgLevel = totalStudents > 0 ? Math.round((students.reduce((sum, s) => sum + (s.level || 1), 0) / totalStudents) * 10) / 10 : 1;
  const activeStreakCount = students.filter(s => (s.streak || 0) > 0).length;

  return (
    <div className="space-y-8 font-display py-4">
      {/* Header do Painel e Seletor de Turma */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-100 text-sky-900 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider flex items-center gap-1">
              <School className="w-3.5 h-3.5" /> Painel do Professor
            </span>
            {user?.name && (
              <span className="text-xs font-bold text-slate-500">
                Olá, {user.name}
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black text-slate-800">
            {selectedClassId === 'all'
              ? 'Todas as Minhas Turmas'
              : selectedClass
              ? selectedClass.name
              : 'Nenhuma Turma Selecionada'}
          </h2>

          {selectedClass && selectedClassId !== 'all' && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-slate-500">Código de Acesso dos Alunos:</span>
              <button
                onClick={() => handleCopyCode(selectedClass.classCode)}
                className="font-black text-robo-blue bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-xl border-2 border-sky-200 text-sm flex items-center gap-2 transition-all active:scale-95"
                title="Clique para copiar o código"
              >
                <span>{selectedClass.classCode}</span>
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copiedCode === selectedClass.classCode && (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg animate-pulse">
                  ✓ Copiado!
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {classes.length > 0 && (
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="bg-slate-100 border-2 border-slate-300 font-extrabold text-slate-800 px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:border-robo-blue"
            >
              <option value="all">🏫 Todas as Minhas Turmas ({classes.length})</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade}º Ano) — {c.classCode}
                </option>
              ))}
            </select>
          )}

          {selectedClassId !== 'all' && selectedClass && (
            <Button
              variant="yellow"
              size="md"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => {
                setTargetClassForStudent(selectedClass.id);
                setShowAddStudentModal(true);
              }}
            >
              Add Aluno
            </Button>
          )}

          <Button variant="blue" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setShowClassModal(true)}>
            Nova Turma
          </Button>
        </div>
      </div>

      {/* Métricas da Turma Selecionada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="white" className="flex items-center gap-4 border-2 border-slate-200 p-5">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Total de Alunos</p>
            <h4 className="text-2xl font-black text-slate-800">{totalStudents} {totalStudents === 1 ? 'Aluno' : 'Alunos'}</h4>
          </div>
        </Card>

        <Card variant="white" className="flex items-center gap-4 border-2 border-slate-200 p-5">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Média de XP da Sala</p>
            <h4 className="text-2xl font-black text-slate-800">{avgXP} XP</h4>
          </div>
        </Card>

        <Card variant="white" className="flex items-center gap-4 border-2 border-slate-200 p-5">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Nível Médio</p>
            <h4 className="text-2xl font-black text-slate-800">Nível {avgLevel}</h4>
          </div>
        </Card>

        <Card variant="white" className="flex items-center gap-4 border-2 border-slate-200 p-5">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">Alunos com Sequência</p>
            <h4 className="text-2xl font-black text-slate-800">{activeStreakCount} Alunos 🔥</h4>
          </div>
        </Card>
      </div>

      {/* Lista de Alunos da Turma */}
      <Card variant="white" className="p-6 space-y-4 border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Alunos da Turma</span>
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                {students.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              {selectedClassId === 'all'
                ? 'Exibindo todos os alunos cadastrados nas suas turmas'
                : `Alunos vinculados à turma "${selectedClass?.name || ''}"`}
            </p>
          </div>

          {selectedClassId !== 'all' && selectedClass && (
            <Button
              variant="gray"
              size="sm"
              icon={<UserPlus className="w-4 h-4 text-robo-blue" />}
              onClick={() => {
                setTargetClassForStudent(selectedClass.id);
                setShowAddStudentModal(true);
              }}
            >
              Cadastrar Aluno Nesta Turma
            </Button>
          )}
        </div>

        {loadingStudents ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-robo-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Carregando alunos da turma...</p>
          </div>
        ) : students.length === 0 ? (
          /* Estado Vazio Amigável */
          <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-sky-50 text-robo-blue mx-auto flex items-center justify-center text-4xl shadow-inner border-2 border-sky-100">
              🎒
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">Nenhum aluno nesta turma ainda</h4>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Compartilhe o código da turma com os alunos para eles entrarem na plataforma, ou cadastre-os manualmente!
              </p>
            </div>

            {selectedClass && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-extrabold text-sky-900 block uppercase">Código de Acesso da Turma:</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-robo-blue tracking-wider">{selectedClass.classCode}</span>
                  <button
                    onClick={() => handleCopyCode(selectedClass.classCode)}
                    className="p-2 bg-white rounded-xl border border-sky-300 text-robo-blue hover:bg-sky-100 transition-all active:scale-95"
                    title="Copiar código"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {selectedClass && (
              <Button
                variant="yellow"
                size="md"
                fullWidth
                icon={<UserPlus className="w-5 h-5" />}
                onClick={() => {
                  setTargetClassForStudent(selectedClass.id);
                  setShowAddStudentModal(true);
                }}
              >
                Cadastrar Primeiro Aluno Manualmente
              </Button>
            )}
          </div>
        ) : (
          /* Tabela / Lista de Alunos */
          <div className="divide-y divide-slate-100">
            {students.map((st, idx) => {
              const matchedClass = classes.find(c => c.id === st.classId);
              return (
                <div key={st.uid} className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-2xl transition-all">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-300 text-sm w-6 text-center">#{idx + 1}</span>
                    <Avatar avatarId={st.avatar || 'avatar_bot_blue'} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800 text-sm">{st.name}</h4>
                        {st.mascot && (
                          <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full capitalize">
                            🤖 {st.mascot}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                        <span>@{st.nickname}</span>
                        {matchedClass && selectedClassId === 'all' && (
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            {matchedClass.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sequência</span>
                      <div className="font-black text-orange-600 text-xs flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        <span>{st.streak || 1} dias</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pontuação</span>
                      <div className="font-black text-amber-600 text-sm flex items-center justify-end gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{st.xp || 100} XP</span>
                      </div>
                    </div>

                    <div className="text-right hidden md:block">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nível</span>
                      <div className="font-black text-sky-600 text-xs">
                        Nível {st.level || 1}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveStudent(st.uid, st.name)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Remover aluno da turma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* MODAL 1: Criar Nova Turma */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="white" className="max-w-md w-full p-6 space-y-6 shadow-2xl relative border-4 border-slate-200 animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowClassModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center text-2xl font-black shadow-inner">
                🏫
              </div>
              <h3 className="text-2xl font-black text-slate-800">Criar Nova Turma</h3>
              <p className="text-xs font-bold text-slate-500">Um código exclusivo será gerado para que seus alunos se vinculem a você.</p>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Nome da Turma</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Ex: 3º Ano B — Manhã"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Ano Escolar</label>
                <select
                  value={newClassGrade}
                  onChange={e => setNewClassGrade(Number(e.target.value))}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-extrabold text-slate-800 focus:outline-none focus:border-robo-blue"
                >
                  {GRADES.map(g => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="gray" size="md" fullWidth onClick={() => setShowClassModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="blue" size="md" fullWidth isLoading={loadingAction} icon={<CheckCircle2 className="w-5 h-5" />}>
                  Criar Sala
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: Cadastrar Aluno Manualmente */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="white" className="max-w-md w-full p-6 space-y-5 shadow-2xl relative border-4 border-slate-200 animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowAddStudentModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-2xl font-black shadow-inner">
                🎓
              </div>
              <h3 className="text-2xl font-black text-slate-800">Cadastrar Novo Aluno</h3>
              <p className="text-xs font-bold text-slate-500">
                Cadastre o aluno diretamente na sua turma para ele já começar com acesso!
              </p>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Turma do Aluno</label>
                <select
                  value={targetClassForStudent}
                  onChange={e => setTargetClassForStudent(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-extrabold text-slate-800 focus:outline-none focus:border-robo-blue"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.grade}º Ano) — Código: {c.classCode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Nome Completo do Aluno</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Ex: Gabriel Alves"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Apelido / Usuário de Login</label>
                <input
                  type="text"
                  value={studentNickname}
                  onChange={e => setStudentNickname(e.target.value)}
                  placeholder="Ex: GabrielRobô"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Senha de Acesso do Aluno</label>
                <input
                  type="text"
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  placeholder="Ex: 123456"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Mascote Inicial</label>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { id: 'robi', name: '🤖 Robi' },
                    { id: 'byte', name: '⚙️ Byte' },
                    { id: 'volt', name: '⚡ Volt' },
                    { id: 'spark', name: '🧩 Spark' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setStudentMascot(m.id as any)}
                      className={`p-2 rounded-xl text-center border-2 text-xs font-extrabold transition-all ${
                        studentMascot === m.id
                          ? 'bg-robo-blue text-white border-sky-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="gray" size="md" fullWidth onClick={() => setShowAddStudentModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="yellow" size="md" fullWidth isLoading={loadingAction} icon={<Sparkles className="w-5 h-5" />}>
                  Cadastrar Aluno
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
