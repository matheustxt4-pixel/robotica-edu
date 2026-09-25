import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Card } from './Card';
import { Button } from './Button';
import { CSSMascot, MascotCharacter } from './CSSMascot';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';
import { progressService } from '../../services/progressService';
import { X, Sparkles, Shirt, Lock, CheckCircle2, Trash2 } from 'lucide-react';

interface BackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackpackModal: React.FC<BackpackModalProps> = ({ isOpen, onClose }) => {
  const { user, equipAccessory } = useAuth();
  const { playSound } = useAudio();
  const [activeCategory, setActiveCategory] = useState<'all' | 'hat' | 'back' | 'tool'>('all');

  if (!isOpen || !user) return null;

  const completedUnits = progressService.getCompletedUnitsCount(user.uid);
  const equipped = user.equippedAccessories || {};

  const equippedHat = MASCOT_ACCESSORIES.find(a => a.id === equipped.hat);
  const equippedBack = MASCOT_ACCESSORIES.find(a => a.id === equipped.back);
  const equippedTool = MASCOT_ACCESSORIES.find(a => a.id === equipped.tool);

  const filteredAccessories = MASCOT_ACCESSORIES.filter(
    a => activeCategory === 'all' || a.category === activeCategory
  );

  const handleEquip = (category: 'hat' | 'back' | 'tool', id: string) => {
    playSound('finish');
    equipAccessory(category, id);
  };

  const handleUnequip = (category: 'hat' | 'back' | 'tool') => {
    playSound('click');
    equipAccessory(category, null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-display select-none overflow-y-auto">
      <Card variant="white" className="max-w-2xl w-full p-4 sm:p-6 space-y-5 shadow-2xl relative border-4 border-slate-300 my-auto max-h-[92vh] flex flex-col">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
          title="Fechar Mochila"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título & Header da Mochila */}
        <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-amber-300 text-amber-950 text-2xl flex items-center justify-center shadow-3d-yellow flex-shrink-0">
            🎒
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
              Mochila de Equipamentos
            </h3>
            <p className="text-xs font-extrabold text-slate-400">
              Equipe ou desequipe os acessórios do seu mascote 🤖✨
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-5 pr-1 flex-1">
          {/* VISUALIZAÇÃO DO MASCOTE + SLOTS EQUIPADOS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 p-4 sm:p-5 rounded-3xl border-3 border-slate-200 shadow-inner">
            
            {/* Mascote em Tempo Real */}
            <div className="md:col-span-6 flex justify-center py-2 overflow-visible min-h-[190px]">
              <CSSMascot
                character={(user.mascot || 'robi') as MascotCharacter}
                mascotColor={user.mascotColor}
                mascotBackground={user.mascotBackground}
                size="md"
                equippedAccessories={user.equippedAccessories}
                message="Abra os slots ao lado para trocar meus acessórios!"
              />
            </div>

            {/* Slots de Equipamento (Cabeça, Costas, Mão) */}
            <div className="md:col-span-6 space-y-2 w-full">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block border-b border-slate-200 pb-1">
                Slots de Acessórios Equipados
              </span>

              {/* Slot Chapéu */}
              <div className="bg-white p-2.5 rounded-2xl border-2 border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{equippedHat ? equippedHat.icon : '🧢'}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Chapéu</span>
                    <span className="text-xs font-black text-slate-800 truncate block">
                      {equippedHat ? equippedHat.name : 'Nenhum equipado'}
                    </span>
                  </div>
                </div>
                {equippedHat ? (
                  <button
                    onClick={() => handleUnequip('hat')}
                    className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black flex items-center gap-1 flex-shrink-0 transition-colors"
                    title="Desequipar Chapéu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desequipar</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Vazio</span>
                )}
              </div>

              {/* Slot Costas */}
              <div className="bg-white p-2.5 rounded-2xl border-2 border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{equippedBack ? equippedBack.icon : '🎒'}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Costas</span>
                    <span className="text-xs font-black text-slate-800 truncate block">
                      {equippedBack ? equippedBack.name : 'Nenhum equipado'}
                    </span>
                  </div>
                </div>
                {equippedBack ? (
                  <button
                    onClick={() => handleUnequip('back')}
                    className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black flex items-center gap-1 flex-shrink-0 transition-colors"
                    title="Desequipar Mochila/Costas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desequipar</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Vazio</span>
                )}
              </div>

              {/* Slot Ferramenta */}
              <div className="bg-white p-2.5 rounded-2xl border-2 border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{equippedTool ? equippedTool.icon : '🛠️'}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Mão / Ferramenta</span>
                    <span className="text-xs font-black text-slate-800 truncate block">
                      {equippedTool ? equippedTool.name : 'Nenhum equipado'}
                    </span>
                  </div>
                </div>
                {equippedTool ? (
                  <button
                    onClick={() => handleUnequip('tool')}
                    className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black flex items-center gap-1 flex-shrink-0 transition-colors"
                    title="Desequipar Ferramenta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desequipar</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Vazio</span>
                )}
              </div>
            </div>
          </div>

          {/* FILTROS & INVENTÁRIO COMPLETO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-robo-blue" />
                <span>Inventário de Acessórios</span>
              </h4>
            </div>

            {/* Abas de Categorias */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'hat', label: '👑 Chapéus' },
                { id: 'back', label: '🚀 Mochilas' },
                { id: 'tool', label: '🛠️ Ferramentas' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id as any);
                    playSound('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeCategory === tab.id
                      ? 'bg-robo-blue text-white shadow-3d-blue scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid de Itens do Inventário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {filteredAccessories.map(acc => {
                const isUnlocked = (user.level || 1) >= acc.unlockedLevel || completedUnits >= acc.unlockedUnits;
                const isEquipped = equipped[acc.category] === acc.id;

                return (
                  <div
                    key={acc.id}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-2 ring-emerald-300'
                        : isUnlocked
                        ? 'bg-white border-slate-200 hover:border-sky-400'
                        : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-xl flex items-center justify-center shadow-xs flex-shrink-0">
                        {acc.icon}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-black text-xs text-slate-800 truncate">{acc.name}</h5>
                        <p className="text-[10px] font-bold text-slate-500 truncate">{acc.description}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isEquipped ? (
                        <button
                          onClick={() => handleUnequip(acc.category)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shadow-3d-red flex items-center gap-1 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Desequipar</span>
                        </button>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleEquip(acc.category, acc.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black shadow-3d-yellow flex items-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
                          <span>Equipar</span>
                        </button>
                      ) : (
                        <div className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Nv.{acc.unlockedLevel} / Unid.{acc.unlockedUnits}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botão Concluir */}
        <div className="pt-2">
          <Button variant="green" size="lg" fullWidth onClick={onClose} className="font-black shadow-3d-green">
            Pronto! Salvar e Voltar à Aventura 🚀
          </Button>
        </div>
      </Card>
    </div>
  );
};

