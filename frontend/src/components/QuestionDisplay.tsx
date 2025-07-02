import React from 'react';

interface QuestionDisplayProps {
  currentQuestion: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ currentQuestion }) => {
  return (
    <div className="bg-red-100 border-2 border-red-500 rounded-lg px-4 py-2">
      <span className="text-red-700 font-semibold">Question</span>
      <div className="text-lg font-bold mt-1">
        {currentQuestion || 'Please start the game'}
      </div>
    </div>
  );
};

export default QuestionDisplay;