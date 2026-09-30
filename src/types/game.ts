export interface Student {
  id: string;
  name: string;
  carColor: string;
  secondaryColor: string;
  carNumber: number;
  teamName: string;
  isReady: boolean;
  progress: number; // 0 to 100% on the single lap
  currentLap: number; // Always 1
  isFinished: boolean;
  finishRank?: number; // P1 to P10
  finishTime?: string;
  score: number;
  correctCount: number; // Target is 10 correct answers
  wrongCount: number;
  streak: number;
  speedKmh: number;
  gear: number;
  rpm: number;
  lastAnswerStatus: 'correct' | 'wrong' | 'idle';
  lastAnswerTime?: number;
  drsActive?: boolean;
  remedialQueue?: string[]; // IDs of missed questions that will be repeated
  currentQuestionIndex?: number;
}

export interface Question {
  id: string;
  expression: string; // e.g. "^2log(8) + ^2log(4)"
  plainText: string;
  explanation: string;
  options: string[];
  correctIndex: number;
  category: 'Sifat Dasar' | 'Penjumlahan & Selisih' | 'Perkalian & Basis' | 'Pangkat Numerus' | 'Persamaan Logaritma';
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
}

export interface RaceState {
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  roomCode: string;
  roomName: string;
  totalLaps: number; // Strictly 1 Lap
  totalQuestions: number; // 10 questions required to finish
  maxFinishers: number; // 10 top finishers triggers race end
  countdownValue: number; // 5, 4, 3, 2, 1, 0 (LIGHTS OUT!)
  startTime: number | null;
  elapsedSeconds: number;
  flagStatus: 'GREEN' | 'YELLOW' | 'SAFETY_CAR' | 'CHECKERED';
  finishersCount: number;
}

export type ViewRole = 'role_select' | 'student_garage' | 'teacher_room' | 'student_cockpit' | 'concept_board';

export interface CarColorPreset {
  id: string;
  name: string;
  teamName: string;
  primary: string;
  accent: string;
  border: string;
  badgeBg: string;
}

export const CAR_COLORS: CarColorPreset[] = [
  { id: 'ferrari', name: 'Scuderia Red', teamName: 'Maranello Racing', primary: '#E10600', accent: '#FFE600', border: '#B30000', badgeBg: 'bg-red-500' },
  { id: 'mclaren', name: 'Papaya Orange', teamName: 'McLaren Apex', primary: '#FF8000', accent: '#00D2BE', border: '#D66A00', badgeBg: 'bg-amber-500' },
  { id: 'mercedes', name: 'Petronas Teal', teamName: 'Silver Arrow', primary: '#00A19B', accent: '#00D2BE', border: '#007A76', badgeBg: 'bg-teal-500' },
  { id: 'redbull', name: 'Cyber Navy Blue', teamName: 'Bull Velocity', primary: '#1E3A8A', accent: '#EF4444', border: '#172554', badgeBg: 'bg-blue-700' },
  { id: 'aston', name: 'Racing Green', teamName: 'British Speed', primary: '#047857', accent: '#A3E635', border: '#064E3B', badgeBg: 'bg-emerald-600' },
  { id: 'alpine', name: 'Electric Pink', teamName: 'Alpine Pulse', primary: '#DB2777', accent: '#3B82F6', border: '#9D174D', badgeBg: 'bg-pink-600' },
  { id: 'sauber', name: 'Neon Volt', teamName: 'Sauber Kinetic', primary: '#65A30D', accent: '#1E293B', border: '#4D7C0F', badgeBg: 'bg-lime-600' },
  { id: 'williams', name: 'Royal Blue', teamName: 'Grove Heritage', primary: '#2563EB', accent: '#60A5FA', border: '#1D4ED8', badgeBg: 'bg-blue-600' },
  { id: 'veloce', name: 'Violet Shift', teamName: 'Veloce Hyper', primary: '#7C3AED', accent: '#F43F5E', border: '#5B21B6', badgeBg: 'bg-purple-600' },
  { id: 'gold', name: 'Gold Turbine', teamName: 'Monaco GP', primary: '#D97706', accent: '#FDE047', border: '#B45309', badgeBg: 'bg-amber-600' },
];
