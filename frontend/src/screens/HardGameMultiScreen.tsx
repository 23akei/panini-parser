import React from 'react';
import Timer from '../components/Timer';
import GameControls from '../components/GameControls';
import QuestionDisplay from '../components/QuestionDisplay';
import PlayArea from '../components/PlayArea';
import RuleInputForm from '../components/RuleInputForm';
import DifficultySelector from '../components/DifficultySelector';
import HPDisplay from '../components/HPDisplay';
import type { PlayerProps } from '../types/interfaces';

interface HardGameMultiScreenProps {
  player1: PlayerProps;
  player2: PlayerProps;
}

const PlayerSection: React.FC<PlayerProps & { playerName: string }> = ({
  gameState,
  timer,
  hitPoints,
  currentQuestion,
  userRule,
  playerScore,
  difficulty,
  currentQuestionData,
  startGame,
  pauseGame,
  resetGame,
  handleRuleSubmit,
  setUserRule,
  changeDifficulty,
  playerName
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-center">{playerName}</h2>
      
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <div className="flex items-center space-x-2">
          <QuestionDisplay currentQuestion={currentQuestionData.from} />
          <GameControls
            gameState={gameState}
            onStart={startGame}
            onPause={pauseGame}
            onReset={resetGame}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Timer timer={timer} />
          <HPDisplay hitPoints={hitPoints} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <PlayArea
          currentQuestion={currentQuestion}
          currentQuestionData={currentQuestionData}
          playerScore={playerScore}
        />

        <RuleInputForm
          userRule={userRule}
          gameState={gameState}
          onRuleChange={setUserRule}
          onSubmit={handleRuleSubmit}
        />
      </div>

      <DifficultySelector
        difficulty={difficulty}
        onChangeDifficulty={changeDifficulty}
      />
    </div>
  );
};

const HardGameMultiScreen: React.FC<HardGameMultiScreenProps> = ({
  player1,
  player2
}) => {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sanskrit Grammar Game - Two Player Mode (Hard)
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', overflowX: 'auto' }}>
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection {...player1} playerName="Player 1" />
        </div>
        
        <div style={{ width: '50%', minWidth: '400px' }}>
          <PlayerSection {...player2} playerName="Player 2" />
        </div>
      </div>
    </div>
  );
};

export default HardGameMultiScreen;
