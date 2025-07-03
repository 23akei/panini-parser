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

// Sutra選択肢の型定義
interface SutraChoice {
  id: string;
  text: string;
}

// Sutra選択肢を表示するコンポーネント
const SutraChoicesComponent: React.FC<{
  choices: SutraChoice[];
  onSelect: (choice: SutraChoice) => void;
  disabled: boolean;
  
}> = ({ choices, onSelect, disabled }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 w-max mx-auto">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className={`text-4xl py-2 px-4 rounded-lg font-medium transition-colors text-center border-2
              bg-transparent text-white border-white
              hover:bg-[#00D1A8] hover:text-pink-500 hover:border-pink-500
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {choice.text}
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
  playerName,
  gameId
}) => {
  // Sutraの選択肢を取得する関数
  const getChoices = (): SutraChoice[] => {
    return [
      { id: "choice1", text: "1.1.1" },
      { id: "choice2", text: "2.1.1" },
      { id: "choice3", text: "3.1.1" },
      { id: "choice4", text: "4.1.1" },
    ];
  };

  return (
    <div className="h-screen rounded-lg p-4 border-[12px] border-pink-400 bg-[#001f3f]">
      <div className="rounded-lg p-4"></div>

      <h2 className="text-4xl font-bold mb-4 text-center">
        <span className="block min-w-[200px] max-w-[300px] mx-auto bg-white text-[#001f3f] border border-white rounded px-6 py-2 text-center">
          {playerName}
        </span>
      </h2>

      <div className="flex items-center justify-center space-x-4 w-full">
        <HPDisplay hitPoints={hitPoints} />
      </div>

      <div className="flex items-center justify-center space-x-4 w-full">
        <QuestionDisplay currentQuestion={questions[currentQuestionDataIndex]} />
      </div>

      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 gap-4 w-max">
          {/* <RuleInputForm
            gameState={gameState}
            onRuleChange={setUserInput}
            onSubmit={(questions: Question[]) => handleRuleSubmit(questions)}
          /> */}
          <SutraChoicesComponent
            choices={getChoices()}
            onSelect={(choice) => console.log(`Selected: ${choice.text}`)}
            disabled={gameState !== 'playing'}
          />
        </div>
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
  player2
}) => {
  return (
    <div className="h-screen flex bg-[#001f3f] p-4 gap-6 overflow-hidden">
      <div className="flex-1 h-full">
        <PlayerSection 
          {...player1}
          playerName="Player 1"
          questions={questions || []}
          currentQuestionDataIndex={currentQuestionDataIndex}
          gameId={gameId}
        />
      </div>

      <div className="flex-1">
        <PlayerSection 
          {...player2}
          playerName="Player 2"
          questions={questions || []}
          currentQuestionDataIndex={currentQuestionDataIndex}
          gameId={gameId}
        />
      </div>
    </div>

  );
};

export default HardGameMultiScreen;
