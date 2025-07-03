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
  choices: SutraChoice[];
  onSelect: (choice: SutraChoice) => void;
  disabled: boolean;
  onHover?: (index: number) => void;
  selectedIndex: number;
}

const SutraChoicesComponent = ({
  choices,
  onSelect,
  disabled,
  onHover,
  selectedIndex
}: SutraChoicesComponentProps) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 w-max mx-auto">
        {choices.map((choice: SutraChoice, idx: number) => (
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

interface PlayerSectionProps extends PlayerProps {
  gameId: string;
  maxHitPoints: number;
}

const PlayerSection = ({
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
}: PlayerSectionProps) => {

  // Sutraの選択肢を取得・管理
  const [choiceList, setChoiceList] = useState<SutraChoice[]>([]);
  useEffect(() => {
    let isMounted = true;
    const fetchChoices = async () => {
      try {
        const result = (await ApiClient.getSutraChoices(gameId, currentQuestionDataIndex + 1)).choices;
        const mapped = result.map(choice => ({
          sutra: choice.sutra,
          desc: choice.description,
          answer: choice.answer || false,
        }));
        if (isMounted) setChoiceList(mapped);
      } catch (err) {
        if (isMounted) setChoiceList([]);
        console.error('Failed to fetch sutra choices:', err);
      }
    };
    fetchChoices();
    return () => { isMounted = false; };
  }, [gameId, currentQuestionDataIndex]);

  // --- コントローラー入力対応 ---
  const { devices, markInputProcessed } = useGameInput();
  const isPlayer1 = playerName === 'Player 1';
  const device = isPlayer1 ? devices.player1 : devices.player2;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // コントローラー入力監視
  useEffect(() => {
    if (!device.lastInput || device.inputProcessed || gameState !== 'playing') return;
    if (choiceList.length === 0) return;
    // 方向入力で選択肢移動
    if (device.lastInput.direction === 'right' || device.lastInput.direction === 'down') {
      setSelectedIndex(selectedIndex => (selectedIndex + 1) % choiceList.length);
      markInputProcessed && markInputProcessed(isPlayer1 ? 1 : 2);
    } else if (device.lastInput.direction === 'left' || device.lastInput.direction === 'up') {
      setSelectedIndex(selectedIndex => (selectedIndex - 1 + choiceList.length) % choiceList.length);
      markInputProcessed && markInputProcessed(isPlayer1 ? 1 : 2);
    } else if (device.lastInput.button === 'a') {
      // 'a'ボタンでsubmit
      selectRuleSubmit(choiceList[selectedIndex]);
      markInputProcessed && markInputProcessed(isPlayer1 ? 1 : 2);
    }
  }, [device.lastInput, device.inputProcessed, gameState, choiceList, selectRuleSubmit, markInputProcessed, isPlayer1, selectedIndex]);

  // 問題が変わったら選択肢リセット
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
            choices={choiceList}
            onSelect={selectRuleSubmit}
            disabled={gameState !== 'playing'}
            selectedIndex={selectedIndex}
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
