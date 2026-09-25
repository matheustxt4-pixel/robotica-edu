import React from 'react';
import { clsx } from 'clsx';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

export type MascotCharacterType = 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist';

export interface CssWizardRobotProps {
  character?: MascotCharacterType;
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

export const CssWizardRobot: React.FC<CssWizardRobotProps> = ({
  character = 'robi',
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit = false,
  equippedAccessories
}) => {
  const hatItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.hat);
  const backItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.back);
  const toolItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.tool);
  const isWizardOrScientist = character === 'wizard' || character === 'scientist';
  const sizeMultiplier = size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-110' : 'scale-100';

  const mascotData = {
    robi: {
      name: 'Robi (Guia Azul)',
      orbitIcons: ['⚙️', '⚡', '💡']
    },
    byte: {
      name: 'Byte (Engenheiro Laranja)',
      orbitIcons: ['🛠️', '⚙️', '🔌']
    },
    volt: {
      name: 'Volt (Elétrico Roxo)',
      orbitIcons: ['⚡', '🔋', '💡']
    },
    spark: {
      name: 'Spark (Programador Verde)',
      orbitIcons: ['🧩', '💻', '🔍']
    },
    wizard: {
      name: 'Mago Robi (Mestre)',
      orbitIcons: ['⚙️', '⚡', '💡']
    },
    scientist: {
      name: 'Prof. Volt (Cientista)',
      orbitIcons: ['⚛️', '🔋', '🧪']
    }
  }[character] || {
    name: 'Robi (Guia Azul)',
    orbitIcons: ['⚙️', '⚡', '💡']
  };

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
        {/* Objetos Flutuantes Orbitando em Volta do Robô */}
        {!hideOrbit && (
          <div className="objects-orbit">
            <div className="floating-object obj-square flex items-center justify-center font-black text-xl text-amber-950">
              {mascotData.orbitIcons[0]}
            </div>
            <div className="floating-object obj-circle flex items-center justify-center font-black text-xl text-sky-950">
              {mascotData.orbitIcons[1]}
            </div>
            <div className="floating-object obj-triangle flex items-center justify-center font-black text-xl text-purple-950">
              {mascotData.orbitIcons[2]}
            </div>
          </div>
        )}

        {/* Personagem Robô Animado (Robi / Byte / Volt / Spark / Mago / Cientista) */}
        <div className={clsx('wizard-robot', `--${character}`)}>
          {/* Overlay de Acessório de Costas (Mochila / Asas / Escudo) */}
          {backItem && (
            <div className="absolute -left-6 top-16 z-0 text-4xl animate-pulse filter drop-shadow-lg select-none pointer-events-none">
              {backItem.icon}
            </div>
          )}

          {/* Overlay de Acessório de Chapéu / Capacete */}
          {hatItem && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 text-4xl animate-bounce-small filter drop-shadow-xl select-none pointer-events-none">
              {hatItem.icon}
            </div>
          )}

          {/* Overlay de Acessório de Mão / Ferramenta */}
          {toolItem && (
            <div className="absolute -right-6 bottom-8 z-40 text-4xl animate-pulse filter drop-shadow-lg select-none pointer-events-none">
              {toolItem.icon}
            </div>
          )}

          {/* Corpo do Robô */}
          <div className="robot-body" />

          {/* Braço Direito + Mão */}
          <div className="robot-right-arm">
            <div className="robot-right-hand" />
          </div>

          {/* Braço Esquerdo + Mão */}
          <div className="robot-left-arm">
            <div className="robot-left-hand" />
          </div>

          {/* Cabeça + Visor + Chapéu ou Antena */}
          <div className="robot-head">
            {/* Antena Robótica com Luz Pulsante para Robôs Padrão (Robi, Byte, Volt, Spark) */}
            {!isWizardOrScientist && (
              <div className="robot-antenna flex flex-col items-center absolute -top-8 left-1/2 -translate-x-1/2 z-30">
                <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-[0_0_12px_#FFD166] animate-pulse" />
                <div className="w-1.5 h-4 bg-slate-800" />
              </div>
            )}

            {isWizardOrScientist ? (
              <>
                <div className="robot-beard" />
                <div className="robot-face">
                  <div className="robot-eyes" />
                </div>

                {/* Chapéu de Mago da Robótica */}
                <div className="robot-hat">
                  <div className="robot-hat-tip" />
                  <div className="star --first" />
                  <div className="star --second" />
                  <div className="star --third" />
                </div>
              </>
            ) : (
              <div className="robot-face --standard-bot flex flex-col items-center justify-center relative">
                {/* Orelhas Robóticas Laterais */}
                <div className="robot-ear --left" />
                <div className="robot-ear --right" />

                {/* Viseira com Olhos LED Pulsantes */}
                <div className="robot-eyes --standard-visor flex items-center justify-around px-2">
                  <div className="w-3.5 h-3.5 bg-sky-300 rounded-full shadow-[0_0_8px_#38BDF8] relative">
                    <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5" />
                  </div>
                  <div className="w-3.5 h-3.5 bg-sky-300 rounded-full shadow-[0_0_8px_#38BDF8] relative">
                    <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 right-0.5" />
                  </div>
                </div>

                {/* Sorriso do Robô */}
                <div className="w-5 h-2 border-b-2 border-slate-900 rounded-b-full mt-1" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balão de Fala do Personagem */}
      {message && (
        <div
          className={clsx(
            'bg-white border-3 md:border-4 border-slate-800 p-4 rounded-3xl shadow-xl relative max-w-full sm:max-w-xs md:max-w-sm z-30 flex-1',
            'before:content-[""] before:absolute before:w-0 before:h-0',
            position === 'right'
              ? 'before:-bottom-3 sm:before:bottom-auto sm:before:top-1/2 sm:before:-translate-y-1/2 before:left-1/2 sm:before:left-auto sm:before:-right-3.5 before:-translate-x-1/2 sm:before:translate-x-0 before:border-x-8 before:border-x-transparent before:border-t-8 before:border-t-slate-800 sm:before:border-y-8 sm:before:border-y-transparent sm:before:border-l-8 sm:before:border-l-slate-800 sm:before:border-t-0'
              : 'before:-bottom-3 sm:before:bottom-auto sm:before:top-1/2 sm:before:-translate-y-1/2 before:left-1/2 sm:before:left-auto sm:before:-left-3.5 before:-translate-x-1/2 sm:before:translate-x-0 before:border-x-8 before:border-x-transparent before:border-t-8 before:border-t-slate-800 sm:before:border-y-8 sm:before:border-y-transparent sm:before:border-r-8 sm:before:border-r-slate-800 sm:before:border-t-0'
          )}
        >
          <span className="text-xs font-black text-robo-blue uppercase tracking-wider block mb-1">
            {mascotData.name} fala:
          </span>
          <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};

