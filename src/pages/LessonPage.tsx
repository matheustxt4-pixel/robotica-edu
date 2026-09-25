import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { ACTIVITIES_BY_LESSON } from '../config/activitiesData';
import { ActivityEngine } from '../components/activities/ActivityEngine';
import { FeedbackModal } from '../components/ui/FeedbackModal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CSSMascot } from '../components/ui/CSSMascot';
import { xpService } from '../services/xpService';
import { progressService } from '../services/progressService';
import { achievementService } from '../services/achievementService';
import { lifeService } from '../services/lifeService';
import { X, ArrowRight, Heart, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user, updateUserXP, updateUserStreak } = useAuth();
  const { playSound } = useAudio();

  const activities = (lessonId && ACTIVITIES_BY_LESSON[lessonId]) || ACTIVITIES_BY_LESSON['les_3_1_1'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Vidas Diárias do Mascote
  const studentLives = user?.uid ? lifeService.getStudentLives(user.uid) : null;
  const [outOfLives, setOutOfLives] = useState(false);

  // Modal Feedback State
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastIsCorrect, setLastIsCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);

  // Lesson Summary State
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryXP, setSummaryXP] = useState(0);

  const currentActivity = activities[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / activities.length) * 100);

  const handleAnswer = (isCorrect: boolean) => {
    setLastIsCorrect(isCorrect);

    if (isCorrect) {
      playSound('correct');
      setCorrectCount(prev => prev + 1);
      setLastXP(currentActivity.xp || 10);
    } else {
      playSound('incorrect');
      setLastXP(0);

      // Descontar 1 vida do mascote
      if (user?.uid) {
        const updated = lifeService.deductLife(user.uid);
        if (updated.lives <= 0) {
          setOutOfLives(true);
        }
      }
    }

    setShowFeedback(true);
  };

  const handleNextStep = async () => {
    setShowFeedback(false);

    if (outOfLives) {
      return;
    }

    if (currentIndex < activities.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finalização da Lição!
      playSound('finish');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      if (user) {
        const finalScorePercent = Math.round(((correctCount + (lastIsCorrect ? 1 : 0)) / activities.length) * 100);

        const xpRes = xpService.awardXP({
          studentId: user.uid,
          currentTotalXP: user.xp,
          reason: finalScorePercent >= 90 ? 'perfect_score' : 'lesson_completed',
          sourceId: lessonId || 'les_demo'
        });

        setSummaryXP(xpRes.xpGained);
        updateUserXP(xpRes.totalXP);

        const lessonParts = (lessonId || '').split('_');
        const currentUnitId = lessonParts.length >= 2 ? `unit_${lessonParts[1]}` : 'unit_1';

        await progressService.completeLesson({
          studentId: user.uid,
          lessonId: lessonId || 'les_1_1',
          unitId: currentUnitId,
          scorePercent: finalScorePercent
        });

        const updatedUser = await updateUserStreak();

        achievementService.checkAndAward({
          studentId: user.uid,
          totalXP: xpRes.totalXP,
          streak: updatedUser?.streak || user.streak
        });
      }

      setIsCompleted(true);
    }
  };

  if (outOfLives) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 font-display">
        <Card variant="white" className="p-8 space-y-6 shadow-2xl border-4 border-rose-300">
          <CSSMascot
            character="robi"
            expression="thinking"
            message="Ops! As 3 vidas do seu mascote acabaram por hoje! Pratique lições anteriores para recarregar!"
          />

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-rose-950">Sem Vidas Restantes ❤️</h2>
            <p className="text-xs font-extrabold text-slate-500">
              As vidas diárias são renovadas 3x por dia (às 00:00).
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="orange"
              size="lg"
              fullWidth
              onClick={() => {
                if (user?.uid) lifeService.refillLives(user.uid);
                setOutOfLives(false);
              }}
              icon={<RefreshCw className="w-5 h-5" />}
            >
              Recarregar Vidas
            </Button>
            <Button variant="gray" size="lg" fullWidth onClick={() => navigate('/map')}>
              Voltar ao Mapa
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 font-display">
        <Card variant="yellow" className="p-8 space-y-6 shadow-2xl border-4 border-amber-300">
          <div className="w-24 h-24 rounded-3xl bg-amber-400 border-4 border-amber-500 text-6xl mx-auto flex items-center justify-center shadow-3d-yellow animate-bounce-small">
            🎉
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-amber-950">Lição Concluída!</h2>
            <p className="text-sm font-bold text-amber-800">Você completou todas as atividades com sucesso!</p>
          </div>

          <div className="bg-white/80 border-2 border-amber-300 p-4 rounded-2xl flex items-center justify-around font-black text-amber-950">
            <div>
              <span className="text-xs text-amber-700 block uppercase">Recompensa</span>
              <span className="text-2xl text-amber-600">+{summaryXP} XP</span>
            </div>
            <div className="w-px h-8 bg-amber-300" />
            <div>
              <span className="text-xs text-amber-700 block uppercase">Desempenho</span>
              <span className="text-2xl text-emerald-600">100%</span>
            </div>
          </div>

          <Button variant="green" size="lg" fullWidth onClick={() => navigate('/map')} icon={<ArrowRight className="w-6 h-6" />}>
            Continuar no Mapa 🚀
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-display py-4">
      {/* Top Controls: Botão Sair & Barra de Progresso & Vidas */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/map')}
          className="p-2 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <ProgressBar value={progressPercent} color="green" height="md" />

        {studentLives && (
          <div className="flex items-center gap-1 bg-rose-50 border-2 border-rose-200 px-3 py-1 rounded-2xl text-rose-600 font-black text-xs whitespace-nowrap">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-4 h-4 ${
                  h <= studentLives.lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 fill-slate-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Container Principal da Atividade */}
      <Card variant="white" className="p-6 md:p-8 shadow-lg border-4 border-slate-200">
        <ActivityEngine activity={currentActivity} onAnswer={handleAnswer} />
      </Card>

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={showFeedback}
        isCorrect={lastIsCorrect}
        message={currentActivity.explanation}
        xpGained={lastXP}
        onNext={handleNextStep}
      />
    </div>
  );
};
