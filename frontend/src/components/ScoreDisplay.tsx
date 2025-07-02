import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="text-right">
      <div className="bg-gray-100 rounded-lg p-4 inline-block">
        <div className="text-sm text-gray-600">Player Score</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;