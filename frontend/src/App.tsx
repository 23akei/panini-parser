import React, { useState, useEffect } from 'react';
import { MAXIMUM_HIT_POINTS } from './constants/appConstants';
import HardGameScreen from './screens/HardGameScreen';
import EasyGameScreen from './screens/EasyGameScreen';
import HomeScreen from './screens/HomeScreen';
import ModeSelectScreen from './screens/ModeSelectScreen';
import GameClearScreen from './screens/GameClearScreen';
import GameFailedScreen from './screens/GameFailedScreen';

interface Question {
  word: string;
  case: string;
  number: string;
  expected: string;
  rule: string;
}

const SanskritGrammarGame = () => {
  const [gameState, setGameState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [timer, setTimer] = useState(61);
  const [hitPoints, setHitPoints] = useState(MAXIMUM_HIT_POINTS);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userRule, setUserRule] = useState('');
  const [playerScore, setPlayerScore] = useState(192);
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'modeSelect' | 'game' | 'results' | 'gameClear' | 'gameFailed'>('home');
  const [gameMode, setGameMode] = useState<'single'>('single');

  const questions: Question[] = [
    {
      word: 'राम',
      case: '主格',
      number: '単数',
      expected: 'रामः',
      rule: 'अकारान्त पुल्लिङ्ग प्रथमा एकवचन'
    },
    {
      word: 'देव',
      case: '対格',
      number: '複数',
      expected: 'देवान्',
      rule: 'अकारान्त पुल्लिङ्ग द्वितीया बहुवचन'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ホーム画面に戻る関数
  const returnToHome = () => {
    setCurrentScreen('home');
    resetGame();
  };

  // ゲームクリア処理
  const handleGameWin = () => {
    setGameState('stopped');
    setCurrentScreen('gameClear');
  };

  // ゲーム失敗処理
  const handleGameFail = () => {
    setGameState('stopped');
    setCurrentScreen('gameFailed');
  };

  useEffect(() => {
    let interval: number;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameState === 'playing') {
      setGameState('stopped');
      handleGameFail(); // 時間切れでゲーム失敗
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const startGame = () => {
    if (gameState === 'stopped') {
      resetGame();
    } else {
      setCurrentQuestion(questions[currentQuestionIndex].word);
    }
    setGameState('playing');
  };

  const healHP = () => {
    if (hitPoints < MAXIMUM_HIT_POINTS) {
      setHitPoints(prev => prev + 1);
    } else {
      alert('HPは最大値です！');
    }
  };

  // ダメージ処理の修正
  const damageHP = () => {
    if (hitPoints > 1) {
      setHitPoints(prev => prev - 1);
    } else {
      setHitPoints(0);
      handleGameFail(); // HPがなくなるとゲーム失敗
    }
  };

  const resetHP = () => {
    setHitPoints(MAXIMUM_HIT_POINTS);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resetGame = () => {
    setGameState('stopped');
    setTimer(61);
    setCurrentQuestion('');
    setUserRule('');
    setCurrentQuestionIndex(0);
    setHitPoints(MAXIMUM_HIT_POINTS);
  };

  const handleRuleSubmit = () => {
    console.log('Submitted rule:', userRule);

    const currentQ = questions[currentQuestionIndex];
    if (userRule.trim() === currentQ.rule) {
      setPlayerScore(prev => prev + 10);
      alert('正解！');
    } else {
      damageHP();
      alert(`不正解。正解は: ${currentQ.rule}`);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1].word);
      setUserRule('');
    } else {
      handleGameWin(); // 全問題終了でゲームクリア
    }
  };

  const changeDifficulty = () => {
    const difficulties: ('EASY' | 'HARD')[] = ['EASY', 'HARD'];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  const handleModeSelect = (mode: 'single') => {
    setGameMode(mode);
    setCurrentScreen('modeSelect');
  };

  const handleDifficultySelect = (selectedDifficulty: 'EASY' | 'HARD') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('game');
    resetGame();
    startGame();
  };

  const currentQuestionData = questions[currentQuestionIndex];

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen onSelectMode={handleModeSelect} />
      )}
      
      {currentScreen === 'modeSelect' && (
        <ModeSelectScreen 
          gameMode={gameMode} 
          onSelectDifficulty={handleDifficultySelect} 
        />
      )}
      
      {currentScreen === 'game' && (
        difficulty === 'HARD' ? (
          <HardGameScreen 
            gameState={gameState}
            timer={timer}
            hitPoints={hitPoints}
            currentQuestion={currentQuestion}
            userRule={userRule}
            playerScore={playerScore}
            difficulty={difficulty}
            currentQuestionData={currentQuestionData}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            handleRuleSubmit={handleRuleSubmit}
            setUserRule={setUserRule}
            changeDifficulty={changeDifficulty}
          />
        ) : (
          <EasyGameScreen 
            gameState={gameState}
            timer={timer}
            hitPoints={hitPoints}
            currentQuestion={currentQuestion}
            userRule={userRule}
            playerScore={playerScore}
            difficulty={difficulty}
            currentQuestionData={currentQuestionData}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            handleRuleSubmit={handleRuleSubmit}
            setUserRule={setUserRule}
            changeDifficulty={changeDifficulty}
          />
        )
      )}
      
      {currentScreen === 'gameClear' && (
        <GameClearScreen 
          playerScore={playerScore}
          onReturnHome={returnToHome}
        />
      )}
      
      {currentScreen === 'gameFailed' && (
        <GameFailedScreen
          playerScore={playerScore}
          onReturnHome={returnToHome}
        />
      )}
      
      {currentScreen === 'results' && (
        <div>Results not implemented!</div>
      )}
    </>
  );
};

export default SanskritGrammarGame;