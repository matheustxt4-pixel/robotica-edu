import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export const GearsGame: React.FC<{ onComplete?: (xp: number) => void }> = ({ onComplete }) => {
  const { playSound } = useAudio();
  const [gear1Placed, setGear1Placed] = useState(false);
  const [gear2Placed, setGear2Placed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePlaceGear1 = () => {
    playSound('click');
    const next = !gear1Placed;
    setGear1Placed(next);
    checkVictory(next, gear2Placed);
  };

  const handlePlaceGear2 = () => {
    playSound('click');
    const next = !gear2Placed;
    setGear2Placed(next);
    checkVictory(gear1Placed, next);
  };

  const checkVictory = (g1: boolean, g2: boolean) => {
    if (g1 && g2 && !isSuccess) {
      setIsSuccess(true);
      playSound('level_up');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onComplete) onComplete(30);
    }
  };

  return (
    <div className="space-y-6 font-display max-w-xl mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-slate-800">⚙️ Desafio: Transmissão de Engrenagens</h3>
        <p className="text-xs text-slate-500 font-extrabold">Encaixe as engrenagens intermediárias para fazer o mecanismo girar!</p>
      </div>

      <Card variant="white" className="p-6 border-4 border-slate-300 space-y-6 relative overflow-hidden shadow-xl">
        {/* Painel do Mecanismo */}
        <div className="bg-slate-100 p-8 rounded-3xl border-2 border-slate-200 flex items-center justify-around relative min-h-[200px]">
          {/* 1. Engrenagem Motora (Sempre girando) */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-amber-500 text-amber-950 flex items-center justify-center text-5xl shadow-md animate-spin duration-[4000ms]">
              ⚙️
            </div>
            <span className="text-xs font-black text-amber-900">Motora 🔄</span>
          </div>

          {/* Slot 1: Intermediária */}
          <div
            onClick={handlePlaceGear1}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-5xl cursor-pointer transition-all ${
              gear1Placed
                ? 'bg-sky-400 border-sky-500 text-sky-950 shadow-md animate-spin duration-[4000ms] [animation-direction:reverse]'
                : 'bg-slate-200 border-dashed border-slate-400 text-slate-300 hover:border-sky-400'
            }`}
          >
            {gear1Placed ? '⚙️' : '+'}
          </div>

          {/* Slot 2: Movida */}
          <div
            onClick={handlePlaceGear2}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-5xl cursor-pointer transition-all ${
              gear2Placed
                ? 'bg-purple-400 border-purple-500 text-purple-950 shadow-md animate-spin duration-[4000ms]'
                : 'bg-slate-200 border-dashed border-slate-400 text-slate-300 hover:border-purple-400'
            }`}
          >
            {gear2Placed ? '⚙️' : '+'}
          </div>
        </div>

        {/* Paleta de Engrenagens */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant={gear1Placed ? 'blue' : 'gray'} size="sm" onClick={handlePlaceGear1} fullWidth>
            {gear1Placed ? '✓ Engrenagem M Média' : 'Encaixar Engrenagem M'}
          </Button>

          <Button variant={gear2Placed ? 'purple' : 'gray'} size="sm" onClick={handlePlaceGear2} fullWidth>
            {gear2Placed ? '✓ Engrenagem P Pequena' : 'Encaixar Engrenagem P'}
          </Button>
        </div>

        {isSuccess && (
          <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl text-sm font-black flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Engrenagens Acopladas! Movimento transmitido com sucesso (+30 XP)! 🎉</span>
          </div>
        )}
      </Card>
    </div>
  );
};
