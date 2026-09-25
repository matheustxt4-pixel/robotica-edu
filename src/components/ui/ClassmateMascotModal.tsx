import React from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { CSSMascot, MascotCharacter } from './CSSMascot';
import { X, Sparkles } from 'lucide-react';
import { MASCOT_ACCESSORIES } from '../../config/mascotAccessories';

interface ClassmateMascotModalProps {
  student: {
    nickname: string;
    avatar: string;
    mascot?: string;
    mascotColor?: any;
    mascotBackground?: string;
    equippedAccessories?: {
      hat?: string;
      back?: string;
      tool?: string;
    };
    xp?: number;
    level?: number;
    grade?: number;
  } | null;
  onClose: () => void;
}

export const ClassmateMascotModal: React.FC<ClassmateMascotModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const mascotName = (student.mascot || 'robi').toUpperCase();
  const equippedHat = MASCOT_ACCESSORIES.find(a => a.id === student.equippedAccessories?.hat);
  const equippedBack = MASCOT_ACCESSORIES.find(a => a.id === student.equippedAccessories?.back);
  const equippedTool = MASCOT_ACCESSORIES.find(a => a.id === student.equippedAccessories?.tool);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-display select-none">
      <Card variant="white" className="max-w-md w-full p-6 space-y-5 shadow-2xl relative border-4 border-slate-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Perfil do Aluno Colega */}
        <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
          <Avatar avatarId={student.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-800">{student.nickname}</h3>
              {student.grade && (
                <span className="text-[10px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full border border-purple-300">
                  {student.grade}º Ano
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 text-amber-600 font-black">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                {student.xp || 0} XP
              </span>
              <span>•</span>
              <span className="text-sky-600 font-black">
                Nível {student.level || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Mascote Animado em 3D com Acessórios Equipados */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400 tracking-wider">
            <span>Mascote & Trajes de {student.nickname}</span>
            <span className="text-sky-600">🤖 {mascotName}</span>
          </div>

          <div className="bg-gradient-to-b from-sky-50 via-slate-50 to-amber-50 p-6 rounded-3xl border-3 border-slate-200 flex items-center justify-center relative overflow-visible shadow-inner min-h-[220px]">
            <CSSMascot
              character={(student.mascot || 'robi') as MascotCharacter}
              mascotColor={student.mascotColor}
              mascotBackground={student.mascotBackground}
              size="lg"
              equippedAccessories={student.equippedAccessories}
              message={`Olá! Sou o robô parceiro de ${student.nickname}! Estamos juntos na aventura! 🤖✨`}
            />
          </div>
        </div>

        {/* Resumo de Equipamento */}
        <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 space-y-1.5 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
            Acessórios Equipados
          </span>
          <div className="flex flex-wrap gap-2 text-slate-700 font-extrabold text-xs">
            {equippedHat ? (
              <span className="bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                {equippedHat.icon} {equippedHat.name}
              </span>
            ) : (
              <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-xl text-[10px]">Sem chapéu</span>
            )}
            {equippedBack ? (
              <span className="bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                {equippedBack.icon} {equippedBack.name}
              </span>
            ) : (
              <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-xl text-[10px]">Sem mochila</span>
            )}
            {equippedTool ? (
              <span className="bg-purple-100 border border-purple-300 px-2.5 py-1 rounded-xl flex items-center gap-1">
                {equippedTool.icon} {equippedTool.name}
              </span>
            ) : (
              <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-xl text-[10px]">Sem ferramenta</span>
            )}
          </div>
        </div>

        <Button variant="blue" size="md" fullWidth onClick={onClose} className="font-black">
          Fechar Visualização 🚀
        </Button>
      </Card>
    </div>
  );
};

