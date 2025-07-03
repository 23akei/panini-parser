export interface SerialData {
  direction?: 'up' | 'down' | 'left' | 'right';
  button?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'k';
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