import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCw, Trash2, Undo, Sparkles, Send, CheckCircle2, Layers, Move } from 'lucide-react';

import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { legoEngine } from '../../services/legoEngine';
import { legoService } from '../../services/legoService';
import { LegoBrick, LegoBrickType } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { LegoBrickSvg } from './LegoBrickSvg';

interface LegoStudioProps {
  onPublishSuccess?: () => void;
}

export const LegoStudio: React.FC<LegoStudioProps> = ({ onPublishSuccess }) => {
  const { user } = useAuth();
  const { playSound } = useAudio();

  // Lista de Blocos Adicionados à Construção
  const [bricks, setBricks] = useState<LegoBrick[]>([]);
  const [selectedBrickId, setSelectedBrickId] = useState<string | null>(null);
  const [lastMovedId, setLastMovedId] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Bloco Ativo Selecionado no Painel de Peças
  const [activeType, setActiveType] = useState<LegoBrickType>('2x2');
  const [activeColor, setActiveColor] = useState<string>('blue');
  const [activeRotation, setActiveRotation] = useState<number>(0);

  // Modal de Publicação na Rede Social
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // Dimensões Ampliadas do Baseplate (14x14 Studs) para caber muito mais peças
  const GRID_SIZE = 14;

  // Lista das Peças Disponíveis para o Aluno
  const availableTypes: Array<{ type: LegoBrickType; label: string; icon: string }> = [
    { type: '1x1', label: '1x1 Micro', icon: '🟦' },
    { type: '2x1', label: '2x1 Fino', icon: '🧱' },
    { type: '2x2', label: '2x2 Padrão', icon: '🟥' },
    { type: '2x4', label: '2x4 Longo', icon: '🟨' },
    { type: '4x4', label: '4x4 Placa', icon: '🟩' },
    { type: 'window', label: 'Janela 🏠', icon: '🪟' },
    { type: 'slope', label: 'Rampa 📐', icon: '📐' },
    { type: 'roof', label: 'Telhado 🔺', icon: '🔺' },
    { type: 'robot_head', label: 'Cabeça Robô 🤖', icon: '🤖' }
  ];

  // Paleta de Cores Disponíveis
  const availableColors: Array<{ name: string; hex: string; label: string }> = [
    { name: 'red', hex: '#ef4444', label: 'Vermelho' },
    { name: 'orange', hex: '#f97316', label: 'Laranja' },
    { name: 'yellow', hex: '#eab308', label: 'Amarelo' },
    { name: 'green', hex: '#22c55e', label: 'Verde' },
    { name: 'blue', hex: '#3b82f6', label: 'Azul' },
    { name: 'purple', hex: '#a855f7', label: 'Roxo' },
    { name: 'pink', hex: '#ec4899', label: 'Rosa' },
    { name: 'cyber', hex: '#06b6d4', label: 'Cyber' },
    { name: 'white', hex: '#f8fafc', label: 'Branco' },
    { name: 'gray', hex: '#64748b', label: 'Cinza' }
  ];

  // Cálculo de Posição de Tela Isométrica Verdadeira (X, Y, Z em Studs)
  const getIsoScreenPos = (x: number, y: number, z: number) => {
    const ISO_ORIGIN_X = 180;
    const ISO_ORIGIN_Y = 40;
    const ISO_STEP_X = 18;
    const ISO_STEP_Y = 10.5;
    const ISO_STEP_Z = 20;

    const left = ISO_ORIGIN_X + (x - y) * ISO_STEP_X;
    const top = ISO_ORIGIN_Y + (x + y) * ISO_STEP_Y - (z * ISO_STEP_Z);
    return { left: `${left}px`, top: `${top}px` };
  };

  // Encaixar Novo Bloco no Grid na Posição (x, y) com validação matemática do LegoEngine
  const handlePlaceBrick = (x: number, y: number, typeToPlace: LegoBrickType = activeType) => {
    if (bricks.length >= 100) return;

    const snap = legoEngine.findSnapPoint(
      x,
      y,
      typeToPlace,
      activeRotation,
      GRID_SIZE,
      bricks
    );

    if (snap.status === 'INVALID') {
      playSound('incorrect');
      return;
    }

    playSound('click');

    const newBrick: LegoBrick = {
      id: `brick_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: typeToPlace,
      x: snap.x,
      y: snap.y,
      z: snap.z,
      color: activeColor,
      rotation: activeRotation
    };

    setBricks(prev => [...prev, newBrick]);
    setSelectedBrickId(newBrick.id);
    setLastMovedId(newBrick.id);

    setTimeout(() => setLastMovedId(null), 500);
  };

  // Mover Bloco Existente para Nova Posição (x, y) com validação matemática do LegoEngine
  const handleMoveExistingBrick = (brickId: string, newX: number, newY: number) => {
    const targetBrick = bricks.find(b => b.id === brickId);
    if (!targetBrick) return;

    const snap = legoEngine.findSnapPoint(
      newX,
      newY,
      targetBrick.type,
      targetBrick.rotation,
      GRID_SIZE,
      bricks,
      brickId
    );

    if (snap.status === 'INVALID') {
      playSound('incorrect');
      return;
    }

    playSound('click');

    setBricks(prev =>
      prev.map(b => (b.id === brickId ? { ...b, x: snap.x, y: snap.y, z: snap.z } : b))
    );
    setSelectedBrickId(brickId);
    setLastMovedId(brickId);

    setTimeout(() => setLastMovedId(null), 500);
  };

  // Soltar item no Grid via Drag & Drop
  const handleDropOnCell = (x: number, y: number, e: React.DragEvent) => {
    e.preventDefault();
    const draggedBrickId = e.dataTransfer.getData('lego-brick-id');
    const draggedType = e.dataTransfer.getData('lego-type') as LegoBrickType;

    if (draggedBrickId) {
      handleMoveExistingBrick(draggedBrickId, x, y);
    } else if (draggedType) {
      handlePlaceBrick(x, y, draggedType);
    }
  };

  // Girar Peça Selecionada
  const handleRotateActive = () => {
    playSound('click');
    setActiveRotation(prev => (prev + 90) % 360);
  };

  // Desfazer Última Ação
  const handleUndo = () => {
    if (bricks.length === 0) return;
    playSound('click');
    setBricks(prev => prev.slice(0, -1));
    setSelectedBrickId(null);
  };

  // Remover Bloco Selecionado
  const handleDeleteSelected = () => {
    if (!selectedBrickId) return;
    playSound('click');
    setBricks(prev => prev.filter(b => b.id !== selectedBrickId));
    setSelectedBrickId(null);
  };

  // Limpar Toda a Base
  const handleClearAll = () => {
    if (bricks.length === 0) return;
    playSound('click');
    setBricks([]);
    setSelectedBrickId(null);
  };

  // Abrir Modal de Publicação
  const handleOpenPublish = () => {
    if (bricks.length === 0) return;
    playSound('click');
    setPostTitle(`Criação Robótica de ${user?.nickname || user?.name || 'Aluno'}`);
    setShowPublishModal(true);
  };

  // Confirmar Publicação na Rede Social da Turma
  const handleConfirmPublish = async () => {
    if (!user || bricks.length === 0 || isPublishing) return;
    setIsPublishing(true);

    await legoService.createPost({
      authorId: user.uid,
      authorName: user.nickname || user.name || 'Aluno Robótica',
      authorAvatar: user.avatar || 'avatar_1',
      authorMascot: user.mascot || 'robi',
      classId: user.classId || 'ROB-YQHN',
      grade: user.grade || 3,
      title: postTitle,
      bricks: bricks
    });

    playSound('finish');
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });

    setPublishSuccessMsg('🎉 Sua criação LEGO foi publicada com sucesso no Mural da Turma!');

    setTimeout(() => {
      setIsPublishing(false);
      setShowPublishModal(false);
      setPublishSuccessMsg('');
      if (onPublishSuccess) {
        onPublishSuccess();
      }
    }, 1800);
  };

  return (
    <div className="space-y-6 font-display select-none">
      {/* BARRA DE FERRAMENTAS DO ESTÚDIO LEGO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SELETOR DE PEÇAS & CORES (ESQUERDA - PALETA ARRASTÁVEL) */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="white" className="p-4 border-4 border-slate-300 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧱</span>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">Arraste ou Clique na Peça</h3>
              </div>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Move className="w-3 h-3" /> Arrastável
              </span>
            </div>

            {/* Grade de Tipos de Blocos LEGO (1x1, 2x1, 2x2, 2x4, 4x4, Rampa, Janela...) */}
            <div className="grid grid-cols-3 gap-2">
              {availableTypes.map(item => (
                <button
                  key={item.type}
                  draggable={true}
                  onDragStart={e => {
                    e.dataTransfer.setData('lego-type', item.type);
                    setActiveType(item.type);
                  }}
                  onClick={() => {
                    setActiveType(item.type);
                    playSound('click');
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all cursor-grab active:cursor-grabbing ${
                    activeType === item.type
                      ? 'bg-robo-blue text-white border-blue-400 shadow-3d-blue scale-105 font-black ring-2 ring-blue-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 font-bold'
                  }`}
                >
                  <span className="text-xl animate-lego-bounce">{item.icon}</span>
                  <span className="text-[10px] whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Paleta de Cores LEGO */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                Cor do Bloco:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {availableColors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setActiveColor(c.name);
                      playSound('click');
                    }}
                    className={`w-9 h-9 rounded-2xl border-4 transition-transform ${
                      activeColor === c.name
                        ? 'border-slate-900 scale-110 shadow-md ring-2 ring-white ring-offset-2'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Controles da Peça Ativa (Girar e Desfazer) */}
            <div className="pt-2 flex gap-2">
              <Button
                variant="gray"
                size="sm"
                fullWidth
                onClick={handleRotateActive}
                icon={<RotateCw className="w-4 h-4 text-robo-blue" />}
              >
                Girar ({activeRotation}°)
              </Button>
              <Button
                variant="gray"
                size="sm"
                fullWidth
                onClick={handleUndo}
                disabled={bricks.length === 0}
                icon={<Undo className="w-4 h-4 text-slate-500" />}
              >
                Desfazer
              </Button>
            </div>
          </Card>

          {/* Resumo da Criação */}
          <div className="bg-slate-100 border-2 border-slate-300 p-4 rounded-3xl flex items-center justify-between text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-robo-purple" />
              <span>Capacidade Ampliada: <strong className="text-slate-900 font-black">{bricks.length}</strong> / 100</span>
            </div>
            <button
              onClick={handleClearAll}
              disabled={bricks.length === 0}
              className="text-rose-600 hover:text-rose-800 text-[11px] font-black disabled:opacity-40"
            >
              Limpar Tudo
            </button>
          </div>
        </div>

        {/* ÁREA DE MONTAGEM ISOMÉTRICA AMPLIA (BASEPLATE DE STUDS 14x14) */}
        <div className="lg:col-span-8 space-y-4">
          <Card variant="white" className="p-4 md:p-6 border-4 border-slate-300 bg-gradient-to-b from-sky-100 via-slate-100 to-amber-50 rounded-3xl relative overflow-hidden shadow-2xl min-h-[520px] flex flex-col items-center justify-center">
            
            {/* Título & Instrução */}
            <div className="absolute top-4 left-6 z-10 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-2xl border border-slate-300 shadow-xs flex items-center gap-2 text-xs font-black text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Arraste e solte os blocos na base 14x14 para se divertir montando!</span>
            </div>

            {/* BASEPLATE ISOMÉTRICO LEGO COMPACTO AMPLIADO (GRID 14x14) */}
            <div className="relative z-10 py-6 my-auto flex items-center justify-center">
              <div className="relative w-[360px] md:w-[480px] h-[360px] md:h-[480px] bg-emerald-600/90 border-4 border-emerald-800 rounded-3xl shadow-2xl flex items-center justify-center overflow-visible">
                
                {/* Textura de Studs do Chão (Baseplate Verde de 14x14) */}
                <div className="absolute inset-0 bg-[radial-gradient(#15803d_2.5px,transparent_2.5px)] [background-size:20px_20px] opacity-85 pointer-events-none rounded-2xl" />

                {/* Grid Clicável e Arrastável 14x14 */}
                <div
                  className="grid grid-cols-14 gap-0.5 w-full h-full p-3 relative z-0"
                  onMouseLeave={() => setHoverPos(null)}
                >
                  {Array.from({ length: GRID_SIZE }, (_, r) =>
                    Array.from({ length: GRID_SIZE }, (_, c) => (
                      <div
                        key={`${r}_${c}`}
                        onClick={() => handlePlaceBrick(c, r)}
                        onMouseEnter={() => setHoverPos({ x: c, y: r })}
                        onDragOver={e => {
                          e.preventDefault();
                          setHoverPos({ x: c, y: r });
                        }}
                        onDrop={e => {
                          setHoverPos(null);
                          handleDropOnCell(c, r, e);
                        }}
                        className="w-full h-full rounded-xs border border-emerald-500/30 hover:bg-white/40 cursor-pointer transition-colors"
                        title={`Encaixar em (${c}, ${r})`}
                      />
                    ))
                  )}
                </div>

                {/* PEÇAS LEGO ENCAIXADAS NO ESTÚDIO COM ANIMAÇÃO LEGO SNAP */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-visible">
                  {[...bricks]
                    .sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x)
                    .map(b => {
                      const isSelected = selectedBrickId === b.id;
                      const isJustMoved = lastMovedId === b.id;

                      const pos = getIsoScreenPos(b.x, b.y, b.z);

                      return (
                        <div
                          key={b.id}
                          draggable={true}
                          onDragStart={e => {
                            e.dataTransfer.setData('lego-brick-id', b.id);
                            setSelectedBrickId(b.id);
                          }}
                          className={`absolute transition-all duration-200 pointer-events-auto cursor-grab active:cursor-grabbing ${
                            isJustMoved ? 'animate-lego-snap' : ''
                          }`}
                          style={{
                            left: pos.left,
                            top: pos.top,
                            zIndex: b.z * 10 + b.y + b.x
                          }}
                        >
                          <LegoBrickSvg
                            type={b.type}
                            color={b.color}
                            sizeMultiplier={0.75}
                            onClick={() => {
                              setSelectedBrickId(b.id);
                              playSound('click');
                            }}
                            className={isSelected ? 'ring-4 ring-amber-400 rounded-xl drop-shadow-xl scale-105' : ''}
                          />
                        </div>
                      );
                    })}

                  {/* PREVIEW DO BLOCO FANTASMA (VERDE SE VÁLIDO / VERMELHO SE COLISÃO OU SEM PINO) */}
                  {hoverPos && (() => {
                    const snap = legoEngine.findSnapPoint(
                      hoverPos.x,
                      hoverPos.y,
                      activeType,
                      activeRotation,
                      GRID_SIZE,
                      bricks
                    );

                    const ghostPos = getIsoScreenPos(snap.x, snap.y, snap.z);

                    return (
                      <div
                        className="absolute pointer-events-none transition-all duration-150 animate-pulse"
                        style={{
                          left: ghostPos.left,
                          top: ghostPos.top,
                          zIndex: snap.z * 10 + snap.y + snap.x + 200
                        }}
                      >
                        <LegoBrickSvg
                          type={activeType}
                          color={activeColor}
                          sizeMultiplier={0.75}
                          isGhost={true}
                          ghostStatus={snap.status === 'VALID' ? 'valid' : 'invalid'}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* BARRA INFERIOR DE AÇÕES E PUBLICAÇÃO */}
            <div className="w-full pt-4 border-t-2 border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                {selectedBrickId && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteSelected}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Excluir Peça
                  </Button>
                )}
              </div>

              {/* Botão Principal: PUBLICAR NA REDE SOCIAL */}
              <Button
                variant="green"
                size="lg"
                disabled={bricks.length === 0}
                onClick={handleOpenPublish}
                icon={<Send className="w-5 h-5 fill-white" />}
                className="py-3 px-6 font-black shadow-3d-green text-sm"
              >
                PUBLICAR NO MURAL DA TURMA 🚀
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL DE PUBLICAÇÃO NA REDE SOCIAL DOS ALUNOS */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card variant="white" className="max-w-md w-full p-6 space-y-5 shadow-2xl relative border-4 border-slate-300 font-display">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-amber-400 border-4 border-amber-300 text-amber-950 font-black text-3xl mx-auto flex items-center justify-center shadow-3d-yellow">
                🧱
              </div>
              <h3 className="text-2xl font-black text-slate-800">Publicar no Mural da Turma</h3>
              <p className="text-xs font-bold text-slate-500">
                Compartilhe sua criação LEGO com seus colegas de classe!
              </p>
            </div>

            {publishSuccessMsg ? (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl font-black text-center text-xs flex items-center justify-center gap-2 animate-bounce-small">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{publishSuccessMsg}</span>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Título da sua Criação:
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    placeholder="Ex: Robô Explorador de Marte"
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-2xl font-bold text-sm text-slate-800 focus:border-robo-blue focus:outline-none"
                    maxLength={40}
                  />
                </div>

                <div className="p-3 bg-blue-50 border-2 border-blue-200 text-blue-950 rounded-2xl text-[11px] font-extrabold flex items-center gap-2">
                  <span>📢</span>
                  <span>Sua obra será postada com seu nome e mascote para todos os alunos da turma curtirem!</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="gray" size="md" fullWidth onClick={() => setShowPublishModal(false)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="yellow"
                    size="md"
                    fullWidth
                    isLoading={isPublishing}
                    onClick={handleConfirmPublish}
                    icon={<Send className="w-4 h-4 fill-amber-950" />}
                  >
                    Publicar Agora 🚀
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
