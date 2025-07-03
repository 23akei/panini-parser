import type { SerialData } from '../types/serial';

export const parseSerialData = (text: string, playerId: 1 | 2): SerialData | null => {
  try {
    const cleaned = text.trim();
    if (!cleaned) return null;

    const parts = cleaned.split(',');
    if (parts.length < 2) return null;

    const data: SerialData = {
      playerId
    };

    // 方向をパース
    const direction = parts[0].toUpperCase();
    if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(direction)) {
      data.direction = direction.toLowerCase() as SerialData['direction'];
    }

    // ボタンをパース
    const button = parts[1].toUpperCase();
    if (['A', 'B', 'SELECT', 'START'].includes(button)) {
      data.button = button.toLowerCase() as SerialData['button'];
    }

    return data;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
};