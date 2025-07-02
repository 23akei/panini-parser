import React from 'react';

interface ModeSelectScreenProps {
  gameMode: 'single' | 'multiple';
  onSelectDifficulty: (difficulty: 'EASY' | 'HARD') => void;
}

const ModeSelectScreen: React.FC<ModeSelectScreenProps> = ({
  gameMode,
  onSelectDifficulty
}) => {
  const renderModeName = () => {
    return gameMode === 'single' ? 'Single Player' : 'Multiplayer';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Select Difficulty - {renderModeName()} Mode
        </h1>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition duration-200 cursor-pointer"
               onClick={() => onSelectDifficulty('EASY')}>
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">EASY</h2>
            <p className="text-gray-700">For beginners. Learn basic grammar rules.</p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg text-center hover:bg-red-100 transition duration-200 cursor-pointer"
               onClick={() => onSelectDifficulty('HARD')}>
            <h2 className="text-2xl font-semibold mb-2 text-red-700">HARD</h2>
            <p className="text-gray-700">For advanced players. Challenge complex grammar rules.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectScreen;
