import React from 'react';
import Timer from '../components/Timer';
import GameControls from '../components/GameControls';
import QuestionDisplay from '../components/QuestionDisplay';
import PlayArea from '../components/PlayArea';
import RuleInputForm from '../components/RuleInputForm';
import DifficultySelector from '../components/DifficultySelector';
import HPDisplay from '../components/HPDisplay';
import type { GameScreenProps } from '../types/interfaces';

const HardGameScreen: React.FC<GameScreenProps> = ({
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
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center space-x-4">
            <QuestionDisplay currentQuestion={currentQuestion} />
            <GameControls
              gameState={gameState}
              onStart={startGame}
              onPause={pauseGame}
              onReset={resetGame}
            />
          </div>
          <Timer timer={timer} />
          <HPDisplay hitPoints={hitPoints} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PlayArea
            currentQuestion={currentQuestion}
            currentQuestionData={currentQuestionData}
            playerScore={playerScore}
            currentStep={1}
            score={playerScore}
            currentStepNumber={1}
            totalSteps={5}
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
    </div>
  );
};

export default HardGameScreen;

