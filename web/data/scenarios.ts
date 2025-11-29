export type Category = 'traffic-lights' | 'signs' | 'pedestrians' | 'right-of-way' | 'hazards' | 'parking';

export interface ScenarioOption {
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Scenario {
  id: string;
  category: Category;
  level: 1 | 2 | 3 | 4;
  question: string;
  image?: string;
  options: ScenarioOption[];
  correctExplanation: string;
  realWorldTip: string;
  xp: number;
}

// Static scenarios are fallback/demo. Real data comes from DB.
export const SCENARIOS: Scenario[] = [
  {
    id: 'tl-001',
    category: 'traffic-lights',
    level: 1,
    question: 'Ju afroheni një semafori që sapo u bë i verdhë. Çfarë duhet të bëni?',
    options: [
      { text: 'Përshpejtoni për të kaluar', isCorrect: false, explanation: 'Përshpejtimi në dritën e verdhë është i rrezikshëm.' },
      { text: 'Ndaloni nëse mund ta bëni të sigurt', isCorrect: true },
      { text: 'Gjithmonë ndaloni menjëherë', isCorrect: false, explanation: 'Ndalimi i papritur mund të shkaktojë aksident.' },
      { text: 'Bini borisë dhe vazhdoni', isCorrect: false, explanation: 'Boria nuk e bën kalimin të sigurt.' },
    ],
    correctExplanation: 'Kur drita bëhet e verdhë, duhet të ndaloni nëse është e mundur të bëhet në mënyrë të sigurt.',
    realWorldTip: 'Nëse nuk mund të ndaloni pa rrezikuar, vazhdoni me kujdes.',
    xp: 25,
  }
];

export const CATEGORY_INFO: Record<Category, { name: string; icon: string; description: string; color: string }> = {
  'traffic-lights': {
    name: 'Semaforët',
    icon: '🚦',
    description: 'Mësoni kur të ndaloni dhe të vazhdoni',
    color: '#ef4444',
  },
  'signs': {
    name: 'Shenjat e Rrugës',
    icon: '🛑',
    description: 'Mësoni shenjat e ndalimit dhe paralajmërimit',
    color: '#f59e0b',
  },
  'pedestrians': {
    name: 'Siguria e Këmbësorëve',
    icon: '🚶',
    description: 'Mbroni përdoruesit e pambrojtur të rrugës',
    color: '#3b82f6',
  },
  'right-of-way': {
    name: 'Përparësia e Kalimit',
    icon: '🔄',
    description: 'Mësoni kush ka përparësi në kryqëzime',
    color: '#8b5cf6',
  },
  'hazards': {
    name: 'Rreziqet në Rrugë',
    icon: '⚠️',
    description: 'Përballuni me motin dhe pengesat',
    color: '#eab308',
  },
  'parking': {
    name: 'Rregullat e Parkimit',
    icon: '🅿️',
    description: 'Mësoni parkimin e sigurt dhe të ligjshëm',
    color: '#06b6d4',
  },
};
