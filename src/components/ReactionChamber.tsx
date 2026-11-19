import { useEffect, useRef, useState, useCallback } from 'react';
import { Molecule } from '../types';

interface ReactionChamberProps {
  N2: number;
  H2: number;
  NH3: number;
  shiftDirection: 'left' | 'right' | 'none';
  temperature: number;
}

const COLORS = {
  N2: '#3B82F6',
  H2: '#10B981',
  NH3: '#F59E0B',
};

const LABELS = {
  N2: 'N₂',
  H2: 'H₂',
  NH3: 'NH₃',
};

function createMolecules(n2: number, h2: number, nh3: number, width: number, height: number): Molecule[] {
  const molecules: Molecule[] = [];
  let id = 0;
  const speed = 1.5;

  for (let i = 0; i < n2; i++) {
    molecules.push({
      id: id++,
      type: 'N2',
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 40) + 20,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
    });
  }
  for (let i = 0; i < h2; i++) {
    molecules.push({
      id: id++,
      type: 'H2',
      x: Math.random() * (width - 30) + 15,
      y: Math.random() * (height - 30) + 15,
      vx: (Math.random() - 0.5) * speed * 3,
      vy: (Math.random() - 0.5) * speed * 3,
    });
  }
  for (let i = 0; i < nh3; i++) {
    molecules.push({
      id: id++,
      type: 'NH3',
      x: Math.random() * (width - 50) + 25,
      y: Math.random() * (height - 50) + 25,
      vx: (Math.random() - 0.5) * speed * 1.5,
      vy: (Math.random() - 0.5) * speed * 1.5,
    });
  }
  return molecules;
}

export default function ReactionChamber({ N2, H2, NH3, shiftDirection, temperature }: ReactionChamberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moleculesRef = useRef<Molecule[]>([]);
  const animFrameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });
  const containerRef = useRef<HTMLDivElement>(null);

  const tempFactor = Math.max(0.5, Math.min(2, temperature / 400));

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(300, width), height: Math.max(250, height) });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    moleculesRef.current = createMolecules(N2, H2, NH3, dimensions.width, dimensions.height);
  }, [N2, H2, NH3, dimensions]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    ctx.clearRect(0, 0, width, height);

    // Background gradient based on temperature
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (temperature < 300) {
      gradient.addColorStop(0, '#1e3a5f');
      gradient.addColorStop(1, '#0f1f3a');
    } else if (temperature > 500) {
      gradient.addColorStop(0, '#5f1e1e');
      gradient.addColorStop(1, '#3a0f0f');
    } else {
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw molecules
    moleculesRef.current.forEach((mol) => {
      // Update position
      mol.x += mol.vx * tempFactor;
      mol.y += mol.vy * tempFactor;

      // Bounce off walls
      const radius = mol.type === 'N2' ? 14 : mol.type === 'H2' ? 9 : 18;
      if (mol.x <= radius || mol.x >= width - radius) mol.vx *= -1;
      if (mol.y <= radius || mol.y >= height - radius) mol.vy *= -1;
      mol.x = Math.max(radius, Math.min(width - radius, mol.x));
      mol.y = Math.max(radius, Math.min(height - radius, mol.y));

      // Draw molecule
      ctx.beginPath();
      ctx.arc(mol.x, mol.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[mol.type];
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${mol.type === 'H2' ? 8 : 10}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(LABELS[mol.type], mol.x, mol.y);
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [dimensions, tempFactor]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">Câmara de Reação</h3>
        {shiftDirection !== 'none' && (
          <div className={`px-3 py-1 rounded-full text-sm font-bold animate-pulse ${
            shiftDirection === 'right' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {shiftDirection === 'right' ? 'Deslocamento → Direita' : 'Deslocamento ← Esquerda'}
          </div>
        )}
      </div>
      <div ref={containerRef} className="relative w-full h-[350px] rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full"
        />
      </div>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-300">N₂ (Reagente)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-300">H₂ (Reagente)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-300">NH₃ (Produto)</span>
        </div>
      </div>
    </div>
  );
}
