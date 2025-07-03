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

interface HardGameMultiScreenProps {
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
  playerName
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-center">{playerName}</h2>
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <div className="flex items-center space-x-4">
          <HPDisplay hitPoints={hitPoints} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* <PlayArea
          currentQuestion={currentQuestion}
          currentQuestionData={currentQuestionData}
          playerScore={playerScore}
        /> */}

        <RuleInputForm
          gameState={gameState}
          onRuleChange={setUserInput}
          onSubmit={(questions: Question[]) => handleRuleSubmit(questions)}
        />
      </div>
    </div>
  );
};

const HardGameMultiScreen: React.FC<HardGameMultiScreenProps> = ({
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
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sanskrit Grammar Game - Two Player Mode (Hard)
      </h1>
        <QuestionDisplay currentQuestion={questions[currentQuestionDataIndex]} />
        <GameControls
          gameState={gameState}
          onStart={startGame}
          onPause={pauseGame}
          onReset={resetGame}
        />
        <Timer timer={timer} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', overflowX: 'auto' }}>
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection 
            {...player1} 
            playerName="Player 1" 
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
          />
        </div>
        
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection 
            {...player2} 
            playerName="Player 2" 
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default HardGameMultiScreen;
