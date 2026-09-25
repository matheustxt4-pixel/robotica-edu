import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'blue' | 'green' | 'orange' | 'purple' | 'gray' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-robo-yellow hover:bg-robo-yellow-light text-robo-dark shadow-3d-yellow active:shadow-3d-pressed active:translate-y-1',
    blue: 'bg-robo-blue hover:bg-robo-blue-light text-white shadow-3d-blue active:shadow-3d-pressed active:translate-y-1',
    green: 'bg-robo-green hover:bg-robo-green-light text-white shadow-3d-green active:shadow-3d-pressed active:translate-y-1',
    orange: 'bg-robo-orange hover:bg-robo-orange-light text-white shadow-3d-orange active:shadow-3d-pressed active:translate-y-1',
    purple: 'bg-robo-purple hover:bg-robo-purple-light text-white shadow-3d-purple active:shadow-3d-pressed active:translate-y-1',
    gray: 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-3d-gray active:shadow-3d-pressed active:translate-y-1',
    white: 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 shadow-3d-gray active:shadow-3d-pressed active:translate-y-1',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_0_0_#9F1239] active:shadow-3d-pressed active:translate-y-1'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm font-bold rounded-xl',
    md: 'px-5 py-2.5 text-base font-extrabold rounded-2xl',
    lg: 'px-8 py-4 text-lg font-black rounded-2xl uppercase tracking-wide'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer select-none font-display focus:outline-none focus:ring-2 focus:ring-robo-blue focus:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed shadow-none translate-y-0 active:translate-y-0',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="text-xl flex items-center justify-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

