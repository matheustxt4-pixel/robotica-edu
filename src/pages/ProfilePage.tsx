import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { XPBar } from '../components/ui/XPBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CSSMascot, MascotCharacter } from '../components/ui/CSSMascot';
import { lifeService } from '../services/lifeService';
import { progressService } from '../services/progressService';
import { MASCOT_ACCESSORIES } from '../config/mascotAccessories';
import { MASCOT_BACKGROUNDS } from '../config/mascotBackgrounds';
import { Sparkles, Flame, Heart, Shirt, Lock, CheckCircle2, Palette, Unlock, Calendar, Image } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, equipAccessory, changeMascot } = useAuth();
  const { playSound } = useAudio();
  const [selectedAccCategory, setSelectedAccCategory] = useState<'all' | 'hat' | 'back' | 'tool'>('all');
  const [forceUnlocked30Days, setForceUnlocked30Days] = useState(false);

  if (!user) return null;

  const createdAtDate = user.createdAt ? new Date(user.createdAt) : new Date();
  const daysActive = Math.floor((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const effectiveDays = Math.max(user.streak || 0, daysActive);
  const is30DaysUnlocked = effectiveDays >= 30 || forceUnlocked30Days;

  const studentLives = lifeService.getStudentLives(user.uid);
  const completedUnits = progressService.getCompletedUnitsCount(user.uid);

  const achievements = [
    { title: 'Primeiros Passos', desc: 'Completou a 1ª lição de robótica', icon: '🤖', unlocked: true },
    { title: 'Mestre do LED', desc: 'Acendeu seu primeiro circuito', icon: '💡', unlocked: true },
    { title: 'Engrenagens Mágicas', desc: 'Conectou 3 engrenagens sem errar', icon: '⚙️', unlocked: false },
    { title: 'Programador Junior', desc: 'Criou sua primeira sequência de blocos', icon: '🧩', unlocked: true },
    { title: 'Super Sequência', desc: '3 dias seguidos estudando', icon: '🔥', unlocked: true },
    { title: 'Perfeição Total', desc: 'Obteve 3 estrelas em uma lição', icon: '⭐', unlocked: false }
  ];

  const filteredAccessories = MASCOT_ACCESSORIES.filter(
    a => selectedAccCategory === 'all' || a.category === selectedAccCategory
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-display py-4">
      {/* Perfil Header */}
      <Card variant="white" className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border-4 border-slate-200 shadow-md">
        <Avatar avatarId={user.avatar} size="xl" />
        <div className="space-y-2 flex-1">
          <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Aluno do {user.grade || 3}º Ano
          </span>
          <h2 className="text-3xl font-black text-slate-800">{user.name}</h2>
          <p className="text-sm font-extrabold text-slate-400">@{user.nickname}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl text-rose-600 font-extrabold text-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              {studentLives.lives} de 3 Vidas Diárias
            </div>
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl text-orange-600 font-extrabold text-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              {user.streak} dias de Sequência
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-amber-700 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              {user.xp} Total XP
            </div>
          </div>
        </div>
      </Card>

      {/* MASCOTE & ARMÁRIO DE ACESSÓRIOS DO ALUNO */}
      <Card variant="white" className="p-6 space-y-6 border-4 border-slate-200 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full text-xs font-black text-purple-900 mb-1">
              🤖 Mascote: {(user.mascot || 'robi').toUpperCase()} {(user.mascotColor && user.mascotColor !== 'original') ? `(${user.mascotColor.toUpperCase()})` : ''}
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              Armário de Acessórios & Trajes ✨
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Desbloqueie capacetes, mochilas a jato e ferramentas evoluindo de Nível e completando Unidades no Mapa!
            </p>
          </div>

          <div className="bg-sky-50 p-3 rounded-2xl border-2 border-sky-200 text-center min-w-[140px] flex-shrink-0">
            <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider block">
              Progresso no Mapa
            </span>
            <span className="text-lg font-black text-robo-blue">
              {completedUnits} Unidades
            </span>
          </div>
        </div>

        {/* Exibição do Mascote Selecionado Fixo com Acessórios Equipados Live */}
        <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 p-6 rounded-3xl border-3 border-slate-200 flex flex-col items-center justify-center relative overflow-visible shadow-inner">
          <CSSMascot
            character={(user.mascot || 'robi') as MascotCharacter}
            mascotColor={user.mascotColor}
            mascotBackground={user.mascotBackground}
            size="lg"
            equippedAccessories={user.equippedAccessories}
            message={`Legal! Estou vestindo meus acessórios especiais para explorar o mapa com você! 🤖✨`}
          />
        </div>

        {/* DESBLOQUEIO DE CENÁRIOS E PLANOS DE FUNDO POR XP (1k, 2k, 3k, 5k, 10k XP) */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-3 border-indigo-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-indigo-100 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-1">
                <Image className="w-3.5 h-3.5" />
                <span>Cenários de Fundo por Conquista de XP</span>
              </div>
              <h4 className="text-lg font-black text-slate-800">
                Planos de Fundo Iluminados do Mascote 🖼️✨
              </h4>
              <p className="text-xs font-extrabold text-slate-500">
                Acumule XP no mapa para desbloquear fundos interativos (1.000 XP, 2.000 XP, 3.000 XP, 5.000 XP e 10.000 XP)!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-indigo-200 shadow-xs flex-shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-400" />
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Seu Total de XP</span>
                <span className="text-sm font-black text-indigo-700">{user.xp} XP</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MASCOT_BACKGROUNDS.map(bg => {
              const isUnlocked = user.xp >= bg.requiredXp;
              const isEquipped = (user.mascotBackground || 'default') === bg.id;

              return (
                <div
                  key={bg.id}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-all relative overflow-hidden ${
                    isEquipped
                      ? 'ring-4 ring-indigo-400 border-indigo-600 shadow-lg scale-102'
                      : isUnlocked
                      ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                      : 'bg-slate-100 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-200 flex items-center justify-center shadow-xs flex-shrink-0 relative overflow-hidden">
                      {bg.imagePath ? (
                        <img src={bg.imagePath} alt={bg.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{bg.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="font-black text-xs text-slate-800 leading-tight">{bg.name}</h5>
                        {bg.badge && (
                          <span className="text-[9px] font-black bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded-md uppercase">
                            {bg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 leading-tight">
                        {bg.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    {isEquipped ? (
                      <Button
                        variant="green"
                        size="sm"
                        fullWidth
                        disabled
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="text-xs font-black"
                      >
                        CENÁRIO EQUIPADO 🌟
                      </Button>
                    ) : isUnlocked ? (
                      <Button
                        variant="yellow"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          changeMascot(user.mascot, user.mascotColor, bg.id);
                          playSound('finish');
                        }}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                        className="text-xs font-black"
                      >
                        Equipar Cenário ✨
                      </Button>
                    ) : (
                      <div className="w-full py-1.5 px-2.5 bg-slate-200 border border-slate-300 text-slate-600 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>Faltam {bg.requiredXp - user.xp} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TROCA DE ROBÔ E COR DO MASCOTE (DESBLOQUEIO COM 30 DIAS) */}
        <div className="bg-gradient-to-r from-purple-50 via-amber-50 to-sky-50 border-3 border-purple-200 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-purple-100 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-purple-600 text-white font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Troca de Cor & Robô (Conquista dos 30 Dias)</span>
              </div>
              <h4 className="text-lg font-black text-slate-800">
                Personalizador de Robô & Paleta de Cores 🎨✨
              </h4>
              <p className="text-xs font-extrabold text-slate-500">
                {is30DaysUnlocked
                  ? 'Você desbloqueou a habilidade especial dos 30 dias! Escolha seu personagem e a aura de cor reluzente.'
                  : `Complete 30 dias de estudos ou sequência de ofensiva para personalizar seu robô!`}
              </p>
            </div>

            {/* Progresso de 30 Dias */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border-2 border-purple-200 shadow-xs flex-shrink-0">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Progresso 30 Dias</span>
                <span className="text-sm font-black text-purple-700">
                  {Math.min(effectiveDays, 30)} / 30 Dias {effectiveDays >= 30 ? '🎉' : '🔥'}
                </span>
              </div>
            </div>
          </div>

          {!is30DaysUnlocked ? (
            <div className="bg-amber-100/90 border-2 border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl flex-shrink-0">
                  🔒
                </div>
                <div>
                  <h5 className="font-black text-xs text-amber-950">Troca de Cor Bloqueada (Faltam {30 - Math.min(effectiveDays, 30)} dias)</h5>
                  <p className="text-[11px] font-bold text-amber-800">
                    Estude todos os dias para acumular 30 dias de ofensiva e liberar todas as auras de cor e robôs!
                  </p>
                </div>
              </div>
              <Button
                variant="yellow"
                size="sm"
                onClick={() => {
                  setForceUnlocked30Days(true);
                  playSound('finish');
                }}
                icon={<Unlock className="w-4 h-4" />}
                className="text-xs font-black whitespace-nowrap flex-shrink-0"
              >
                ⚡ Simular 30 Dias (Testar)
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Seleção do Personagem do Robô */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  1. Escolha o Personagem do Mascote:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { id: 'robi', label: 'Robi', color: 'bg-sky-500', icon: '⚡' },
                    { id: 'byte', label: 'Byte', color: 'bg-orange-500', icon: '🛠️' },
                    { id: 'volt', label: 'Volt', color: 'bg-purple-600', icon: '🔋' },
                    { id: 'spark', label: 'Spark', color: 'bg-emerald-500', icon: '🧩' },
                    { id: 'wizard', label: 'Mago', color: 'bg-indigo-600', icon: '🧙‍♂️' },
                    { id: 'scientist', label: 'Cientista', color: 'bg-pink-600', icon: '🧪' },
                    { id: 'bmo', label: 'BMO', color: 'bg-teal-500', icon: '🕹️' }
                  ].map(bot => {
                    const isSelected = (user.mascot || 'robi') === bot.id;
                    return (
                      <button
                        key={bot.id}
                        onClick={() => {
                          changeMascot(bot.id as any, user.mascotColor);
                          playSound('click');
                        }}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105 ring-2 ring-purple-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <span className="text-base">{bot.icon}</span>
                        <span className="text-[11px] font-black">{bot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seleção da Paleta / Aura de Cor (30 Dias) */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  2. Escolha a Aura de Cor Especial (Desbloqueada 30 Dias):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { id: 'original', label: 'Original', badge: '🌈 Padrão', bg: 'bg-slate-100 text-slate-800' },
                    { id: 'gold', label: 'Ouro Lendário', badge: '🌟 Dourado', bg: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black' },
                    { id: 'cyber_purple', label: 'Cyber Purple', badge: '💜 Neon', bg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black' },
                    { id: 'emerald', label: 'Esmeralda', badge: '💚 Matrix', bg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black' },
                    { id: 'ruby_red', label: 'Rubi Flamejante', badge: '🔥 Fogo', bg: 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-black' },
                    { id: 'dark_shadow', label: 'Titânio Negro', badge: '🕶️ Sombra', bg: 'bg-slate-900 text-amber-400 font-black' }
                  ].map(pal => {
                    const isSelected = (user.mascotColor || 'original') === pal.id;
                    return (
                      <button
                        key={pal.id}
                        onClick={() => {
                          changeMascot(user.mascot || 'robi', pal.id as any);
                          playSound('finish');
                        }}
                        className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'ring-4 ring-purple-400 border-purple-600 scale-105 shadow-lg'
                            : 'border-slate-200 hover:scale-102'
                        } ${pal.bg}`}
                      >
                        <span className="text-[9px] uppercase tracking-wider block opacity-90">{pal.badge}</span>
                        <span className="text-xs font-black leading-tight text-center">{pal.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros de Categorias de Acessórios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-robo-blue" />
              <span>Seus Acessórios no Armário</span>
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Todos os Acessórios' },
              { id: 'hat', label: '👑 Chapéus & Capacetes' },
              { id: 'back', label: '🚀 Mochilas & Costas' },
              { id: 'tool', label: '🛠️ Ferramentas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedAccCategory(tab.id as any);
                  playSound('click');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedAccCategory === tab.id
                    ? 'bg-robo-blue text-white shadow-3d-blue scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid de Acessórios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {filteredAccessories.map(acc => {
              const isUnlocked = (user.level || 1) >= acc.unlockedLevel || completedUnits >= acc.unlockedUnits;
              const isEquipped = user.equippedAccessories?.[acc.category] === acc.id;

              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-2xl border-3 transition-all flex flex-col justify-between gap-3 ${
                    isEquipped
                      ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                      : isUnlocked
                      ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-md'
                      : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 text-2xl flex items-center justify-center shadow-xs flex-shrink-0">
                        {acc.icon}
                      </div>
                      <div>
                        <h5 className="font-black text-xs text-slate-800 flex items-center gap-1">
                          <span>{acc.name}</span>
                        </h5>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight mt-0.5">
                          {acc.description}
                        </p>
                      </div>
                    </div>
                    {acc.badge && (
                      <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md uppercase flex-shrink-0">
                        {acc.badge}
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    {isEquipped ? (
                      <Button
                        variant="green"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          equipAccessory(acc.category, null);
                          playSound('click');
                        }}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        className="text-xs font-black"
                      >
                        EQUIPADO ⚡ (Remover)
                      </Button>
                    ) : isUnlocked ? (
                      <Button
                        variant="yellow"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          equipAccessory(acc.category, acc.id);
                          playSound('finish');
                        }}
                        icon={<Sparkles className="w-4 h-4" />}
                        className="text-xs font-black"
                      >
                        Equipar Acessório ✨
                      </Button>
                    ) : (
                      <div className="w-full py-2 px-3 bg-slate-200 border border-slate-300 text-slate-600 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Requer Nível {acc.unlockedLevel} ou Unidade {acc.unlockedUnits}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Barra de Nível */}
      <XPBar totalXP={user.xp} />

      {/* Galeria de Conquistas */}
      <Card variant="white" className="p-6 space-y-4 border-2 border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">Medalhas & Conquistas</h3>
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
            {achievements.filter(a => a.unlocked).length} de {achievements.length} Desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
          {achievements.map((ach, idx) => (
            <Badge
              key={idx}
              title={ach.title}
              description={ach.desc}
              icon={ach.icon}
              unlocked={ach.unlocked}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
