import { useState, useCallback } from 'react';
import type { Devices, DeviceConnection } from '../types/serial';
import { parseSerialData } from '../utils/parseSerialData';

export const useWebSerialMultiDevice = () => {
  const [devices, setDevices] = useState<Devices>({
    player1: { port: null, reader: null, isConnected: false, lastInput: null, inputProcessed: false, isToggled: false },
    player2: { port: null, reader: null, isConnected: false, lastInput: null, inputProcessed: false, isToggled: false }
  });

  const readLoop = async (reader: ReadableStreamDefaultReader, playerId: 1 | 2) => {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const parsedData = parseSerialData(line, playerId);
          if (parsedData) {
            setDevices(prev => {
              const playerStr = `player${playerId}` as const;
              const prevDevice = prev[playerStr];
              let newToggled = prevDevice.isToggled;
              let newInputProcessed = false;

              // If the button is 'k', flip the toggle
              if (parsedData.button === 'k') {
                newToggled = !prevDevice.isToggled;
                newInputProcessed = true;
              }

              return {
                ...prev,
                [playerStr]: {
                  ...prevDevice,
                  lastInput: parsedData,
                  inputProcessed: newInputProcessed,
                  isToggled: newToggled
                }
              };
            });
          }
        }
      }
    } catch (error) {
      console.error(`Player ${playerId} read error:`, error);
    }
  };

  // 🔧 追加：処理済みにマークする関数
  const markInputProcessed = useCallback((playerId: 1 | 2) => {
    setDevices(prev => ({
      ...prev,
      [`player${playerId}`]: {
        ...prev[`player${playerId}`],
        inputProcessed: true
      }
    }));
  }, []);

  const connect = useCallback(async (playerId: 1 | 2) => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const reader = port.readable?.getReader();
      if (!reader) throw new Error('Reader not available');

      setDevices(prev => ({
        ...prev,
        [`player${playerId}`]: {
          port,
          reader,
          isConnected: true,
          lastInput: null,
          inputProcessed: true,
          isToggled: false
        }
      }));

      readLoop(reader, playerId);

    } catch (error) {
      console.error(`Player ${playerId} connection error:`, error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async (playerId: 1 | 2) => {
    const playerKey = `player${playerId}` as keyof Devices;
    const device = devices[playerKey];

    try {
      if (device.reader) {
        await device.reader.cancel();
        device.reader.releaseLock();
      }
      if (device.port) {
        await device.port.close();
      }

      setDevices(prev => ({
        ...prev,
        [playerKey]: {
          port: null,
          reader: null,
          isConnected: false,
          lastInput: null,
          inputProcessed: true,
          isToggled: false
        }
      }));
    } catch (error) {
      console.error(`Player ${playerId} disconnect error:`, error);
    }
  }, [devices]);

  return {
    devices,
    connect,
    disconnect
  };
};