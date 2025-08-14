import { ChronicleEventComponent } from '../../src/chronicle/ChronicleEventComponent.ts';
import { ChronicleEvent } from '../../src/chronicle/ChronicleEvent.ts';
import { EventType } from '../../src/chronicle/EventType.ts';
import { EventCategory } from '../../src/chronicle/EventCategory.ts';
import { Time } from '../../src/time/Time.js';
import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure.js';
import { Place } from '../../src/generator/Place.ts';

describe('ChronicleEventComponent', () => {
  let sampleEvent1;
  let sampleEvent2;
  let eventType;
  let time;
  let place;
  let figure;

  beforeEach(() => {
    eventType = new EventType(EventCategory.POLITICAL, 'Birth');
    time = new Time(484);
    figure = new HistoricalFigure('Herodotus');
    place = new Place('Halicarnassus');
    
    sampleEvent1 = new ChronicleEvent(
      'Birth, Herodotus',
      eventType,
      time,
      place,
      'The birth of the Father of History.',
      figure
    );
    
    sampleEvent2 = new ChronicleEvent(
      'Historical Event',
      eventType,
      time,
      place,
      'Another significant event.',
      null
    );
  });

  describe('constructor', () => {
    it('should create an empty component when no events provided', () => {
      const component = new ChronicleEventComponent();
      expect(component).toBeInstanceOf(ChronicleEventComponent);
      expect(component.getEvents()).toHaveLength(0);
    });

    it('should create a component with initial events', () => {
      const component = new ChronicleEventComponent([sampleEvent1, sampleEvent2]);
      expect(component.getEvents()).toHaveLength(2);
      expect(component.getEvents()[0]).toBe(sampleEvent1);
      expect(component.getEvents()[1]).toBe(sampleEvent2);
    });

    it('should throw TypeError when events is not an array', () => {
      expect(() => new ChronicleEventComponent('not an array')).toThrow(TypeError);
      expect(() => new ChronicleEventComponent(123)).toThrow(TypeError);
      expect(() => new ChronicleEventComponent({})).toThrow(TypeError);
    });

    it('should throw TypeError when events array contains non-ChronicleEvent instances', () => {
      expect(() => new ChronicleEventComponent([sampleEvent1, { plain: 'object' }])).toThrow(TypeError);
      expect(() => new ChronicleEventComponent(['string'])).toThrow(TypeError);
      expect(() => new ChronicleEventComponent([123])).toThrow(TypeError);
    });
  });

  describe('addEvent', () => {
    let component;

    beforeEach(() => {
      component = new ChronicleEventComponent();
    });

    it('should add a valid ChronicleEvent', () => {
      component.addEvent(sampleEvent1);
      expect(component.getEvents()).toHaveLength(1);
      expect(component.getEvents()[0]).toBe(sampleEvent1);
    });

    it('should add multiple events', () => {
      component.addEvent(sampleEvent1);
      component.addEvent(sampleEvent2);
      expect(component.getEvents()).toHaveLength(2);
      expect(component.getEvents()[0]).toBe(sampleEvent1);
      expect(component.getEvents()[1]).toBe(sampleEvent2);
    });

    it('should throw TypeError when adding non-ChronicleEvent instances', () => {
      expect(() => component.addEvent({ plain: 'object' })).toThrow(TypeError);
      expect(() => component.addEvent('string')).toThrow(TypeError);
      expect(() => component.addEvent(123)).toThrow(TypeError);
      expect(() => component.addEvent(null)).toThrow(TypeError);
      expect(() => component.addEvent(undefined)).toThrow(TypeError);
    });
  });

  describe('getEvents', () => {
    it('should return empty array for empty component', () => {
      const component = new ChronicleEventComponent();
      const events = component.getEvents();
      expect(events).toHaveLength(0);
      expect(Array.isArray(events)).toBe(true);
    });

    it('should return all events in chronological order', () => {
      const component = new ChronicleEventComponent([sampleEvent1, sampleEvent2]);
      const events = component.getEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBe(sampleEvent1);
      expect(events[1]).toBe(sampleEvent2);
    });

    it('should return a read-only array', () => {
      const component = new ChronicleEventComponent([sampleEvent1]);
      const events = component.getEvents();
      
      // Should not be able to modify the returned array
      expect(() => events.push(sampleEvent2)).toThrow();
    });
  });

  describe('static create', () => {
    it('should create an empty component when no events provided', () => {
      const component = ChronicleEventComponent.create();
      expect(component).toBeInstanceOf(ChronicleEventComponent);
      expect(component.getEvents()).toHaveLength(0);
    });

    it('should create a component with initial events', () => {
      const component = ChronicleEventComponent.create([sampleEvent1, sampleEvent2]);
      expect(component.getEvents()).toHaveLength(2);
      expect(component.getEvents()[0]).toBe(sampleEvent1);
      expect(component.getEvents()[1]).toBe(sampleEvent2);
    });

    it('should throw TypeError when events contains non-ChronicleEvent instances', () => {
      expect(() => ChronicleEventComponent.create([sampleEvent1, { plain: 'object' }])).toThrow(TypeError);
    });
  });
});