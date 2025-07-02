import React from 'react';

interface Question {
  word: string;
  case: string;
  number: string;
  expected: string;
  rule: string;
}

interface PlayerProps {
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

interface EasyGameMultiScreenProps {
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
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white', margin: '10px 0' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{playerName}</h2>
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
          <h3>Question: {currentQuestionData.word}</h3>
          <p>Case: {currentQuestionData.case}</p>
          <p>Number: {currentQuestionData.number}</p>
          <p>Expected Form: {currentQuestionData.expected}</p>
          <input
            type="text"
            value={userRule}
            onChange={e => setUserRule(e.target.value)}
            placeholder="Enter the rule"
            style={{ width: '100%', marginRight: '10px', marginBottom: '10px', padding: '5px' }}
          />
          <button onClick={handleRuleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

const EasyGameMultiScreen: React.FC<EasyGameMultiScreenProps> = ({
  player1,
  player2
}) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sanskrit Grammar Game - Two Player Mode (Easy)</h1>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', overflowX: 'auto' }}>
        <div style={{ flex: '1', minWidth: '480px' }}>
          <PlayerSection {...player1} playerName="Player 1" />
        </div>
        
        <div style={{ flex: '1', minWidth: '480px' }}>
          <PlayerSection {...player2} playerName="Player 2" />
        </div>
      </div>
    </div>
  );
};

export default EasyGameMultiScreen;
