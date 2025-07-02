import React from 'react';
import ScoreDisplay from './ScoreDisplay';
import type { GameStep } from '../api/client';

interface PlayAreaProps {
  currentQuestion: string;
  currentStep: GameStep | undefined;
  score: number;
  currentStepNumber: number;
  totalSteps: number;
}

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
                <strong>変換元:</strong> 
                <span className="font-devanagari text-xl ml-2">{currentStep.from}</span>
              </div>
              <div className="text-lg mb-2">
                <strong>変換先:</strong>
                <span className="font-devanagari text-xl ml-2">{currentStep.to}</span>
              </div>
              {currentStep.hint && (
                <div className="text-sm text-blue-600 mt-2">
                  <strong>ヒント:</strong> {currentStep.hint}
                </div>
              )}
            </div>
          )}

          <div className="text-center py-8">
            <div className="text-6xl mb-4">？</div>
            <div className="text-2xl text-gray-600">パーニニ規則番号を入力</div>
            <div className="text-sm text-gray-500 mt-2">
              どの文法規則がこの変換を支配していますか？
            </div>
          </div>
        </div>
      </div>

      <ScoreDisplay score={score} />
    </div>
  );
};

export default PlayArea;