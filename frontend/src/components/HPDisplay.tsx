import React from "react";
import { GiMagicLamp } from "react-icons/gi";

interface HPDisplayProps {
  hitPoints: number;
  maxHitPoints: number;
}

const HPDisplay: React.FC<HPDisplayProps> = ({ hitPoints, maxHitPoints }) => {
  // Calculate number of rows needed (max 10 per row)
  const iconsPerRow = 10;
  const rows = Math.ceil(maxHitPoints / iconsPerRow);
  
  // Create rows of HP icons
  const renderRows = () => {
    const rowElements = [];
    
    for (let row = 0; row < rows; row++) {
      const startIndex = row * iconsPerRow;
      const endIndex = Math.min(startIndex + iconsPerRow, maxHitPoints);
      const iconsInRow = endIndex - startIndex;
      
      rowElements.push(
        <div key={row} className="flex space-x-1 justify-center">
          {Array.from({ length: iconsInRow }, (_, index) => {
            const globalIndex = startIndex + index;
            return (
              <GiMagicLamp
                key={globalIndex}
                className={`text-3xl ${
                  globalIndex < hitPoints ? 'text-yellow-500' : 'text-gray-500'
                }`}
              />
            );
          })}
        </div>
      );
    }
    
    return rowElements;
  };

  return (
    <div className="rounded-lg px-4 py-2 flex items-center justify-center w-96 h-24">
      <div className="flex flex-col space-y-1 items-center justify-center">
        {renderRows()}
        {/* {hitPoints} / {maxHitPoints} */}
      </div>
    </div>
  );
};

export default HPDisplay;