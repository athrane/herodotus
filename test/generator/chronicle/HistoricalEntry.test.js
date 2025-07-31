import { HistoricalEntry } from '../../../src/generator/chronicle/HistoricalEntry.js';
import { Time } from '../../../src/time/Time.js';
import { HistoricalFigure } from '../../../src/generator/HistoricalFigure.js';
import { Place } from '../../../src/generator/Place.js';
import { EventType } from '../../../src/generator/event/EventType.js';

describe('HistoricalEntry', () => {
  let heading;
  let eventType;
  let time;
  let figure;
  let place;
  let description;

  beforeEach(() => {
    heading = 'Birth, Herodotus';
    eventType = new EventType('Political', 'Birth');
    time = new Time(484);
    figure = new HistoricalFigure('Herodotus');
    place = new Place('Halicarnassus');
    description = 'The birth of the Father of History.';
  });

  describe('constructor', () => {
    it('should create a HistoricalEntry with valid arguments', () => {
      const entry = new HistoricalEntry(heading, eventType, time, place, description, figure);
      expect(entry).toBeInstanceOf(HistoricalEntry);
      console.log(time);
      expect(entry.getHeading()).toBe(heading);
      expect(entry.getTime()).toBe(time);
      expect(entry.getFigure()).toBe(figure);
      expect(entry.getPlace()).toBe(place);
      expect(entry.getDescription()).toBe(description);
    });

    it('should throw a TypeError for invalid argument types', () => {      
      expect(() => new HistoricalEntry(123, time, figure, place, description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(heading, 'not time', figure, place, description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(heading, time, 'not figure', place, description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(heading, time, figure, 'not place', description)).toThrow(TypeError);
      expect(() => new HistoricalEntry(heading, time, figure, place, 123)).toThrow(TypeError);
    });
  });

  describe('getters', () => {
    it('should return the correct values provided in the constructor', () => {      
      const entry = new HistoricalEntry(heading, eventType, time, place, description, figure);
      expect(entry.getHeading()).toBe('Birth, Herodotus');
      expect(entry.getEventType().getName()).toBe('Birth');
      expect(entry.getTime().getYear()).toBe(484);
      expect(entry.getPlace().getName()).toBe('Halicarnassus');
      expect(entry.getDescription()).toBe('The birth of the Father of History.');
      expect(entry.getFigure().getName()).toBe('Herodotus');
    });
  });
});