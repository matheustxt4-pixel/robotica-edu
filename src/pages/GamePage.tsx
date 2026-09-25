import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { ProgrammingGame } from '../games/programming/ProgrammingGame';
import { CircuitGame } from '../games/circuits/CircuitGame';
import { GearsGame } from '../games/gears/GearsGame';
import { RunnerGame } from '../games/runner/RunnerGame';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { xpService } from '../services/xpService';
import { progressService } from '../services/progressService';
import { achievementService } from '../services/achievementService';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GamePage: React.FC = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUserXP, updateUserStreak } = useAuth();
  const { playSound } = useAudio();

  const lessonId = searchParams.get('lessonId') || 'les_1_2';
  const unitId = searchParams.get('unitId') || 'unit_1';

  const [earnedXP, setEarnedXP] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleGameComplete = async (xp: number) => {
    if (user) {
      const res = xpService.awardXP({
        studentId: user.uid,
        currentTotalXP: user.xp,
        reason: 'game_level',
        sourceId: `game_${gameType}_${Date.now()}`,
        customXP: xp
      });
      setEarnedXP(res.xpGained);
      updateUserXP(res.totalXP);

      // Registrar a lição como concluída para liberar a próxima fase no mapa!
      await progressService.completeLesson({
        studentId: user.uid,
        lessonId: lessonId,
        unitId: unitId,
        scorePercent: 100
      });

      const updatedUser = await updateUserStreak();

      achievementService.checkAndAward({
        studentId: user.uid,
        totalXP: res.totalXP,
        streak: updatedUser?.streak || user.streak
      });

      playSound('finish');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 font-display">
        <Card variant="yellow" className="p-8 space-y-6 shadow-2xl border-4 border-amber-300">
          <div className="w-24 h-24 rounded-3xl bg-amber-400 border-4 border-amber-500 text-6xl mx-auto flex items-center justify-center shadow-3d-yellow animate-bounce-small">
            🎉
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-amber-950">Lição Concluída!</h2>
            <p className="text-sm font-bold text-amber-800">Você completou o desafio e liberou a próxima lição!</p>
          </div>

          <div className="bg-white/80 border-2 border-amber-300 p-4 rounded-2xl flex items-center justify-around font-black text-amber-950">
            <div>
              <span className="text-xs text-amber-700 block uppercase">Recompensa</span>
              <span className="text-2xl text-amber-600">+{earnedXP || 30} XP</span>
            </div>
            <div className="w-px h-8 bg-amber-300" />
            <div>
              <span className="text-xs text-amber-700 block uppercase">Desempenho</span>
              <span className="text-2xl text-emerald-600">100%</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="green"
              size="lg"
              fullWidth
              onClick={() => navigate('/map')}
              icon={<ArrowRight className="w-6 h-6" />}
            >
              Continuar no Mapa 🚀
            </Button>
            <Button
              variant="gray"
              size="sm"
              fullWidth
              onClick={() => setIsCompleted(false)}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Jogar Novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-display py-4">
      {/* Header com botão voltar */}
      <div className="flex items-center justify-between">
        <Button variant="gray" size="sm" onClick={() => navigate('/map')} icon={<ArrowLeft className="w-4 h-4" />}>
          Voltar ao Mapa
        </Button>

        {earnedXP > 0 && (
          <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black px-4 py-1.5 rounded-full text-xs animate-bounce-small">
            +{earnedXP} XP Conquistados! 🎉
          </div>
        )}
      </div>

      {/* Dispatcher de Jogos 2D */}
      <Card variant="white" className="p-6 shadow-xl border-4 border-slate-200">
        {gameType === 'circuit' ? (
          <CircuitGame onComplete={handleGameComplete} />
        ) : gameType === 'gears' ? (
          <GearsGame onComplete={handleGameComplete} />
        ) : gameType === 'runner' ? (
          <RunnerGame onComplete={handleGameComplete} />
        ) : (
          <ProgrammingGame onComplete={handleGameComplete} />
        )}
      </Card>
    </div>
  );
};
