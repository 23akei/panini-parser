import React from 'react';
import HintsPanel from './HintsPanel';

interface RuleInputFormProps {
  userRule: string;
  gameState: 'stopped' | 'playing' | 'paused';
  onRuleChange: (rule: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const RuleInputForm: React.FC<RuleInputFormProps> = ({ 
  userRule, 
  gameState, 
  onRuleChange, 
  onSubmit,
  isSubmitting = false
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6">
        <h3 className="text-green-700 font-semibold mb-4 text-lg">Enter Rule</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              パーニニ規則を入力してください:
            </label>
            <input
              type="text"
              value={userRule}
              onChange={(e) => onRuleChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="例: 3.1.68 または規則名"
              disabled={gameState !== 'playing' || isSubmitting}
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={gameState !== 'playing' || !userRule.trim() || isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                送信中...
              </>
            ) : (
              'Submit Rule'
            )}
          </button>
        </div>
      </div>

      <HintsPanel />
    </div>
  );
};

export default RuleInputForm;