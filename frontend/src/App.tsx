import React, { useState, useEffect } from 'react';
import { MAXIMUM_HIT_POINTS } from './constants/appConstants';
import HardGameScreen from './screens/HardGameScreen';
import EasyGameScreen from './screens/EasyGameScreen';
import HardGameMultiScreen from './screens/HardGameMultiScreen';
import EasyGameMultiScreen from './screens/EasyGameMultiScreen';
import HomeScreen from './screens/HomeScreen';
import ModeSelectScreen from './screens/ModeSelectScreen';
import GameClearScreen from './screens/GameClearScreen';
import GameFailedScreen from './screens/GameFailedScreen';
import type Question from './types/interfaces';

const SanskritGrammarGame = () => {
  const [gameState, setGameState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [timer, setTimer] = useState(61);
  const [hitPoints, setHitPoints] = useState(MAXIMUM_HIT_POINTS);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userRule, setUserRule] = useState('');
  const [playerScore, setPlayerScore] = useState(192);
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'modeSelect' | 'game' | 'results' | 'gameClear' | 'gameFailed'>('home');
  const [gameMode, setGameMode] = useState<'single' | 'multi'>('single');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // プレイヤー2のステート (対戦モード用)
  const [gameState2, setGameState2] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [timer2, setTimer2] = useState(61);
  const [hitPoints2, setHitPoints2] = useState(MAXIMUM_HIT_POINTS);
  const [currentQuestion2, setCurrentQuestion2] = useState('');
  const [userRule2, setUserRule2] = useState('');
  const [playerScore2, setPlayerScore2] = useState(192);
  const [currentQuestionIndex2, setCurrentQuestionIndex2] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      from: 'word1',
      to: 'word2',
      hint: 'hint_1_to_2'
    },
    {
      id: 2,
      from: 'word2',
      to: 'word3',
      hint: 'hint_2_to_3'
    },
    {
      id: 3,
      from: 'word3',
      to: 'word4',
      hint: 'hint_3_to_4'
    },
    {
      id: 4,
      from: 'word4',
      to: 'word5',
      hint: 'hint_4_to_5'
    },
    {
      id: 5,
      from: 'word5',
      to: '',
      hint: 'hint_5_to_end'
    }
  ]

  const [currentQuestionData, setCurrentQuestionData] = useState<Question>(questions[0]);
  const [currentQuestionData2, setCurrentQuestionData2] = useState<Question>(questions[0]);

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

  // プレイヤー2用のタイマー処理
  useEffect(() => {
    if (gameMode === 'multi' && gameState2 === 'playing' && timer2 > 0) {
      const interval = setInterval(() => {
        setTimer2(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState2, timer2, gameMode]);

  const startGame = () => {
    if (gameState === 'stopped') {
      resetGame();
    } else {
      setCurrentQuestion(questions[currentQuestionIndex].word);
    }
    setGameState('playing');
  };

  // プレイヤー2用のゲーム開始
  const startGame2 = () => {
    if (gameState2 === 'stopped') {
      resetGame2();
    } else {
      setCurrentQuestion2(questions[currentQuestionIndex2].word);
    }
    setGameState2('playing');
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

  // プレイヤー2用のダメージ処理
  const damageHP2 = () => {
    if (hitPoints2 > 1) {
      setHitPoints2(prev => prev - 1);
    } else {
      setHitPoints2(0);
      setGameState2('stopped');
      // プレイヤー2のゲーム失敗処理
    }
  };

  const resetHP = () => {
    setHitPoints(MAXIMUM_HIT_POINTS);
  };

  const pauseGame = () => {
    setGameState('paused');
  };

    const pauseGame2 = () => {
    setGameState2('paused');
  };

  const resetGame = () => {
    setGameState('stopped');
    setTimer(61);
    setCurrentQuestion('');
    setUserRule('');
    setCurrentQuestionIndex(0);
    setHitPoints(MAXIMUM_HIT_POINTS);
  };

  // プレイヤー2用のリセット
  const resetGame2 = () => {
    setGameState2('stopped');
    setTimer2(61);
    setCurrentQuestion2('');
    setUserRule2('');
    setCurrentQuestionIndex2(0);
    setHitPoints2(MAXIMUM_HIT_POINTS);
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

  // プレイヤー2用のルール提出処理
  const handleRuleSubmit2 = () => {
    console.log('Player 2 submitted rule:', userRule2);

    const currentQ = questions[currentQuestionIndex2];
    if (userRule2.trim() === currentQ.rule) {
      setPlayerScore2(prev => prev + 10);
      alert('Player 2: Correct!');
    } else {
      damageHP2();
      alert(`Player 2: Incorrect. The correct answer is: ${currentQ.rule}`);
    }

    if (currentQuestionIndex2 < questions.length - 1) {
      setCurrentQuestionIndex2(prev => prev + 1);
      setCurrentQuestion2(questions[currentQuestionIndex2 + 1].word);
      setUserRule2('');
    } else {
      setGameState2('stopped');
      // プレイヤー2のゲーム終了処理
    }
  };

  const changeDifficulty = () => {
    const difficulties: ('EASY' | 'HARD')[] = ['EASY', 'HARD'];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  // プレイヤー2用の難易度変更
  const changeDifficulty2 = () => {
    // プレイヤー2の難易度は常にプレイヤー1と同じに設定
    // 個別に変更したい場合は、ここで別の処理を実装
  };

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setGameMode(mode);
    setCurrentScreen('modeSelect');
  };

  const handleDifficultySelect = (selectedDifficulty: 'EASY' | 'HARD') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('game');
    
    if (gameMode === 'single') {
      resetGame();
      startGame();
    } else {
      // 対戦モードの場合は両方のプレイヤーをリセット
      resetGame();
      resetGame2();
      startGame();
      startGame2();
    }
  };

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
      
      {currentScreen === 'game' && gameMode === 'single' && (
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
      
      {currentScreen === 'game' && gameMode === 'multi' && (
        difficulty === 'HARD' ? (
          <HardGameMultiScreen 
            player1={{
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
            }}
            player2={{
              gameState: gameState2,
              timer: timer2,
              hitPoints: hitPoints2,
              currentQuestion: currentQuestion2,
              userRule: userRule2,
              playerScore: playerScore2,
              difficulty,
              currentQuestionData: currentQuestionData2,
              startGame: startGame2,
              pauseGame: pauseGame2,
              resetGame: resetGame2,
              handleRuleSubmit: handleRuleSubmit2,
              setUserRule: setUserRule2,
              changeDifficulty: changeDifficulty2
            }}
          />
        ) : (
          <EasyGameMultiScreen 
            player1={{
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
            }}
            player2={{
              gameState: gameState2,
              timer: timer2,
              hitPoints: hitPoints2,
              currentQuestion: currentQuestion2,
              userRule: userRule2,
              playerScore: playerScore2,
              difficulty,
              currentQuestionData: currentQuestionData2,
              startGame: startGame2,
              pauseGame: pauseGame2,
              resetGame: resetGame2,
              handleRuleSubmit: handleRuleSubmit2,
              setUserRule: setUserRule2,
              changeDifficulty: changeDifficulty2
            }}
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