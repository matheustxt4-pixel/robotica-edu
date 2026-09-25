import React from 'react';
import { calculateLevelFromXP } from '../../config/xpRules';
import { ProgressBar } from './ProgressBar';

export interface XPBarProps {
  totalXP: number;
  compact?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ totalXP, compact = false }) => {
  const { level, currentLevelXP, nextLevelXP, progressPercent } = calculateLevelFromXP(totalXP);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-full font-display">
        <span className="text-xl">⚡</span>
        <span className="font-extrabold text-amber-900 text-sm">{totalXP} XP</span>
        <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-black">Nível {level}</span>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-200 p-4 rounded-3xl shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between font-display">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-robo-yellow flex items-center justify-center text-xl shadow-3d-yellow font-black text-amber-950">
            {level}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">Nível {level}</h4>
            <p className="text-xs text-slate-500 font-semibold">{totalXP} XP acumulados</p>
          </div>
        </div>
        <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
          {currentLevelXP} / {nextLevelXP} XP
        </span>
      </div>
      <ProgressBar value={progressPercent} color="yellow" height="md" showText={false} />
    </div>
  );
};

