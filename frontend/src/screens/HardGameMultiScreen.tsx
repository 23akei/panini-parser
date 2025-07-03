import React from 'react';
import Timer from '../components/Timer';
import GameControls from '../components/GameControls';
import QuestionDisplay from '../components/QuestionDisplay';
import PlayArea from '../components/PlayArea';
import RuleInputForm from '../components/RuleInputForm';
import DifficultySelector from '../components/DifficultySelector';
import HPDisplay from '../components/HPDisplay';
import type { PlayerProps } from '../types/interfaces';
import type { Question } from '../types/interfaces';
import HintsPanel from '../components/HintsPanel';
import { ApiClient } from '../api/client';

// Sutra選択肢の型定義
interface SutraChoice {
  sutra: string;
  desc: string;
}

export type { SutraChoice };

// Sutra選択肢を表示するコンポーネント
const SutraChoicesComponent: React.FC<{
  choices: SutraChoice[];
  onSelect: (choice: SutraChoice) => void;
  disabled: boolean;
}> = ({ choices, onSelect, disabled }) => {
  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-semibold text-gray-700">Select rule:</h3>
      <div className="grid grid-cols-1 gap-2">
        {choices.map(choice => (
          <button
            key={choice.sutra}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors text-left"
          >
            {choice.sutra}
          </button>
        ))}
      </div>
    </div>
  );
};

interface HardGameMultiScreenProps {
  gameId: string; // 追加: ゲームID
  gameState: 'stopped' | 'playing' | 'paused';
  timer: number;
  questions: Question[];
  currentQuestionDataIndex: number;
  difficulty: 'EASY' | 'HARD';
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  player1: PlayerProps;
  player2: PlayerProps;
}

const PlayerSection: React.FC<PlayerProps> = ({
  gameState,
  hitPoints,
  playerScore,
  questions,
  currentQuestionDataIndex,
  setUserInput,
  handleRuleSubmit,
  selectRuleSubmit,
  playerName,
  gameId
}) => {
  // Sutraの選択肢を取得する関数
  const getChoices = async (): Promise<SutraChoice[]> => {
    // return [
    //   { sutra: "choice1", desc: "Sample rule: 1.1.1" },
    //   { sutra: "choice2", desc: "Sample rule: 2.1.1" },
    //   { sutra: "choice3", desc: "Sample rule: 3.1.1" },
    //   { sutra: "choice4", desc: "Sample rule: 4.1.1" },
    // ];
    return await ApiClient.getSutraChoices(gameId, currentQuestionDataIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center space-x-4">
          <HPDisplay hitPoints={hitPoints} />
      </div>
      <h2 className="text-xl font-bold mb-4 text-center">{playerName}</h2>
      <div className="flex justify-between items-center mb-4 border-b pb-3">
      </div>
      <QuestionDisplay currentQuestion={questions[currentQuestionDataIndex]} />
      <div className="grid grid-cols-1 gap-4 mb-4">
        <SutraChoicesComponent
          choices={getChoices()}
          onSelect={selectRuleSubmit}
          disabled={gameState !== 'playing'}
        />
      </div>
    </div>
  );
};

const HardGameMultiScreen: React.FC<HardGameMultiScreenProps> = ({
  gameId,
  gameState,
  timer,
  questions,
  currentQuestionDataIndex,
  difficulty,
  startGame,
  pauseGame,
  resetGame,
  player1,
  player2,
}) => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sanskrit Grammar Game - Two Player Mode (Hard)
      </h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', overflowX: 'auto' }}>
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection 
            {...player1} 
            playerName="Player 1" 
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
            gameId={gameId}
          />
        </div>
        
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection 
            {...player2} 
            playerName="Player 2" 
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
            gameId={gameId}
          />
        </div>
      </div>

    </div>
  );
};

export default HardGameMultiScreen;
