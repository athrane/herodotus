import { ChronicleEvent } from '../../src/chronicle/ChronicleEvent';
import { Time } from '../../src/time/Time';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';
import { Location } from '../../src/geography/Location';
import { EventType } from '../../src/chronicle/EventType';

describe('ChronicleEvent', () => {
  let heading;
  let eventType;
  let time;
  let figureComponent;
  let place;
  let description;

  beforeEach(() => {
    heading = 'Birth, Herodotus';
    eventType = new EventType('Political', 'Birth');
    time = new Time(484);
  figureComponent = HistoricalFigureComponent.create('Herodotus', -484, 59, 'Greek', 'Historian');
    place = Location.create(null, null, 'Halicarnassus');
    description = 'The birth of the Father of History.';
  });

  describe('constructor', () => {
    it('should create a ChronicleEvent with valid arguments', () => {
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figureComponent);
      expect(entry).toBeInstanceOf(ChronicleEvent);
      console.log(time);
      expect(entry.getHeading()).toBe(heading);
      expect(entry.getTime()).toBe(time);
      expect(entry.getFigure()).toBe(figureComponent);
      expect(entry.getPlace()).toBe(place);
      expect(entry.getDescription()).toBe(description);
    });

    it('should throw a TypeError for invalid argument types', () => {      
      expect(() => new ChronicleEvent(123, eventType, time, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, 'not event type', time, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, 'not time', place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, 'not place', description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, place, 123)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, place, description, 'not component')).toThrow(TypeError);
    });
  });

  describe('getters', () => {
    it('should return the correct values provided in the constructor', () => {      
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figureComponent);
      expect(entry.getHeading()).toBe('Birth, Herodotus');
      expect(entry.getEventType().getName()).toBe('Birth');
      expect(entry.getTime().getYear()).toBe(484);
      expect(entry.getPlace().getName()).toBe('Halicarnassus');
      expect(entry.getDescription()).toBe('The birth of the Father of History.');
      expect(entry.getFigure()?.name).toBe('Herodotus');
    });
  });
});