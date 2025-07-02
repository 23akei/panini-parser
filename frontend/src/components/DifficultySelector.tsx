import React from 'react';

interface DifficultySelectorProps {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  onChangeDifficulty: () => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  difficulty, 
  onChangeDifficulty 
}) => {
  return (
    <div className="text-center">
      <button
        onClick={onChangeDifficulty}
        className={`px-8 py-3 rounded-lg font-bold text-xl transition-colors ${
          difficulty === 'EASY' ? 'bg-green-500 text-white' :
          difficulty === 'MEDIUM' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}
      >
        {difficulty}
      </button>
    </div>
  );
};

export default DifficultySelector;