import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { Map, Boxes, Gamepad2, Trophy, User } from 'lucide-react';

export const StudentBottomNav: React.FC = () => {
  const { playSound } = useAudio();

  const navItems = [
    { to: '/map', label: 'Mapa', icon: <Map className="w-5 h-5" /> },
    { to: '/lego', label: 'LEGO', icon: <Boxes className="w-5 h-5" /> },
    { to: '/game/programming', label: 'Jogos', icon: <Gamepad2 className="w-5 h-5" /> },
    { to: '/ranking', label: 'Ranking', icon: <Trophy className="w-5 h-5" /> },
    { to: '/profile', label: 'Perfil', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-4 border-slate-200 py-2 px-3 md:hidden font-display shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => playSound('click')}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-robo-blue text-white shadow-3d-blue scale-105 font-black'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

