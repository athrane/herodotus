import { Component } from '../../src/ecs/Component';
import { TimeComponent } from '../../src/time/TimeComponent';
import { NameComponent } from '../../src/ecs/NameComponent';
import { Time } from '../../src/time/Time';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { EventType } from '../../src/chronicle/EventType';
import { ChronicleEvent } from '../../src/chronicle/ChronicleEvent';
import { Place } from '../../src/generator/Place';
import { FeatureType } from '../../src/geography/feature/FeatureType';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { Sector } from '../../src/geography/galaxy/Sector';
import { Continent } from '../../src/geography/planet/Continent';

describe('Null Object Pattern', () => {
  describe('Component base class', () => {
    it('should have a static Null getter', () => {
      expect(Component.Null).toBeDefined();
      expect(Component.Null).toBeInstanceOf(Component);
    });

    it('should return the same instance on multiple calls', () => {
      const null1 = Component.Null;
      const null2 = Component.Null;
      expect(null1).toBe(null2);
    });

    it('should return a frozen instance', () => {
      const nullInstance = Component.Null;
      expect(Object.isFrozen(nullInstance)).toBe(true);
    });
  });

  describe('TimeComponent', () => {
    it('should have a static Null getter', () => {
      expect(TimeComponent.Null).toBeDefined();
      expect(TimeComponent.Null).toBeInstanceOf(TimeComponent);
      expect(TimeComponent.Null).toBeInstanceOf(Component);
    });

    it('should return a valid Time object', () => {
      const nullTimeComponent = TimeComponent.Null;
      expect(nullTimeComponent.getTime()).toBeDefined();
      expect(nullTimeComponent.getTime()).toBeInstanceOf(Time);
      expect(nullTimeComponent.getTime().getYear()).toBe(0);
    });

    it('should return the same instance on multiple calls', () => {
      const null1 = TimeComponent.Null;
      const null2 = TimeComponent.Null;
      expect(null1).toBe(null2);
    });
  });

  describe('NameComponent', () => {
    it('should have a static Null getter', () => {
      expect(NameComponent.Null).toBeDefined();
      expect(NameComponent.Null).toBeInstanceOf(NameComponent);
    });

    it('should return empty string for text', () => {
      const nullNameComponent = NameComponent.Null;
      expect(nullNameComponent.getText()).toBe('');
    });
  });

  describe('Time data class', () => {
    it('should have a static Null getter', () => {
      expect(Time.Null).toBeDefined();
      expect(Time.Null).toBeInstanceOf(Time);
    });

    it('should return year 0', () => {
      const nullTime = Time.Null;
      expect(nullTime.getYear()).toBe(0);
    });

    it('should return the same instance on multiple calls', () => {
      const null1 = Time.Null;
      const null2 = Time.Null;
      expect(null1).toBe(null2);
    });
  });

  describe('DataSetEvent', () => {
    it('should have a static Null getter', () => {
      expect(DataSetEvent.Null).toBeDefined();
      expect(DataSetEvent.Null).toBeInstanceOf(DataSetEvent);
    });

    it('should return empty strings for all fields', () => {
      const nullEvent = DataSetEvent.Null;
      expect(nullEvent.getEventType()).toBe('');
      expect(nullEvent.getCause()).toBe('');
      expect(nullEvent.getEventName()).toBe('');
      expect(nullEvent.getHeading()).toBe('');
      expect(nullEvent.getPlace()).toBe('');
    });
  });

  describe('DataSetEventComponent', () => {
    it('should have a static Null getter', () => {
      expect(DataSetEventComponent.Null).toBeDefined();
      expect(DataSetEventComponent.Null).toBeInstanceOf(DataSetEventComponent);
    });

    it('should return DataSetEvent.Null', () => {
      const nullComponent = DataSetEventComponent.Null;
      expect(nullComponent.getDataSetEvent()).toBe(DataSetEvent.Null);
    });
  });

  describe('EventType', () => {
    it('should have a static Null getter', () => {
      expect(EventType.Null).toBeDefined();
      expect(EventType.Null).toBeInstanceOf(EventType);
    });

    it('should return Social category and empty name', () => {
      const nullEventType = EventType.Null;
      expect(nullEventType.getCategory()).toBe('Social');
      expect(nullEventType.getName()).toBe('');
    });
  });

  describe('Place', () => {
    it('should have a static Null getter', () => {
      expect(Place.Null).toBeDefined();
      expect(Place.Null).toBeInstanceOf(Place);
    });

    it('should return empty name', () => {
      const nullPlace = Place.Null;
      expect(nullPlace.getName()).toBe('');
    });
  });

  describe('ChronicleEvent', () => {
    it('should have a static Null getter', () => {
      expect(ChronicleEvent.Null).toBeDefined();
      expect(ChronicleEvent.Null).toBeInstanceOf(ChronicleEvent);
    });

    it('should have empty heading and description', () => {
      const nullEvent = ChronicleEvent.Null;
      expect(nullEvent.getHeading()).toBe('');
      expect(nullEvent.getDescription()).toBe('');
    });

    it('should have Null dependencies', () => {
      const nullEvent = ChronicleEvent.Null;
      expect(nullEvent.getEventType()).toBe(EventType.Null);
      expect(nullEvent.getTime()).toBe(Time.Null);
      expect(nullEvent.getPlace()).toBe(Place.Null);
      expect(nullEvent.getFigure()).toBeNull();
    });
  });

  describe('FeatureType', () => {
    it('should have a static Null getter', () => {
      expect(FeatureType.Null).toBeDefined();
      expect(FeatureType.Null).toBeInstanceOf(FeatureType);
    });

    it('should return empty strings for key and name', () => {
      const nullType = FeatureType.Null;
      expect(nullType.getKey()).toBe('');
      expect(nullType.getName()).toBe('');
    });
  });

  describe('GeographicalFeature', () => {
    it('should have a static Null getter', () => {
      expect(GeographicalFeature.Null).toBeDefined();
      expect(GeographicalFeature.Null).toBeInstanceOf(GeographicalFeature);
    });

    it('should have empty name and FeatureType.Null', () => {
      const nullFeature = GeographicalFeature.Null;
      expect(nullFeature.getName()).toBe('');
      expect(nullFeature.getType()).toBe(FeatureType.Null);
    });
  });

  describe('Sector', () => {
    it('should have a static Null getter', () => {
      expect(Sector.Null).toBeDefined();
      expect(Sector.Null).toBeInstanceOf(Sector);
    });

    it('should have empty id and name', () => {
      const nullSector = Sector.Null;
      expect(nullSector.getId()).toBe('');
      expect(nullSector.getName()).toBe('');
      expect(nullSector.getPlanetIds()).toEqual([]);
    });
  });

  describe('Continent', () => {
    it('should have a static Null getter', () => {
      expect(Continent.Null).toBeDefined();
      expect(Continent.Null).toBeInstanceOf(Continent);
    });

    it('should have empty name and no features', () => {
      const nullContinent = Continent.Null;
      expect(nullContinent.getName()).toBe('');
      expect(nullContinent.getFeatures()).toEqual([]);
    });
  });

  describe('Null objects are immutable', () => {
    it('Time.Null should be frozen', () => {
      expect(Object.isFrozen(Time.Null)).toBe(true);
    });

    it('TimeComponent.Null should be frozen', () => {
      expect(Object.isFrozen(TimeComponent.Null)).toBe(true);
    });

    it('DataSetEvent.Null should be frozen', () => {
      expect(Object.isFrozen(DataSetEvent.Null)).toBe(true);
    });

    it('EventType.Null should be frozen', () => {
      expect(Object.isFrozen(EventType.Null)).toBe(true);
    });

    it('ChronicleEvent.Null should be frozen', () => {
      expect(Object.isFrozen(ChronicleEvent.Null)).toBe(true);
    });
  });

  describe('Null objects prevent null reference errors', () => {
    it('should allow safe method calls on Null component', () => {
      const component = TimeComponent.Null;
      expect(() => component.getTime()).not.toThrow();
      expect(() => component.getTime().getYear()).not.toThrow();
    });

    it('should allow safe method calls on Null data object', () => {
      const event = DataSetEvent.Null;
      expect(() => event.getEventType()).not.toThrow();
      expect(() => event.getEventName()).not.toThrow();
    });

    it('should allow safe chaining through Null objects', () => {
      const chronicleEvent = ChronicleEvent.Null;
      expect(() => {
        const year = chronicleEvent.getTime().getYear();
        const category = chronicleEvent.getEventType().getCategory();
        const placeName = chronicleEvent.getPlace().getName();
        return { year, category, placeName };
      }).not.toThrow();
    });
  });
});
