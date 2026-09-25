import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { lifeService } from '../../services/lifeService';
import { XPBar } from './XPBar';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Volume2, VolumeX, LogOut, Flame, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isMuted, toggleMute, playSound } = useAudio();
  const navigate = useNavigate();

  const studentLives = user?.uid ? lifeService.getStudentLives(user.uid) : null;

  const handleLogout = () => {
    playSound('click');
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-slate-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 font-display">
        {/* LOGO & MARCA ROBÓTICAEDU */}
        <Link to="/map" className="flex items-center gap-2 group select-none">
          <div className="w-10 h-10 rounded-2xl bg-robo-blue text-white flex items-center justify-center text-2xl shadow-3d-blue group-hover:scale-105 transition-transform">
            🤖
          </div>
          <div>
            <h1 className="font-black text-lg md:text-xl text-slate-900 leading-none flex items-center gap-1.5">
              Robótica<span className="text-robo-blue">Edu</span>
              <span className="text-[10px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mapa 🗺️
              </span>
            </h1>
            <p className="text-[10px] font-extrabold text-slate-400">Trilha Principal de Aprendizado</p>
          </div>
        </Link>

        {/* INDICADORES DO ALUNO (VIDAS ❤️, STREAK 🔥, XP ⭐) */}
        {user && user.role === 'student' && (
          <div className="flex items-center gap-2 md:gap-3">
            {/* Vidas Diárias do Mascote */}
            {studentLives && (
              <div
                className="flex items-center gap-1 bg-rose-50 border-2 border-rose-200 px-2.5 py-1 rounded-2xl text-rose-600 font-black text-xs md:text-sm"
                title="Vidas diárias do seu mascote"
              >
                {[1, 2, 3].map(h => (
                  <Heart
                    key={h}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                      h <= studentLives.lives
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-300 fill-slate-200'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Streak / Sequência Diária */}
            <div className="flex items-center gap-1 bg-orange-50 border-2 border-orange-200 px-2.5 py-1 rounded-2xl text-orange-600 font-extrabold text-xs md:text-sm">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce-small" />
              <span>{user.streak || 0}d</span>
            </div>

            {/* XP Bar compacta */}
            <XPBar totalXP={user.xp} compact />
          </div>
        )}

        {/* CONTROLES: SOM, PERFIL & LOGOUT */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleMute();
              playSound('click');
            }}
            className="p-2 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-robo-blue" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-2">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-90">
                <Avatar avatarId={user.avatar} size="sm" />
                <span className="hidden lg:inline font-black text-xs text-slate-800">{user.nickname || user.name}</span>
              </Link>
              <Button variant="gray" size="sm" onClick={handleLogout} title="Sair">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="yellow" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
