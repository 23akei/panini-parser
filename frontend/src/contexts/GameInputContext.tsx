import React, { createContext, useContext } from 'react';
import { useWebSerialMultiDevice } from '../hooks/useWebSerialMultiDevice';
import type { Devices } from '../types/serial';

interface GameInputContextType {
  devices: Devices;
  connect: (playerId: 1 | 2) => Promise<void>;
  disconnect: (playerId: 1 | 2) => Promise<void>;
}

const GameInputContext = createContext<GameInputContextType | null>(null);

export const GameInputProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const webSerial = useWebSerialMultiDevice();

  return (
    <GameInputContext.Provider value={webSerial}>
      {children}
    </GameInputContext.Provider>
  );
};

export const useGameInput = () => {
  const context = useContext(GameInputContext);
  if (!context) {
    throw new Error('useGameInput must be used within GameInputProvider');
  }
  return context;
};