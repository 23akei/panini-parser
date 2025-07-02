import { useState, useEffect } from 'react';
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
  const [currentGameData, setCurrentGameData] = useState<StartGameResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userRule, setUserRule] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  
  // API hooks
  const { startGame, submitAnswer, finishGame, isLoading, error } = useGameOperations();
  const { 
    data: gameStatus 
  } = useGameStatus(
    currentGameData?.game_id || null, 
    gameState === 'playing'
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleGameTimeout();
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  // Game operations
  const handleStartGame = async () => {
    try {
      const gameData = await startGame.mutateAsync({ 
        level: difficulty, 
        length: 5 
      });
      
      setCurrentGameData(gameData);
      setCurrentStepIndex(0);
      setGameState('playing');
      setTimer(61);
      setUserRule('');
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const handlePauseGame = () => {
    setGameState('paused');
  };

  const handleResetGame = async () => {
    if (currentGameData?.game_id) {
      try {
        await finishGame.mutateAsync(currentGameData.game_id);
      } catch (err) {
        console.error('Failed to finish game properly:', err);
      }
    }
    
    setGameState('stopped');
    setTimer(61);
    setCurrentGameData(null);
    setCurrentStepIndex(0);
    setUserRule('');
  };

  const handleGameTimeout = async () => {
    if (currentGameData?.game_id) {
      try {
        const results = await finishGame.mutateAsync(currentGameData.game_id);
        alert(`タイムアップ！最終スコア: ${results.score}`);
      } catch (err) {
        console.error('Failed to finish game:', err);
      }
    }
    setGameState('stopped');
  };

  const handleRuleSubmit = async () => {
    if (!currentGameData || !userRule.trim()) return;

    const currentStep = currentGameData.steps[currentStepIndex];
    if (!currentStep) return;

    try {
      const response = await submitAnswer.mutateAsync({
        gameId: currentGameData.game_id,
        stepId: currentStep.id,
        request: { sutra: userRule.trim() }
      });

      if (response.correct) {
        alert('正解！ ' + response.explanation);
      } else {
        alert('不正解。' + response.explanation);
      }

      // Move to next step or finish game
      if (response.next_step_id !== null && response.next_step_id !== undefined) {
        setCurrentStepIndex(prev => prev + 1);
        setUserRule('');
      } else {
        // Game completed
        const results = await finishGame.mutateAsync(currentGameData.game_id);
        alert(`ゲーム完了！最終スコア: ${results.score} (${results.rank})`);
        setGameState('stopped');
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  const changeDifficulty = () => {
    const difficulties: ('beginner' | 'intermediate' | 'expert')[] = ['beginner', 'intermediate', 'expert'];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  // Current step data
  const currentStep: GameStep | undefined = currentGameData?.steps[currentStepIndex];
  const currentQuestion = currentStep?.from || '';

  // Loading and error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>エラー:</strong> {error.message}
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center space-x-4">
            <QuestionDisplay currentQuestion={currentQuestion} />
            <GameControls
              gameState={gameState}
              onStart={handleStartGame}
              onPause={handlePauseGame}
              onReset={handleResetGame}
            />
          </div>
          <Timer timer={timer} />
        </div>

        {isLoading && (
          <div className="mb-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">読み込み中...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PlayArea
            currentQuestion={currentQuestion}
            currentStep={currentStep}
            score={gameStatus?.score || 0}
            currentStepNumber={gameStatus?.current_step || 1}
            totalSteps={gameStatus?.total_steps || 5}
          />

          <RuleInputForm
            userRule={userRule}
            gameState={gameState}
            onRuleChange={setUserRule}
            onSubmit={handleRuleSubmit}
            isSubmitting={submitAnswer.isPending}
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

export default SanskritGrammarGame;