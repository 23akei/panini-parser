import React from 'react';
import HintsPanel from './HintsPanel';
import type { Question } from '../types/interfaces';

interface RuleInputFormProps {
  gameState: 'stopped' | 'playing' | 'paused';
  onRuleChange: (rule: string) => void;
  onSubmit: (questions: Question[]) => void;
}

const RuleInputForm: React.FC<RuleInputFormProps> = ({ 
  gameState, 
  onRuleChange,
  onSubmit 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6">
        <h3 className="text-green-700 font-semibold mb-4 text-lg">Enter Rule</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Panini Rule:
            </label>
            <textarea
              value=""
              onChange={(e) => onRuleChange(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Example: अकारान्त पुल्लिङ्ग प्रथमा एकवचन"
              disabled={gameState !== 'playing'}
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={gameState !== 'playing'}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Rule
          </button>
        </div>
      </div>

      <HintsPanel />
    </div>
  );
};

export default RuleInputForm;