import { StressType } from '../types';

interface ControlsProps {
  onApplyStress: (stress: StressType) => void;
  onReset: () => void;
  prediction: 'left' | 'right' | null;
  onPredictionChange: (dir: 'left' | 'right' | null) => void;
  predictionResult: 'correct' | 'incorrect' | null;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
}

export default function Controls({
  onApplyStress,
  onReset,
  prediction,
  onPredictionChange,
  predictionResult,
  temperature,
  onTemperatureChange,
}: ControlsProps) {
  return (
    <div className="space-y-6">
      {/* Concentração */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Concentração
        </h4>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onApplyStress('add-N2')}
            className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 hover:border-blue-400/60 rounded-lg text-blue-300 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ＋ Adicionar N₂ (Reagente)
          </button>
          <button
            onClick={() => onApplyStress('add-H2')}
            className="px-4 py-2.5 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 hover:border-green-400/60 rounded-lg text-green-300 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ＋ Adicionar H₂ (Reagente)
          </button>
          <button
            onClick={() => onApplyStress('add-NH3')}
            className="px-4 py-2.5 bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/30 hover:border-yellow-400/60 rounded-lg text-yellow-300 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ＋ Adicionar NH₃ (Produto)
          </button>
        </div>
      </div>

      {/* Volume e Pressão */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Volume e Pressão
        </h4>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onApplyStress('high-pressure')}
            className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 hover:border-purple-400/60 rounded-lg text-purple-300 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ↑ Alta Pressão (Baixo Volume)
          </button>
          <button
            onClick={() => onApplyStress('low-pressure')}
            className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-400/60 rounded-lg text-indigo-300 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            ↓ Baixa Pressão (Alto Volume)
          </button>
        </div>
      </div>

      {/* Temperatura */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Temperatura
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onApplyStress('cold'); onTemperatureChange(200); }}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                temperature === 200
                  ? 'bg-cyan-600/40 border border-cyan-400/60 text-cyan-200'
                  : 'bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300'
              }`}
            >
              ❄️ Frio (200 K)
            </button>
            <button
              onClick={() => { onTemperatureChange(400); }}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                temperature === 400
                  ? 'bg-gray-600/40 border border-gray-400/60 text-gray-200'
                  : 'bg-gray-600/20 hover:bg-gray-600/40 border border-gray-500/30 hover:border-gray-400/60 text-gray-300'
              }`}
            >
              🌡️ 400 K
            </button>
            <button
              onClick={() => { onApplyStress('hot'); onTemperatureChange(600); }}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                temperature === 600
                  ? 'bg-red-600/40 border border-red-400/60 text-red-200'
                  : 'bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 hover:border-red-400/60 text-red-300'
              }`}
            >
              🔥 Quente (600 K)
            </button>
          </div>
        </div>
      </div>

      {/* Previsão */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">
          🎯 Prever o Deslocamento
        </h4>
        <p className="text-xs text-gray-400 mb-3">
          Escolha uma direção e aplique um estresse para testar seu conhecimento.
        </p>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onPredictionChange(prediction === 'left' ? null : 'left')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              prediction === 'left'
                ? 'bg-red-500/30 border-2 border-red-400 text-red-200'
                : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
            }`}
          >
            ← Esquerda
          </button>
          <button
            onClick={() => onPredictionChange(prediction === 'right' ? null : 'right')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              prediction === 'right'
                ? 'bg-green-500/30 border-2 border-green-400 text-green-200'
                : 'bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10'
            }`}
          >
            Direita →
          </button>
        </div>
        {predictionResult && (
          <div className={`p-2 rounded-lg text-sm font-medium text-center ${
            predictionResult === 'correct'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {predictionResult === 'correct' ? '✅ Correto!' : '❌ Incorreto!'}
          </div>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 hover:border-red-400/60 rounded-xl text-red-300 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        🔄 Reiniciar Sistema
      </button>
    </div>
  );
}
