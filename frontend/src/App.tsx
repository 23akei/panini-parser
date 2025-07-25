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
import ConnectControllerScreen from './screens/ConnectControllerScreen';
import GameClearScreen from './screens/GameClearScreen';
import GameFailedScreen from './screens/GameFailedScreen';
import type { Question } from './types/interfaces';
import Timer from './components/Timer';
import GameControls from './components/GameControls';
import QuestionDisplay from './components/QuestionDisplay';
import PlayArea from './components/PlayArea';
import RuleInputForm from './components/RuleInputForm';
import DifficultySelector from './components/DifficultySelector';
import AnswerFeedback from './components/AnswerFeedback';
import GameEndEffects from './components/GameEndEffects';
import HPChangeEffect from './components/HPChangeEffect';
import { useGameOperations, useGameStatus } from './hooks/useGame';
import { type StartGameResponse, type GameStep, ApiClient } from './api/client';
import { mapStepsToQuestions } from './mapper/mapper';
import type { SutraChoice } from './screens/HardGameMultiScreen';
import { GameInputProvider } from './contexts/GameInputContext';
import ConnectControllerScreenSingle from './screens/ConnectControllerScreenSingle';

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
  const [currentScreen, setCurrentScreen] = useState<'home' | 'modeSelect' | 'connectController' | 'connectControllerSingle' | 'game' | 'results' | 'gameClear' | 'gameClear2' | 'gameFailed'>('home');
  const [gameMode, setGameMode] = useState<'single' | 'multi'>('single');
  const [timer, setTimer] = useState(INIT_TIMER);

  // 問題データのステート
  const [questions, setQuestions] = useState<Question[]>();
  const [gameId, setGameId] = useState<string>('');
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
  // Dynamic max hit points based on game step length
  const [maxHitPoints, setMaxHitPoints] = useState(MAXIMUM_HIT_POINTS);

  // Effect states for visual and audio feedback
  const [answerFeedback1, setAnswerFeedback1] = useState<{ isVisible: boolean; isCorrect: boolean }>({
    isVisible: false,
    isCorrect: false
  });
  const [answerFeedback2, setAnswerFeedback2] = useState<{ isVisible: boolean; isCorrect: boolean }>({
    isVisible: false,
    isCorrect: false
  });
  const [gameEndEffect1, setGameEndEffect1] = useState<{ isVisible: boolean; isVictory: boolean }>({
    isVisible: false,
    isVictory: false
  });
  const [gameEndEffect2, setGameEndEffect2] = useState<{ isVisible: boolean; isVictory: boolean }>({
    isVisible: false,
    isVictory: false
  });
  const [hpChangeEffect1, setHpChangeEffect1] = useState<{ isVisible: boolean; isDamage: boolean }>({
    isVisible: false,
    isDamage: false
  });
  const [hpChangeEffect2, setHpChangeEffect2] = useState<{ isVisible: boolean; isDamage: boolean }>({
    isVisible: false,
    isDamage: false
  });

  /**
   * 関数定義
   */
  // Map UI difficulty to API difficulty
  const mapDifficultyToApiLevel = (difficulty: 'EASY' | 'HARD'): string => {
    return difficulty === 'EASY' ? 'beginner' : 'expert';
  };

  // Calculate maximum hit points based on game step length
  const calculateMaxHitPoints = (gameStepLength: number): number => {
    // Set max hit points to be proportional to game length
    // For balance: fewer steps = fewer lives, more steps = more lives
    return Math.max(2, Math.floor(gameStepLength * 0.6)); // At least 2 lives, scales with game length
  };

  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  // 問題データを取得する関数
  const getQuestions = async (): Promise<{ value1: Question[]; value2: string }> => {
    const apiLevel = mapDifficultyToApiLevel(difficulty);
    // Set game length (configurable based on difficulty or user preference)
    const gameLength = 5; // Default game length
    const startGameResult = await ApiClient.startGame(apiLevel, gameLength)
    return {
      value1: mapStepsToQuestions(startGameResult),
      value2: startGameResult.game_id // APIから取得したゲームIDを使用
    }
  };

  // ホーム画面に戻る関数
  const returnToHome = () => {
    setCurrentScreen('home');
    resetGame();
  };

  // Helper functions for effects
  const showAnswerFeedback1 = (isCorrect: boolean) => {
    setAnswerFeedback1({ isVisible: true, isCorrect });
  };

  const hideAnswerFeedback1 = () => {
    setAnswerFeedback1({ isVisible: false, isCorrect: false });
  };

  const showAnswerFeedback2 = (isCorrect: boolean) => {
    setAnswerFeedback2({ isVisible: true, isCorrect });
  };

  const hideAnswerFeedback2 = () => {
    setAnswerFeedback2({ isVisible: false, isCorrect: false });
  };

  const showGameEndEffect1 = (isVictory: boolean) => {
    setGameEndEffect1({ isVisible: true, isVictory });
  };

  const hideGameEndEffect1 = () => {
    setGameEndEffect1({ isVisible: false, isVictory: false });
  };

  const showGameEndEffect2 = (isVictory: boolean) => {
    setGameEndEffect2({ isVisible: true, isVictory });
  };

  const hideGameEndEffect2 = () => {
    setGameEndEffect2({ isVisible: false, isVictory: false });
  };

  const showHpChangeEffect1 = (isDamage: boolean) => {
    // Reset first, then show after a small delay to ensure fresh state
    setHpChangeEffect1({ isVisible: false, isDamage: false });
    setTimeout(() => {
      setHpChangeEffect1({ isVisible: true, isDamage });
    }, 50);
  };

  const hideHpChangeEffect1 = () => {
    setHpChangeEffect1({ isVisible: false, isDamage: false });
  };

  const showHpChangeEffect2 = (isDamage: boolean) => {
    // Reset first, then show after a small delay to ensure fresh state
    setHpChangeEffect2({ isVisible: false, isDamage: false });
    setTimeout(() => {
      setHpChangeEffect2({ isVisible: true, isDamage });
    }, 50);
  };

  const hideHpChangeEffect2 = () => {
    setHpChangeEffect2({ isVisible: false, isDamage: false });
  };

  // ゲームクリア処理
  const handleGameWin = () => {
    showGameEndEffect1(true);
    setTimeout(() => {
      setGameState('stopped');
      setCurrentScreen('gameClear');
    }, 3000);
  };

    // ゲームクリア処理
  const handleGameWin2 = () => {
    showGameEndEffect2(true);
    setTimeout(() => {
      setGameState('stopped');
      setCurrentScreen('gameClear2');
    }, 3000);
  };

  const handleGameFail = () => {
    setGameState('stopped');
    setCurrentScreen('gameFailed');
  };

  // ゲーム開始処理
  const startGame = () => {
    // setQuestions(getQuestions());
    if (gameState === 'stopped') {
      resetGame();
    }
    setGameState('playing');
  };

  const healHP = () => {
    if (hitPoints < maxHitPoints) {
      setHitPoints(prev => prev + 1);
      showHpChangeEffect1(false); // Show heal effect
    } else {
      alert('HP is at maximum!');
    }
  };

  // プレイヤー1のダメージ処理
  const damageHP = () => {
    if (hitPoints > 1) {
      setHitPoints(prev => prev - 1);
      showHpChangeEffect1(true); // Show damage effect
    } else {
      setHitPoints(0);
      showHpChangeEffect1(true); // Show damage effect
      showGameEndEffect1(false); // Show defeat effect for Player 1
      setTimeout(() => {
        handleGameWin2(); // HPがなくなるとゲーム失敗
      }, 3000);
    }
  };

  // プレイヤー2用のダメージ処理
  const damageHP2 = () => {
    if (hitPoints2 > 1) {
      setHitPoints2(prev => prev - 1);
      showHpChangeEffect2(true); // Show damage effect
    } else {
      // プレイヤー2のゲーム失敗処理
      setHitPoints2(0);
      showHpChangeEffect2(true); // Show damage effect
      showGameEndEffect2(false); // Show defeat effect for Player 2
      setTimeout(() => {
        handleGameWin(); // HPがなくなるとゲーム失敗
      }, 3000);
    }
  };

  const singleDamageHP = () => {
    if (hitPoints > 1) {
      setHitPoints(prev => prev - 1);
      showHpChangeEffect1(true); // Show damage effect
    } else {
      setHitPoints(0);
      showHpChangeEffect1(true); // Show damage effect
      handleGameFail(); // HPがなくなるとゲーム失敗
    }
  }

  const resetHP = () => {
    setHitPoints(maxHitPoints);
  };

  const handlePauseGame = () => {
    setGameState('paused');
  };

  const resetGame = async () => {
    // ゲームの状態をリセット
    setGameState('stopped');
    setTimer(INIT_TIMER);
    const result = await getQuestions();
    setQuestions(result.value1);
    setGameId(result.value2);
    setCurrentQuestionDataIndex(0);

    // Calculate max hit points based on game step length
    // const gameStepLength = result.value1.length;
    // const calculatedMaxHitPoints = calculateMaxHitPoints(gameStepLength);
    // setMaxHitPoints(calculatedMaxHitPoints);

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
    alert('Player 1: Correct!');

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
    alert('Player 2: Correct!');

    damageHP();

    if (currentQuestionDataIndex < questions.length - 1) {
      const nextIndex = currentQuestionDataIndex + 1;
      setCurrentQuestionDataIndex(nextIndex);
    } else {
      handleGameWin(); // 全問題終了でゲームクリア
    }
  };

  const selectRuleSubmit = async (choice: SutraChoice) => {
    const result = await ApiClient.submitAnswer(gameId, currentQuestionDataIndex + 1, { sutra: choice.sutra })

    // Show answer feedback for Player 1
    showAnswerFeedback1(result.correct);

    // Continue immediately without waiting for feedback
    if (result.correct === true) {
      damageHP2();
      if (!result.next_step_id) {
        handleGameWin();
      }
      setCurrentQuestionDataIndex(prev => prev + 1); // 次のステップに進む
    } else {
      damageHP();
    }
  }

  const selectRuleSubmit2 = async (choice: SutraChoice) => {
    const result = await ApiClient.submitAnswer(gameId, currentQuestionDataIndex + 1, { sutra: choice.sutra })

    // Show answer feedback for Player 2
    showAnswerFeedback2(result.correct);

    // Continue immediately without waiting for feedback
    if (result.correct === true) {
      damageHP();
      if (!result.next_step_id) {
        handleGameWin2();
      }
      setCurrentQuestionDataIndex(prev => prev + 1); // 次のステップに進む
    } else {
      damageHP2();
    }
  }

  const selectRuleSubmitSinglePlay = async (choice: SutraChoice) => {
    const result = await ApiClient.submitAnswer(gameId, currentQuestionDataIndex + 1, { sutra: choice.sutra })
    
    // Show answer feedback for single player
    showAnswerFeedback1(result.correct);
    
    if (result.correct === true) {
      if (!result.next_step_id) {
        handleGameWin();
      }
      setCurrentQuestionDataIndex(prev => prev + 1); // 次のステップに進む
    } else {
      singleDamageHP(); // プレイヤー1のHPを減らす
    }
  }

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setGameMode(mode);
    setCurrentScreen('modeSelect');
  };

  const handleDifficultySelect = (selectedDifficulty: 'EASY' | 'HARD') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('connectController'); // ConnectController画面に遷移
  };

  const handleDifficultySelectSingle = (selectedDifficulty: 'EASY' | 'HARD') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('connectControllerSingle'); // ConnectController画面に遷移
  };

  const handleConnectComplete = async () => {
    setCurrentScreen('game');
    await resetGame();
    startGame();
  };

  return (
    <GameInputProvider>
        {currentScreen === 'home' && (
          <HomeScreen onSelectMode={handleModeSelect} />
        )}

        {currentScreen === 'modeSelect' && gameMode === 'single' && (
          <ModeSelectScreen
            gameMode={gameMode}
            onSelectDifficulty={handleDifficultySelectSingle}
          />
        )}

        {currentScreen === 'modeSelect' && gameMode === 'multi' && (
          <ModeSelectScreen
            gameMode={gameMode}
            onSelectDifficulty={handleDifficultySelect}
          />
        )}

        {currentScreen === 'connectController' && (
          <ConnectControllerScreen
            onConnectComplete={handleConnectComplete}
          />
        )}

        {currentScreen === 'connectControllerSingle' && (
          <ConnectControllerScreenSingle
            onConnectComplete={handleConnectComplete}
          />
        )}

      {currentScreen === 'game' && gameMode === 'single' && (
        difficulty === 'HARD' ? (
          <HardGameScreen
            gameId={gameId}
            gameState={gameState}
            timer={timer}
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
            difficulty={difficulty}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            player={{
              gameState: gameState,
              hitPoints: hitPoints,
              playerScore: playerScore,
              questions: questions || [],
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput,
              handleRuleSubmit: handleRuleSubmit,
              playerName: "Player",
              selectRuleSubmit: selectRuleSubmitSinglePlay,
              gameId: gameId,
              maxHitPoints: maxHitPoints
            }}
          />
        ) : (
          <EasyGameScreen
            gameId={gameId}
            gameState={gameState}
            timer={timer}
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
            difficulty={difficulty}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            player={{
              gameState: gameState,
              hitPoints: hitPoints,
              playerScore: playerScore,
              questions: questions || [],
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput,
              handleRuleSubmit: handleRuleSubmit,
              playerName: "Player",
              selectRuleSubmit: selectRuleSubmitSinglePlay,
              gameId: gameId,
              maxHitPoints: maxHitPoints
            }}
          />
        )
      )}

      {currentScreen === 'game' && gameMode === 'multi' && (
        difficulty === 'HARD' ? (
          <HardGameMultiScreen
            gameId={gameId}
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
              playerName: "Player 1",
              selectRuleSubmit: selectRuleSubmit,
              gameId: gameId, /* gameIdを追加 */
              maxHitPoints: maxHitPoints
            }}
            player2={{
              gameState: gameState,
              hitPoints: hitPoints2,
              playerScore: playerScore2,
              questions: questions || [], /* questions情報を追加 */
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput2,
              handleRuleSubmit: handleRuleSubmit2,
              playerName: "Player 2",
              selectRuleSubmit: selectRuleSubmit2,
              gameId: gameId, /* gameIdを追加 */
              maxHitPoints: maxHitPoints
            }}
          />
        ) : (
          <EasyGameMultiScreen
            gameId={gameId}
            gameState={gameState}
            timer={timer}
            questions={questions || []}
            currentQuestionDataIndex={currentQuestionDataIndex}
            difficulty={difficulty}
            startGame={startGame}
            pauseGame={pauseGame}
            resetGame={resetGame}
            player1={{
              gameState: gameState,
              hitPoints: hitPoints,
              playerScore: playerScore,
              questions: questions || [],
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput,
              handleRuleSubmit: handleRuleSubmit,
              playerName: "Player 1",
              selectRuleSubmit: selectRuleSubmit,
              gameId: gameId,
              maxHitPoints: maxHitPoints
            }}
            player2={{
              gameState: gameState,
              hitPoints: hitPoints2,
              playerScore: playerScore2,
              questions: questions || [],
              currentQuestionDataIndex: currentQuestionDataIndex,
              setUserInput: setUserInput2,
              handleRuleSubmit: handleRuleSubmit2,
              playerName: "Player 2",
              selectRuleSubmit: selectRuleSubmit2,
              gameId: gameId,
              maxHitPoints: maxHitPoints
            }}
          />
        )
      )}

        {currentScreen === 'gameClear' && (
          <GameClearScreen
            playerName="Player 1"
            onReturnHome={returnToHome}
          />
        )}

        {currentScreen === 'gameClear2' && (
          <GameClearScreen
            playerName="Player 2"
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

        {/* Effect Components */}
        <AnswerFeedback
          isVisible={answerFeedback1.isVisible}
          isCorrect={answerFeedback1.isCorrect}
          onComplete={hideAnswerFeedback1}
          playerId={1}
        />
        
        <AnswerFeedback
          isVisible={answerFeedback2.isVisible}
          isCorrect={answerFeedback2.isCorrect}
          onComplete={hideAnswerFeedback2}
          playerId={2}
        />

        <GameEndEffects
          isVisible={gameEndEffect1.isVisible}
          isVictory={gameEndEffect1.isVictory}
          onComplete={hideGameEndEffect1}
          playerId={1}
        />
        
        <GameEndEffects
          isVisible={gameEndEffect2.isVisible}
          isVictory={gameEndEffect2.isVictory}
          onComplete={hideGameEndEffect2}
          playerId={2}
        />

        <HPChangeEffect
          isVisible={hpChangeEffect1.isVisible}
          isDamage={hpChangeEffect1.isDamage}
          onComplete={hideHpChangeEffect1}
          playerId={1}
        />
        
        <HPChangeEffect
          isVisible={hpChangeEffect2.isVisible}
          isDamage={hpChangeEffect2.isDamage}
          onComplete={hideHpChangeEffect2}
          playerId={2}
        />
    </GameInputProvider>
  );
};

export default SanskritGrammarGame;