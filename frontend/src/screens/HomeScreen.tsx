import React from 'react';

interface HomeScreenProps {
  onSelectMode: (mode: 'single' | 'multiple') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sanskrit Grammar Game</h1>
        <p className="text-center mb-8 text-lg text-gray-600">
          Select your mode to start playing!
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => onSelectMode('single')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors"
          >
            Single Player
          </button>
          
          <button 
            onClick={() => onSelectMode('multiple')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-colors"
          >
            Multiplayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
