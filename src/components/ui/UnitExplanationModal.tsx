import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { X, BookOpen, Lightbulb, Compass, Award } from 'lucide-react';
import { UNIT_EXPLANATIONS } from '../../config/unitExplanationsData';

interface UnitExplanationModalProps {
  unitId: string | null;
  onClose: () => void;
}

export const UnitExplanationModal: React.FC<UnitExplanationModalProps> = ({ unitId, onClose }) => {
  if (!unitId) return null;

  const explanation = UNIT_EXPLANATIONS[unitId] || {
    title: "Explicação Pedagógica da Unidade",
    gradeText: "Guia Teórico de Robótica",
    summary: "Aprenda os conceitos práticos de robótica, lógica e eletrônica nesta unidade!",
    theory: "Esta unidade desenvolve competências fundamentais de raciocínio lógico, resolução de problemas e fundamentos de tecnologia.",
    keyConcepts: ["Pensamento Computacional", "Resolução de Problemas", "Prática Robótica"],
    realWorldExample: "Aplicações diretas em tecnologia, automação e sistemas inteligentes do dia a dia.",
    mascotTip: "Continue praticando os desafios para fixar o aprendizado e ganhar XP!"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border-4 border-indigo-400 dark:border-indigo-600 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-1 rounded-full">
                  {explanation.gradeText}
                </span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                  {explanation.title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Resumo Rápido */}
          <div className="mt-5 p-4 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500" /> Resumo Rápido
            </h3>
            <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">
              {explanation.summary}
            </p>
          </div>

          {/* Explicação Teórica Detalhada */}
          <div className="mt-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              📖 Explicação Pedagógica
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {explanation.theory}
            </p>
          </div>

          {/* Conceitos Chave */}
          <div className="mt-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">
              🔑 Conceitos Chave
            </h3>
            <div className="flex flex-wrap gap-2">
              {explanation.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  ✨ {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Exemplo no Mundo Real */}
          <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl">
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" /> Onde vemos isso no mundo real?
            </h3>
            <p className="mt-1 text-emerald-900 dark:text-emerald-200 text-sm font-medium">
              {explanation.realWorldExample}
            </p>
          </div>

          {/* Dica do Mascote */}
          <div className="mt-5 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-amber-800 dark:text-amber-300">
                Dica do Robô Mascote
              </h4>
              <p className="mt-0.5 text-slate-700 dark:text-slate-300 text-sm italic">
                "{explanation.mascotTip}"
              </p>
            </div>
          </div>

          {/* Botão de Fechar */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button variant="blue" size="md" onClick={onClose}>
              Entendi! Vamos Praticar 🚀
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
