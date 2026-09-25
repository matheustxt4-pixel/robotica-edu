import React, { useState } from 'react';
import { Activity } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export interface ActivityProps {
  activity: Activity;
  onAnswer: (isCorrect: boolean) => void;
}

export const MultipleChoiceActivity: React.FC<ActivityProps> = ({ activity, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === activity.correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-6 font-display">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug">
        {activity.question}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activity.options?.map((opt, idx) => {
          const isSelected = selectedOption === opt;

          return (
            <Card
              key={idx}
              onClick={() => setSelectedOption(opt)}
              variant={isSelected ? 'yellow' : 'white'}
              hoverEffect
              className={clsx(
                'p-5 border-4 transition-all flex items-center justify-between gap-3 cursor-pointer select-none',
                isSelected ? 'border-amber-400 scale-[1.02] shadow-md' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <span className="font-extrabold text-base md:text-lg text-slate-800">{opt}</span>
              <div
                className={clsx(
                  'w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all',
                  isSelected ? 'bg-amber-400 border-amber-500 text-amber-950' : 'border-slate-300 bg-slate-100'
                )}
              >
                {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          variant="yellow"
          size="lg"
          disabled={!selectedOption}
          onClick={handleSubmit}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Verificar Resposta 🚀
        </Button>
      </div>
    </div>
  );
};

