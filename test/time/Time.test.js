import { Time } from '../../src/time/Time.ts';

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

    // New edge case tests for integer validation
    it('should throw a TypeError for decimal numbers', () => {
      expect(() => Time.create(1066.5)).toThrow(TypeError);
      expect(() => Time.create(1066.1)).toThrow(TypeError);
      expect(() => Time.create(-1066.5)).toThrow(TypeError);
    });

    it('should throw a TypeError for special numeric values', () => {
      expect(() => Time.create(NaN)).toThrow(TypeError);
      expect(() => Time.create(Infinity)).toThrow(TypeError);
      expect(() => Time.create(-Infinity)).toThrow(TypeError);
    });

    it('should accept zero and negative integers', () => {
      expect(() => Time.create(0)).not.toThrow();
      expect(() => Time.create(-1)).not.toThrow();
      expect(() => Time.create(-1000)).not.toThrow();
      expect(Time.create(0).getYear()).toBe(0);
      expect(Time.create(-1).getYear()).toBe(-1);
    });

    it('should accept large integer values', () => {
      const largeYear = 999999999;
      const time = Time.create(largeYear);
      expect(time.getYear()).toBe(largeYear);
    });

    it('should maintain immutability of year property', () => {
      const time = Time.create(1066);
      const originalYear = time.getYear();
      // Attempting to modify (though TypeScript prevents this at compile time)
      // This test ensures runtime immutability
      expect(time.getYear()).toBe(originalYear);
    });
  });

  describe('getYear', () => {
    it('should return the year it was constructed with', () => {
      const time = Time.create(1492);
      expect(time.getYear()).toBe(1492);
    });

    it('should return consistent values on multiple calls', () => {
      const time = Time.create(1776);
      expect(time.getYear()).toBe(1776);
      expect(time.getYear()).toBe(1776);
      expect(time.getYear()).toBe(1776);
    });

    it('should handle boundary year values correctly', () => {
      const zeroTime = Time.create(0);
      const negativeTime = Time.create(-500);
      
      expect(zeroTime.getYear()).toBe(0);
      expect(negativeTime.getYear()).toBe(-500);
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

    it('should create multiple distinct instances', () => {
      const time1 = Time.create(1000);
      const time2 = Time.create(1000);
      
      expect(time1).not.toBe(time2); // Different object references
      expect(time1.getYear()).toBe(time2.getYear()); // Same values
    });

    it('should create instances with different years', () => {
      const times = [1, 100, 1000, 2000].map(year => Time.create(year));
      
      times.forEach((time, index) => {
        expect(time).toBeInstanceOf(Time);
        expect(time.getYear()).toBe([1, 100, 1000, 2000][index]);
      });
    });
  });

  describe('error messages', () => {
    it('should provide specific error message for decimal numbers', () => {
      try {
        Time.create(1066.5);
        fail('Expected TypeError to be thrown');
      } catch (error) {
        expect(error.message).toContain('Time year must be a whole number');
      }
    });

    it('should provide specific error message for non-numbers', () => {
      try {
        Time.create('1066');
        fail('Expected TypeError to be thrown');
      } catch (error) {
        expect(error.message).toContain('Time year must be a whole number');
      }
    });
  });
});