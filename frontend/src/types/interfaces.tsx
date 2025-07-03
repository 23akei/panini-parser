// 共通のインターフェース定義
import type { GameStep } from '../api/client';
import type { SutraChoice } from '../screens/HardGameMultiScreen';

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
  currentQuestion?: Question;
  userRule: string;
  playerScore: number;
  difficulty: 'EASY' | 'HARD';
  currentQuestionData?: Question;
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
  selectRuleSubmit: (choice: SutraChoice) => void; // ルール選択のサブミット関数
  playerName: string;
  gameId: string; // 追加: ゲームID
}
