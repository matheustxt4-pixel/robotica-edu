import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'white' | 'dark' | 'yellow' | 'blue' | 'green' | 'purple';
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  className,
  onClick,
  hoverEffect = false
}) => {
  const variantStyles = {
    white: 'bg-white border-2 border-slate-200 text-robo-dark shadow-sm',
    dark: 'bg-robo-dark-card border-2 border-robo-dark text-white',
    yellow: 'bg-amber-50 border-2 border-robo-yellow text-amber-950',
    blue: 'bg-sky-50 border-2 border-robo-blue text-sky-950',
    green: 'bg-emerald-50 border-2 border-robo-green text-emerald-950',
    purple: 'bg-purple-50 border-2 border-robo-purple text-purple-950'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-3xl p-5 transition-all duration-200',
        variantStyles[variant],
        hoverEffect && 'hover:-translate-y-1 hover:shadow-md cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

