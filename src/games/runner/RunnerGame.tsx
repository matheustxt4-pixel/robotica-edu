import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CSSMascot } from '../../components/ui/CSSMascot';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { Play, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RunnerGameProps {
  onComplete?: (xp: number) => void;
}

export type MarcoCommand = 'MOVE' | 'TURN_RIGHT' | 'TURN_LEFT' | 'COLLECT';

export const RunnerGame: React.FC<RunnerGameProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { playSound } = useAudio();

  // Nível Atual (Fase 1, 2 ou 3)
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Posição do Personagem no Tabuleiro de Pedras (X, Y, Direção: 0=Direita, 90=Baixo, 180=Esquerda, 270=Cima)
  const [charPos, setCharPos] = useState({ x: 0, y: 0, dir: 0 });
  const [collectedGems, setCollectedGems] = useState<number[]>([]);

  // Blocos Adicionados ao Caderno de Código do Marco
  const [notebookBlocks, setNotebookBlocks] = useState<MarcoCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Adicione blocos ao seu caderno e clique em ▶️ para iniciar!');

  // Configuração das Fases do Marco Run
  const stageConfigs = {
    1: {
      title: 'Fase 1: Primeiros Passos na Selva 🍃',
      tiles: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0, hasGem: true },
        { x: 3, y: 0 }
      ],
      start: { x: 0, y: 0, dir: 0 },
      gemIndex: 2,
      targetTile: { x: 3, y: 0 },
      instruction: 'Adicione 2 blocos "Avance 1 passo" e 1 bloco "Coletar Cristal 💎" ao seu caderno!'
    },
    2: {
      title: 'Fase 2: Curva nas Pedras da Lagoa 🐸',
      tiles: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1, hasGem: true },
        { x: 3, y: 1 }
      ],
      start: { x: 0, y: 0, dir: 0 },
      gemIndex: 3,
      targetTile: { x: 3, y: 1 },
      instruction: 'Avance, vire à direita, avance e colete o cristal azul!'
    },
    3: {
      title: 'Fase 3: O Templo dos Cristais Mágicos 🏆',
      tiles: [
        { x: 0, y: 0 },
        { x: 1, y: 0, hasGem: true },
        { x: 2, y: 0 },
        { x: 2, y: 1, hasGem: true },
        { x: 3, y: 1 }
      ],
      start: { x: 0, y: 0, dir: 0 },
      gemIndex: 1,
      targetTile: { x: 3, y: 1 },
      instruction: 'Combine movimentos e colete os cristais pelo caminho de pedras!'
    }
  };

  const currentConfig = stageConfigs[stage];

  // Reiniciar estado ao trocar de Fase
  useEffect(() => {
    resetStage();
  }, [stage]);

  const resetStage = () => {
    setCharPos(currentConfig.start);
    setCollectedGems([]);
    setNotebookBlocks([]);
    setIsRunning(false);
    setActiveStepIndex(null);
    setIsSuccess(false);
    setFeedbackMsg(currentConfig.instruction);
  };

  // Adicionar Bloco ao Caderno
  const addBlockToNotebook = (cmd: MarcoCommand) => {
    if (isRunning || notebookBlocks.length >= 8) return;
    playSound('click');
    setNotebookBlocks(prev => [...prev, cmd]);
  };

  // Remover Bloco do Caderno
  const removeBlock = (index: number) => {
    if (isRunning) return;
    playSound('click');
    setNotebookBlocks(prev => prev.filter((_, i) => i !== index));
  };

  // Limpar Caderno
  const clearNotebook = () => {
    if (isRunning) return;
    playSound('click');
    setNotebookBlocks([]);
    setCharPos(currentConfig.start);
    setCollectedGems([]);
    setIsSuccess(false);
    setActiveStepIndex(null);
  };

  // Executar a Sequência de Comandos do Caderno (Simulador Marco Run)
  const runCodeSequence = async () => {
    if (notebookBlocks.length === 0 || isRunning) return;

    setIsRunning(true);
    setIsSuccess(false);
    setCharPos(currentConfig.start);
    setCollectedGems([]);
    setFeedbackMsg('Executando sequência do caderno de código... 🚀');

    let cur = { ...currentConfig.start };
    const gems: number[] = [];

    for (let i = 0; i < notebookBlocks.length; i++) {
      setActiveStepIndex(i);
      const cmd = notebookBlocks[i];
      await new Promise(r => setTimeout(r, 650));

      if (cmd === 'MOVE') {
        let nx = cur.x;
        let ny = cur.y;
        if (cur.dir === 0) nx += 1;
        else if (cur.dir === 90) ny += 1;
        else if (cur.dir === 180) nx -= 1;
        else if (cur.dir === 270) ny -= 1;

        // Verificar se a nova posição está sobre as pedras da trilha
        const isOnTile = currentConfig.tiles.some(t => t.x === nx && t.y === ny);
        if (!isOnTile) {
          playSound('incorrect');
          setFeedbackMsg('Ops! O Marco pisou fora das pedras de caminhada! Ajuste seus blocos. 🍃');
          setIsRunning(false);
          setActiveStepIndex(null);
          return;
        }

        cur = { ...cur, x: nx, y: ny };
        playSound('click');
      } else if (cmd === 'TURN_RIGHT') {
        cur = { ...cur, dir: ((cur.dir + 90) % 360) as any };
        playSound('click');
      } else if (cmd === 'TURN_LEFT') {
        cur = { ...cur, dir: ((cur.dir + 270) % 360) as any };
        playSound('click');
      } else if (cmd === 'COLLECT') {
        // Verificar se há cristal na pedra atual
        const tileIndex = currentConfig.tiles.findIndex(t => t.x === cur.x && t.y === cur.y && t.hasGem);
        if (tileIndex !== -1 && !gems.includes(tileIndex)) {
          gems.push(tileIndex);
          setCollectedGems([...gems]);
          playSound('correct');
          setFeedbackMsg('💎 Cristal azul coletado com sucesso!');
        }
      }

      setCharPos(cur);
    }

    // Verificar Conclusão do Nível
    const isAtTarget = cur.x === currentConfig.targetTile.x && cur.y === currentConfig.targetTile.y;
    const hasCollectedRequiredGem = gems.length > 0;

    if (isAtTarget && hasCollectedRequiredGem) {
      setIsSuccess(true);
      playSound('finish');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setFeedbackMsg('🎉 Parabéns! Você ajudou o Marco a percorrer a trilha e coletar o cristal!');
      if (stage === 3 && onComplete) {
        onComplete(35);
      }
    } else if (!hasCollectedRequiredGem) {
      playSound('incorrect');
      setFeedbackMsg('Você chegou ao fim mas esqueceu de adicionar o bloco "Coletar Cristal 💎"!');
    } else {
      playSound('click');
      setFeedbackMsg('Você não chegou até a última pedra do caminho. Adicione mais blocos "Avance"!');
    }

    setIsRunning(false);
    setActiveStepIndex(null);
  };

  return (
    <div className="space-y-4 font-display max-w-4xl mx-auto select-none">
      {/* Header do Jogo Run Marco */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-emerald-900 text-white p-4 rounded-3xl border-4 border-emerald-500 shadow-xl gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 font-black text-2xl flex items-center justify-center shadow-3d-yellow">
            🤠
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">Run Marco! — Aventuras de Código</span>
            <h3 className="text-xl font-black">{currentConfig.title}</h3>
          </div>
        </div>

        {/* Seletor de Fases */}
        <div className="flex gap-2">
          {[1, 2, 3].map(stg => (
            <button
              key={stg}
              onClick={() => setStage(stg as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 ${
                stage === stg
                  ? 'bg-amber-400 text-amber-950 border-amber-300 scale-105 shadow-md'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
              }`}
            >
              Fase {stg}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA PRINCIPAL DO JOGO: CADERNO DE CÓDIGO (ESQUERDA) + MAPA DA SELVA (DIREITA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* PAINEL ESQUERDO: CADERNO DE CÓDIGO DO MARCO (Estilo Caderno Espiral) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-amber-50 border-4 border-amber-200 rounded-3xl p-5 shadow-2xl relative font-display text-slate-800">
          {/* Aba Superior com Botão PLAY ▶️ */}
          <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📓</span>
              <h4 className="font-black text-sm text-amber-950 uppercase tracking-wide">Caderno de Comandos</h4>
            </div>

            <button
              onClick={clearNotebook}
              disabled={isRunning || notebookBlocks.length === 0}
              className="text-rose-600 hover:text-rose-800 p-1.5 rounded-xl bg-amber-100 hover:bg-rose-100 transition-colors disabled:opacity-40"
              title="Limpar Caderno"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Paleta de Blocos Disponíveis */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider block">
              Clique nos blocos para adicionar ao caderno:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addBlockToNotebook('MOVE')}
                disabled={isRunning}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-3d-blue flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>👣</span>
                <span>Avance 1 passo</span>
              </button>

              <button
                type="button"
                onClick={() => addBlockToNotebook('COLLECT')}
                disabled={isRunning}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>💎</span>
                <span>Coletar Cristal</span>
              </button>

              <button
                type="button"
                onClick={() => addBlockToNotebook('TURN_RIGHT')}
                disabled={isRunning}
                className="p-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>➡️</span>
                <span>Vire Direita</span>
              </button>

              <button
                type="button"
                onClick={() => addBlockToNotebook('TURN_LEFT')}
                disabled={isRunning}
                className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>⬅️</span>
                <span>Vire Esquerda</span>
              </button>
            </div>
          </div>

          {/* Lista dos Blocos Adicionados no Caderno */}
          <div className="bg-white/80 border-2 border-amber-200 rounded-2xl p-3 min-h-[180px] space-y-2 shadow-inner">
            {notebookBlocks.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-amber-800/60 text-xs font-bold text-center gap-2">
                <span>📝 Seu caderno está vazio!</span>
                <span className="text-[10px]">Clique nos blocos acima para programar o Marco.</span>
              </div>
            ) : (
              notebookBlocks.map((cmd, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl font-black text-xs transition-all ${
                    activeStepIndex === idx
                      ? 'bg-amber-300 text-amber-950 border-2 border-amber-500 scale-105 shadow-md'
                      : cmd === 'MOVE'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : cmd === 'COLLECT'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/80 text-[10px] flex items-center justify-center font-black">
                      {idx + 1}
                    </span>
                    <span>
                      {cmd === 'MOVE' && '👣 Avance 1 passo'}
                      {cmd === 'COLLECT' && '💎 Coletar Cristal'}
                      {cmd === 'TURN_RIGHT' && '➡️ Vire à Direita (90°)'}
                      {cmd === 'TURN_LEFT' && '⬅️ Vire à Esquerda (90°)'}
                    </span>
                  </div>

                  <button
                    onClick={() => removeBlock(idx)}
                    disabled={isRunning}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Botão de Execução no Caderno ▶️ */}
          <div className="pt-4">
            <Button
              variant="green"
              size="lg"
              fullWidth
              isLoading={isRunning}
              disabled={notebookBlocks.length === 0}
              onClick={runCodeSequence}
              icon={<Play className="w-6 h-6 fill-white" />}
              className="py-4 text-base font-black shadow-3d-green"
            >
              EXECUTAR CADERNO ▶️
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAINEL DIREITO: MAPA DA SELVA DO MARCO (Estilo Run Marco!) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="white" className="p-4 border-4 border-emerald-500 bg-emerald-600 rounded-3xl relative overflow-hidden shadow-2xl min-h-[380px] flex flex-col justify-between">
            {/* Fundo da Selva com Grama e Plantas Tropicais em CSS */}
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_2px,transparent_2px)] [background-size:16px_16px] bg-emerald-500 opacity-90 -z-0" />

            {/* Elementos Tropicais de Cenário (Macaco, Sapinho, Flores) */}
            <div className="absolute top-4 left-6 text-2xl select-none animate-bounce-small z-0">🦜</div>
            <div className="absolute top-4 right-10 text-2xl select-none z-0">🐒</div>
            <div className="absolute bottom-14 right-6 text-3xl select-none z-0">👑🐸</div>
            <div className="absolute top-16 right-24 text-xl select-none z-0 opacity-80">🌸</div>
            <div className="absolute bottom-20 left-10 text-xl select-none z-0 opacity-80">🌺</div>

            {/* TABULEIRO DE PEDRAS DE CAMINHO DO MARCO */}
            <div className="relative z-10 my-auto py-12 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-4 md:gap-6 p-6 bg-emerald-700/60 backdrop-blur-xs rounded-3xl border-4 border-emerald-400 shadow-2xl">
                {Array.from({ length: 2 }, (_, r) => (
                  <React.Fragment key={r}>
                    {Array.from({ length: 4 }, (_, c) => {
                      const isPathTile = currentConfig.tiles.some(t => t.x === c && t.y === r);
                      const isTargetTile = currentConfig.targetTile.x === c && currentConfig.targetTile.y === r;
                      const hasGemOnTile = currentConfig.tiles.some(t => t.x === c && t.y === r && t.hasGem);
                      const tileIndex = currentConfig.tiles.findIndex(t => t.x === c && t.y === r && t.hasGem);
                      const isGemCollected = collectedGems.includes(tileIndex);
                      const isCharHere = charPos.x === c && charPos.y === r;

                      return (
                        <div
                          key={`${r}_${c}`}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl relative flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isPathTile
                              ? 'bg-amber-200 border-4 border-amber-400 shadow-3d-yellow'
                              : 'bg-emerald-800/40 border-2 border-emerald-700/50 opacity-40'
                          }`}
                        >
                          {/* Marcação de Pedra de Caminho */}
                          {isPathTile && (
                            <div className="absolute inset-1 rounded-xl border border-amber-300/60 bg-amber-100/60 pointer-events-none" />
                          )}

                          {/* Cristal Azul Coletável na Pedra */}
                          {hasGemOnTile && !isGemCollected && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center animate-bounce-small text-2xl drop-shadow-[0_0_12px_#3B82F6] pointer-events-none">
                              💎
                            </div>
                          )}

                          {/* Marcação da Pedra Final */}
                          {isTargetTile && !isCharHere && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center text-xl animate-pulse pointer-events-none">
                              🏁
                            </div>
                          )}

                          {/* PERSONAGEM MARCO / MASCOTE NA PEDRA */}
                          {isCharHere && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                              <div
                                className="flex items-center justify-center transition-transform duration-300"
                                style={{
                                  transform: `rotate(${charPos.dir}deg)`
                                }}
                              >
                                <div className="scale-[0.36] md:scale-[0.45] origin-center flex items-center justify-center">
                                  <CSSMascot
                                    character={(user?.mascot || 'robi') as any}
                                    size="sm"
                                    expression={isSuccess ? 'happy' : undefined}
                                    hideOrbit={true}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Balão de Instrução estilo Run Marco (Canto Inferior) */}
            <div className="relative z-10 bg-amber-100 border-2 border-amber-300 text-amber-950 p-3.5 rounded-2xl shadow-lg flex items-center gap-3 text-xs font-bold">
              <span className="text-xl flex-shrink-0">✨</span>
              <span>{feedbackMsg}</span>
            </div>
          </Card>

          {/* Modal de Conclusão da Fase do Marco */}
          {isSuccess && (
            <div className="bg-emerald-950 border-4 border-emerald-400 text-white p-6 rounded-3xl text-center space-y-4 shadow-2xl animate-bounce-small">
              <div className="w-16 h-16 rounded-3xl bg-amber-400 text-amber-950 font-black text-3xl mx-auto flex items-center justify-center shadow-3d-yellow">
                🤠
              </div>
              <h3 className="text-2xl font-black">Fase {stage} Concluída com Sucesso!</h3>
              <p className="text-xs text-emerald-200 font-bold">
                Você programou o Marco perfeitamente para percorrer as pedras e coletar os cristais mágicos!
              </p>
              <div className="flex gap-3 pt-2">
                {stage < 3 ? (
                  <Button variant="yellow" size="lg" fullWidth onClick={() => setStage((stage + 1) as any)}>
                    Avançar para Fase {stage + 1} ➔
                  </Button>
                ) : (
                  <Button variant="green" size="lg" fullWidth onClick={() => { if (onComplete) onComplete(35); }}>
                    Concluir Desafio do Marco (+35 XP) 🎉
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
