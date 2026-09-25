import React from 'react';
import { Button } from './Button';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  title?: string;
  message?: string;
  xpGained?: number;
  onNext: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  title,
  message,
  xpGained = 0,
  onNext
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
      <div
        className={clsx(
          'max-w-2xl mx-auto rounded-3xl p-6 shadow-2xl border-4 flex flex-col md:flex-row items-center justify-between gap-4 font-display',
          isCorrect
            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
            : 'bg-rose-50 border-rose-400 text-rose-950'
        )}
      >
        <div className="flex items-center gap-4">
          <div className={clsx('p-3 rounded-2xl text-white shadow-md', isCorrect ? 'bg-emerald-500' : 'bg-rose-500')}>
            {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black">
              {title || (isCorrect ? 'Excelente! Resposta Correta! 🎉' : 'Ops! Vamos tentar entender... 🤔')}
            </h3>
            {message && <p className="text-sm font-semibold opacity-90 mt-1">{message}</p>}
            {isCorrect && xpGained > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-200 text-emerald-950 font-black px-3 py-1 rounded-xl mt-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                +{xpGained} XP Conquistados!
              </div>
            )}
          </div>
        </div>
        <Button
          variant={isCorrect ? 'green' : 'orange'}
          size="lg"
          onClick={onNext}
          className="w-full md:w-auto whitespace-nowrap min-w-[160px]"
        >
          {isCorrect ? 'Continuar 🚀' : 'Tentar Novamente 💡'}
        </Button>
      </div>
    </div>
  );
};

