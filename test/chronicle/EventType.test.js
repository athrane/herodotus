import { EventType } from '../../src/chronicle/EventType.js';
import { EventCategory } from '../../src/chronicle/EventCategory.js';


describe('EventType', () => {
  describe('constructor', () => {
    it('should create an EventType with a valid category and name', () => {
      const category = EventCategory.POLITICAL;
      const name = 'Formation of State';
      const eventType = new EventType(category, name);
      expect(eventType).toBeInstanceOf(EventType);
      expect(eventType.getCategory()).toBe(category);
      expect(eventType.getName()).toBe(name);
    });

    it('should throw a TypeError if the category is not a string', () => {
      const name = 'Formation of State';
      expect(() => new EventType(123, name)).toThrow(TypeError);
      expect(() => new EventType(null, name)).toThrow(TypeError);
    });

    it('should throw a TypeError if the name is not a string', () => {
      const category = EventCategory.POLITICAL;
      expect(() => new EventType(category, 123)).toThrow(TypeError);
      expect(() => new EventType(category, null)).toThrow(TypeError);
    });

    it('should throw a TypeError for an invalid category string', () => {
      const name = 'Formation of State';
      const invalidCategory = 'Not a real category';
      expect(() => new EventType(invalidCategory, name)).toThrow(`Invalid event category: ${invalidCategory}`);
    });
  });

  describe('getters', () => {
    it('should return the correct category', () => {
      const category = EventCategory.ECONOMIC;
      const name = 'Trade Route Establishment';
      const eventType = new EventType(category, name);
      expect(eventType.getCategory()).toBe(category);
    });

    it('should return the correct name', () => {
      const category = EventCategory.SOCIAL;
      const name = 'Great Plague';
      const eventType = new EventType(category, name);
      expect(eventType.getName()).toBe(name);
    });
  });
});