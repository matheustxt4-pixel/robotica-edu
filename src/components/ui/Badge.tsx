import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  title: string;
  description?: string;
  icon: string;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  title,
  description,
  icon,
  unlocked = true,
  size = 'md',
  className
}) => {
  const sizeStyles = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl'
  };

  return (
    <div className={clsx('flex flex-col items-center text-center gap-1.5', className)}>
      <div
        className={clsx(
          'flex items-center justify-center rounded-3xl border-4 transition-all duration-300 shadow-md font-display',
          sizeStyles[size],
          unlocked
            ? 'bg-amber-100 border-amber-400 text-amber-950 scale-100'
            : 'bg-slate-100 border-slate-300 text-slate-400 grayscale opacity-60'
        )}
      >
        <span className="drop-shadow">{icon}</span>
      </div>
      <h5 className="font-extrabold text-xs text-slate-800 font-display leading-tight">{title}</h5>
      {description && <p className="text-[10px] text-slate-500 max-w-[120px] font-semibold">{description}</p>}
    </div>
  );
};

