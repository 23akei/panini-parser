import type { SerialData } from '../types/serial';

export const parseSerialData = (text: string, devicePlayerId: 1 | 2): SerialData | null => {
  try {
    const cleaned = text.trim();
    if (!cleaned) return null;

    const parts = cleaned.split(',');
    if (parts.length < 3) return null;

    const deviceId = parseInt(parts[0]);
    const type = parseInt(parts[1]);
    
    // Determine player ID from device ID (device 1 = player 1, device 2 = player 2)
    const playerId = deviceId as 1 | 2;
    
    const data: SerialData = {
      playerId
    };

    if (type === 1) {
      // Stick input: deviceId,1,direction
      const direction = parseInt(parts[2]);
      // Arduino direction mapping: neutral(0) right(1) left(2) down(3) up(4)
      const directionMap = ['neutral', 'right', 'left', 'down', 'up'] as const;
      if (direction >= 0 && direction <= 4) {
        data.direction = directionMap[direction];
      }
    } else if (type === 2) {
      // Button input: deviceId,2,button,pressed
      if (parts.length >= 4) {
        const buttonPin = parseInt(parts[2]);
        const pressed = parseInt(parts[3]);
        
        // Only process button press events (not release)
        if (pressed === 1) {
          // Arduino button mapping: pin 2=A, pin 3=B, pin 4=C, pin 5=D, pin 6=E, pin 7=F, pin 8=K
          const buttonMap: { [key: number]: SerialData['button'] } = {
            2: 'a',
            3: 'b', 
            4: 'c',
            5: 'd',
            6: 'e',
            7: 'f',
            8: 'k'
          };
          
          if (buttonMap[buttonPin]) {
            data.button = buttonMap[buttonPin];
          }
        }
      }
    }

    // Only return data if we parsed something meaningful
    if (data.direction || data.button) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
};