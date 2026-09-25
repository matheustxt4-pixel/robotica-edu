import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { ClassmateMascotModal } from '../components/ui/ClassmateMascotModal';
import { Trophy, MapPin, Eye, Users, Globe, Calendar, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeaderboardEntry } from '../types';

export const RankingPage: React.FC = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    leaderboardService.getLeaderboard(period).then(data => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [period]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const getMascotEmoji = (mascot?: string) => {
    switch (mascot) {
      case 'byte': return '⚙️';
      case 'volt': return '⚡';
      case 'spark': return '🧩';
      case 'wizard': return '🧙‍♂️';
      case 'scientist': return '🧪';
      case 'bmo': return '🎮';
      default: return '🤖';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-display py-2 select-none">
      {/* BANNER REFORÇANDO O FOCO NO MAPA */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border-3 border-amber-300 p-3.5 rounded-2xl shadow-sm gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🗺️</span>
          <div>
            <span className="text-xs font-black text-amber-950 block">Como subir no Ranking?</span>
            <span className="text-[11px] font-bold text-amber-900">
              Conclua as lições e missões da <strong>Trilha Principal do Mapa</strong> para acumular XP!
            </span>
          </div>
        </div>
        <Link
          to="/map"
          className="w-full sm:w-auto text-xs font-black bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all shadow-3d-yellow flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <MapPin className="w-4 h-4" />
          <span>Ir para o Mapa 🗺️</span>
        </Link>
      </div>

      {/* Header do Ranking */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-900 font-black px-4 py-1.5 rounded-full text-xs shadow-sm">
          <Trophy className="w-5 h-5 text-amber-600 fill-amber-500" />
          {period === 'allTime' ? (
            <span className="flex items-center gap-1.5 text-blue-900">
              <Globe className="w-4 h-4 text-blue-600" /> Classificação Geral de Todo o Jogo
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" /> Ranking Exclusivo da Sua Turma
            </span>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800">Ranking dos Campeões 🏆</h2>
        <p className="text-xs text-slate-500 font-extrabold">
          {period === 'allTime'
            ? 'Competição global entre todos os robôs da plataforma!'
            : 'Desafie e veja o progresso dos seus colegas de sala! Clique no colega para ver o mascote 🤖✨'}
        </p>
      </div>

      {/* Tabs de Filtro de Período */}
      <div className="flex bg-slate-200/90 p-1.5 rounded-2xl max-w-md mx-auto border border-slate-300 shadow-inner">
        <button
          onClick={() => setPeriod('weekly')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${
            period === 'weekly' ? 'bg-amber-400 text-amber-950 shadow-md scale-102' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Semanal (Turma)</span>
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${
            period === 'monthly' ? 'bg-amber-400 text-amber-950 shadow-md scale-102' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Mensal (Turma)</span>
        </button>
        <button
          onClick={() => setPeriod('allTime')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 ${
            period === 'allTime' ? 'bg-sky-500 text-white shadow-md scale-102 font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Geral (Todo o Jogo)</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Carregando posições no ranking...</p>
        </div>
      ) : entries.length === 0 ? (
        <Card variant="white" className="p-8 text-center space-y-3 border-2 border-slate-200">
          <span className="text-4xl">🤖</span>
          <h4 className="text-lg font-black text-slate-800">Nenhum colega no ranking ainda</h4>
          <p className="text-xs text-slate-500 font-semibold">
            Seja o primeiro a completar lições no mapa para pontuar nesta classificação!
          </p>
        </Card>
      ) : (
        <>
          {/* Pódio dos 3 Primeiros Colocados */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end max-w-lg mx-auto pt-6">
            {/* 2º Lugar */}
            {top3[1] ? (
              <div
                onClick={() => setSelectedStudent(top3[1])}
                className="flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-105"
              >
                <Avatar avatarId={top3[1].avatar} size="lg" />
                <div className="bg-slate-200 border-2 border-slate-300 rounded-t-3xl w-full p-3 text-center shadow-md relative group-hover:border-sky-400">
                  <span className="text-2xl">🥈</span>
                  <h4 className="font-extrabold text-xs text-slate-800 mt-1 flex items-center justify-center gap-1 truncate">
                    <span className="truncate">{top3[1].nickname}</span>
                    <span className="text-xs">{getMascotEmoji(top3[1].mascot)}</span>
                  </h4>
                  <span className="text-xs font-black text-amber-600 block">{top3[1].xp} XP</span>
                  <span className="text-[9px] font-extrabold text-sky-600 flex items-center justify-center gap-1 mt-1 opacity-90">
                    <Eye className="w-3 h-3" /> Mascote
                  </span>
                </div>
              </div>
            ) : <div />}

            {/* 1º Lugar (Central - Mais alto) */}
            {top3[0] ? (
              <div
                onClick={() => setSelectedStudent(top3[0])}
                className="flex flex-col items-center gap-2 -translate-y-4 cursor-pointer group transition-transform hover:scale-105"
              >
                <div className="relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce-small">👑</span>
                  <Avatar avatarId={top3[0].avatar} size="xl" />
                </div>
                <div className="bg-amber-100 border-4 border-amber-400 rounded-t-3xl w-full p-4 text-center shadow-lg group-hover:border-amber-500">
                  <span className="text-3xl">🥇</span>
                  <h4 className="font-black text-sm text-amber-950 mt-1 flex items-center justify-center gap-1 truncate">
                    <span className="truncate">{top3[0].nickname}</span>
                    <span className="text-sm">{getMascotEmoji(top3[0].mascot)}</span>
                  </h4>
                  <span className="text-sm font-black text-amber-600 block">{top3[0].xp} XP</span>
                  <span className="text-[10px] font-black text-amber-800 flex items-center justify-center gap-1 mt-1">
                    <Eye className="w-3.5 h-3.5" /> Ver Mascote 🤖
                  </span>
                </div>
              </div>
            ) : <div />}

            {/* 3º Lugar */}
            {top3[2] ? (
              <div
                onClick={() => setSelectedStudent(top3[2])}
                className="flex flex-col items-center gap-2 cursor-pointer group transition-transform hover:scale-105"
              >
                <Avatar avatarId={top3[2].avatar} size="lg" />
                <div className="bg-amber-800/10 border-2 border-amber-700/20 rounded-t-3xl w-full p-3 text-center shadow-md group-hover:border-amber-600">
                  <span className="text-2xl">🥉</span>
                  <h4 className="font-extrabold text-xs text-slate-800 mt-1 flex items-center justify-center gap-1 truncate">
                    <span className="truncate">{top3[2].nickname}</span>
                    <span className="text-xs">{getMascotEmoji(top3[2].mascot)}</span>
                  </h4>
                  <span className="text-xs font-black text-amber-600 block">{top3[2].xp} XP</span>
                  <span className="text-[9px] font-extrabold text-sky-600 flex items-center justify-center gap-1 mt-1 opacity-90">
                    <Eye className="w-3 h-3" /> Mascote
                  </span>
                </div>
              </div>
            ) : <div />}
          </div>

          {/* Demais Posições */}
          {rest.length > 0 && (
            <Card variant="white" className="p-4 border-2 border-slate-200 divide-y divide-slate-100 shadow-md">
              {rest.map(entry => (
                <div
                  key={entry.studentId}
                  onClick={() => setSelectedStudent(entry)}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-sky-50 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-400 text-sm w-6">#{entry.position}</span>
                    <Avatar avatarId={entry.avatar} size="sm" />
                    <div>
                      <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                        <span>{entry.nickname}</span>
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                          {getMascotEmoji(entry.mascot)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-amber-600 text-sm">{entry.xp} XP</span>
                    <span className="text-[10px] font-black bg-sky-100 text-sky-900 px-2 py-1 rounded-xl flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Mascote
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      {/* Modal de Visualização do Mascote do Colega */}
      <ClassmateMascotModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
