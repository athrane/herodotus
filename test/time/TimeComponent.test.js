import { TimeComponent } from '../../src/time/TimeComponent.js';
import { Time } from '../../src/time/Time.js';

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
  });
  
  describe('static create', () => {
    it('should create a new instance of TimeComponent', () => {
      const time = Time.create(2024);
      const component = TimeComponent.create(time);
      expect(component).toBeInstanceOf(TimeComponent);
      expect(component.getTime()).toBe(time);
    });
  });
});