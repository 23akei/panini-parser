export interface SerialData {
  direction?: 'up' | 'down' | 'left' | 'right';
  button?: 'A' | 'B' | 'select' | 'start';
  timestamp: number;
  playerId: 1 | 2;
}

export interface DeviceConnection {
  port: SerialPort | null;
  reader: ReadableStreamDefaultReader | null;
  isConnected: boolean;
  lastInput: SerialData | null;
}

export type Devices = {
  player1: DeviceConnection;
  player2: DeviceConnection;
};