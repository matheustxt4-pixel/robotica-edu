import React, { useState } from 'react';
import { ActivityProps } from './MultipleChoiceActivity';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle } from 'lucide-react';

export const TrueFalseActivity: React.FC<ActivityProps> = ({ activity, onAnswer }) => {
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedBool === null) return;
    const isCorrect = selectedBool === activity.correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-6 font-display">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug">
        {activity.question}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <Card
          onClick={() => setSelectedBool(true)}
          variant={selectedBool === true ? 'green' : 'white'}
          hoverEffect
          className={clsx(
            'p-6 border-4 flex flex-col items-center gap-3 cursor-pointer text-center',
            selectedBool === true ? 'border-emerald-400 scale-[1.02]' : 'border-slate-200'
          )}
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <span className="font-black text-xl text-emerald-950">VERDADEIRO</span>
        </Card>

        <Card
          onClick={() => setSelectedBool(false)}
          variant={selectedBool === false ? 'yellow' : 'white'}
          hoverEffect
          className={clsx(
            'p-6 border-4 flex flex-col items-center gap-3 cursor-pointer text-center',
            selectedBool === false ? 'border-rose-400 scale-[1.02]' : 'border-slate-200'
          )}
        >
          <XCircle className="w-12 h-12 text-rose-500" />
          <span className="font-black text-xl text-rose-950">FALSO</span>
        </Card>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          variant="yellow"
          size="lg"
          disabled={selectedBool === null}
          onClick={handleSubmit}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Verificar Resposta 🚀
        </Button>
      </div>
    </div>
  );
};
