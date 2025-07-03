import React from 'react';
import { useState, useEffect, useMemo } from 'react';
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
  answer: boolean;
}

export type { SutraChoice };

// Sutra選択肢を表示するコンポーネント
const SutraChoicesComponent: React.FC<{
  choices: Promise<SutraChoice[]>;
  onSelect: (choice: SutraChoice) => void;
  disabled: boolean;
  
}> = ({ choices, onSelect, disabled }) => {
  const [choiceList, setChoiceList] = useState<SutraChoice[]>([]);

  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const result = await choices;
        setChoiceList(result);
      } catch (err) {
        console.error('Failed to fetch sutra choices:', err);
      }
  };
  fetchChoices();
}, [choices]);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 w-max mx-auto">
        {choiceList.map(choice => (
          <button
            key={choice.sutra}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className={`text-4xl py-2 px-4 rounded-lg font-medium transition-colors text-center border-2
              bg-transparent text-white border-white
              hover:bg-[#00D1A8] hover:text-pink-500 hover:border-pink-500
              disabled:opacity-50 disabled:cursor-not-allowed`}
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
  gameId,
  maxHitPoints
}) => {
  // Sutraの選択肢を取得する関数
  const choices = useMemo(() => {
    const getChoices = async (): Promise<SutraChoice[]> => {
      const result = (await ApiClient.getSutraChoices(gameId, currentQuestionDataIndex+1)).choices;
      return result.map(choice => ({
        sutra: choice.sutra,
        desc: choice.description,
        answer: choice.answer || false,
      }));
    };
    return getChoices();
  }, [gameId, currentQuestionDataIndex]);

  return (
    <div className="h-screen rounded-lg p-4 border-[12px] border-pink-400 bg-[#001f3f]">
      <div className="rounded-lg p-4"></div>

      <h2 className="text-4xl font-bold mb-4 text-center">
        <span className="block min-w-[200px] max-w-[300px] mx-auto bg-white text-[#001f3f] border border-white rounded px-6 py-2 text-center">
          {playerName}
        </span>
      </h2>

      <div className="flex items-center justify-center space-x-4 w-full">
        <HPDisplay hitPoints={hitPoints} maxHitPoints={maxHitPoints} />
      </div>

      <div className="flex items-center justify-center space-x-4 w-full">
        <QuestionDisplay currentQuestion={questions[currentQuestionDataIndex]} />
      </div>
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 gap-4 w-max">
          <SutraChoicesComponent
            choices={choices}
            onSelect={selectRuleSubmit}
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
  player2,
}) => {
  return (
    <div className="h-screen flex bg-[#001f3f] p-4 gap-6 overflow-hidden">
      <audio src="main.m4a" autoPlay loop id="myAudio"></audio>
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
