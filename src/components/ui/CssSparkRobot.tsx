import React, { useState } from 'react';
import { clsx } from 'clsx';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

export interface CssSparkRobotProps {
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

export const CssSparkRobot: React.FC<CssSparkRobotProps> = ({
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit = false,
  equippedAccessories
}) => {
  const expressions = ['^_^', 'O_O', '[#_#]', 'B-)'];
  const [currentIndex, setCurrentIndex] = useState(0);

  const hatItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.hat);
  const backItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.back);
  const toolItem = MASCOT_ACCESSORIES.find(a => a.id === equippedAccessories?.tool);

  // Clique para Alternar Expressões no Visor Matrix
  const handleNextExpression = () => {
    setCurrentIndex(prev => (prev + 1) % expressions.length);
  };

  const currentFace = expressions[currentIndex];
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
        {/* Objetos Flutuantes Orbitando em Volta do Robô Spark (Bloco Scratch, Tela, Lupa) */}
        {!hideOrbit && (
          <div className="objects-orbit">
            <div className="floating-object obj-square flex items-center justify-center font-black text-xl text-amber-950">
              🧩
            </div>
            <div className="floating-object obj-circle flex items-center justify-center font-black text-xl text-sky-950">
              💻
            </div>
            <div className="floating-object obj-triangle flex items-center justify-center font-black text-xl text-purple-950">
              🔍
            </div>
          </div>
        )}

        {/* Personagem Robô Spark Animado com Braços Articulados e Visor Matrix Interativo */}
        <div className="wizard-robot --spark relative">
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

          {/* Corpo do Robô em Bloco Scratch */}
          <div className="robot-body relative flex flex-col items-center justify-center p-1">
            {/* Peito de Encaixe de Bloco */}
            <div
              onClick={handleNextExpression}
              className="w-10 h-7 bg-emerald-600 border border-slate-900 rounded-md flex items-center justify-center cursor-pointer shadow-md absolute top-4 left-1/2 -translate-x-1/2 z-20 hover:scale-110 active:scale-90 transition-transform"
              title="Clique para alternar o código de bloco do Spark!"
            >
              <span className="text-[10px] font-mono font-black text-emerald-200">🧩 BLOCK</span>
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

          {/* Cabeça do Robô com Visor LCD Matrix Interativo */}
          <div className="robot-head">
            <div className="robot-antenna flex flex-col items-center absolute -top-8 left-1/2 -translate-x-1/2 z-30">
              <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 shadow-[0_0_12px_#34D399] animate-pulse" />
              <div className="w-1.5 h-4 bg-slate-800" />
            </div>

            <div
              onClick={handleNextExpression}
              className="robot-face --standard-bot flex flex-col items-center justify-center relative cursor-pointer"
              title="Clique para trocar a expressão do Spark!"
            >
              <div className="robot-ear --left" />
              <div className="robot-ear --right" />

              {/* Display LCD Matrix Verde com Carinha Interativa */}
              <div className="robot-eyes --standard-visor flex items-center justify-center bg-slate-950 border-2 border-emerald-400/80">
                <span className="font-mono text-xs font-black text-emerald-400 tracking-wider">
                  {currentFace}
                </span>
              </div>

              <div className="w-5 h-2 border-b-2 border-slate-900 rounded-b-full mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Balão de Fala do Spark */}
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
            Spark (Programador Modular Scratch) fala:
          </span>
          <p className="text-xs md:text-sm font-extrabold text-slate-800 leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};



