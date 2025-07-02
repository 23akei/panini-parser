import React from 'react';

const HintsPanel: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4">
      <h4 className="text-yellow-700 font-semibold mb-2">ヒント</h4>
      <ul className="text-sm text-yellow-800 space-y-1">
        <li>• 語根の語幹を特定する</li>
        <li>• 格変化のパターンを思い出す</li>
        <li>• 性・数・格を確認する</li>
      </ul>
    </div>
  );
};

export default HintsPanel;