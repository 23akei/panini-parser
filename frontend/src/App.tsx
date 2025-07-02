import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import GameControls from './components/GameControls';
import QuestionDisplay from './components/QuestionDisplay';
import PlayArea from './components/PlayArea';
import RuleInputForm from './components/RuleInputForm';
import DifficultySelector from './components/DifficultySelector';
import { connectToArduino } from './assets/serial';

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
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userRule, setUserRule] = useState('');
  const [playerScore, setPlayerScore] = useState(192);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');

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

  useEffect(() => {
    let interval: number;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameState('stopped');
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const startGame = () => {
    setGameState('playing');
    setTimer(61);
    setCurrentQuestion(questions[currentQuestionIndex].word);
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
  };

  const handleRuleSubmit = () => {
    console.log('Submitted rule:', userRule);

    const currentQ = questions[currentQuestionIndex];
    if (userRule.trim() === currentQ.rule) {
      setPlayerScore(prev => prev + 10);
      alert('正解！');
    } else {
      alert(`不正解。正解は: ${currentQ.rule}`);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1].word);
      setUserRule('');
    } else {
      setGameState('stopped');
      alert('ゲーム終了！');
    }
  };

  const changeDifficulty = () => {
    const difficulties: ('EASY' | 'MEDIUM' | 'HARD')[] = ['EASY', 'MEDIUM', 'HARD'];
    const currentIndex = difficulties.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    setDifficulty(difficulties[nextIndex]);
  };

  const currentQuestionData = questions[currentQuestionIndex];

  const [arduinoInput, setArduinoInput] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mt-4 text-sm text-gray-600">
        Arduino入力: <span className="font-mono">{arduinoInput}</span>
      </div>
      <button
        onClick={() => {
          connectToArduino((line: string) => {
            console.log('Arduino says:', line);
            setArduinoInput(line);
          });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Arduinoと接続
      </button>

        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div className="flex items-center space-x-4">
            <QuestionDisplay currentQuestion={currentQuestion} />
            <GameControls
              gameState={gameState}
              onStart={startGame}
              onPause={pauseGame}
              onReset={resetGame}
            />
          </div>
          <Timer timer={timer} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PlayArea
            currentQuestion={currentQuestion}
            currentQuestionData={currentQuestionData}
            playerScore={playerScore}
          />

          <RuleInputForm
            userRule={userRule}
            gameState={gameState}
            onRuleChange={setUserRule}
            onSubmit={handleRuleSubmit}
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