export interface SerialData {
  direction?: 'up' | 'down' | 'left' | 'right';
  button?: 'A' | 'B' | 'C' | 'D';
  playerId: 1 | 2;
}

export interface DeviceConnection {
  reader: ReadableStreamDefaultReader | null;
  isConnected: boolean;
  lastInput: SerialData | null;
}

export type Devices = {
  player1: DeviceConnection;
  player2: DeviceConnection;
};