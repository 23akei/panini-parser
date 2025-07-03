import React from "react";

interface HPDisplayProps {
  hitPoints: number;
}

const HPDisplay: React.FC<HPDisplayProps> = ({ hitPoints }) => {
  return (
    <div className="bg-red-100 border-2 border-red-500 rounded-lg px-4 py-2 flex items-center space-x-2">
      <span className="text-red-700">❤️</span>
      <span className="text-red-700 font-semibold">HP</span>
      <div className="text-xl font-bold text-red-800">
        {Array(hitPoints).fill('💚')}
        {/* {hitPoints} / 5 */}
      </div>
    </div>
  );
};

export default HPDisplay;