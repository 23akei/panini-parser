// 共通のインターフェース定義
import type { GameStep } from '../api/client';

// Use GameStep from OpenAPI instead of local Question interface
export type Question = GameStep;

export interface PlayAreaProps {
  currentQuestion: string;
  currentQuestionData: Question | undefined;
  playerScore: number;
  currentStep: number;
  score: number;
  currentStepNumber: number;
  totalSteps: number;
}

export interface GameScreenProps {
  gameState: 'stopped' | 'playing' | 'paused';
  timer: number;
  hitPoints: number;
  currentQuestion: string;
  userRule: string;
  playerScore: number;
  difficulty: 'EASY' | 'HARD';
  currentQuestionData: Question;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  handleRuleSubmit: () => void;
  setUserRule: (rule: string) => void;
  changeDifficulty: () => void;
}

export interface PlayerProps {
  gameState: 'stopped' | 'playing' | 'paused';
  hitPoints: number;
  playerScore: number;
  questions: Question[];
  currentQuestionDataIndex: number;
  setUserInput: (input: string) => void;
  handleRuleSubmit: (questions: Question[]) => void;
  playerName: string;
  gameId: string; // 追加: ゲームID
}
