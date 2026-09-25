import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Mail, UserCheck, Sparkles, UserPlus, AlertCircle } from 'lucide-react';
import { GRADES, AVATARS } from '../config/constants';

export const Login: React.FC = () => {
  const { loginStudentWithCode, loginWithEmail, registerTeacher, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialLoginType = (location.state as any)?.loginType || 'student';
  const [loginType, setLoginType] = useState<'student' | 'teacher'>(initialLoginType);
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');
  const [teacherMode, setTeacherMode] = useState<'login' | 'register'>('login');

  // Student Form State
  const [nickname, setNickname] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [classCode, setClassCode] = useState('ROB-YQHN');
  const [selectedGrade, setSelectedGrade] = useState(3);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_bot_blue');
  const [selectedMascot, setSelectedMascot] = useState<'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo'>('robi');

  // Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI Feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMsg('Por favor, digite seu nome ou apelido!');
      return;
    }
    if (!studentPassword.trim()) {
      setErrorMsg('Por favor, digite sua senha de acesso!');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginStudentWithCode({
        nickname: nickname.trim(),
        password: studentPassword.trim(),
        classCode: classCode.trim().toUpperCase(),
        grade: selectedGrade,
        avatar: selectedAvatar,
        mascot: selectedMascot,
        isRegisterMode: studentMode === 'register'
      });
      navigate('/map');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao entrar. Tente novamente!');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Preencha e-mail e senha!');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      if (teacherMode === 'login') {
        await loginWithEmail(email.trim(), password);
      } else {
        if (!teacherName.trim()) {
          setErrorMsg('Preencha seu nome completo!');
          setLoading(false);
          return;
        }
        await registerTeacher(teacherName.trim(), email.trim(), password);
      }
      navigate('/teacher');
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('auth/configuration-not-found')) {
        setErrorMsg('Ative o login por "E-mail/Senha" no painel do Firebase: Vá em Firebase -> Authentication -> Método de Login e ative "E-mail/senha".');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está cadastrado! Clique em "Já tenho conta" para fazer login.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else {
        setErrorMsg(err.message || 'Erro ao realizar login de professor. Verifique seus dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/teacher');
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('auth/configuration-not-found')) {
        setErrorMsg('Ative o login do Google no Firebase Console: Vá em Firebase -> Authentication -> Método de Login e ative "Google".');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('A janela de login do Google foi fechada.');
      } else {
        setErrorMsg(err.message || 'Erro ao realizar login com o Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 md:py-12 font-display">
      <Card variant="white" className="p-6 md:p-8 space-y-6 shadow-xl border-4 border-slate-200">
        {/* Top Icon & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-robo-blue text-white mx-auto flex items-center justify-center text-3xl shadow-3d-blue">
            🤖
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-robo-dark">Acessar Plataforma</h2>
          <p className="text-xs md:text-sm text-slate-500 font-bold">Escolha como deseja entrar para continuar</p>
        </div>

        {/* Tab Selector: Aluno vs Professor */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLoginType('student');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-extrabold rounded-xl transition-all ${
              loginType === 'student' ? 'bg-robo-yellow text-amber-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🚀 Sou Aluno
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('teacher');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs md:text-sm font-extrabold rounded-xl transition-all ${
              loginType === 'teacher' ? 'bg-robo-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            👨‍🏫 Professor / Admin
          </button>
        </div>

        {/* Mensagem de Erro Alerta */}
        {errorMsg && (
          <div className="flex items-center gap-2 bg-rose-50 border-2 border-rose-300 text-rose-800 p-3 rounded-2xl text-xs font-extrabold">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulário de Aluno */}
        {loginType === 'student' ? (
          <div className="space-y-4">
            {/* Sub-seletor para o Aluno: Já tenho conta vs Criar nova conta */}
            <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300">
              <button
                type="button"
                onClick={() => {
                  setStudentMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  studentMode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔑 Já Tenho Conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setStudentMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  studentMode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ✨ Criar Nova Conta
              </button>
            </div>

            {studentMode === 'login' ? (
              /* FORMULÁRIO DE LOGIN DE ALUNO ("Já tenho conta") */
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl text-xs text-sky-950 font-bold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  <span>Entre com seu nome e código da turma cadastrados para continuar de onde parou!</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Seu Nome ou Apelido Cadastrado
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="Ex: Lucas, Ana, Pedro..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Sua Senha de Acesso 🔒
                  </label>
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={e => setStudentPassword(e.target.value)}
                    placeholder="Digite sua senha cadastrada..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Código da Sala / Turma
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={classCode}
                      onChange={e => setClassCode(e.target.value.toUpperCase())}
                      placeholder="Ex: ROB-4821"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-black text-slate-800 uppercase tracking-widest focus:outline-none focus:border-robo-blue"
                    />
                    <KeyRound className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
                  </div>
                </div>

                <Button type="submit" variant="green" size="lg" fullWidth isLoading={loading} icon={<UserCheck className="w-5 h-5" />}>
                  Entrar na Minha Conta 🚀
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStudentMode('register')}
                    className="text-xs font-extrabold text-robo-blue hover:underline"
                  >
                    Novo por aqui? Criar nova conta de aluno ➔
                  </button>
                </div>
              </form>
            ) : (
              /* FORMULÁRIO DE CADASTRO DE NOVO ALUNO ("Criar nova conta") */
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Seu Nome ou Apelido
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="Ex: Lucas, Ana, Pedro..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Crie uma Senha de Acesso 🔒
                  </label>
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={e => setStudentPassword(e.target.value)}
                    placeholder="Crie sua senha de acesso..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Selecione o seu Avatar de Perfil
                  </label>
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {AVATARS.map(av => (
                      <Avatar
                        key={av.id}
                        avatarId={av.id}
                        size="sm"
                        selected={selectedAvatar === av.id}
                        onClick={() => setSelectedAvatar(av.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* SELEÇÃO PERMANENTE DO MASCOTE COMPANHEIRO */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    🤖 Escolha seu Mascote Companheiro (NÃO poderá trocar depois!)
                  </label>
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 text-[11px] text-amber-900 font-bold mb-2">
                    🔒 <strong>Atenção:</strong> Escolha com carinho! Seu mascote será seu parceiro definitivo e ganhará evoluções visuais conforme você completa as 20 unidades!
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { id: 'robi', name: '🤖 Robi', desc: 'Guia' },
                      { id: 'byte', name: '⚙️ Byte', desc: 'Engenheiro' },
                      { id: 'volt', name: '⚡ Volt', desc: 'Elétrico' },
                      { id: 'spark', name: '🧩 Spark', desc: 'Programador' },
                      { id: 'wizard', name: '🧙‍♂️ Mago', desc: 'Mestre' },
                      { id: 'scientist', name: '🧪 Cientista', desc: 'Átomos' },
                      { id: 'bmo', name: '🎮 BMO', desc: 'Console' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMascot(m.id as any)}
                        className={`p-2 rounded-xl text-center border-2 transition-all ${
                          selectedMascot === m.id
                            ? 'bg-robo-blue text-white border-sky-600 font-black shadow-md scale-105'
                            : 'bg-slate-50 text-slate-700 border-slate-200 font-bold hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs">{m.name}</span>
                        <span className="text-[9px] opacity-80 block">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Seu Ano Escolar
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-extrabold text-slate-800 focus:outline-none focus:border-robo-blue"
                  >
                    {GRADES.map(g => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Código da Sala (Ex: ROB-4821)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={classCode}
                      onChange={e => setClassCode(e.target.value.toUpperCase())}
                      placeholder="Ex: ROB-4821"
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-black text-slate-800 uppercase tracking-widest focus:outline-none focus:border-robo-blue"
                    />
                    <KeyRound className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
                  </div>
                </div>

                <Button type="submit" variant="yellow" size="lg" fullWidth isLoading={loading} icon={<Sparkles className="w-5 h-5" />}>
                  Criar Conta e Começar 🎉
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStudentMode('login')}
                    className="text-xs font-extrabold text-robo-blue hover:underline"
                  >
                    Já tem uma conta? Fazer login ➔
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Formulário de Professor */
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div className="flex justify-center gap-4 text-xs font-black text-slate-500 pb-1">
              <button
                type="button"
                onClick={() => setTeacherMode('login')}
                className={teacherMode === 'login' ? 'text-robo-blue underline font-extrabold' : ''}
              >
                Já tenho conta
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setTeacherMode('register')}
                className={teacherMode === 'register' ? 'text-robo-blue underline font-extrabold' : ''}
              >
                Criar nova conta
              </button>
            </div>

            {teacherMode === 'register' && (
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  placeholder="Profª. Maria Souza"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                E-mail Institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="professor@escola.edu.br"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-2 border-slate-300 rounded-2xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:border-robo-blue"
              />
            </div>

            <Button
              type="submit"
              variant="blue"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={teacherMode === 'login' ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            >
              {teacherMode === 'login' ? 'Acessar Painel' : 'Criar Conta de Professor'}
            </Button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <span className="relative bg-white px-2 text-xs font-bold text-slate-400">ou acesse com</span>
            </div>

            <Button
              type="button"
              variant="white"
              size="lg"
              fullWidth
              onClick={handleGoogleLogin}
              isLoading={loading}
              className="border-2 border-slate-300 hover:border-slate-400"
            >
              <span className="flex items-center justify-center gap-2 font-bold text-slate-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Entrar com Google
              </span>
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
