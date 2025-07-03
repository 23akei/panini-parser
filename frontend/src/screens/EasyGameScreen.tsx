import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import QuestionDisplay from '../components/QuestionDisplay';
import HPDisplay from '../components/HPDisplay';
import type { PlayerProps } from '../types/interfaces';
import type { Question } from '../types/interfaces';
import { ApiClient } from '../api/client';
import { useGameInput } from '../contexts/GameInputContext';

// Sutra選択肢の型定義
interface SutraChoice {
  sutra: string;
  desc: string;
  answer: boolean;
}

export type { SutraChoice };

// Sutra選択肢を表示するコンポーネント
interface SutraChoicesComponentProps {
  choices: Promise<SutraChoice[]>;
  onSelect: (choice: SutraChoice) => void;
  disabled: boolean;
  onHover?: (index: number) => void;
  selectedIndex: number;
}

const SutraChoicesComponent: React.FC<SutraChoicesComponentProps> = ({ 
  choices, 
  onSelect, 
  disabled, 
  onHover, 
  selectedIndex 
}) => {
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
        {choiceList.map((choice, idx) => (
          <button
            key={choice.sutra}
            onClick={() => onSelect(choice)}
            onMouseOver={() => onHover && onHover(idx)}
            disabled={disabled}
            className={`
              text-4xl py-2 px-4 rounded-lg font-medium transition-colors text-center border-2
              ${selectedIndex === idx
                ? 'bg-[#00D1A8] text-pink-500 border-pink-500'
                : 'bg-transparent text-white border-white'}
              hover:bg-[#00D1A8] hover:text-pink-500 hover:border-pink-500
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {choice.sutra}
          </button>
        ))}
      </div>
    </div>
  );
};

interface EasyGameScreenProps {
  gameId: string;
  gameState: 'stopped' | 'playing' | 'paused';
  timer: number;
  questions: Question[];
  currentQuestionDataIndex: number;
  difficulty: 'EASY' | 'HARD';
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  player: PlayerProps;
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

  // Controller integration for single player
  const { devices, markInputProcessed } = useGameInput();
  const device = devices.player1; // Single player uses player1 device
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [choiceList, setChoiceList] = useState<SutraChoice[]>([]);

  // Load choices for controller navigation
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

  // Controller input monitoring
  useEffect(() => {
    if (!device.lastInput || device.inputProcessed || gameState !== 'playing') return;
    if (choiceList.length === 0) return;

    let answerIndex = choiceList.findIndex(choice => choice.answer);
    let nextAnswerIndex = answerIndex > selectedIndex ? selectedIndex + 1 : (answerIndex < selectedIndex ? selectedIndex - 1 : answerIndex);

    // Navigation with directional input
    if (device.lastInput.direction === 'right') {
      setSelectedIndex(device.isToggled ? nextAnswerIndex : (selectedIndex + 1) % choiceList.length);
      markInputProcessed && markInputProcessed(1);
    } else if (device.lastInput.direction === 'left') {
      setSelectedIndex(device.isToggled ? nextAnswerIndex : (selectedIndex - 1 + choiceList.length) % choiceList.length);
      markInputProcessed && markInputProcessed(1);
    } else if (device.lastInput.button === 'b') {
      // Submit selection
      selectRuleSubmit(choiceList[selectedIndex]);
      markInputProcessed && markInputProcessed(1);
    }
  }, [device.lastInput, device.inputProcessed, gameState, choiceList, selectRuleSubmit, markInputProcessed, selectedIndex]);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [currentQuestionDataIndex, gameId]);

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
            onHover={(idx: number) => setSelectedIndex(idx)}
            disabled={gameState !== 'playing'}
            selectedIndex={selectedIndex}
          />
        </div>
      </div>
    </div>
  );
};

const EasyGameScreen: React.FC<EasyGameScreenProps> = ({
  gameId,
  gameState,
  timer,
  questions,
  currentQuestionDataIndex,
  difficulty,
  startGame,
  pauseGame,
  resetGame,
  player,
}) => {
  return (
    <div className="h-screen flex bg-[#001f3f] p-4 gap-6 overflow-hidden justify-center">
      <audio src="main.m4a" autoPlay loop id="myAudio"></audio>
      <div className="flex-1 h-full max-w-[50%]">
        <PlayerSection 
          {...player}
          playerName="Player"
          questions={questions || []}
          currentQuestionDataIndex={currentQuestionDataIndex}
          gameId={gameId}
        />
      </div>
    </div>
  );
};

export default EasyGameScreen;