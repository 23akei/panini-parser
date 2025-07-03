import React from 'react';
import type { Question } from '../types/interfaces';

interface QuestionDisplayProps {
  currentQuestion: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ currentQuestion }) => {
  return (
    <div className="rounded-lg px-4 py-2">
      <div className="text-4xl text-pink-500 font-bold mt-1">
        {currentQuestion.from_word + " → " + currentQuestion.to_word || 'Please start the game'}
      </div>
    </div>
  );
};

export default QuestionDisplay;