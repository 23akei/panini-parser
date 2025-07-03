import React from "react";
import { GiMagicLamp } from "react-icons/gi";

interface HPDisplayProps {
  hitPoints: number;
}

const HPDisplay: React.FC<HPDisplayProps> = ({ hitPoints }) => {
  return (
    <div className="rounded-lg px-4 py-2 flex items-center space-x-2">
      <div className="flex space-x-2">
        <GiMagicLamp className="text-yellow-500 text-7xl" />
        <GiMagicLamp className="text-yellow-500 text-7xl" />
        <GiMagicLamp className="text-yellow-500 text-7xl" />
        <GiMagicLamp className="text-yellow-500 text-7xl" />
        <GiMagicLamp className="text-gray-500 text-7xl" />
        <GiMagicLamp className="text-gray-500 text-7xl" />
        {/* {hitPoints} / 5 */}
      </div>
    </div>
  );
};

export default HPDisplay;