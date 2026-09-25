import React, { useState } from 'react';
import { ActivityProps } from './MultipleChoiceActivity';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const OrderingActivity: React.FC<ActivityProps> = ({ activity, onAnswer }) => {
  const [items, setItems] = useState<string[]>(activity.initialItems || []);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const copy = [...items];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setItems(copy);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const copy = [...items];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setItems(copy);
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(items) === JSON.stringify(activity.correctAnswer);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-6 font-display">
      <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center leading-snug">
        {activity.question}
      </h3>

      <div className="space-y-3 max-w-lg mx-auto">
        {items.map((item, idx) => (
          <Card key={idx} variant="white" className="p-4 border-2 border-slate-300 flex items-center justify-between gap-3 shadow-sm">
            <span className="font-extrabold text-base text-slate-800">{item}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowUp className="w-5 h-5 text-slate-700" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(idx)}
                disabled={idx === items.length - 1}
                className="p-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowDown className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button variant="yellow" size="lg" onClick={handleSubmit} className="w-full sm:w-auto min-w-[200px]">
          Verificar Sequência 🚀
        </Button>
      </div>
    </div>
  );
};
