import React from 'react';

interface GameControlsProps {
  gameState: 'stopped' | 'playing' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  gameState, 
  onStart, 
  onPause, 
  onReset 
}) => {
  const handlePlayPause = () => {
    if (gameState === 'stopped' || gameState === 'paused') {
      onStart();
    } else {
      onPause();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handlePlayPause}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
      >
        <span>{gameState === 'playing' ? '⏸️ ' : '▶️ '}</span>
        <span>{gameState === 'stopped' ? 'Start' : gameState === 'playing' ? 'Pause' : 'Resume'}</span>
      </button>

      <button
        onClick={onReset}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
      >
        <span>🔄 Reset</span>
      </button>
    </div>
  );
};

export default GameControls;