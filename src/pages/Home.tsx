import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CSSMascot } from '../components/ui/CSSMascot';
import { useNavigate } from 'react-router-dom';
import { Rocket, GraduationCap, Sparkles } from 'lucide-react';
import { GiRobotAntennas, GiGears, GiElectric, GiProcessor } from 'react-icons/gi';
import { FaRobot, FaGraduationCap } from 'react-icons/fa';
import { TbPuzzle } from 'react-icons/tb';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartStudent = () => {
    navigate('/login', { state: { loginType: 'student' } });
  };

  const handleStartTeacher = () => {
    navigate('/login', { state: { loginType: 'teacher' } });
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10 gap-8 text-center font-display">
      {/* Hero Header */}
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-900 font-extrabold px-4 py-1.5 rounded-full text-sm shadow-sm animate-bounce-small">
          <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
          Plataforma Gamificada do 1º ao 5º Ano
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-robo-dark leading-tight flex items-center justify-center gap-3">
          Aprenda Robótica Jogando! <GiRobotAntennas className="text-robo-blue text-5xl md:text-6xl animate-pulse" />
        </h1>

        <p className="text-lg md:text-xl text-slate-600 font-bold max-w-xl mx-auto">
          Explore missões incríveis com circuitos, engrenagens e programação em blocos!
        </p>
      </div>

      {/* Robi Guia Azul Animado em Puro HTML/CSS (Estilo CodePen 3D) */}
      <div className="max-w-xl w-full flex justify-center">
        <CSSMascot
          character="robi"
          size="lg"
          message="Olá! Eu sou o Robi Guia Azul 🤖! Escolha abaixo como você deseja entrar na aventura!"
        />
      </div>

      {/* Cards de Entrada Rápida */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
        {/* Card Aluno */}
        <Card variant="yellow" hoverEffect className="flex flex-col justify-between p-6 md:p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-robo-yellow border-2 border-amber-400 flex items-center justify-center text-4xl shadow-3d-yellow text-amber-950">
              <FaRobot className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-amber-950">Sou Aluno</h3>
              <p className="text-sm font-bold text-amber-800/80 mt-1">
                Acesse seu mapa de aprendizagem, ganhe XP, suba de nível e encare os desafios de robótica!
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="yellow" size="lg" fullWidth onClick={handleStartStudent} icon={<Rocket className="w-6 h-6" />}>
              Entrar na Aventura
            </Button>
          </div>
        </Card>

        {/* Card Professor */}
        <Card variant="blue" hoverEffect className="flex flex-col justify-between p-6 md:p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-robo-blue border-2 border-sky-600 flex items-center justify-center text-4xl shadow-3d-blue text-white">
              <FaGraduationCap className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-sky-950">Sou Professor</h3>
              <p className="text-sm font-bold text-sky-800/80 mt-1">
                Gerencie turmas, acompanhe o progresso dos alunos e visualize relatórios de desempenho.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="blue" size="lg" fullWidth onClick={handleStartTeacher} icon={<GraduationCap className="w-6 h-6" />}>
              Painel do Professor
            </Button>
          </div>
        </Card>
      </div>

      {/* Destaques de Funcionalidades com Ícones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-4">
        <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl text-center space-y-2 hover:border-purple-300 transition-colors">
          <TbPuzzle className="text-4xl text-purple-600 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-800">Programação</h4>
          <p className="text-xs text-slate-500 font-semibold">Blocos visuais</p>
        </div>
        <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl text-center space-y-2 hover:border-amber-300 transition-colors">
          <GiElectric className="text-4xl text-amber-500 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-800">Circuitos</h4>
          <p className="text-xs text-slate-500 font-semibold">Simulação de LEDs</p>
        </div>
        <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl text-center space-y-2 hover:border-sky-300 transition-colors">
          <GiGears className="text-4xl text-sky-600 mx-auto animate-spin duration-[8000ms]" />
          <h4 className="font-extrabold text-sm text-slate-800">Engrenagens</h4>
          <p className="text-xs text-slate-500 font-semibold">Mecanismos 2D</p>
        </div>
        <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl text-center space-y-2 hover:border-emerald-300 transition-colors">
          <GiProcessor className="text-4xl text-emerald-500 mx-auto" />
          <h4 className="font-extrabold text-sm text-slate-800">Robô & Sensores</h4>
          <p className="text-xs text-slate-500 font-semibold">Desafios práticos</p>
        </div>
      </div>
    </div>
  );
};
