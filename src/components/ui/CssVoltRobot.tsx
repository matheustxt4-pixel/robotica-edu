import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

export interface CssVoltRobotProps {
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

export const CssVoltRobot: React.FC<CssVoltRobotProps> = ({
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit = false,
  equippedAccessories
}) => {
  const [chargeLevel, setChargeLevel] = useState(3);
  const [isCharging, setIsCharging] = useState(false);

  const hatItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.hat);
  const backItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.back);
  const toolItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.tool);

  // Pressionar e Segurar para Carregar a Bateria do Volt 0% -> 100%
  const handleStartCharge = () => {
    setIsCharging(true);
    setChargeLevel(prev => (prev >= 5 ? 1 : prev + 1));
  };

  const handleEndCharge = () => {
    setIsCharging(false);
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
        {/* Objetos Flutuantes Orbitando em Volta do Robô Volt (Raio, Bateria, Lâmpada) */}
        {!hideOrbit && (
          <div className="objects-orbit">
            <div className="floating-object obj-square flex items-center justify-center font-black text-xl text-amber-950">
              ⚡
            </div>
            <div className="floating-object obj-circle flex items-center justify-center font-black text-xl text-sky-950">
              🔋
            </div>
            <div className="floating-object obj-triangle flex items-center justify-center font-black text-xl text-purple-950">
              💡
            </div>
          </div>
        )}

        {/* Personagem Robô Volt Animado com Braços Articulados e Indicador de Carga Interativo */}
        <div className="wizard-robot --volt relative">
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

          {/* Corpo do Robô com Indicador de Bateria Interativo */}
          <div className="robot-body relative flex flex-col items-center justify-center p-1">
            {/* Botão de Pressionar e Segurar no Peito */}
            <button
              onMouseDown={handleStartCharge}
              onMouseUp={handleEndCharge}
              onTouchStart={handleStartCharge}
              onTouchEnd={handleEndCharge}
              className="w-11 h-7 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-black text-[9px] rounded-lg shadow-md border border-purple-300 transition-transform active:scale-90 absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 z-20"
              title="Pressione para carregar a bateria do Volt!"
            >
              ⚡ {chargeLevel * 20}%
            </button>
          </div>

          {/* Braço Direito + Mão Articulada (Linha do Tempo 10s Keyframes) */}
          <div className="robot-right-arm">
            <div className="robot-right-hand" />
          </div>

          {/* Braço Esquerdo + Mão Articulada (Linha do Tempo 10s Keyframes) */}
          <div className="robot-left-arm">
            <div className="robot-left-hand" />
          </div>

          {/* Cabeça do Robô com Antena de Raio e Domo Elétrico */}
          <div className="robot-head">
            <div className="robot-antenna flex flex-col items-center absolute -top-8 left-1/2 -translate-x-1/2 z-30">
              <div className={clsx('w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-900 shadow-[0_0_14px_#C084FC]', isCharging ? 'scale-125 animate-ping' : 'animate-pulse')} />
              <div className="w-1.5 h-4 bg-slate-800" />
            </div>

            <div className="robot-face --standard-bot flex flex-col items-center justify-center relative">
              <div className="robot-ear --left" />
              <div className="robot-ear --right" />

              <div className="robot-eyes --standard-visor flex items-center justify-around px-2">
                <div className={clsx('w-3.5 h-3.5 bg-purple-300 rounded-full shadow-[0_0_8px_#C084FC] relative', isCharging && 'animate-bounce')}>
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
                <div className={clsx('w-3.5 h-3.5 bg-purple-300 rounded-full shadow-[0_0_8px_#C084FC] relative', isCharging && 'animate-bounce')}>
                  <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>

              <div className="w-5 h-2 border-b-2 border-slate-900 rounded-b-full mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Balão de Fala do Volt */}
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
          <span className="text-xs font-black text-purple-600 uppercase tracking-wider block mb-1">
            Volt (Cientista Elétrico Tesla) fala:
          </span>
          <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};



