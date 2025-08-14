import { ChronicleEvent } from '../../src/chronicle/ChronicleEvent.ts';
import { Time } from '../../src/time/Time.js';
import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure.ts';
import { Place } from '../../src/generator/Place.ts';
import { EventType } from '../../src/chronicle/EventType.ts';

describe('ChronicleEvent', () => {
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
    it('should create a ChronicleEvent with valid arguments', () => {
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figure);
      expect(entry).toBeInstanceOf(ChronicleEvent);
      console.log(time);
      expect(entry.getHeading()).toBe(heading);
      expect(entry.getTime()).toBe(time);
      expect(entry.getFigure()).toBe(figure);
      expect(entry.getPlace()).toBe(place);
      expect(entry.getDescription()).toBe(description);
    });

    it('should throw a TypeError for invalid argument types', () => {      
      expect(() => new ChronicleEvent(123, time, figure, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, 'not time', figure, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, time, 'not figure', place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, time, figure, 'not place', description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, time, figure, place, 123)).toThrow(TypeError);
    });
  });

  describe('getters', () => {
    it('should return the correct values provided in the constructor', () => {      
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figure);
      expect(entry.getHeading()).toBe('Birth, Herodotus');
      expect(entry.getEventType().getName()).toBe('Birth');
      expect(entry.getTime().getYear()).toBe(484);
      expect(entry.getPlace().getName()).toBe('Halicarnassus');
      expect(entry.getDescription()).toBe('The birth of the Father of History.');
      expect(entry.getFigure().getName()).toBe('Herodotus');
    });
  });
});