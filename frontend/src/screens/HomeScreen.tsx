import React from 'react';

interface HomeScreenProps {
  onSelectMode: (mode: 'single' | 'multi') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {

  return (
    <div className="min-h-screen flex border-[12px] border-pink-400 bg-[#001f3f]">
      <audio src="intro.m4a" autoPlay loop id="myAudio"></audio>
      {/* left */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src="main.png"
          alt="Panini Game"
          className="w-[80%] max-w-[500px] h-auto object-contain scale-x-[-1]"
        />
      </div>

      {/* right */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-7xl font-extrabold mb-4 text-yellow-400 text-center stroke-white">
          Pāṇini Krīḍa
        </h1>
        <h2 className="text-4xl font-semibold mb-6 text-yellow-400 text-center stroke-white">
          पाणिनि क्रीडा
        </h2>

      <div className="flex flex-nowrap justify-center space-x-6">
        {/* Single Player */}
        <button
          onClick={() => onSelectMode('single')}
          className="relative group"
        >
          <img
            src="single-icon.png"
            alt="Single Player Icon"
            className="w-65 h-45 object-cover rounded-xl"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center text-pink-500 text-2xl font-bold text-center leading-snug">
            <br />एकाकी<br />Solo
          </span>
        </button>

        {/* 2-Player Mode */}
        <button
          onClick={() => onSelectMode('multi')}
          className="relative group"
        >
          <img
            src="multi-icon.png"
            alt="Multiplayer Icon"
            className="w-65 h-45 object-cover rounded-xl"
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center text-pink-500 text-2xl font-bold text-center leading-snug">
            <br />मेलनम्‌<br />Battle
          </span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default HomeScreen;
