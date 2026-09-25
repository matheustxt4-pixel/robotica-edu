import React, { useState } from 'react';
import { ActivityProps } from './MultipleChoiceActivity';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

export const MatchingActivity: React.FC<ActivityProps> = ({ activity, onAnswer }) => {
  const pairs: { key: string; val: string }[] = activity.initialItems || [];
  const keys = pairs.map(p => p.key);
  const values = [...pairs.map(p => p.val)].sort(() => Math.random() - 0.5);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const handleSelectValue = (val: string) => {
    if (!selectedKey) return;
    setMatches(prev => ({ ...prev, [selectedKey]: val }));
    setSelectedKey(null);
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(matches) === JSON.stringify(activity.correctAnswer);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-6 font-display">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug">
        {activity.question}
      </h3>

      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
        {/* Coluna da Esquerda (Chaves) */}
        <div className="space-y-3">
          {keys.map((k, idx) => {
            const isSelected = selectedKey === k;
            const matchedVal = matches[k];

            return (
              <Card
                key={idx}
                onClick={() => setSelectedKey(k)}
                variant={isSelected ? 'yellow' : matchedVal ? 'blue' : 'white'}
                className={clsx(
                  'p-4 border-2 cursor-pointer text-center font-extrabold text-sm md:text-base select-none',
                  isSelected ? 'border-amber-400 scale-[1.02]' : 'border-slate-300'
                )}
              >
                <div>{k}</div>
                {matchedVal && <div className="text-xs text-sky-700 font-black mt-1">➡ {matchedVal}</div>}
              </Card>
            );
          })}
        </div>

        {/* Coluna da Direita (Valores) */}
        <div className="space-y-3">
          {values.map((v, idx) => {
            const isUsed = Object.values(matches).includes(v);

            return (
              <Card
                key={idx}
                onClick={() => handleSelectValue(v)}
                variant={isUsed ? 'green' : 'white'}
                className={clsx(
                  'p-4 border-2 cursor-pointer text-center font-bold text-sm md:text-base select-none',
                  selectedKey ? 'hover:border-amber-400 hover:bg-amber-50' : '',
                  isUsed ? 'border-emerald-400 opacity-80' : 'border-slate-300'
                )}
              >
                {v}
              </Card>
            );
          })}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          variant="yellow"
          size="lg"
          disabled={Object.keys(matches).length < keys.length}
          onClick={handleSubmit}
          className="w-full sm:w-auto min-w-[200px]"
        >
          Verificar Associação 🚀
        </Button>
      </div>
    </div>
  );
};
