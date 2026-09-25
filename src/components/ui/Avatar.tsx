import React from 'react';
import { AVATARS } from '../../config/constants';
import { clsx } from 'clsx';

export interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarId,
  size = 'md',
  className,
  onClick,
  selected = false
}) => {
  const avatarData = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

  const sizeStyles = {
    sm: 'w-8 h-8 text-base rounded-xl',
    md: 'w-12 h-12 text-2xl rounded-2xl',
    lg: 'w-16 h-16 text-3xl rounded-3xl',
    xl: 'w-24 h-24 text-5xl rounded-3xl'
  };

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: avatarData.color }}
      className={clsx(
        'flex items-center justify-center font-display border-2 border-white/50 shadow-md transition-all duration-200 select-none',
        sizeStyles[size],
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        selected && 'ring-4 ring-robo-yellow ring-offset-2 scale-105',
        className
      )}
      title={avatarData.name}
    >
      <span className="drop-shadow">{avatarData.icon}</span>
    </div>
  );
};

