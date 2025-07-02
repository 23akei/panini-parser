import React, { useState, useEffect } from 'react';
import { MAXIMUM_HIT_POINTS } from './constants/appConstants';
import { INIT_TIMER } from './constants/appConstants';
import { INIT_POINT } from './constants/appConstants';
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
  /**
   * ステート定義
   */
  // 共通ステート
  const [gameState, setGameState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
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
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'modeSelect' | 'game' | 'results' | 'gameClear' | 'gameFailed'>('home');
  const [gameMode, setGameMode] = useState<'single' | 'multi'>('single');
  const [timer, setTimer] = useState(INIT_TIMER);
  
  // 問題データのステート
  const [questions, setQuestions] = useState<Question[]>();
  // const [currentQuestionData, setCurrentQuestionData] = useState<Question>();
  const [currentQuestionDataIndex, setCurrentQuestionDataIndex] = useState(0);
  // プレイヤー1のステート
  const [hitPoints, setHitPoints] = useState(MAXIMUM_HIT_POINTS);
  const [playerScore, setPlayerScore] = useState(INIT_POINT);
  const [userInput, setUserInput] = useState<string>('');
  // プレイヤー2のステート (対戦モード用)
  const [hitPoints2, setHitPoints2] = useState(MAXIMUM_HIT_POINTS);
  const [playerScore2, setPlayerScore2] = useState(INIT_POINT);
  const [userInput2, setUserInput2] = useState<string>('');

  /**
   * 時間のカウントダウン処理
   */
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

  /**
   * 関数定義
   */
  // Map UI difficulty to API difficulty
  const mapDifficultyToApiLevel = (difficulty: 'EASY' | 'HARD'): string => {
    return difficulty === 'EASY' ? 'beginner' : 'expert';
  };

  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };
  
  // 問題データを取得する関数
  const getQuestions = (): Question[] => {
    // 将来的には外部APIやサービスから取得する予定
    return [
      {
        id: 1,
        from_word: 'word1',
        to_word: 'word2',
        hint: 'hint_1_to_2'
      },
      {
        id: 2,
        from_word: 'word2',
        to_word: 'word3',
        hint: 'hint_2_to_3'
      },
      {
        id: 3,
        from_word: 'word3',
        to_word: 'word4',
        hint: 'hint_3_to_4'
      },
      {
        id: 4,
        from_word: 'word4',
        to_word: 'word5',
        hint: 'hint_4_to_5'
      },
      {
        id: 5,
        from_word: 'word5',
        to_word: '',
        hint: 'hint_5_to_end'
      }
    ];
  };

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

  // ゲーム開始処理
  const startGame = () => {
    setQuestions(getQuestions());
    if (gameState === 'stopped') {
      resetGame();
    } else {
      const questions = getQuestions();
      //const currentQ = questions[currentQuestionDataIndex];
      //setCurrentQuestionData(currentQ);
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

  // プレイヤー2用のダメージ処理
  const damageHP2 = () => {
    if (hitPoints2 > 1) {
      setHitPoints2(prev => prev - 1);
    } else {
      setHitPoints2(0);
      // プレイヤー2のゲーム失敗処理
    }
  };

  const resetHP = () => {
    setHitPoints(MAXIMUM_HIT_POINTS);
  };

  const handlePauseGame = () => {
    setGameState('paused');
  };

  const resetGame = () => {
    // ゲームの状態をリセット
    setGameState('stopped');
    setTimer(INIT_TIMER);
    const questions = getQuestions();
    setQuestions(questions);
    setCurrentQuestionDataIndex(0);
    //const initialQ = questions[0];
    //setCurrentQuestionData(initialQ);
    // プレイヤー1用のリセット
    setHitPoints(MAXIMUM_HIT_POINTS);
    setPlayerScore(INIT_POINT);
    // プレイヤー2用のリセット
    setHitPoints2(MAXIMUM_HIT_POINTS);
    setPlayerScore2(INIT_POINT);
  };

  // プレイヤー1のルール入力処理
  const handleRuleSubmit = (_questionsParam: Question[]) => {
    // 常にstateのquestionsを使用する
    if (!questions || questions.length === 0) return;
    
    const currentQ = questions[currentQuestionDataIndex];
    
    // ルールが正解かどうかをチェック
    // 現在は正解のみ返す
    setPlayerScore(prev => prev + 10);
    alert('プレイヤー1: 正解！');

    damageHP2();

    if (currentQuestionDataIndex < questions.length - 1) {
      const nextIndex = currentQuestionDataIndex + 1;
      setCurrentQuestionDataIndex(nextIndex);
    } else {
      handleGameWin(); // 全問題終了でゲームクリア
    }
  };

  // プレイヤー2のルール入力処理
  const handleRuleSubmit2 = (_questionsParam: Question[]) => {
    // 常にstateのquestionsを使用する
    if (!questions || questions.length === 0) return;
    
    const currentQ = questions[currentQuestionDataIndex];
    
    // ルールが正解かどうかをチェック
    // 現在は正解のみ返す
    setPlayerScore2(prev => prev + 10);
    alert('プレイヤー2: 正解！');

    damageHP();

    if (currentQuestionDataIndex < questions.length - 1) {
      const nextIndex = currentQuestionDataIndex + 1;
      setCurrentQuestionDataIndex(nextIndex);
    } else {
      handleGameWin(); // 全問題終了でゲームクリア
    }
  };

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setGameMode(mode);
    setCurrentScreen('modeSelect');
  };

  const handleDifficultySelect = (selectedDifficulty: 'EASY' | 'HARD') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('game');
    resetGame();
    startGame();
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
          <p>Not implemented!!!</p>
        ) : (
          <p>Not implemented!!!</p>
        )
      )}

      {currentScreen === 'game' && gameMode === 'multi' && (
        difficulty === 'HARD' ? (
          <HardGameMultiScreen 
            gameState={gameState}
            timer={timer}
            questions={questions || []} /* nullチェック追加 */
            currentQuestionDataIndex={currentQuestionDataIndex}
            difficulty={difficulty}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            player1={{
              gameState: gameState,
              hitPoints: hitPoints,
              playerScore: playerScore,
              questions: questions || [], /* questions情報を追加 */
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput,
              handleRuleSubmit: handleRuleSubmit,
              playerName: "Player 1"
            }}
            player2={{
              gameState: gameState,
              hitPoints: hitPoints2,
              playerScore: playerScore2,
              questions: questions || [], /* questions情報を追加 */
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput2,
              handleRuleSubmit: handleRuleSubmit2,
              playerName: "Player 2"
            }}
          />
        ) : (
           <p>Not implemented!!!</p>
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