import React from 'react';

interface TimerProps {
  timer: number;
}

const Timer: React.FC<TimerProps> = ({ timer }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-blue-100 border-2 border-blue-500 rounded-lg px-4 py-2 flex items-center space-x-2">
      <span className="text-blue-700">⏰</span>
      <span className="text-blue-700 font-semibold">Timer</span>
      <div className="text-xl font-bold text-blue-800">
        {formatTime(timer)}
      </div>
    </div>
  );
};

export default Timer;