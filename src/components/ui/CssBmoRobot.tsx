import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

export interface CssBmoRobotProps {
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

export const CssBmoRobot: React.FC<CssBmoRobotProps> = ({
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit = false,
  equippedAccessories
}) => {
  const [isVibrating, setIsVibrating] = useState(false);

  const hatItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.hat);
  const backItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.back);
  const toolItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.tool);

  const triggerVibrate = () => {
    setIsVibrating(true);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(200);
      } catch (e) {
        // Ignorar se não suportado
      }
    }
    setTimeout(() => {
      setIsVibrating(false);
    }, 1500);
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
      {/* MASCOTE BMO GAMBOY EM 100% PURO HTML E CSS (CODEPEN STYLE) */}
      <div className={clsx('relative flex items-center justify-center transition-transform duration-300 flex-shrink-0', sizeMultiplier)}>
        <div className={clsx('bmo-container relative', isVibrating && '--vibrate')}>
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

          {/* Corpo Interno */}
          <div className="bmo-body-inner" />

          {/* Tela de Vídeo */}
          <div className="bmo-screen-frame" />

          {/* Rosto / Olhos Piscantes / Sorriso */}
          <div className="bmo-face">
            <div className="bmo-eyes" />
            <div className="bmo-mouth" />
          </div>

          {/* Entrada de Fita / CD */}
          <div className="bmo-cd-slot" />

          {/* Botão Triângulo (Ciano) */}
          <div
            className="bmo-btn-triangle"
            onClick={triggerVibrate}
            onMouseEnter={triggerVibrate}
            title="Clique ou Passe o Mouse para Ativar o BMO!"
          />

          {/* Botão Círculo (Verde) */}
          <div
            className="bmo-btn-circle"
            onClick={triggerVibrate}
            onMouseEnter={triggerVibrate}
            title="Clique ou Passe o Mouse para Ativar o BMO!"
          />

          {/* Botão Direcional D-Pad (Amarelo) */}
          <div
            className="bmo-btn-dpad"
            onClick={triggerVibrate}
            onMouseEnter={triggerVibrate}
            title="Clique ou Passe o Mouse para Ativar o BMO!"
          >
            <div className="bmo-btn-dpad-top" />
          </div>

          {/* Saída de Som / Alto-falante */}
          <div className="bmo-speaker">
            <div className="bmo-speaker-dot" style={{ top: '10px', left: '20px' }} />
            <div className="bmo-speaker-dot" style={{ top: '10px', left: '50px' }} />
            <div className="bmo-speaker-dot" style={{ top: '40px', left: '5px' }} />
            <div className="bmo-speaker-dot" style={{ top: '40px', left: '35px' }} />
            <div className="bmo-speaker-dot" style={{ top: '40px', left: '65px' }} />
            <div className="bmo-speaker-dot" style={{ top: '70px', left: '20px' }} />
            <div className="bmo-speaker-dot" style={{ top: '70px', left: '50px' }} />
          </div>

          {/* Texto Lateral "BM" */}
          <div className="bmo-letters">BM</div>
        </div>
      </div>

      {/* Balão de Fala do BMO */}
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
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">
            BMO (Console Robô) fala:
          </span>
          <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};

