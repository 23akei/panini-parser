import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import type { PlayAreaProps } from '../types/interfaces';

const PlayArea: React.FC<PlayAreaProps> = ({
  currentQuestion,
  currentStep,
  score,
  currentStepNumber,
  totalSteps
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6">
        <h3 className="text-red-700 font-semibold mb-4 text-lg">
          Play ({currentStepNumber}/{totalSteps})
        </h3>
        <div className="space-y-4">
          {currentQuestion && currentStep && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-lg mb-2">
                <strong>Root:</strong> <span className="font-devanagari text-xl">{currentQuestion}</span>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Desired Form:</strong> {currentQuestionData.case} {currentQuestionData.number}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <strong>Expected Form:</strong>
                <span className="font-devanagari text-lg ml-2">{currentQuestionData.expected}</span>
              </div>
            </div>
          )}

          <div className="text-center py-8">
            <div className="text-6xl mb-4">1.4.24</div>
            <div className="text-2xl text-gray-600">Panini Rule Number</div>
          </div>
        </div>
      </div>

      <ScoreDisplay score={score} />
    </div>
  );
};

export default PlayArea;