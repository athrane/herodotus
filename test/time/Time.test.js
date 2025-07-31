import { Time } from '../../src/time/Time.js';

describe('Time', () => {
  describe('constructor', () => {
    it('should create a Time object with a valid year', () => {
      const time = Time.create(1066);
      expect(time).toBeInstanceOf(Time);
      expect(time.getYear()).toBe(1066);
    });

    it('should throw a TypeError if the year is not a number', () => {
      expect(() => Time.create('1066')).toThrow(TypeError);
      expect(() => Time.create(null)).toThrow(TypeError);
      expect(() => Time.create(undefined)).toThrow(TypeError);
      expect(() => Time.create({})).toThrow(TypeError);
      expect(() => Time.create([])).toThrow(TypeError);
    });
  });

  describe('getYear', () => {
    it('should return the year it was constructed with', () => {
      const time = Time.create(1492);
      expect(time.getYear()).toBe(1492);
    });
  });

  describe('static create', () => {
    it('should create a new instance of Time', () => {
      const time = Time.create(2024);
      expect(time).toBeInstanceOf(Time);
      expect(time.getYear()).toBe(2024);
    });

    it('should throw a TypeError if the year is not a number', () => {
      expect(() => Time.create('2024')).toThrow(TypeError);
    });
  });
});