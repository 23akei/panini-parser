import { parseSerialData } from './parseSerialData';

describe('parseSerialData', () => {
  test('parses stick input correctly', () => {
    // Test all directions
    expect(parseSerialData('2,1,0', 1)).toEqual({ playerId: 2, direction: 'right' });
    expect(parseSerialData('2,1,1', 1)).toEqual({ playerId: 2, direction: 'up' });
    expect(parseSerialData('2,1,2', 1)).toEqual({ playerId: 2, direction: 'left' });
    expect(parseSerialData('2,1,3', 1)).toEqual({ playerId: 2, direction: 'down' });
  });

  test('parses button press correctly', () => {
    // Test all buttons
    expect(parseSerialData('2,2,2,1', 1)).toEqual({ playerId: 2, button: 'a' });
    expect(parseSerialData('2,2,3,1', 1)).toEqual({ playerId: 2, button: 'b' });
    expect(parseSerialData('2,2,4,1', 1)).toEqual({ playerId: 2, button: 'c' });
    expect(parseSerialData('2,2,5,1', 1)).toEqual({ playerId: 2, button: 'd' });
    expect(parseSerialData('2,2,6,1', 1)).toEqual({ playerId: 2, button: 'e' });
    expect(parseSerialData('2,2,7,1', 1)).toEqual({ playerId: 2, button: 'f' });
    expect(parseSerialData('2,2,8,1', 1)).toEqual({ playerId: 2, button: 'k' });
  });

  test('ignores button release events', () => {
    expect(parseSerialData('2,2,2,0', 1)).toBe(null);
    expect(parseSerialData('2,2,3,0', 1)).toBe(null);
  });

  test('handles different device IDs', () => {
    expect(parseSerialData('1,1,1', 1)).toEqual({ playerId: 1, direction: 'up' });
    expect(parseSerialData('2,1,1', 1)).toEqual({ playerId: 2, direction: 'up' });
  });

  test('returns null for invalid input', () => {
    expect(parseSerialData('', 1)).toBe(null);
    expect(parseSerialData('invalid', 1)).toBe(null);
    expect(parseSerialData('1,2', 1)).toBe(null); // too few parts
    expect(parseSerialData('1,3,1', 1)).toBe(null); // invalid type
  });

  test('returns null for invalid direction', () => {
    expect(parseSerialData('1,1,4', 1)).toBe(null); // direction out of range
    expect(parseSerialData('1,1,-1', 1)).toBe(null); // negative direction
  });

  test('returns null for invalid button', () => {
    expect(parseSerialData('1,2,1,1', 1)).toBe(null); // button pin 1 doesn't exist
    expect(parseSerialData('1,2,9,1', 1)).toBe(null); // button pin 9 doesn't exist
  });
});