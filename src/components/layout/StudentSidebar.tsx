import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { BackpackModal } from '../ui/BackpackModal';
import { Map, Boxes, Gamepad2, Trophy, User, Sparkles } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

export const StudentSidebar: React.FC = () => {
  const { playSound } = useAudio();
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      to: '/map',
      label: 'Mapa de Missões',
      icon: <Map className="w-6 h-6 text-sky-500" />,
      color: 'hover:border-sky-400 hover:bg-sky-50 text-sky-950',
      badge: '🎯 PRINCIPAL'
    },
    {
      to: '/lego',
      label: 'Oficina LEGO 🧱',
      icon: <Boxes className="w-6 h-6 text-emerald-500" />,
      color: 'hover:border-emerald-400 hover:bg-emerald-50 text-emerald-950',
      badge: 'EXTRA'
    },
    {
      to: '/game/programming',
      label: 'Central de Jogos',
      icon: <Gamepad2 className="w-6 h-6 text-purple-500" />,
      color: 'hover:border-purple-400 hover:bg-purple-50 text-purple-950'
    },
    {
      to: '/ranking',
      label: 'Liga da Turma',
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      color: 'hover:border-amber-400 hover:bg-amber-50 text-amber-950'
    },
    {
      to: '/profile',
      label: 'Meu Perfil',
      icon: <User className="w-6 h-6 text-rose-500" />,
      color: 'hover:border-rose-400 hover:bg-rose-50 text-rose-950'
    }
  ];

  return (
    <>
      <aside className="w-64 flex-shrink-0 hidden md:flex flex-col gap-4 font-display select-none sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        {/* BOTÃO DA MOCHILA DO ALUNO */}
        <button
          onClick={() => {
            playSound('click');
            setIsBackpackOpen(true);
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-sm border-3 border-amber-300 shadow-3d-yellow transition-all scale-[1.01] active:scale-95"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🎒</span>
            <span>Minha Mochila</span>
          </div>
          <span className="text-[10px] font-black bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Trocar ⚡
          </span>
        </button>

        {/* CARD DE NAVEGAÇÃO PRINCIPAL */}
        <div className="bg-white border-4 border-slate-200 rounded-3xl p-3 space-y-2 shadow-xl">
          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-2">
            <span>🎯 Trilha de Aprendizado</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <nav className="space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => playSound('click')}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-2xl font-black text-sm border-3 transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-800 shadow-3d-dark scale-[1.02] ring-2 ring-slate-300'
                      : `bg-slate-50 border-slate-200 ${item.color}`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Modal da Mochila */}
      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
      />
    </>
  );
};

