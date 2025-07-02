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
import type { Question } from './types/interfaces';
import Timer from './components/Timer';
import GameControls from './components/GameControls';
import QuestionDisplay from './components/QuestionDisplay';
import PlayArea from './components/PlayArea';
import RuleInputForm from './components/RuleInputForm';
import DifficultySelector from './components/DifficultySelector';
import { useGameOperations, useGameStatus } from './hooks/useGame';
import type { StartGameResponse, GameStep } from './api/client';

const SanskritGrammarGame = () => {
  // Game state
  const [gameState, setGameState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [timer, setTimer] = useState(61);
  const [hitPoints, setHitPoints] = useState(MAXIMUM_HIT_POINTS);
  const [userRule, setUserRule] = useState('');

  // API hooks
  const { startGame: startGameMutation, submitAnswer, finishGame, isLoading, error } = useGameOperations();
  
  // API state
  const [currentGameData, setCurrentGameData] = useState<StartGameResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const {
    data: gameStatus
  } = useGameStatus(
    currentGameData?.game_id || null,
    gameState === 'playing'
  );

  // Timer effect
  const [playerScore, setPlayerScore] = useState(192);
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'modeSelect' | 'game' | 'results' | 'gameClear' | 'gameFailed'>('home');
  const [gameMode, setGameMode] = useState<'single' | 'multi'>('single');

  // プレイヤー2のステート (対戦モード用)
  const [gameState2, setGameState2] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [timer2, setTimer2] = useState(61);
  const [hitPoints2, setHitPoints2] = useState(MAXIMUM_HIT_POINTS);
  const [userRule2, setUserRule2] = useState('');
  const [playerScore2, setPlayerScore2] = useState(192);

  // Map UI difficulty to API difficulty
  const mapDifficultyToApiLevel = (difficulty: 'EASY' | 'HARD'): string => {
    return difficulty === 'EASY' ? 'beginner' : 'expert';
  };
  
  // 問題データを取得する関数
  const getQuestions = (): Question[] => {
    // 将来的には外部APIやサービスから取得する予定
    return [
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
    ];
  };

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentQuestion2, setCurrentQuestion2] = useState('');
  const [currentQuestionData, setCurrentQuestionData] = useState<Question>();
  const [currentQuestionData2, setCurrentQuestionData2] = useState<Question>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionIndex2, setCurrentQuestionIndex2] = useState(0);

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
    let interval: NodeJS.Timeout;
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

  const startLocalGame = () => {
    if (gameState === 'stopped') {
      resetGame();
    } else {
      const questions = getQuestions();
      const currentQ = questions[currentQuestionIndex];
      setCurrentQuestionData(currentQ);
      setCurrentQuestion(currentQ.from);
    }
    setGameState('playing');
  };

  // プレイヤー2用のゲーム開始
  const startGame2 = () => {
    if (gameState2 === 'stopped') {
      resetGame2();
    } else {
      const questions = getQuestions();
      const currentQ = questions[currentQuestionIndex2];
      setCurrentQuestionData2(currentQ);
      setCurrentQuestion2(currentQ.from);
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

  const handlePauseGame = () => {
    setGameState('paused');
  };

  const pauseGame2 = () => {
    setGameState2('paused');
  };
  
  const pauseGame = () => {
    setGameState('paused');
  };

  const resetGame = () => {
    setGameState('stopped');
    setTimer(61);
    setCurrentGameData(null);
    setCurrentStepIndex(0);
    setUserRule('');
    setCurrentQuestionIndex(0);
    setHitPoints(MAXIMUM_HIT_POINTS);
    const questions = getQuestions();
    const initialQ = questions[0];
    setCurrentQuestionData(initialQ);
  };

  // プレイヤー2用のリセット
  const resetGame2 = () => {
    setGameState2('stopped');
    setTimer2(61);
    setCurrentQuestion2('');
    setUserRule2('');
    setCurrentQuestionIndex2(0);
    setHitPoints2(MAXIMUM_HIT_POINTS);
    const questions = getQuestions();
    const initialQ = questions[0];
    setCurrentQuestionData2(initialQ);
  };

  const handleRuleSubmit = () => {
    console.log('Submitted rule:', userRule);
    const questions = getQuestions();
    const currentQ = questions[currentQuestionIndex];

    if (userRule.trim() === currentQ.hint) {
      setPlayerScore(prev => prev + 10);
      alert('正解！');
    } else {
      damageHP();
      alert(`不正解。正解は: ${currentQ.hint}`);
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQ = questions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestionData(nextQ);
      setCurrentQuestion(nextQ.from);
      setUserRule('');
    } else {
      handleGameWin(); // 全問題終了でゲームクリア
    }
  };

  // プレイヤー2用のルール提出処理
  const handleRuleSubmit2 = () => {
    console.log('Player 2 submitted rule:', userRule2);
    const questions = getQuestions();
    const currentQ = questions[currentQuestionIndex2];

    if (userRule2.trim() === currentQ.hint) {
      setPlayerScore2(prev => prev + 10);
      alert('Player 2: Correct!');
    } else {
      damageHP2();
      alert(`Player 2: Incorrect. The correct answer is: ${currentQ.hint}`);
    }

    if (currentQuestionIndex2 < questions.length - 1) {
      const nextIndex = currentQuestionIndex2 + 1;
      const nextQ = questions[nextIndex];
      setCurrentQuestionIndex2(nextIndex);
      setCurrentQuestionData2(nextQ);
      setCurrentQuestion2(nextQ.from);
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
      // Start API game
      const apiLevel = mapDifficultyToApiLevel(selectedDifficulty);
      startGameMutation.mutate({ level: apiLevel, length: 5 }, {
        onSuccess: (data) => {
          setCurrentGameData(data);
          setCurrentStepIndex(0);
          setGameState('playing');
        }
      });
    } else {
      // 対戦モードの場合は両方のプレイヤーをリセット
      resetGame();
      resetGame2();
      startLocalGame();
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
            currentQuestionData={currentQuestionData || { id: 0, from: '', to: '', hint: null }}
            startGame={startLocalGame}
            pauseGame={handlePauseGame}
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
            currentQuestionData={currentQuestionData || { id: 0, from: '', to: '', hint: null }}
            startGame={startLocalGame}
            pauseGame={handlePauseGame}
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
              currentQuestionData: currentQuestionData || { id: 0, from: '', to: '', hint: null },
              startGame: startLocalGame,
              pauseGame: handlePauseGame,
              resetGame,
              handleRuleSubmit,
              setUserRule,
              changeDifficulty,
              playerName: "Player 1"
            }}
            player2={{
              gameState: gameState2,
              timer: timer2,
              hitPoints: hitPoints2,
              currentQuestion: currentQuestion2,
              userRule: userRule2,
              playerScore: playerScore2,
              difficulty,
              currentQuestionData: currentQuestionData2 || { id: 0, from: '', to: '', hint: null },
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
              currentQuestionData: currentQuestionData || { id: 0, from: '', to: '', hint: null },
              startGame: startLocalGame,
              pauseGame: handlePauseGame,
              resetGame,
              handleRuleSubmit,
              setUserRule,
              changeDifficulty,
              playerName: "Player 1"
            }}
            player2={{
              gameState: gameState2,
              timer: timer2,
              hitPoints: hitPoints2,
              currentQuestion: currentQuestion2,
              userRule: userRule2,
              playerScore: playerScore2,
              difficulty,
              currentQuestionData: currentQuestionData2 || { id: 0, from: '', to: '', hint: null },
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