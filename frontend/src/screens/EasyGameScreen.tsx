import React from 'react';

interface Question {
  word: string;
  case: string;
  number: string;
  expected: string;
  rule: string;
}

interface EasyGameScreenProps {
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

const EasyGameScreen: React.FC<EasyGameScreenProps> = ({
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
  changeDifficulty
}) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Sanskrit Grammar Game - Easy Mode</h1>
      <div>
        <p>Time: {timer}</p>
        <p>HP: {hitPoints}</p>
        <p>Score: {playerScore}</p>
        <p>Difficulty: {difficulty}</p>
        <button onClick={changeDifficulty}>Change Difficulty</button>
      </div>
      <div>
        {gameState === 'stopped' ? (
          <button onClick={startGame}>Start Game</button>
        ) : gameState === 'playing' ? (
          <>
            <button onClick={pauseGame}>Pause</button>
            <button onClick={resetGame}>Reset</button>
          </>
        ) : (
          <>
            <button onClick={startGame}>Resume</button>
            <button onClick={resetGame}>Reset</button>
          </>
        )}
      </div>
      {gameState === 'playing' && currentQuestionData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Question: {currentQuestionData.word}</h2>
          <p>Case: {currentQuestionData.case}</p>
          <p>Number: {currentQuestionData.number}</p>
          <p>Expected Form: {currentQuestionData.expected}</p>
          <input
            type="text"
            value={userRule}
            onChange={e => setUserRule(e.target.value)}
            placeholder="Enter the rule"
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button onClick={handleRuleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default EasyGameScreen;
