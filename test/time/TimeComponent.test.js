import { TimeComponent } from '../../src/time/TimeComponent.ts';
import { Time } from '../../src/time/Time.ts';

describe('TimeComponent', () => {
  describe('constructor', () => {
    it('should create a TimeComponent with a valid Time object', () => {
      const time = Time.create(1066);
      const component = TimeComponent.create(time);
      expect(component).toBeInstanceOf(TimeComponent);
      expect(component.getTime()).toBe(time);
    });

    it('should throw a TypeError if the argument is not a Time instance', () => {
      expect(() => TimeComponent.create({ year: 1066 })).toThrow(TypeError);
      expect(() => TimeComponent.create(1066)).toThrow(TypeError);
      expect(() => TimeComponent.create('1066')).toThrow(TypeError);
      expect(() => TimeComponent.create(null)).toThrow(TypeError);
      expect(() => TimeComponent.create(undefined)).toThrow(TypeError);
    });
  });

  describe('getTime', () => {
    it('should return the Time object it was constructed with', () => {
      const time = Time.create(1492);
      const component = TimeComponent.create(time);
      expect(component.getTime()).toBe(time);
      expect(component.getTime().getYear()).toBe(1492);
    });

    it('should return consistent values on multiple calls', () => {
      const time = Time.create(1776);
      const component = TimeComponent.create(time);
      const retrievedTime1 = component.getTime();
      const retrievedTime2 = component.getTime();
      
      expect(retrievedTime1).toBe(retrievedTime2);
      expect(retrievedTime1).toBe(time);
    });
  });

  describe('setTime', () => {
    it('should update the Time object to a new valid Time instance', () => {
      const time = Time.create(1066);
      const component = TimeComponent.create(time);
      const newTime = Time.create(1776);
      component.setTime(newTime);
      expect(component.getTime()).toBe(newTime);
      expect(component.getTime().getYear()).toBe(1776);
    });

    it('should throw a TypeError if the new time is not a Time instance', () => {
      const time = Time.create(1066);
      const component = TimeComponent.create(time);
      expect(() => component.setTime({ year: 1776 })).toThrow(TypeError);
      expect(() => component.setTime(1776)).toThrow(TypeError);
      expect(() => component.setTime('1776')).toThrow(TypeError);
      expect(() => component.setTime(null)).toThrow(TypeError);
      expect(() => component.setTime(undefined)).toThrow(TypeError);
    });

    it('should allow setting the same Time instance multiple times', () => {
      const time = Time.create(1066);
      const component = TimeComponent.create(time);
      const newTime = Time.create(1776);
      
      component.setTime(newTime);
      component.setTime(newTime); // Same instance again
      
      expect(component.getTime()).toBe(newTime);
    });

    it('should support chaining multiple setTime calls', () => {
      const initialTime = Time.create(1000);
      const time1 = Time.create(1500);
      const time2 = Time.create(1600);
      const time3 = Time.create(1700);
      
      const component = TimeComponent.create(initialTime);
      
      component.setTime(time1);
      expect(component.getTime().getYear()).toBe(1500);
      
      component.setTime(time2);
      expect(component.getTime().getYear()).toBe(1600);
      
      component.setTime(time3);
      expect(component.getTime().getYear()).toBe(1700);
    });

    it('should handle edge case Time values correctly', () => {
      const component = TimeComponent.create(Time.create(1000));
      
      // Test zero
      const zeroTime = Time.create(0);
      component.setTime(zeroTime);
      expect(component.getTime().getYear()).toBe(0);
      
      // Test negative
      const negativeTime = Time.create(-500);
      component.setTime(negativeTime);
      expect(component.getTime().getYear()).toBe(-500);
      
      // Test large positive
      const largeTime = Time.create(999999);
      component.setTime(largeTime);
      expect(component.getTime().getYear()).toBe(999999);
    });
  });
  
  describe('static create', () => {
    it('should create a new instance of TimeComponent', () => {
      const time = Time.create(2024);
      const component = TimeComponent.create(time);
      expect(component).toBeInstanceOf(TimeComponent);
      expect(component.getTime()).toBe(time);
    });

    it('should create multiple distinct component instances', () => {
      const time = Time.create(2024);
      const component1 = TimeComponent.create(time);
      const component2 = TimeComponent.create(time);
      
      expect(component1).not.toBe(component2); // Different component instances
      expect(component1.getTime()).toBe(time); // Same time reference
      expect(component2.getTime()).toBe(time);
    });
  });

  describe('component behavior', () => {
    it('should maintain Time reference integrity', () => {
      const originalTime = Time.create(1066);
      const component = TimeComponent.create(originalTime);
      
      // The component should hold the exact same Time instance
      expect(component.getTime()).toBe(originalTime);
      expect(component.getTime() === originalTime).toBe(true);
    });

    it('should not modify the original Time object when creating component', () => {
      const time = Time.create(1492);
      const originalYear = time.getYear();
      
      TimeComponent.create(time);
      
      // Time object should remain unchanged
      expect(time.getYear()).toBe(originalYear);
    });
  });

  describe('error handling', () => {
    it('should provide meaningful error messages for invalid Time in constructor', () => {
      try {
        TimeComponent.create('invalid');
        fail('Expected TypeError to be thrown');
      } catch (error) {
        expect(error.message).toContain('time must be an instance of the Time class');
      }
    });

    it('should provide meaningful error messages for invalid Time in setTime', () => {
      const component = TimeComponent.create(Time.create(1000));
      
      try {
        component.setTime('invalid');
        fail('Expected TypeError to be thrown');
      } catch (error) {
        expect(error.message).toContain('time must be an instance of the Time class');
      }
    });
  });
});