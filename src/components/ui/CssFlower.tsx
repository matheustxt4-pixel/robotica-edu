import React from 'react';

export type FlowerVariant = 'sunflower' | 'sakura' | 'cyber' | 'tulip' | 'purple';
export type FlowerSize = 'sm' | 'md' | 'lg';

interface CssFlowerProps {
  variant?: FlowerVariant;
  size?: FlowerSize;
  className?: string;
  delay?: number; // em segundos para desincronizar as animações
}

export const CssFlower: React.FC<CssFlowerProps> = ({
  variant = 'sunflower',
  size = 'md',
  className = '',
  delay = 0
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-16', head: 'w-8 h-8', center: 'w-3.5 h-3.5', stem: 'h-8 w-1' },
    md: { container: 'w-14 h-22', head: 'w-12 h-12', center: 'w-5 h-5', stem: 'h-12 w-1.5' },
    lg: { container: 'w-20 h-32', head: 'w-16 h-16', center: 'w-7 h-7', stem: 'h-18 w-2' }
  };

  const currentSize = sizeMap[size];

  // Esquema de cores por variante
  const colorMap = {
    sunflower: {
      petal: 'bg-gradient-to-t from-amber-400 to-yellow-300 border border-amber-500/40 shadow-sm',
      center: 'bg-gradient-to-r from-amber-900 to-amber-700 border-2 border-amber-950 shadow-inner',
      stem: 'bg-gradient-to-b from-emerald-500 to-emerald-700',
      leaf: 'bg-emerald-600 border border-emerald-400/40'
    },
    sakura: {
      petal: 'bg-gradient-to-t from-pink-400 to-rose-200 border border-pink-400/40 shadow-sm',
      center: 'bg-gradient-to-r from-pink-600 to-purple-500 border-2 border-pink-700 shadow-inner',
      stem: 'bg-gradient-to-b from-green-500 to-emerald-700',
      leaf: 'bg-green-600 border border-green-300/40'
    },
    cyber: {
      petal: 'bg-gradient-to-t from-cyan-400 to-sky-200 border border-cyan-300/50 shadow-cyan-300/50 shadow-md',
      center: 'bg-gradient-to-r from-purple-600 to-indigo-700 border-2 border-cyan-300 shadow-inner',
      stem: 'bg-gradient-to-b from-emerald-400 to-teal-700',
      leaf: 'bg-teal-500 border border-cyan-300/40'
    },
    tulip: {
      petal: 'bg-gradient-to-t from-red-500 to-orange-400 border border-red-600/40 shadow-sm',
      center: 'bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-amber-800 shadow-inner',
      stem: 'bg-gradient-to-b from-emerald-600 to-green-800',
      leaf: 'bg-emerald-700 border border-emerald-400/40'
    },
    purple: {
      petal: 'bg-gradient-to-t from-purple-500 to-violet-300 border border-purple-400/40 shadow-sm',
      center: 'bg-gradient-to-r from-amber-400 to-yellow-500 border-2 border-amber-700 shadow-inner',
      stem: 'bg-gradient-to-b from-emerald-500 to-green-700',
      leaf: 'bg-emerald-600 border border-emerald-300/40'
    }
  };

  const theme = colorMap[variant];
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      className={`relative flex flex-col items-center justify-end select-none ${currentSize.container} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Flor Principal (Cabeça + Pétalas) */}
      <div className={`relative flex items-center justify-center ${currentSize.head} animate-flower-sway z-10`} style={{ animationDelay: `${delay}s` }}>
        {/* 8 Pétalas em Arranjo Radial */}
        {angles.map((angle, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full transform origin-center transition-transform ${theme.petal}`}
            style={{
              width: size === 'sm' ? '10px' : size === 'md' ? '16px' : '22px',
              height: size === 'sm' ? '20px' : size === 'md' ? '30px' : '42px',
              transform: `rotate(${angle}deg) translateY(-${size === 'sm' ? '8px' : size === 'md' ? '13px' : '18px'})`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
            }}
          />
        ))}

        {/* Centro da Flor (Pólen) */}
        <div className={`relative z-20 rounded-full flex items-center justify-center animate-pulse-subtle ${currentSize.center} ${theme.center}`}>
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-ping opacity-75" />
        </div>
      </div>

      {/* Caule Verde com Folhas Secundárias */}
      <div className={`relative flex flex-col items-center ${currentSize.stem} ${theme.stem} rounded-full z-0 origin-bottom animate-stem-sway`} style={{ animationDelay: `${delay + 0.2}s` }}>
        {/* Folha Esquerda */}
        <div
          className={`absolute top-1/3 -left-3.5 w-4 h-2.5 rounded-full transform -rotate-30 origin-right ${theme.leaf}`}
        />
        {/* Folha Direita */}
        <div
          className={`absolute top-1/2 -right-3.5 w-4 h-2.5 rounded-full transform rotate-30 origin-left ${theme.leaf}`}
        />
      </div>

      {/* Base de Terra / Raiz */}
      <div className="w-6 h-1.5 bg-amber-950/20 rounded-full blur-[1px] z-0" />
    </div>
  );
};

