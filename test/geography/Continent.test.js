import { Continent } from '../../src/geography/Continent.js';

describe('Continent', () => {
  describe('constructor', () => {
    it('should create a Continent with a valid name', () => {
      const name = 'Atlantis';
      const continent = new Continent(name);
      expect(continent).toBeInstanceOf(Continent);
      expect(continent.getName()).toBe(name);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => new Continent(123)).toThrow(TypeError);
      expect(() => new Continent({})).toThrow(TypeError);
      expect(() => new Continent(null)).toThrow(TypeError);
      expect(() => new Continent(undefined)).toThrow(TypeError);
      expect(() => new Continent([])).toThrow(TypeError);
    });
  });

  describe('name getter', () => {
    it('should return the name provided in the constructor', () => {
      const name = 'Mu';
      const continent = new Continent(name);
      expect(continent.getName()).toBe(name);
    });
  });
});