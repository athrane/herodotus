import { HistoricalEntry } from '../../src/generator/HistoricalEntry.js';

describe('HistoricalEntry', () => {
  describe('constructor', () => {
    it('should create a HistoricalEntry with a valid description', () => {
      const description = 'The founding of the city of Aethelburg.';
      const entry = new HistoricalEntry(description);
      expect(entry).toBeInstanceOf(HistoricalEntry);
      expect(entry.description).toBe(description);
    });

    it('should throw a TypeError if the description is not a string', () => {
      expect(() => new HistoricalEntry(123)).toThrow(TypeError);
      expect(() => new HistoricalEntry({})).toThrow(TypeError);
      expect(() => new HistoricalEntry(null)).toThrow(TypeError);
      expect(() => new HistoricalEntry(undefined)).toThrow(TypeError);
      expect(() => new HistoricalEntry([])).toThrow(TypeError);
    });

    it('should allow an empty string as a description', () => {
      const entry = new HistoricalEntry('');
      expect(entry.description).toBe('');
    });
  });

  describe('description getter', () => {
    it('should return the description provided in the constructor', () => {
      const description = 'A great battle was fought on the plains of Gorgoroth.';
      const entry = new HistoricalEntry(description);
      expect(entry.description).toBe(description);
    });
  });
});