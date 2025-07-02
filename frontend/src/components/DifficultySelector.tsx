import React from 'react';

interface DifficultySelectorProps {
  difficulty: 'beginner' | 'intermediate' | 'expert';
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
          difficulty === 'beginner' ? 'bg-green-500 text-white' :
          difficulty === 'intermediate' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}
      >
        {difficulty.toUpperCase()}
      </button>
    </div>
  );
};

export default DifficultySelector;