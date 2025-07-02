import React from 'react';
import type { GameScreenProps } from '../types/interfaces';

const EasyGameScreen: React.FC<GameScreenProps> = ({
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
