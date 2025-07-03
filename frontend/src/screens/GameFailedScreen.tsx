import React from 'react';

interface GameFailedScreenProps {
  playerScore: number;
  onReturnHome: () => void;
}

const GameFailedScreen: React.FC<GameFailedScreenProps> = ({
  playerScore,
  onReturnHome
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-6">Game Failed...</h1>
        <p className="text-xl mb-4">Better luck next time!</p>
        <p className="text-2xl font-semibold mb-6">Final Score: {playerScore}</p>
        <button 
          onClick={onReturnHome}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default GameFailedScreen;
