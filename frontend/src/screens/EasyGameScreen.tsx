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
      <h1>サンスクリット文法ゲーム - Easy モード</h1>
      <div>
        <p>時間: {timer}</p>
        <p>HP: {hitPoints}</p>
        <p>スコア: {playerScore}</p>
        <p>難易度: {difficulty}</p>
        <button onClick={changeDifficulty}>難易度変更</button>
      </div>
      <div>
        {gameState === 'stopped' ? (
          <button onClick={startGame}>ゲーム開始</button>
        ) : gameState === 'playing' ? (
          <>
            <button onClick={pauseGame}>一時停止</button>
            <button onClick={resetGame}>リセット</button>
          </>
        ) : (
          <>
            <button onClick={startGame}>再開</button>
            <button onClick={resetGame}>リセット</button>
          </>
        )}
      </div>
      {gameState === 'playing' && currentQuestionData && (
        <div style={{ marginTop: '20px' }}>
          <h2>問題: {currentQuestionData.word}</h2>
          <p>格: {currentQuestionData.case}</p>
          <p>数: {currentQuestionData.number}</p>
          <p>予想形: {currentQuestionData.expected}</p>
          <input
            type="text"
            value={userRule}
            onChange={e => setUserRule(e.target.value)}
            placeholder="ルールを入力してください"
            style={{ width: '300px', marginRight: '10px' }}
          />
          <button onClick={handleRuleSubmit}>送信</button>
        </div>
      )}
    </div>
  );
};

export default EasyGameScreen;
