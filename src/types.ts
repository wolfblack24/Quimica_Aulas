export interface Molecule {
  id: number;
  type: 'N2' | 'H2' | 'NH3';
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface ChartDataPoint {
  time: number;
  N2: number;
  H2: number;
  NH3: number;
}

export interface SimulationState {
  N2: number;
  H2: number;
  NH3: number;
  temperature: number; // in K
  pressure: 'low' | 'normal' | 'high';
  isAtEquilibrium: boolean;
  shiftDirection: 'left' | 'right' | 'none';
  lastStress: string;
}

export type StressType = 
  | 'add-N2' 
  | 'add-H2' 
  | 'add-NH3' 
  | 'high-pressure' 
  | 'low-pressure' 
  | 'cold' 
  | 'hot';

export const INITIAL_STATE: SimulationState = {
  N2: 8,
  H2: 12,
  NH3: 6,
  temperature: 400,
  pressure: 'normal',
  isAtEquilibrium: true,
  shiftDirection: 'none',
  lastStress: '',
};

export const STRESS_DESCRIPTIONS: Record<StressType, string> = {
  'add-N2': 'Adicionado N₂ (Reagente)',
  'add-H2': 'Adicionado H₂ (Reagente)',
  'add-NH3': 'Adicionado NH₃ (Produto)',
  'high-pressure': 'Alta Pressão (Baixo Volume)',
  'low-pressure': 'Baixa Pressão (Alto Volume)',
  'cold': 'Temperatura Fria (200 K)',
  'hot': 'Temperatura Quente (600 K)',
};

export const CORRECT_SHIFTS: Record<StressType, 'left' | 'right'> = {
  'add-N2': 'right',
  'add-H2': 'right',
  'add-NH3': 'left',
  'high-pressure': 'right',
  'low-pressure': 'left',
  'cold': 'right',
  'hot': 'left',
};

export const SHIFT_EXPLANATIONS: Record<StressType, string> = {
  'add-N2': 'Ao adicionar N₂ (reagente), o sistema desloca para a direita para consumir o excesso de reagente e produzir mais NH₃.',
  'add-H2': 'Ao adicionar H₂ (reagente), o sistema desloca para a direita para consumir o excesso de reagente e produzir mais NH₃.',
  'add-NH3': 'Ao adicionar NH₃ (produto), o sistema desloca para a esquerda para consumir o excesso de produto e produzir mais reagentes.',
  'high-pressure': 'Ao aumentar a pressão, o sistema desloca para o lado com menos mols de gás. Como a direita tem 2 mols (2NH₃) e a esquerda tem 4 mols (N₂ + 3H₂), o equilíbrio desloca para a direita.',
  'low-pressure': 'Ao diminuir a pressão, o sistema desloca para o lado com mais mols de gás. Como a esquerda tem 4 mols (N₂ + 3H₂) e a direita tem 2 mols (2NH₃), o equilíbrio desloca para a esquerda.',
  'cold': 'A reação é exotérmica (libera calor). Ao diminuir a temperatura, o sistema desloca para a direita (sentido exotérmico) para gerar mais calor.',
  'hot': 'A reação é exotérmica (libera calor). Ao aumentar a temperatura, o sistema desloca para a esquerda (sentido endotérmico) para absorver o calor excessivo.',
};
