import { useState, useCallback, useRef } from 'react';
import ReactionChamber from './components/ReactionChamber';
import Controls from './components/Controls';
import AmountChart from './components/AmountChart';
import {
  SimulationState,
  StressType,
  ChartDataPoint,
  INITIAL_STATE,
  STRESS_DESCRIPTIONS,
  CORRECT_SHIFTS,
  SHIFT_EXPLANATIONS,
} from './types';

export default function App() {
  const [state, setState] = useState<SimulationState>({ ...INITIAL_STATE });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    { time: 0, N2: 8, H2: 12, NH3: 6 },
  ]);
  const [prediction, setPrediction] = useState<'left' | 'right' | null>(null);
  const [predictionResult, setPredictionResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastStress, setLastStress] = useState<StressType | null>(null);
  const timeRef = useRef(1);

  const applyStress = useCallback((stress: StressType) => {
    setLastStress(stress);
    setShowExplanation(true);
    setPredictionResult(null);

    // Check prediction
    if (prediction) {
      const correct = CORRECT_SHIFTS[stress];
      setPredictionResult(prediction === correct ? 'correct' : 'incorrect');
    }

    const correctShift = CORRECT_SHIFTS[stress];

    setState((prev) => {
      let newState = { ...prev };
      newState.lastStress = STRESS_DESCRIPTIONS[stress];
      newState.shiftDirection = correctShift;
      newState.isAtEquilibrium = false;

      // Apply the stress
      switch (stress) {
        case 'add-N2':
          newState.N2 += 4;
          break;
        case 'add-H2':
          newState.H2 += 6;
          break;
        case 'add-NH3':
          newState.NH3 += 4;
          break;
        case 'high-pressure':
          newState.pressure = 'high';
          break;
        case 'low-pressure':
          newState.pressure = 'low';
          break;
        case 'cold':
          newState.temperature = 200;
          break;
        case 'hot':
          newState.temperature = 600;
          break;
      }

      // Simulate shift
      if (correctShift === 'right') {
        // Consume reactants, produce products
        switch (stress) {
          case 'add-N2':
            newState.N2 = Math.max(1, newState.N2 - 2);
            newState.H2 = Math.max(1, newState.H2 - 3);
            newState.NH3 += 4;
            break;
          case 'add-H2':
            newState.N2 = Math.max(1, newState.N2 - 2);
            newState.H2 = Math.max(1, newState.H2 - 2);
            newState.NH3 += 4;
            break;
          case 'high-pressure':
            newState.N2 = Math.max(1, newState.N2 - 2);
            newState.H2 = Math.max(1, newState.H2 - 4);
            newState.NH3 += 4;
            break;
          case 'cold':
            newState.N2 = Math.max(1, newState.N2 - 2);
            newState.H2 = Math.max(1, newState.H2 - 3);
            newState.NH3 += 4;
            break;
          default:
            break;
        }
      } else {
        // Consume products, produce reactants
        switch (stress) {
          case 'add-NH3':
            newState.NH3 = Math.max(1, newState.NH3 - 2);
            newState.N2 += 2;
            newState.H2 += 3;
            break;
          case 'low-pressure':
            newState.NH3 = Math.max(1, newState.NH3 - 2);
            newState.N2 += 2;
            newState.H2 += 4;
            break;
          case 'hot':
            newState.NH3 = Math.max(1, newState.NH3 - 3);
            newState.N2 += 2;
            newState.H2 += 3;
            break;
          default:
            break;
        }
      }

      return newState;
    });

    // Update chart data
    timeRef.current += 1;
    setChartData((prev) => {
      const lastPoint = prev[prev.length - 1];
      const newPoint: ChartDataPoint = {
        time: timeRef.current,
        N2: state.N2,
        H2: state.H2,
        NH3: state.NH3,
      };
      // Add intermediate points for smooth transition
      const midPoint: ChartDataPoint = {
        time: timeRef.current - 0.5,
        N2: Math.round((lastPoint.N2 + newPoint.N2) / 2 + (correctShift === 'right' ? -1 : 1)),
        H2: Math.round((lastPoint.H2 + newPoint.H2) / 2 + (correctShift === 'right' ? -1.5 : 1.5)),
        NH3: Math.round((lastPoint.NH3 + newPoint.NH3) / 2 + (correctShift === 'right' ? 2 : -2)),
      };
      return [...prev, midPoint, newPoint];
    });

    // Reset to equilibrium after delay
    setTimeout(() => {
      setState((prev) => ({ ...prev, isAtEquilibrium: true, shiftDirection: 'none' }));
    }, 3000);
  }, [prediction, state]);

  const reset = useCallback(() => {
    setState({ ...INITIAL_STATE });
    setChartData([{ time: 0, N2: 8, H2: 12, NH3: 6 }]);
    setPrediction(null);
    setPredictionResult(null);
    setShowExplanation(false);
    setLastStress(null);
    timeRef.current = 1;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
              ⚗️
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Princípio de Le Chatelier
              </h1>
              <p className="text-xs text-gray-400">Simulação Interativa — Processo de Haber</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Reaction Equation */}
        <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
          <h2 className="text-sm font-medium text-gray-400 mb-2">O Sistema de Reação</h2>
          <div className="text-2xl md:text-3xl font-bold tracking-wide">
            <span className="text-blue-400">N₂</span>
            <span className="text-gray-400 mx-2">+</span>
            <span className="text-green-400">3H₂</span>
            <span className="text-gray-400 mx-2">⇌</span>
            <span className="text-yellow-400">2NH₃</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Processo de Haber <span className="text-orange-400 font-medium">(Exotérmica: ΔH = -92 kJ/mol)</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">⚡</span> Aplicar Estresse ao Sistema
            </h3>
            <Controls
              onApplyStress={applyStress}
              onReset={reset}
              prediction={prediction}
              onPredictionChange={setPrediction}
              predictionResult={predictionResult}
              temperature={state.temperature}
              onTemperatureChange={(temp) => setState((prev) => ({ ...prev, temperature: temp }))}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Reaction Chamber */}
            <ReactionChamber
              N2={state.N2}
              H2={state.H2}
              NH3={state.NH3}
              shiftDirection={state.shiftDirection}
              temperature={state.temperature}
            />

            {/* Explanation */}
            {showExplanation && lastStress && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    💡
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-300 mb-1">
                      Estresse: {STRESS_DESCRIPTIONS[lastStress]}
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {SHIFT_EXPLANATIONS[lastStress]}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        CORRECT_SHIFTS[lastStress] === 'right'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {CORRECT_SHIFTS[lastStress] === 'right' ? '→ Deslocamento para a Direita' : '← Deslocamento para a Esquerda'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">N₂</div>
                <div className="text-xl font-bold text-blue-400">{state.N2}</div>
                <div className="text-xs text-gray-500">mols</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">H₂</div>
                <div className="text-xl font-bold text-green-400">{state.H2}</div>
                <div className="text-xs text-gray-500">mols</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">NH₃</div>
                <div className="text-xl font-bold text-yellow-400">{state.NH3}</div>
                <div className="text-xs text-gray-500">mols</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">Estado</div>
                <div className={`text-sm font-bold ${state.isAtEquilibrium ? 'text-green-400' : 'text-orange-400'}`}>
                  {state.isAtEquilibrium ? '⚖️ Equilíbrio' : '⚡ Deslocando'}
                </div>
                <div className="text-xs text-gray-500">{state.temperature} K</div>
              </div>
            </div>

            {/* Chart */}
            <AmountChart data={chartData} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">📚 Sobre o Princípio de Le Chatelier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="mb-2">
                O <strong className="text-blue-400">Princípio de Le Chatelier</strong> estabelece que, quando um sistema em equilíbrio químico é submetido a uma perturbação (estresse), o sistema se desloca no sentido que minimiza essa perturbação, estabelecendo um novo equilíbrio.
              </p>
              <p>
                Os estresses possíveis são: variação de <strong className="text-green-400">concentração</strong>, <strong className="text-purple-400">pressão/volume</strong> e <strong className="text-orange-400">temperatura</strong>.
              </p>
            </div>
            <div>
              <p className="mb-2">
                O <strong className="text-yellow-400">Processo de Haber</strong> é a reação industrial para produção de amônia (NH₃), fundamental para fertilizantes e outros produtos químicos.
              </p>
              <p>
                Na indústria, busca-se maximizar o rendimento de NH₃ utilizando alta pressão, temperatura moderada e remoção contínua do produto.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-8 py-4 text-center text-xs text-gray-500">
        Simulação Educacional — Princípio de Le Chatelier | Processo de Haber
      </footer>
    </div>
  );
}
