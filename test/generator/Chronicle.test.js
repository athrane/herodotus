import { Chronicle } from '../../src/generator/Chronicle.js';
import { HistoricalEntry } from '../../src/generator/HistoricalEntry.js';
import { Time } from '../../src/generator/time/Time.js';
import { HistoricalFigure } from '../../src/generator/HistoricalFigure.js';
import { Place } from '../../src/generator/Place.js';

describe('Chronicle', () => {
  let chronicle;

  beforeEach(() => {
    chronicle = new Chronicle();
  });

  describe('constructor', () => {
    it('should create an empty chronicle', () => {
      expect(chronicle).toBeInstanceOf(Chronicle);
      expect(chronicle.getEntries()).toEqual([]);
    });
  });

  describe('addEntry', () => {
    it('should add a HistoricalEntry to the chronicle', () => {
      const entry = new HistoricalEntry(
        new Time(490),
        new HistoricalFigure('Miltiades'),
        new Place('Marathon'),
        'Athenians defeat the first Persian invasion.'
      );
      chronicle.addEntry(entry);
      expect(chronicle.getEntries()).toHaveLength(1);
      expect(chronicle.getEntries()[0]).toBe(entry);
    });

    it('should allow multiple entries to be added', () => {
      const entry1 = new HistoricalEntry(
        new Time(490),
        new HistoricalFigure('Miltiades'),
        new Place('Marathon'),
        'Athenians defeat the first Persian invasion.'
      );  
      const entry2 = new HistoricalEntry(
        new Time(480),
        new HistoricalFigure('Themistocles'),
        new Place('Salamis'),
        'Greek fleet defeats the Persian navy.'
      );
      chronicle.addEntry(entry1);
      chronicle.addEntry(entry2);
      expect(chronicle.getEntries()).toHaveLength(2); 
      expect(chronicle.getEntries()[0]).toBe(entry1);
      expect(chronicle.getEntries()[1]).toBe(entry2);
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
});