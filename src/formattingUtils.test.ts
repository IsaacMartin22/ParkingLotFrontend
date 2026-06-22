import {
  formatDuration,
  formatElapsedSince,
  formatTimestamp,
  getCapacityInfo,
  toNumber,
} from './formattingUtils';

describe('formattingUtils', () => {
  describe('toNumber', () => {
    it('returns finite numbers unchanged', () => {
      expect(toNumber(42)).toBe(42);
      expect(toNumber(0)).toBe(0);
    });

    it('converts numeric strings to numbers', () => {
      expect(toNumber('42')).toBe(42);
      expect(toNumber(' 12.5 ')).toBe(12.5);
    });

    it('returns undefined for invalid values', () => {
      expect(toNumber('')).toBeUndefined();
      expect(toNumber('not-a-number')).toBeUndefined();
      expect(toNumber(Number.NaN)).toBeUndefined();
      expect(toNumber(undefined)).toBeUndefined();
      expect(toNumber(null)).toBeUndefined();
    });
  });

  describe('getCapacityInfo', () => {
    it('calculates occupied spaces and percent full', () => {
      expect(getCapacityInfo(100, 25)).toEqual({
        capacity: 100,
        occupied: 75,
        available: 25,
        percentFull: 75,
      });
    });

    it('defaults missing values to zero', () => {
      expect(getCapacityInfo()).toEqual({
        capacity: 0,
        occupied: 0,
        available: 0,
        percentFull: 0,
      });
    });

    it('does not return negative occupied spaces', () => {
      expect(getCapacityInfo(10, 15)).toEqual({
        capacity: 10,
        occupied: 0,
        available: 15,
        percentFull: 0,
      });
    });
  });

  describe('formatDuration', () => {
    it('formats durations under an hour as minutes', () => {
      expect(formatDuration(59_000)).toBe('0m');
      expect(formatDuration(5 * 60 * 1000)).toBe('5m');
    });

    it('formats durations over an hour with hours and minutes', () => {
      expect(formatDuration((2 * 60 + 15) * 60 * 1000)).toBe('2h 15m');
    });

    it('formats durations over a day with days, hours, and minutes', () => {
      expect(formatDuration(((1 * 24 + 3) * 60 + 20) * 60 * 1000)).toBe('1d 3h 20m');
    });
  });

  describe('formatElapsedSince', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns N/A for missing or invalid values', () => {
      expect(formatElapsedSince()).toBe('N/A');
      expect(formatElapsedSince('not-a-date')).toBe('N/A');
    });

    it('formats elapsed time since a valid timestamp', () => {
      expect(formatElapsedSince('2025-01-01T10:30:00Z')).toBe('1h 30m');
    });

    it('does not return negative elapsed time for future timestamps', () => {
      expect(formatElapsedSince('2025-01-01T13:00:00Z')).toBe('0m');
    });
  });

  describe('formatTimestamp', () => {
    it('returns the original value for invalid timestamps', () => {
      expect(formatTimestamp('invalid-date')).toBe('invalid-date');
    });

    it('formats valid timestamps as a local time string', () => {
      const value = '2025-01-01T12:00:00Z';

      expect(formatTimestamp(value)).toBe(new Date(value).toLocaleTimeString());
    });
  });
});
