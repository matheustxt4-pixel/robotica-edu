import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

export interface CssByteRobotProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  className?: string;
  hideOrbit?: boolean;
  equippedAccessories?: {
    hat?: string;
    back?: string;
    tool?: string;
  };
}

export const CssByteRobot: React.FC<CssByteRobotProps> = ({
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit = false,
  equippedAccessories
}) => {
  const [gearRotation, setGearRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const hatItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.hat);
  const backItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.back);
  const toolItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.tool);

  // Gira a engrenagem com arraste ou clique
  const handleSpinGear = () => {
    setGearRotation(prev => prev + 120);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 900);
  };

  const sizeMultiplier = size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-110' : 'scale-100';

  return (
    <div
      className={clsx(
        'flex flex-col sm:flex-row items-center gap-4 max-w-full font-display select-none overflow-visible',
        !hideOrbit && 'py-2',
        position === 'right' ? 'sm:flex-row-reverse text-center sm:text-right' : 'text-center sm:text-left',
        className
      )}
    >
      {/* CENA ANIMADA 100% PURO HTML E CSS (ESTILO CODEPEN CRAAFTX) */}
      <div className={clsx('scene-container relative flex items-center justify-center transition-transform duration-300 flex-shrink-0', sizeMultiplier)}>
        {/* Objetos Flutuantes Orbitando em Volta do Robô (Engrenagem, Chave de Fenda, Plugue) */}
        {!hideOrbit && (
          <div className="objects-orbit">
            <div className="floating-object obj-square flex items-center justify-center font-black text-xl text-amber-950">
              ⚙️
            </div>
            <div className="floating-object obj-circle flex items-center justify-center font-black text-xl text-sky-950">
              🛠️
            </div>
            <div className="floating-object obj-triangle flex items-center justify-center font-black text-xl text-purple-950">
              🔌
            </div>
          </div>
        )}

        {/* Personagem Robô Byte Animado com Braços Articulados e Engrenagem Interativa */}
        <div className="wizard-robot --byte relative">
          {/* Overlay de Acessório de Costas */}
          {backItem && (
            <div className="absolute -left-6 top-16 z-0 text-4xl animate-pulse filter drop-shadow-lg select-none pointer-events-none">
              {backItem.icon}
            </div>
          )}

          {/* Overlay de Acessório de Chapéu */}
          {hatItem && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 text-4xl animate-bounce-small filter drop-shadow-xl select-none pointer-events-none">
              {hatItem.icon}
            </div>
          )}

          {/* Overlay de Acessório de Mão */}
          {toolItem && (
            <div className="absolute -right-6 bottom-8 z-40 text-4xl animate-pulse filter drop-shadow-lg select-none pointer-events-none">
              {toolItem.icon}
            </div>
          )}

          {/* Corpo do Robô com Engrenagem Interativa */}
          <div className="robot-body relative flex flex-col items-center justify-center">
            {/* Engrenagem Central Interativa no Peito */}
            <div
              onClick={handleSpinGear}
              onMouseDown={handleSpinGear}
              className={clsx(
                'w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-slate-900 flex items-center justify-center cursor-pointer transition-transform duration-700 shadow-md z-20 absolute top-5 left-1/2 -translate-x-1/2 hover:scale-110',
                isSpinning && 'animate-spin'
              )}
              style={{ transform: `translateX(-50%) rotate(${gearRotation}deg)` }}
              title="Clique para girar a engrenagem mecânica do Byte!"
            >
              <div className="w-4 h-4 rounded-full bg-slate-950 text-[9px] text-amber-300 flex items-center justify-center font-black">⚙️</div>
            </div>
          </div>

          {/* Braço Direito + Mão Articulada (Linha do Tempo 10s Keyframes) */}
          <div className="robot-right-arm">
            <div className="robot-right-hand" />
          </div>

          {/* Braço Esquerdo + Mão Articulada (Linha do Tempo 10s Keyframes) */}
          <div className="robot-left-arm">
            <div className="robot-left-hand" />
          </div>

          {/* Cabeça do Robô Cúbica com Viseira Mecânica e Olhos que Giram */}
          <div className="robot-head">
            <div className="robot-face --standard-bot flex flex-col items-center justify-center relative">
              {/* Orelhas Robóticas de Engrenagem */}
              <div className="robot-ear --left" />
              <div className="robot-ear --right" />

              {/* Viseira com Lentes Duplas Giratórias */}
              <div className="robot-eyes --standard-visor flex items-center justify-around px-2">
                <div
                  className="w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center transition-transform duration-700 shadow-[0_0_6px_#FFB703]"
                  style={{ transform: `rotate(${gearRotation * 2}deg)` }}
                >
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </div>
                <div
                  className="w-4 h-4 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center transition-transform duration-700 shadow-[0_0_6px_#FFB703]"
                  style={{ transform: `rotate(${-gearRotation * 2}deg)` }}
                >
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </div>
              </div>

              {/* Sorriso do Robô */}
              <div className="w-5 h-2 border-b-2 border-slate-900 rounded-b-full mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Balão de Fala do Byte */}
      {message && (
        <div
          className={clsx(
            'bg-white border-4 border-slate-800 p-5 rounded-3xl shadow-2xl relative max-w-xs md:max-w-md z-30',
            'before:content-[""] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-y-8 before:border-y-transparent',
            position === 'right'
              ? 'before:-right-3.5 before:border-l-8 before:border-l-slate-800'
              : 'before:-left-3.5 before:border-r-8 before:border-r-slate-800'
          )}
        >
          <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-1">
            Byte (Engenheiro Industrial) fala:
          </span>
          <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};



