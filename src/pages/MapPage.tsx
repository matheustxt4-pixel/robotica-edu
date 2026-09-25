import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { WORLDS_BY_GRADE, UNIT_GAME_TYPES } from '../config/worldsData';
import { progressService } from '../services/progressService';
import { UserProgress, LessonStatus, Lesson } from '../types';
import { Lock, CheckCircle, Star, Rocket, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CssFlower } from '../components/ui/CssFlower';
import { UnitExplanationModal } from '../components/ui/UnitExplanationModal';

export const MapPage: React.FC = () => {
  const { user } = useAuth();
  const { playSound } = useAudio();

  const [selectedGrade, setSelectedGrade] = useState<number>(user?.grade || 3);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson; status: LessonStatus } | null>(null);
  const [selectedUnitExplanation, setSelectedUnitExplanation] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      progressService.getStudentProgress(user.uid).then(pm => setProgressMap(pm));
    }
  }, [user]);

  const worldData = WORLDS_BY_GRADE[selectedGrade] || WORLDS_BY_GRADE[3];
  const world = worldData.world;
  const units = worldData.units;

  // Contador de lições concluídas
  let totalLessonsInWorld = 0;
  let completedCount = 0;

  units.forEach(u => {
    u.lessons.forEach(l => {
      totalLessonsInWorld++;
      if (progressMap[l.id]?.status === 'completed' || progressMap[l.id]?.status === 'perfect') {
        completedCount++;
      }
    });
  });

  const percentComplete = totalLessonsInWorld > 0 ? Math.round((completedCount / totalLessonsInWorld) * 100) : 0;

  const handleNodeClick = (lesson: Lesson, status: LessonStatus) => {
    if (status === 'locked') {
      playSound('incorrect');
      return;
    }
    playSound('click');
    setSelectedLesson({ lesson, status });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-display py-4 select-none">
      {/* Seletor do Ano Escolar (1º ao 5º Ano) & Botão Guia Teórico */}
      <div className="flex items-center justify-between bg-white border-2 border-slate-200 p-2 rounded-3xl shadow-sm overflow-x-auto gap-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[1, 2, 3, 4, 5].map(g => (
            <button
              key={g}
              onClick={() => {
                setSelectedGrade(g);
                playSound('click');
              }}
              className={`px-4 py-2 text-xs md:text-sm font-black rounded-2xl transition-all whitespace-nowrap ${
                selectedGrade === g
                  ? 'bg-robo-blue text-white shadow-3d-blue scale-105'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {g}º Ano
            </button>
          ))}
        </div>

        {/* Botão Rápido de Acesso ao Guia Teórico no Topo */}
        <button
          onClick={() => {
            playSound('click');
            const firstUnitId = units[0]?.id || 'unit_1';
            setSelectedUnitExplanation(firstUnitId);
          }}
          className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-3d-yellow flex items-center gap-1.5 transition-all text-xs flex-shrink-0 active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-950" />
          <span>Guia Teórico 📖</span>
        </button>
      </div>

      {/* Header do Mundo */}
      <Card variant="purple" className="p-6 md:p-8 relative overflow-hidden shadow-lg border-4 border-purple-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-purple-200 text-purple-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              {world.title}
            </span>
            <h2 className="text-3xl font-black text-purple-950">{world.description}</h2>
            <p className="text-xs font-bold text-purple-800/80">
              {completedCount} de {totalLessonsInWorld} Lições Concluídas ({percentComplete}%)
            </p>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-purple-200 border-4 border-purple-400 flex items-center justify-center text-4xl shadow-md flex-shrink-0">
            {world.icon}
          </div>
        </div>
      </Card>

      {/* Unidades e Trilha de Lições Curva */}
      <div className="space-y-12">
        {(() => {
          let prevLessonId: string | null = null;
          let globalLessonCount = 0;

          // Padrão senoidal de coordenadas X (percentual de 0% a 100%)
          const xPattern = [50, 74, 86, 74, 50, 26, 14, 26];

          return units.map((unit, unitIdx) => {
            const Y_SPACING = 130;
            const containerHeight = unit.lessons.length * Y_SPACING + 40;

            // Calcular coordenadas exatas dos nós da unidade
            const points = unit.lessons.map((lesson, lIdx) => {
              const currentGlobalIdx = globalLessonCount;
              globalLessonCount++;

              const xPct = xPattern[currentGlobalIdx % xPattern.length];
              const xPx = (xPct / 100) * 320;
              const yPx = 50 + lIdx * Y_SPACING;

              const isFirstLessonInWorld = unitIdx === 0 && lIdx === 0;
              const status = progressService.getLessonStatus(lesson.id, isFirstLessonInWorld, prevLessonId, progressMap);
              prevLessonId = lesson.id;

              return {
                lesson,
                lIdx,
                xPct,
                xPx,
                yPx,
                status,
                record: progressMap[lesson.id]
              };
            });

            // Construir string do caminho da curva SVG (Bézier suave)
            let pathD = '';
            let completedPathD = '';

            if (points.length > 0) {
              pathD = `M ${points[0].xPx} ${points[0].yPx}`;
              let completedSegmentD = `M ${points[0].xPx} ${points[0].yPx}`;
              let hasCompletedSegment = points[0].status === 'completed' || points[0].status === 'perfect';

              for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const controlY1 = p1.yPx + Y_SPACING / 2;
                const controlY2 = p2.yPx - Y_SPACING / 2;

                const segment = ` C ${p1.xPx} ${controlY1}, ${p2.xPx} ${controlY2}, ${p2.xPx} ${p2.yPx}`;
                pathD += segment;

                if (p2.status === 'completed' || p2.status === 'perfect' || p1.status === 'completed' || p1.status === 'perfect') {
                  completedSegmentD += segment;
                }
              }

              if (hasCompletedSegment) {
                completedPathD = completedSegmentD;
              }
            }

            return (
              <div key={unit.id} className="space-y-6">
                {/* Header da Unidade com Botão PROMINENTE do Guia de Conteúdo */}
                <div className="bg-slate-200/90 border-3 border-slate-300 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
                  <div className="text-center md:text-left">
                    <h3 className="font-black text-slate-800 text-lg md:text-xl">{unit.title}</h3>
                    <p className="text-xs font-bold text-slate-600">{unit.description}</p>
                  </div>

                  {/* BOTÃO PROMINENTE DO GUIA DA UNIDADE */}
                  <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-center md:justify-end">
                    <button
                      onClick={() => {
                        playSound('click');
                        setSelectedUnitExplanation(unit.id);
                      }}
                      className="bg-robo-blue hover:bg-sky-600 text-white font-black px-4 py-2 rounded-2xl border-2 border-sky-400 text-xs shadow-3d-blue flex items-center gap-1.5 transition-all active:scale-95"
                      title="Ver explicação pedagógica desta unidade"
                    >
                      <BookOpen className="w-4 h-4 text-white" />
                      <span>Guia da Unidade 📖</span>
                    </button>

                    <span className="text-xs font-black bg-white px-3 py-2 rounded-2xl text-slate-600 border border-slate-300">
                      Unidade {unit.order}
                    </span>
                  </div>
                </div>

                {/* Container da Trilha S-Curve 3D */}
                <div className="relative w-full max-w-md mx-auto py-4 overflow-hidden" style={{ height: `${containerHeight}px` }}>
                  {/* Flores Decorativas em 100% HTML/CSS Animadas nas Curvas da Trilha */}
                  <div className="absolute top-4 left-2 z-0 scale-75 md:scale-90 opacity-90 pointer-events-none">
                    <CssFlower variant="sunflower" size="sm" delay={0.2} />
                  </div>
                  <div className="absolute top-28 right-3 z-0 scale-75 md:scale-90 opacity-90 pointer-events-none">
                    <CssFlower variant="sakura" size="md" delay={0.7} />
                  </div>
                  <div className="absolute top-64 left-3 z-0 scale-75 md:scale-90 opacity-90 pointer-events-none">
                    <CssFlower variant="cyber" size="sm" delay={1.2} />
                  </div>
                  <div className="absolute bottom-20 right-2 z-0 scale-75 md:scale-90 opacity-90 pointer-events-none">
                    <CssFlower variant="purple" size="md" delay={0.4} />
                  </div>
                  <div className="absolute bottom-4 left-5 z-0 scale-75 md:scale-90 opacity-90 pointer-events-none">
                    <CssFlower variant="tulip" size="sm" delay={0.9} />
                  </div>

                  {/* SVG da Estrada/Caminho Curvo */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none -z-0"
                    viewBox={`0 0 320 ${containerHeight}`}
                    preserveAspectRatio="none"
                  >
                    {/* Borda Externa/Sombra da Estrada */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Asfalto/Superfície da Estrada */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Tracejado Central da Trilha */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      strokeDasharray="6 10"
                      strokeLinecap="round"
                    />
                    {/* Trilha Verde Brilhante para Lições Concluídas */}
                    {completedPathD && (
                      <path
                        d={completedPathD}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>

                  {/* Nós das Lições Posicionados Exatamente na Curva */}
                  {points.map(({ lesson, xPct, yPx, status, record }) => {
                    return (
                      <div
                        key={lesson.id}
                        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300"
                        style={{
                          left: `${xPct}%`,
                          top: `${yPx}px`
                        }}
                      >
                        <div className="group relative">
                          {status === 'completed' && (
                            <div className="absolute -top-3 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md z-20">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          )}

                          {status === 'perfect' && (
                            <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full text-[10px] shadow-md flex items-center gap-0.5 z-20">
                              <Star className="w-3.5 h-3.5 fill-amber-950" /> Perfeito!
                            </div>
                          )}

                          {status === 'available' && (
                            <div className="absolute -top-4 -right-3 bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-bounce-small z-20">
                              Próxima!
                            </div>
                          )}

                          <button
                            onClick={() => handleNodeClick(lesson, status)}
                            disabled={status === 'locked'}
                            className={`w-20 h-20 md:w-22 md:h-22 rounded-3xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-200 shadow-xl ${
                              status === 'perfect' || status === 'completed'
                                ? 'bg-robo-green border-4 border-emerald-300 text-white shadow-3d-green hover:scale-110 active:scale-95'
                                : status === 'available'
                                ? 'bg-robo-yellow border-4 border-amber-300 text-amber-950 shadow-3d-yellow hover:scale-110 active:scale-95 ring-4 ring-amber-300 ring-offset-2 animate-pulse-subtle'
                                : 'bg-slate-200 border-4 border-slate-300 text-slate-400 cursor-not-allowed opacity-80'
                            }`}
                          >
                            {status === 'locked' ? (
                              <Lock className="w-7 h-7 text-slate-400" />
                            ) : (
                              lesson.type === 'circuit' ? '💡' : lesson.type === 'gears' ? '⚙️' : lesson.type === 'runner' ? '🏃‍♂️' : '🧩'
                            )}
                          </button>
                        </div>

                        <div className="mt-1.5 text-center max-w-[130px] bg-white/90 backdrop-blur-xs px-2 py-1 rounded-xl shadow-xs border border-slate-200/60">
                          <h4 className="font-black text-[11px] md:text-xs text-slate-800 leading-tight">{lesson.title}</h4>
                          {record && record.stars > 0 && (
                            <div className="flex items-center justify-center gap-0.5 mt-0.5 text-amber-400">
                              {[1, 2, 3].map(s => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= record.stars ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Especial da Unidade (alinhado dinamicamente com o tema pedagógico) */}
                {(() => {
                  const gameType = UNIT_GAME_TYPES[unit.id] || 'programming';

                  if (gameType === 'circuit') {
                    return (
                      <div className="my-8 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 rounded-3xl text-amber-950 shadow-xl border-4 border-amber-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left z-10">
                          <span className="bg-slate-950 text-amber-300 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                            Desafio Elétrico & LED 💡
                          </span>
                          <h3 className="text-2xl font-black text-slate-950">{unit.title} — Laboratório Prático</h3>
                          <p className="text-xs font-bold text-amber-950/90 max-w-md">
                            {unit.description}. Teste polaridade (+/-), resistores e circuitos em 100% HTML/CSS!
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 z-10 w-full md:w-auto">
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedUnitExplanation(unit.id);
                            }}
                            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-black px-4 py-2.5 rounded-2xl border-2 border-amber-300 text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-4 h-4 text-amber-600" /> Guia Teórico 📖
                          </button>
                          <Link to="/game/circuit" className="w-full sm:w-auto">
                            <Button variant="green" size="lg" fullWidth className="font-black shadow-3d-green text-white hover:scale-105 active:scale-95">
                              Jogar Laboratório 💡
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  if (gameType === 'gears') {
                    return (
                      <div className="my-8 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 p-6 rounded-3xl text-white shadow-xl border-4 border-purple-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left z-10">
                          <span className="bg-emerald-400 text-emerald-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                            Desafio Mecânico ⚙️
                          </span>
                          <h3 className="text-2xl font-black">{unit.title} — Simulador Mecânico</h3>
                          <p className="text-xs font-bold text-purple-100 max-w-md">
                            {unit.description}. Monte engrenagens motrizes e transmita velocidade e torque ao robô!
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 z-10 w-full md:w-auto">
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedUnitExplanation(unit.id);
                            }}
                            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-purple-950 font-black px-4 py-2.5 rounded-2xl border-2 border-purple-300 text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-4 h-4 text-purple-600" /> Guia Teórico 📖
                          </button>
                          <Link to="/game/gears" className="w-full sm:w-auto">
                            <Button variant="yellow" size="lg" fullWidth className="font-black shadow-3d-yellow text-amber-950 hover:scale-105 active:scale-95">
                              Jogar Engrenagens ⚙️
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  if (gameType === 'runner') {
                    return (
                      <div className="my-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 rounded-3xl text-white shadow-xl border-4 border-pink-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left z-10">
                          <span className="bg-yellow-400 text-amber-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                            Marco Run 🏃‍♂️
                          </span>
                          <h3 className="text-2xl font-black">{unit.title} — Caderno de Programação</h3>
                          <p className="text-xs font-bold text-indigo-100 max-w-md">
                            {unit.description}. Monte a sequência no caderno e guie o robô pelo caminho de pedras!
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 z-10 w-full md:w-auto">
                          <button
                            onClick={() => {
                              playSound('click');
                              setSelectedUnitExplanation(unit.id);
                            }}
                            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-indigo-950 font-black px-4 py-2.5 rounded-2xl border-2 border-pink-300 text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-4 h-4 text-indigo-600" /> Guia Teórico 📖
                          </button>
                          <Link to="/game/runner" className="w-full sm:w-auto">
                            <Button variant="yellow" size="lg" fullWidth className="font-black shadow-3d-yellow text-amber-950 hover:scale-105 active:scale-95">
                              Jogar Marco Run 🏃‍♂️
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="my-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-3xl text-white shadow-xl border-4 border-blue-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2 text-center md:text-left z-10">
                        <span className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                          Navegação em Matriz 🧩
                        </span>
                        <h3 className="text-2xl font-black">{unit.title} — Desafio de Grade</h3>
                        <p className="text-xs font-bold text-blue-100 max-w-md">
                          {unit.description}. Programe a movimentação do robô na matriz 5x5 com comandos lógicos!
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 z-10 w-full md:w-auto">
                        <button
                          onClick={() => {
                            playSound('click');
                            setSelectedUnitExplanation(unit.id);
                          }}
                          className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-950 font-black px-4 py-2.5 rounded-2xl border-2 border-blue-300 text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" /> Guia Teórico 📖
                        </button>
                        <Link to="/game/programming" className="w-full sm:w-auto">
                          <Button variant="yellow" size="lg" fullWidth className="font-black shadow-3d-yellow text-amber-950 hover:scale-105 active:scale-95">
                            Jogar Robô em Grade 🧩
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          });
        })()}
      </div>

      {/* Modal de Detalhes da Lição Selecionada */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="white" className="max-w-md w-full p-6 space-y-6 shadow-2xl relative border-4 border-slate-200 font-display">
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 border-4 border-amber-300 text-4xl mx-auto flex items-center justify-center shadow-3d-yellow">
                {selectedLesson.lesson.type === 'circuit' ? '💡' : selectedLesson.lesson.type === 'gears' ? '⚙️' : selectedLesson.lesson.type === 'runner' ? '🏃‍♂️' : '🧩'}
              </div>
              <h3 className="text-2xl font-black text-slate-800">{selectedLesson.lesson.title}</h3>
              <p className="text-sm font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
                Recompensa: +{selectedLesson.lesson.totalXpReward} XP
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="gray" size="md" fullWidth onClick={() => setSelectedLesson(null)}>
                Voltar
              </Button>
              {selectedLesson.lesson.type === 'circuit' ? (
                <Link to={`/game/circuit?lessonId=${selectedLesson.lesson.id}&unitId=${selectedLesson.lesson.unitId}`} className="w-full">
                  <Button variant="yellow" size="md" fullWidth icon={<Rocket className="w-5 h-5" />}>
                    Jogar Laboratório do LED 💡
                  </Button>
                </Link>
              ) : selectedLesson.lesson.type === 'gears' ? (
                <Link to={`/game/gears?lessonId=${selectedLesson.lesson.id}&unitId=${selectedLesson.lesson.unitId}`} className="w-full">
                  <Button variant="yellow" size="md" fullWidth icon={<Rocket className="w-5 h-5" />}>
                    Jogar Engrenagens ⚙️
                  </Button>
                </Link>
              ) : selectedLesson.lesson.type === 'runner' ? (
                <Link to={`/game/runner?lessonId=${selectedLesson.lesson.id}&unitId=${selectedLesson.lesson.unitId}`} className="w-full">
                  <Button variant="yellow" size="md" fullWidth icon={<Rocket className="w-5 h-5" />}>
                    Jogar Marco Run 🏃‍♂️
                  </Button>
                </Link>
              ) : selectedLesson.lesson.type === 'programming' ? (
                <Link to={`/game/programming?lessonId=${selectedLesson.lesson.id}&unitId=${selectedLesson.lesson.unitId}`} className="w-full">
                  <Button variant="yellow" size="md" fullWidth icon={<Rocket className="w-5 h-5" />}>
                    Jogar Programação 🧩
                  </Button>
                </Link>
              ) : (
                <Link to={`/lesson/${selectedLesson.lesson.id}`} className="w-full">
                  <Button variant="green" size="md" fullWidth icon={<Rocket className="w-5 h-5" />}>
                    Começar Lição
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Explicação de Conteúdo da Unidade */}
      <UnitExplanationModal
        unitId={selectedUnitExplanation}
        onClose={() => setSelectedUnitExplanation(null)}
      />
    </div>
  );
};
