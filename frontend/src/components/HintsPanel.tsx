import React from 'react';

const HintsPanel: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4">
      <h4 className="text-yellow-700 font-semibold mb-2">Hints</h4>
      <ul className="text-sm text-yellow-800 space-y-1">
        <li>• Identify the root stem</li>
        <li>• Recall the declension pattern</li>
        <li>• Verify gender, number, and case</li>
      </ul>
    </div>
  );
};

export default HintsPanel;