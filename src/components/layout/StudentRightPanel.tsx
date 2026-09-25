import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CSSMascot } from '../ui/CSSMascot';
import { Card } from '../ui/Card';
import { XPBar } from '../ui/XPBar';
import { Flame, Target, ShieldCheck, Heart } from 'lucide-react';
import { lifeService } from '../../services/lifeService';

export const StudentRightPanel: React.FC = () => {
  const { user } = useAuth();
  const studentLives = user?.uid ? lifeService.getStudentLives(user.uid) : null;

  if (!user) return null;

  // Dicas Diárias do Mascote Ativo do Aluno
  const mascotTips: Record<string, string> = {
    robi: 'Olá! Lembre-se de encaixar os blocos no Estúdio LEGO e publicar no Mural da Turma! 🤖',
    byte: 'E aí! Complete mais 1 lição hoje para manter sua sequência de estudo em dia! ⚙️',
    volt: 'Energia total! Sabia que circuitos em série alimentam LEDs com voltagem contínua? ⚡',
    spark: 'Brilhante! Ganhe mais XP nas missões para subir no Pódio da Liga! ✨',
    wizard: 'Magia da tecnologia! Programe a rota do robô com blocos visuais perfeitos! 🧙‍♂️',
    scientist: 'Hipótese confirmada: praticar robótica todos os dias eleva seu nível! 🔬',
    bmo: 'Hora do jogo! Encare os mini-games de circuitos e engrenagens na central! 🎮'
  };

  const currentTip = mascotTips[user.mascot || 'robi'] || mascotTips.robi;

  return (
    <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-4 font-display select-none sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pl-1">
      {/* WIDGET DO MASCOTE ATIVO DO ALUNO */}
      <Card variant="white" className="p-4 border-4 border-slate-200 rounded-3xl space-y-3 shadow-xl relative flex flex-col items-center overflow-visible">
        <div className="w-full flex items-center justify-between border-b-2 border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Seu Mascote Guia</h4>
          </div>
          <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase">
            {user.mascot || 'robi'}
          </span>
        </div>

        {/* Mascot CSS Component Centered */}
        <div className="w-full flex justify-center items-center h-48 py-1 overflow-visible">
          <CSSMascot character={user.mascot || 'robi'} size="sm" hideOrbit={true} equippedAccessories={user.equippedAccessories} />
        </div>

        {/* Bolha de Fala / Dica do Mascote */}
        <div className="w-full p-3 bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 text-sky-950 rounded-2xl text-xs font-bold leading-snug shadow-xs text-center">
          💬 {currentTip}
        </div>
      </Card>

      {/* WIDGET DE PROGRESSO DE NÍVEL E META DIÁRIA DE XP */}
      <Card variant="white" className="p-4 border-4 border-slate-200 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Progresso do Nível</h4>
          </div>
          <span className="text-xs font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-3d-yellow">
            Nível {user.level || 1}
          </span>
        </div>

        <div className="space-y-2">
          <XPBar totalXP={user.xp} />
        </div>
      </Card>

      {/* WIDGET DE STATUS: VIDAS & SEQUÊNCIA */}
      <div className="grid grid-cols-2 gap-3">
        {/* Vidas ❤️ */}
        <div className="bg-rose-50 border-3 border-rose-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Vidas Diárias</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(h => (
              <Heart
                key={h}
                className={`w-4 h-4 ${
                  studentLives && h <= studentLives.lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-slate-300 fill-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sequência 🔥 */}
        <div className="bg-orange-50 border-3 border-orange-200 p-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Sequência</span>
          <div className="flex items-center gap-1 font-black text-slate-900 text-sm">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce-small" />
            <span>{user.streak || 0} Dias</span>
          </div>
        </div>
      </div>

      {/* MINI CARD DE SEGURANÇA E INCENTIVO */}
      <div className="bg-slate-100 border-2 border-slate-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-extrabold text-slate-600">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span>Ambiente 100% seguro e supervisionado para alunos do 1º ao 5º Ano.</span>
      </div>
    </aside>
  );
};
