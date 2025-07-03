import React from "react";
import { GiMagicLamp } from "react-icons/gi";

interface HPDisplayProps {
  hitPoints: number;
  maxHitPoints: number;
}

const HPDisplay: React.FC<HPDisplayProps> = ({ hitPoints, maxHitPoints }) => {
  return (
    <div className="rounded-lg px-4 py-2 flex items-center space-x-2">
      <div className="flex space-x-2">
        {Array.from({ length: maxHitPoints }, (_, index) => (
          <GiMagicLamp
            key={index}
            className={`text-7xl ${
              index < hitPoints ? 'text-yellow-500' : 'text-gray-500'
            }`}
          />
        ))}
        {/* {hitPoints} / {maxHitPoints} */}
      </div>
    </div>
  );
};

export default HPDisplay;