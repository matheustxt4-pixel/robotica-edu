import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Play, RotateCcw, ArrowUp, RotateCw, Trash2, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

export type CommandType = 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT';

export interface GridPos {
  x: number;
  y: number;
  dir: 0 | 90 | 180 | 270; // 0: Norte, 90: Leste, 180: Sul, 270: Oeste
}

export const ProgrammingGame: React.FC<{ onComplete?: (xp: number) => void }> = ({ onComplete }) => {
  const { playSound } = useAudio();

  // Mapa 5x5: Início (0,4 Norte) -> Destino (3,1)
  const initialRobot: GridPos = { x: 0, y: 4, dir: 0 };
  const targetPos = { x: 3, y: 1 };
  const obstacles = [{ x: 1, y: 3 }, { x: 2, y: 3 }];

  const [robot, setRobot] = useState<GridPos>(initialRobot);
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addCommand = (cmd: CommandType) => {
    if (isRunning || commands.length >= 8) return;
    playSound('click');
    setCommands(prev => [...prev, cmd]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    playSound('click');
    setCommands(prev => prev.filter((_, i) => i !== index));
  };

  const resetGame = () => {
    setRobot(initialRobot);
    setCommands([]);
    setIsRunning(false);
    setIsSuccess(false);
    setErrorMsg(null);
  };

  const runProgram = async () => {
    if (commands.length === 0 || isRunning) return;
    setIsRunning(true);
    setErrorMsg(null);
    let current = { ...initialRobot };

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      await new Promise(r => setTimeout(r, 600));

      if (cmd === 'FORWARD') {
        let nx = current.x;
        let ny = current.y;
        if (current.dir === 0) ny -= 1;
        else if (current.dir === 90) nx += 1;
        else if (current.dir === 180) ny += 1;
        else if (current.dir === 270) nx -= 1;

        // Validar limites da grade 5x5 (0 a 4)
        if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
          setErrorMsg('Ops! O robô tentou sair do mapa! 🤖💥');
          playSound('incorrect');
          setIsRunning(false);
          return;
        }

        // Validar obstáculos
        if (obstacles.some(o => o.x === nx && o.y === ny)) {
          setErrorMsg('Bateu no obstáculo! Altere os comandos. 🪨');
          playSound('incorrect');
          setIsRunning(false);
          return;
        }

        current = { ...current, x: nx, y: ny };
      } else if (cmd === 'TURN_RIGHT') {
        current = { ...current, dir: ((current.dir + 90) % 360) as any };
      } else if (cmd === 'TURN_LEFT') {
        current = { ...current, dir: ((current.dir + 270) % 360) as any };
      }

      setRobot(current);
      playSound('click');
    }

    // Verificar se chegou ao objetivo (3,1)
    if (current.x === targetPos.x && current.y === targetPos.y) {
      setIsSuccess(true);
      playSound('level_up');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onComplete) onComplete(30);
    } else {
      setErrorMsg('O robô não chegou à bateria. Tente adicionar mais comandos!');
      playSound('incorrect');
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-6 font-display">
      {/* Top Header */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-black text-slate-800">🎮 Programação em Blocos: Rota do Robô</h3>
        <p className="text-xs text-slate-500 font-extrabold">Adicione os comandos para guiar o robô até a bateria 🔋!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Grade 2D (5x5) */}
        <Card variant="white" className="p-4 border-4 border-slate-300 mx-auto max-w-sm w-full">
          <div className="grid grid-cols-5 gap-1.5 bg-slate-200 p-2 rounded-2xl">
            {Array.from({ length: 25 }).map((_, idx) => {
              const x = idx % 5;
              const y = Math.floor(idx / 5);
              const isRobotHere = robot.x === x && robot.y === y;
              const isTargetHere = targetPos.x === x && targetPos.y === y;
              const isObstacleHere = obstacles.some(o => o.x === x && o.y === y);

              return (
                <div
                  key={idx}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 relative border ${
                    isTargetHere
                      ? 'bg-amber-100 border-amber-400'
                      : isObstacleHere
                      ? 'bg-slate-400 border-slate-500'
                      : 'bg-white border-slate-300'
                  }`}
                >
                  {isObstacleHere && '🪨'}
                  {isTargetHere && !isRobotHere && '🔋'}
                  {isRobotHere && (
                    <div
                      className="transition-transform duration-300 font-black text-3xl"
                      style={{ transform: `rotate(${robot.dir}deg)` }}
                    >
                      🤖
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Workspace de Comandos */}
        <div className="space-y-4">
          <Card variant="white" className="p-4 border-4 border-slate-200 space-y-3">
            <h4 className="font-black text-slate-700 text-xs uppercase tracking-wider">Paleta de Comandos</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="blue" size="sm" onClick={() => addCommand('FORWARD')} icon={<ArrowUp className="w-4 h-4" />}>
                Avançar
              </Button>
              <Button variant="purple" size="sm" onClick={() => addCommand('TURN_RIGHT')} icon={<RotateCw className="w-4 h-4" />}>
                Virar Direita
              </Button>
              <Button variant="purple" size="sm" onClick={() => addCommand('TURN_LEFT')} icon={<RotateCw className="w-4 h-4 -scale-x-100" />}>
                Virar Esquerda
              </Button>
            </div>
          </Card>

          {/* Fila de Comandos */}
          <Card variant="yellow" className="p-4 border-4 border-amber-300 space-y-3 min-h-[140px]">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-amber-950 text-xs uppercase tracking-wider">
                Sequência do Programa ({commands.length}/8)
              </h4>
              <button onClick={resetGame} className="text-amber-800 hover:text-amber-950 p-1" title="Reiniciar">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[50px] items-center">
              {commands.length === 0 ? (
                <span className="text-xs text-amber-800/60 font-extrabold italic">Clique nos botões acima para montar o programa...</span>
              ) : (
                commands.map((cmd, i) => (
                  <div
                    key={i}
                    onClick={() => removeCommand(i)}
                    className="bg-white border-2 border-amber-400 px-3 py-1.5 rounded-xl font-black text-xs text-amber-950 flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700"
                  >
                    <span>{cmd === 'FORWARD' ? '⬆️ Avançar' : cmd === 'TURN_RIGHT' ? '🔄 Dir' : '↩️ Esq'}</span>
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                  </div>
                ))
              )}
            </div>
          </Card>

          {errorMsg && (
            <div className="bg-rose-100 border-2 border-rose-300 text-rose-800 p-3 rounded-2xl text-xs font-black">
              {errorMsg}
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl text-sm font-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Excelente! Robô recarregado (+30 XP)! 🎉</span>
              </div>
            </div>
          )}

          <Button
            variant="green"
            size="lg"
            fullWidth
            onClick={runProgram}
            isLoading={isRunning}
            disabled={commands.length === 0 || isSuccess}
            icon={<Play className="w-5 h-5 fill-current" />}
          >
            ▶ Executar Programa
          </Button>
        </div>
      </div>
    </div>
  );
};
