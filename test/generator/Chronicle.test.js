import { Chronicle } from '../../src/generator/Chronicle.js';
import { HistoricalEntry } from '../../src/generator/HistoricalEntry.js';

describe('Chronicle', () => {
  let chronicle;

  beforeEach(() => {
    chronicle = new Chronicle();
  });

  describe('constructor', () => {
    it('should create an empty chronicle', () => {
      expect(chronicle).toBeInstanceOf(Chronicle);
      expect(chronicle.entries).toEqual([]);
    });
  });

  describe('addEntry', () => {
    it('should add a HistoricalEntry to the chronicle', () => {
      const entry = new HistoricalEntry('An important event happened.');
      chronicle.addEntry(entry);
      expect(chronicle.entries).toHaveLength(1);
      expect(chronicle.entries[0]).toBe(entry);
    });

    it('should add multiple HistoricalEntry objects to the chronicle', () => {
      const entry1 = new HistoricalEntry('First event.');
      const entry2 = new HistoricalEntry('Second event.');
      chronicle.addEntry(entry1);
      chronicle.addEntry(entry2);
      expect(chronicle.entries).toHaveLength(2);
      expect(chronicle.entries).toEqual([entry1, entry2]);
    });

    it('should throw a TypeError if a non-HistoricalEntry object is added', () => {
      const notAnEntry = { description: 'This is not a real entry.' };
      expect(() => chronicle.addEntry(notAnEntry)).toThrow(TypeError);
    });

    it('should throw a TypeError for primitive values', () => {
      expect(() => chronicle.addEntry('a string')).toThrow(TypeError);
      expect(() => chronicle.addEntry(123)).toThrow(TypeError);
      expect(() => chronicle.addEntry(null)).toThrow(TypeError);
      expect(() => chronicle.addEntry(undefined)).toThrow(TypeError);
    });
  });

  describe('entries getter', () => {
    it('should return the array of entries', () => {
      const entry = new HistoricalEntry('An event');
      chronicle.addEntry(entry);
      const entries = chronicle.entries;
      expect(entries).toBeInstanceOf(Array);
      expect(entries).toHaveLength(1);
      expect(entries[0].description).toBe('An event');
    });
  });
});