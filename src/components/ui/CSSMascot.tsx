import React from 'react';
import { CssWizardRobot } from './CssWizardRobot';
import { CssByteRobot } from './CssByteRobot';
import { CssVoltRobot } from './CssVoltRobot';
import { CssSparkRobot } from './CssSparkRobot';
import { CssBmoRobot } from './CssBmoRobot';
import { MASCOT_BACKGROUNDS } from '../../config/mascotBackgrounds';

export type MascotCharacter = 'robi' | 'byte' | 'volt' | 'spark' | 'wizard' | 'scientist' | 'bmo';
export type MascotColor = 'original' | 'gold' | 'cyber_purple' | 'emerald' | 'ruby_red' | 'dark_shadow';

const COLOR_STYLES: Record<MascotColor, string> = {
  original: '',
  gold: 'filter drop-shadow-[0_0_14px_rgba(251,191,36,0.9)] hue-rotate-[40deg] saturate-[1.8]',
  cyber_purple: 'filter drop-shadow-[0_0_14px_rgba(168,85,247,0.9)] hue-rotate-[110deg] saturate-[1.5]',
  emerald: 'filter drop-shadow-[0_0_14px_rgba(34,197,94,0.9)] hue-rotate-[190deg] saturate-[1.6]',
  ruby_red: 'filter drop-shadow-[0_0_14px_rgba(239,68,68,0.9)] hue-rotate-[290deg] saturate-[1.8]',
  dark_shadow: 'filter drop-shadow-[0_0_16px_rgba(15,23,42,0.95)] brightness-[0.75] contrast-[1.35]'
};

export interface CSSMascotProps {
  character?: MascotCharacter;
  mascotColor?: MascotColor;
  mascotBackground?: string;
  expression?: 'happy' | 'excited' | 'thinking' | 'wink';
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

export const CSSMascot: React.FC<CSSMascotProps> = ({
  character = 'robi',
  mascotColor = 'original',
  mascotBackground,
  message,
  size = 'md',
  position = 'left',
  className,
  hideOrbit,
  equippedAccessories
}) => {
  const colorClass = COLOR_STYLES[mascotColor] || '';
  const bgData = MASCOT_BACKGROUNDS.find(b => b.id === mascotBackground);

  const renderRobot = () => {
    if (character === 'byte') {
      return <CssByteRobot message={message} size={size} position={position} className={className} hideOrbit={hideOrbit} equippedAccessories={equippedAccessories} />;
    }
    if (character === 'volt') {
      return <CssVoltRobot message={message} size={size} position={position} className={className} hideOrbit={hideOrbit} equippedAccessories={equippedAccessories} />;
    }
    if (character === 'spark') {
      return <CssSparkRobot message={message} size={size} position={position} className={className} hideOrbit={hideOrbit} equippedAccessories={equippedAccessories} />;
    }
    if (character === 'bmo') {
      return <CssBmoRobot message={message} size={size} position={position} className={className} hideOrbit={hideOrbit} equippedAccessories={equippedAccessories} />;
    }

    return (
      <CssWizardRobot
        character={character}
        message={message}
        size={size}
        position={position}
        className={className}
        hideOrbit={hideOrbit}
        equippedAccessories={equippedAccessories}
      />
    );
  };

  const robotNode = colorClass ? (
    <div className={`transition-all duration-300 ${colorClass}`}>
      {renderRobot()}
    </div>
  ) : (
    renderRobot()
  );

  if (!bgData || bgData.id === 'default') {
    return robotNode;
  }

  return (
    <div className={`relative p-4 rounded-3xl overflow-hidden transition-all duration-500 shadow-xl ${bgData.bgStyle}`}>
      {/* Imagem / GIF de Fundo do Cenário */}
      {bgData.imagePath && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${bgData.imagePath})` }}
        />
      )}

      {/* Camada translúcida para garantir excelente contraste */}
      {bgData.imagePath && (
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[0.5px]" />
      )}

      {/* Partículas Flutuantes do Cenário de Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-50 flex items-center justify-around z-0">
        {bgData.floatingParticles.map((particle, idx) => (
          <span
            key={idx}
            className={`text-xl animate-bounce transform ${
              idx % 2 === 0 ? 'translate-y-2 scale-110' : '-translate-y-2 scale-90'
            }`}
            style={{ animationDelay: `${idx * 0.4}s` }}
          >
            {particle}
          </span>
        ))}
      </div>

      {/* Conteúdo do Mascote */}
      <div className="relative z-10">
        {robotNode}
      </div>
    </div>
  );
};


