import { HistoricalEntry } from '../../src/generator/HistoricalEntry.js';
import { Time } from '../../src/generator/time/Time.js';
import { HistoricalFigure } from '../../src/generator/HistoricalFigure.js';
import { Place } from '../../src/generator/Place.js';

describe('HistoricalEntry', () => {
  let time;
  let figure;
  let place;
  let description;

  beforeEach(() => {
    time = new Time(484);
    figure = new HistoricalFigure('Herodotus');
    place = new Place('Halicarnassus');
    description = 'The birth of the Father of History.';
  });

  describe('constructor', () => {
    it('should create a HistoricalEntry with valid arguments', () => {
      const entry = new HistoricalEntry(time, figure, place, description);
      expect(entry).toBeInstanceOf(HistoricalEntry);
      console.log(time);
      expect(entry.getTime()).toBe(time);
      expect(entry.getFigure()).toBe(figure);
      expect(entry.getPlace()).toBe(place);
      expect(entry.getDescription()).toBe(description);
    });

    it('should throw a TypeError for invalid argument types', () => {
      expect(() => new HistoricalEntry('not time', figure, place, description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(time, 'not figure', place, description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(time, figure, 'not place', description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(time, figure, place, 123)).toThrow(TypeError);
    });
  });

  describe('getters', () => {
    it('should return the correct values provided in the constructor', () => {
      const entry = new HistoricalEntry(time, figure, place, description);
      expect(entry.getTime().getYear()).toBe(484);
      expect(entry.getFigure().getName()).toBe('Herodotus');
      expect(entry.getPlace().getName()).toBe('Halicarnassus');
      expect(entry.getDescription()).toBe('The birth of the Father of History.');
    });
  });
});