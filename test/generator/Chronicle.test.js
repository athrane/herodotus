import { Chronicle } from '../../src/generator/Chronicle.js';
import { HistoricalEntry } from '../../src/generator/HistoricalEntry.js';
import { Time } from '../../src/generator/time/Time.js';
import { HistoricalFigure } from '../../src/generator/HistoricalFigure.js';
import { Place } from '../../src/generator/Place.js';
import { EventType } from '../../src/generator/event/EventType.js';

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
        'Victory, Marathon',
        new EventType('Military', 'Battle'),
        new Time(490),
        new Place('Marathon'),
        'Athenians defeat the first Persian invasion.',
        new HistoricalFigure('Miltiades')
      );
      chronicle.addEntry(entry);
      expect(chronicle.getEntries()).toHaveLength(1);
      expect(chronicle.getEntries()[0]).toBe(entry);
    });

    it('should allow multiple entries to be added', () => {
      const entry1 = new HistoricalEntry(
        'Victory, Marathon',
        new EventType('Military', 'Battle'),
        new Time(490),
        new Place('Marathon'),
        'Athenians defeat the first Persian invasion.',
        new HistoricalFigure('Miltiades')
      );  
      const entry2 = new HistoricalEntry(
        'Victory, Salamis',
        new EventType('Military', 'Battle'),
        new Time(480),
        new Place('Salamis'),
        'Greek fleet defeats the Persian navy.',
        new HistoricalFigure('Themistocles')
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