import React, { useState } from 'react';
import { LegoStudio } from '../components/lego/LegoStudio';
import { LegoFeed } from '../components/lego/LegoFeed';
import { useAudio } from '../context/AudioContext';
import { Users, Layers, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LegoPage: React.FC = () => {
  const { playSound } = useAudio();
  const [activeTab, setActiveTab] = useState<'studio' | 'feed'>('studio');

  const handleTabSwitch = (tab: 'studio' | 'feed') => {
    playSound('click');
    setActiveTab(tab);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 font-display py-2">
      {/* BANNER REFORÇANDO QUE O FOCO PRINCIPAL É O MAPA */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50 border-3 border-sky-300 p-3 rounded-2xl shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <div>
            <span className="text-xs font-black text-sky-950 block">Atividade Complementar</span>
            <span className="text-[11px] font-bold text-sky-800">
              O foco principal da sua jornada é evoluir na <strong>Trilha de Aprendizado do Mapa</strong>!
            </span>
          </div>
        </div>
        <Link
          to="/map"
          onClick={() => playSound('click')}
          className="w-full sm:w-auto text-xs font-black bg-robo-blue hover:bg-sky-600 text-white px-4 py-2 rounded-xl transition-all shadow-3d-blue flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <MapPin className="w-4 h-4" />
          <span>Voltar ao Mapa Principal 🗺️</span>
        </Link>
      </div>
      {/* NAVEGAÇÃO DE ABAS: OFICINA LEGO vs MURAL DA TURMA */}
      <div className="flex items-center justify-center bg-white border-2 border-slate-200 p-2 rounded-3xl shadow-sm max-w-md mx-auto gap-2">
        <button
          onClick={() => handleTabSwitch('studio')}
          className={`flex-1 py-3 px-4 text-xs md:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'studio'
              ? 'bg-robo-blue text-white shadow-3d-blue scale-105'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Oficina LEGO 🧱</span>
        </button>

        <button
          onClick={() => handleTabSwitch('feed')}
          className={`flex-1 py-3 px-4 text-xs md:text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'feed'
              ? 'bg-robo-purple text-white shadow-3d-purple scale-105'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mural da Turma 🌟</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA ATIVA */}
      {activeTab === 'studio' ? (
        <LegoStudio onPublishSuccess={() => setActiveTab('feed')} />
      ) : (
        <LegoFeed onGoToStudio={() => setActiveTab('studio')} />
      )}
    </div>
  );
};
