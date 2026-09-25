import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Power, CheckCircle2, Zap } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface CircuitGameProps {
  onComplete?: (xp: number) => void;
}

export const CircuitGame: React.FC<CircuitGameProps> = ({ onComplete }) => {
  const { playSound } = useAudio();

  // Fases do Jogo do LED (1: Polaridade Ánodo/Cátodo, 2: Seleção de Resistor, 3: Laboratório de Cores RGB)
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // FASE 1 STATE: Polaridade do LED (Diodo)
  const [isLedReversed, setIsLedReversed] = useState(false); // Anodo no Positivo vs Catodo no Positivo
  const [isSwitchLevel1On, setIsSwitchLevel1On] = useState(false);
  const [phase1Passed, setPhase1Passed] = useState(false);

  // FASE 2 STATE: Resistor de Proteção (0Ω, 220Ω, 10kΩ)
  const [selectedResistor, setSelectedResistor] = useState<number | null>(null); // 0, 220, 10000
  const [isSwitchLevel2On, setIsSwitchLevel2On] = useState(false);
  const [isLedBurnt, setIsLedBurnt] = useState(false);
  const [phase2Passed, setPhase2Passed] = useState(false);

  // FASE 3 STATE: Laboratório de Mistura RGB em CSS
  const [redPower, setRedPower] = useState(false);
  const [greenPower, setGreenPower] = useState(false);
  const [bluePower, setBluePower] = useState(false);
  const [targetColorName] = useState<'AMARELO' | 'CIANO' | 'ROXO' | 'BRANCO'>('AMARELO');

  // handlers Fase 1
  const toggleFlipLed = () => {
    playSound('click');
    setIsLedReversed(prev => !prev);
    setIsSwitchLevel1On(false);
  };

  const handleTestLevel1 = () => {
    playSound('click');
    const newState = !isSwitchLevel1On;
    setIsSwitchLevel1On(newState);

    if (newState && !isLedReversed) {
      playSound('level_up');
      setPhase1Passed(true);
    } else if (newState && isLedReversed) {
      playSound('incorrect');
    }
  };

  // handlers Fase 2
  const handleSelectResistor = (ohms: number) => {
    playSound('click');
    setSelectedResistor(ohms);
    setIsSwitchLevel2On(false);
    setIsLedBurnt(false);
  };

  const handleTestLevel2 = () => {
    if (selectedResistor === null) return;
    playSound('click');
    setIsSwitchLevel2On(true);

    if (selectedResistor === 0) {
      // 0 Ohms = Queima o LED por excesso de corrente!
      playSound('incorrect');
      setIsLedBurnt(true);
    } else if (selectedResistor === 220) {
      // 220 Ohms = Valor ideal para LED de 2V em bateria 9V!
      playSound('level_up');
      setPhase2Passed(true);
      setIsLedBurnt(false);
    } else {
      // 10.000 Ohms = Corrente muito fraca
      playSound('click');
      setIsLedBurnt(false);
    }
  };

  // handlers Fase 3
  const checkPhase3Goal = (r: boolean, g: boolean, b: boolean) => {
    if (targetColorName === 'AMARELO' && r && g && !b) return true;
    if (targetColorName === 'CIANO' && !r && g && b) return true;
    if (targetColorName === 'ROXO' && r && !g && b) return true;
    if (targetColorName === 'BRANCO' && r && g && b) return true;
    return false;
  };

  const toggleRGBChannel = (color: 'R' | 'G' | 'B') => {
    playSound('click');
    let nr = redPower;
    let ng = greenPower;
    let nb = bluePower;

    if (color === 'R') nr = !redPower;
    if (color === 'G') ng = !greenPower;
    if (color === 'B') nb = !bluePower;

    setRedPower(nr);
    setGreenPower(ng);
    setBluePower(nb);

    if (checkPhase3Goal(nr, ng, nb)) {
      playSound('finish');
      setIsSuccess(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onComplete) onComplete(30);
    }
  };

  // Calcular a cor RGB resultante em CSS
  const getRgbColorCss = () => {
    const r = redPower ? 255 : 30;
    const g = greenPower ? 255 : 30;
    const b = bluePower ? 255 : 30;
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-6 font-display max-w-xl mx-auto select-none">
      {/* Header do Simulador */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs font-black text-amber-950">
          <span>💡 Laboratório de Circuitos & LED</span>
        </div>
        <h3 className="text-2xl font-black text-slate-800">
          {level === 1 && 'Fase 1: Polaridade do LED (Ánodo & Cátodo)'}
          {level === 2 && 'Fase 2: Proteção com Resistor de Ohms'}
          {level === 3 && `Fase 3: Laboratório de Cores RGB — Crie a cor ${targetColorName}!`}
        </h3>
        <p className="text-xs text-slate-500 font-extrabold">
          {level === 1 && 'Aprenda por qual perninha a energia entra! O Ánodo (+) deve ir no polo positivo.'}
          {level === 2 && 'Escolha o resistor ideal para não queimar o LED com a bateria de 9V!'}
          {level === 3 && 'Ligue os canais R (Vermelho), G (Verde) e B (Azul) para formar a cor indicada.'}
        </p>
      </div>

      {/* Indicador de Passos das 3 Fases */}
      <div className="flex justify-center items-center gap-3">
        {[
          { num: 1, title: 'Polaridade', done: phase1Passed },
          { num: 2, title: 'Resistor', done: phase2Passed },
          { num: 3, title: 'Cores RGB', done: isSuccess }
        ].map(p => (
          <button
            key={p.num}
            onClick={() => setLevel(p.num as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 ${
              level === p.num
                ? 'bg-robo-blue text-white border-sky-600 shadow-md scale-105'
                : p.done
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'bg-slate-100 border-slate-300 text-slate-500 opacity-70'
            }`}
          >
            <span>Fase {p.num}</span>
            {p.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        ))}
      </div>

      {/* PAINEL DO CIRCUITO EM 100% HTML/CSS */}
      <Card variant="white" className="p-6 border-4 border-slate-300 space-y-6 relative overflow-hidden shadow-2xl bg-slate-950 text-white rounded-3xl">

        {/* FASE 1: POLARIDADE DO LED */}
        {level === 1 && (
          <div className="space-y-6">
            <div className="flex justify-around items-center py-4 bg-slate-900/90 rounded-3xl border-2 border-slate-800 relative">
              {/* Bateria 9V */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-300 text-amber-950 flex flex-col items-center justify-between p-2 font-black shadow-lg">
                  <div className="flex justify-between w-full text-[10px]">
                    <span className="text-rose-700">+</span>
                    <span className="text-slate-900">-</span>
                  </div>
                  <span className="text-2xl">🔋</span>
                  <span className="text-[10px]">9V</span>
                </div>
                <span className="text-[10px] font-black text-amber-400">Bateria (+) (-)</span>
              </div>

              {/* Fios de Conexão com Animação CSS */}
              <div className="flex flex-col items-center gap-1">
                <div className={`h-1.5 w-24 rounded-full transition-all duration-300 ${isSwitchLevel1On && !isLedReversed ? 'bg-rose-500 shadow-[0_0_12px_#F43F5E]' : 'bg-rose-900/60'}`} />
                <span className="text-[9px] font-black text-rose-400">Fio Positivo (+)</span>
                <div className={`h-1.5 w-24 rounded-full transition-all duration-300 ${isSwitchLevel1On ? 'bg-sky-500 shadow-[0_0_12px_#0EA5E9]' : 'bg-sky-900/60'}`} />
                <span className="text-[9px] font-black text-sky-400">Fio Negativo (-)</span>
              </div>

              {/* COMPONENTE LED 100% HTML/CSS DE DIODO */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex flex-col items-center">
                  {/* Domo de Vidro do LED */}
                  <div
                    className={`w-14 h-16 rounded-t-full border-2 transition-all duration-500 relative flex items-center justify-center ${
                      isSwitchLevel1On && !isLedReversed
                        ? 'bg-amber-300 border-yellow-200 shadow-[0_0_40px_#FBBF24] scale-110'
                        : 'bg-rose-900/40 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {/* Anel do Filamento Interno */}
                    <div className="w-5 h-5 rounded-full border border-white/50 flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${isSwitchLevel1On && !isLedReversed ? 'bg-white shadow-[0_0_10px_#FFF]' : 'bg-rose-400/40'}`} />
                    </div>
                  </div>

                  {/* Pernas de Metal do LED (Ánodo mais longo, Cátodo mais curto) */}
                  <div className={`flex gap-3 mt-0.5 transition-transform duration-300 ${isLedReversed ? 'scale-x-[-1]' : ''}`}>
                    {/* Ánodo (+) Perninha Longa */}
                    <div className="flex flex-col items-center">
                      <div className="w-1.5 h-10 bg-slate-400 rounded-b-md shadow-inner" />
                      <span className="text-[9px] font-black text-rose-400 mt-1">Ánodo (+)</span>
                    </div>
                    {/* Cátodo (-) Perninha Curta */}
                    <div className="flex flex-col items-center">
                      <div className="w-1.5 h-7 bg-slate-400 rounded-b-md shadow-inner" />
                      <span className="text-[9px] font-black text-sky-400 mt-4">Cátodo (-)</span>
                    </div>
                  </div>
                </div>

                <Button variant="gray" size="sm" onClick={toggleFlipLed} className="mt-2 text-[10px]">
                  🔄 Girar Perninhas do LED
                </Button>
              </div>
            </div>

            {/* Teste da Fase 1 */}
            <div className="flex flex-col items-center gap-3">
              <Button
                variant={isSwitchLevel1On && !isLedReversed ? 'green' : 'yellow'}
                size="lg"
                fullWidth
                onClick={handleTestLevel1}
                icon={<Power className="w-5 h-5" />}
              >
                {isSwitchLevel1On ? 'Desligar Circuito' : 'Ligar Energia do Circuito ⚡'}
              </Button>

              {isSwitchLevel1On && isLedReversed && (
                <div className="bg-rose-950/80 border border-rose-500 text-rose-200 p-3 rounded-2xl text-xs font-bold text-center">
                  ⚠️ O LED não acendeu porque está invertido! O Ánodo (+) precisa estar ligado no polo Positivo (+). Clique em "Girar Perninhas do LED"!
                </div>
              )}

              {phase1Passed && (
                <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 p-4 rounded-2xl text-center space-y-3">
                  <p className="font-black text-sm">🎉 Excelente! O LED acendeu na polaridade correta!</p>
                  <Button variant="green" size="md" onClick={() => setLevel(2)}>
                    Ir para Fase 2: Resistor de Proteção ➔
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FASE 2: RESISTOR DE PROTEÇÃO */}
        {level === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 p-4 rounded-3xl border-2 border-slate-800 text-center space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Escolha o Resistor para conectar entre a bateria de 9V e o LED:
              </h4>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { ohms: 0, label: '0 Ω (Sem Resistor)', color: 'border-rose-500 text-rose-300' },
                  { ohms: 220, label: '220 Ω (Ideal)', color: 'border-emerald-400 text-emerald-300' },
                  { ohms: 10000, label: '10.000 Ω (10k)', color: 'border-sky-400 text-sky-300' }
                ].map(r => (
                  <button
                    key={r.ohms}
                    type="button"
                    onClick={() => handleSelectResistor(r.ohms)}
                    className={`p-3 rounded-2xl border-2 font-black text-xs transition-all flex flex-col items-center gap-1 ${
                      selectedResistor === r.ohms
                        ? 'bg-amber-400 text-amber-950 border-white shadow-lg scale-105'
                        : `bg-slate-800 ${r.color} hover:bg-slate-700`
                    }`}
                  >
                    {/* Resistor em 100% HTML/CSS */}
                    <div className="w-12 h-3 bg-amber-200 rounded-full border border-amber-400 flex items-center justify-center gap-1 my-1">
                      <div className="w-1 h-full bg-amber-900" />
                      <div className="w-1 h-full bg-rose-600" />
                      <div className="w-1 h-full bg-amber-600" />
                    </div>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulação Visual do Teste do Resistor */}
            <div className="flex justify-center items-center py-4 bg-slate-900 rounded-3xl relative">
              <div className="flex items-center gap-4">
                <div className="text-2xl">🔋 9V</div>
                <div className="h-1 w-12 bg-rose-500" />

                {/* Resistor Selecionado */}
                <div className="px-3 py-1.5 bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-400">
                  {selectedResistor !== null ? `${selectedResistor} Ω` : 'Escolha um Resistor'}
                </div>

                <div className="h-1 w-12 bg-amber-400" />

                {/* LED com Estado de Brilho ou Fumaça */}
                <div className="relative">
                  {isLedBurnt ? (
                    <div className="w-14 h-16 rounded-t-full bg-slate-900 border-2 border-rose-600 flex flex-col items-center justify-center text-rose-500 animate-pulse">
                      <span className="text-xl">💥</span>
                      <span className="text-[8px] font-black text-rose-400">QUEIMOU!</span>
                    </div>
                  ) : (
                    <div
                      className={`w-14 h-16 rounded-t-full border-2 transition-all duration-500 flex items-center justify-center ${
                        isSwitchLevel2On && selectedResistor === 220
                          ? 'bg-emerald-300 border-emerald-200 shadow-[0_0_40px_#10B981] scale-110'
                          : isSwitchLevel2On && selectedResistor === 10000
                          ? 'bg-emerald-900/50 border-emerald-700/60 shadow-[0_0_8px_#10B981] text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-white/70" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Testar Fase 2 */}
            <div className="space-y-3">
              <Button
                variant="yellow"
                size="lg"
                fullWidth
                disabled={selectedResistor === null}
                onClick={handleTestLevel2}
                icon={<Zap className="w-5 h-5" />}
              >
                Testar Resistor no Circuito ⚡
              </Button>

              {isLedBurnt && (
                <div className="bg-rose-950/80 border-2 border-rose-500 text-rose-200 p-3 rounded-2xl text-xs text-center font-bold">
                  🔥 Ops! Sem a resistência do resistor, a corrente de 9V queimou o LED de 2V! Escolha o resistor de 220 Ω!
                </div>
              )}

              {isSwitchLevel2On && selectedResistor === 10000 && (
                <div className="bg-amber-950/80 border-2 border-amber-500 text-amber-200 p-3 rounded-2xl text-xs text-center font-bold">
                  💡 O resistor de 10.000 Ω bloqueou quase toda a corrente. O LED acendeu muito fraco! Tente o resistor de 220 Ω.
                </div>
              )}

              {phase2Passed && (
                <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 p-4 rounded-2xl text-center space-y-3">
                  <p className="font-black text-sm">🌟 Perfeito! O resistor de 220 Ω protegeu o LED e manteve o brilho máximo seguro!</p>
                  <Button variant="green" size="md" onClick={() => setLevel(3)}>
                    Ir para Fase 3: Laboratório RGB ➔
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FASE 3: LABORATÓRIO DE MISTURA DE CORES RGB */}
        {level === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-4 rounded-3xl border-2 border-slate-800 text-center space-y-2">
              <span className="bg-purple-900/80 text-purple-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Desafio Final: Síntese Aditiva de Luz RGB
              </span>
              <h4 className="text-lg font-black text-white">
                Meta: Crie a luz <span className="text-amber-400 font-extrabold">{targetColorName}</span>!
              </h4>
            </div>

            {/* LED RGB DOME EM 100% HTML/CSS DYNAMIC GLOW */}
            <div className="flex justify-center items-center py-8 bg-slate-900 rounded-3xl relative overflow-hidden">
              {/* Lâmpada LED com Glow Dinâmico de CSS em tempo real */}
              <div
                className="w-24 h-28 rounded-t-full border-4 transition-all duration-500 relative flex items-center justify-center shadow-2xl"
                style={{
                  backgroundColor: getRgbColorCss(),
                  borderColor: redPower || greenPower || bluePower ? '#FFFFFF' : '#475569',
                  boxShadow: redPower || greenPower || bluePower ? `0 0 60px ${getRgbColorCss()}` : 'none'
                }}
              >
                {/* Filamento Triplo RGB */}
                <div className="flex gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${redPower ? 'bg-rose-500 shadow-[0_0_10px_#F43F5E]' : 'bg-slate-800'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${greenPower ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-slate-800'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full ${bluePower ? 'bg-sky-500 shadow-[0_0_10px_#0EA5E9]' : 'bg-slate-800'}`} />
                </div>
              </div>
            </div>

            {/* Chaves de Controle dos 3 Canais RGB */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => toggleRGBChannel('R')}
                className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
                  redPower ? 'bg-rose-600 text-white border-rose-300 shadow-[0_0_15px_#F43F5E]' : 'bg-slate-900 border-rose-950 text-rose-400'
                }`}
              >
                🔴 Canal R (Red)
              </button>
              <button
                type="button"
                onClick={() => toggleRGBChannel('G')}
                className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
                  greenPower ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_15px_#10B981]' : 'bg-slate-900 border-emerald-950 text-emerald-400'
                }`}
              >
                🟢 Canal G (Green)
              </button>
              <button
                type="button"
                onClick={() => toggleRGBChannel('B')}
                className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
                  bluePower ? 'bg-sky-600 text-white border-sky-300 shadow-[0_0_15px_#0EA5E9]' : 'bg-slate-900 border-sky-950 text-sky-400'
                }`}
              >
                🔵 Canal B (Blue)
              </button>
            </div>

            {/* Modal de Conclusão Total */}
            {isSuccess && (
              <div className="bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 p-6 rounded-3xl text-center space-y-4 animate-bounce-small">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-lg">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-white">Parabéns! Mestre do LED!</h3>
                <p className="text-xs font-bold text-emerald-300">
                  Você domina polaridade, resistores e a síntese aditiva de cores RGB em circuitos elétricos!
                </p>
                <div className="bg-emerald-900/60 p-3 rounded-2xl font-black text-amber-300 text-sm">
                  +30 XP Conquistados! 🎉
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
