import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value: number; // 0 a 100
  color?: 'yellow' | 'blue' | 'green' | 'orange' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'green',
  height = 'md',
  showText = false,
  className
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorStyles = {
    yellow: 'bg-robo-yellow',
    blue: 'bg-robo-blue',
    green: 'bg-robo-green',
    orange: 'bg-robo-orange',
    purple: 'bg-robo-purple'
  };

  const heightStyles = {
    sm: 'h-3 rounded-full',
    md: 'h-5 rounded-2xl',
    lg: 'h-7 rounded-2xl'
  };

  return (
    <div className={clsx('w-full bg-slate-200 overflow-hidden relative border border-slate-300', heightStyles[height], className)}>
      <div
        className={clsx('h-full transition-all duration-500 ease-out relative', colorStyles[color])}
        style={{ width: `${clampedValue}%` }}
      >
        {/* Efeito de brilho superposto */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-2xl" />
      </div>
      {showText && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800 drop-shadow">
          {clampedValue}%
        </span>
      )}
    </div>
  );
};

