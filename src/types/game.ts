export type GameScreen = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY';

export interface PlayerPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

export type StationId =
  | 'station-1-masalah'
  | 'station-2-hipotesis'
  | 'station-3-pembolehubah'
  | 'station-4-radas'
  | 'station-5-keselamatan'
  | 'station-6-pengukuran'
  | 'station-7-graf'
  | 'station-8-kesimpulan';

export interface Station {
  id: StationId;
  stepNumber: number;
  name: string;
  zone: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  themeColor: string;
}

export interface ClueTerminal {
  id: string;
  title: string;
  author: string;
  x: number;
  y: number;
  content: string;
  tip: string;
  isRead: boolean;
}

export interface VariableItem {
  id: string;
  label: string;
  category: 'manipulasi' | 'bergerakbalas' | 'dimalarkan';
}

export interface QuizPuzzle {
  stationId: StationId;
  stepNumber: number;
  title: string;
  subTitle: string;
  scenario: string;
  explanationOnCorrect: string;
  puzzleType: 
    | 'single_choice' 
    | 'variable_sorter' 
    | 'meniscus_reading' 
    | 'apparatus_hazard_match' 
    | 'graph_analysis'
    | 'hypothesis_builder';
  // Specific data fields
  options?: { id: string; text: string; isCorrect: boolean; feedback?: string }[];
  variables?: VariableItem[];
  meniscusData?: {
    correctVolume: number;
    tolerance: number;
    unit: string;
    description: string;
  };
  apparatusItems?: {
    name: string;
    usage: string;
    symbolOrImage: string;
    category: 'radas' | 'simbol';
    hazardType?: string;
  }[];
  graphData?: {
    xLabel: string;
    yLabel: string;
    points: { x: number; y: number }[];
    question: string;
    correctInterpretation: string;
  };
  hypothesisData?: {
    part1Options: string[];
    part2Options: string[];
    correctPart1: string;
    correctPart2: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface GameStats {
  score: number;
  stepsCompleted: number;
  startTime: number;
  endTime: number | null;
  attemptsCount: number;
  correctCount: number;
}
