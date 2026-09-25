import React from 'react';
import { CSSMascot, MascotCharacter } from './CSSMascot';

export interface MascotProps {
  character?: 'robi' | 'byte';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  character = 'robi',
  message,
  size = 'md',
  position = 'left',
  className
}) => {
  return (
    <CSSMascot
      character={character as MascotCharacter}
      message={message}
      size={size}
      position={position}
      className={className}
    />
  );
};


