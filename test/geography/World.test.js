import { World } from '../../src/geography/World.js';
import { Continent } from '../../src/geography/Continent.js';

describe('World', () => {
  let world;

  beforeEach(() => {
    world = World.create("Test World");
  });

  describe('constructor', () => {
    it('should create an empty world', () => {
      expect(world).toBeInstanceOf(World);
      expect(world.getContinents()).toEqual([]);
    });
  });

  describe('addContinent', () => {
    it('should add a Continent to the world', () => {
      const continent = new Continent('Pangea');
      world.addContinent(continent);
      expect(world.getContinents()).toHaveLength(1);
      expect(world.getContinents()[0]).toBe(continent);
    });

    it('should allow multiple continents to be added', () => {
      const continent1 = new Continent('Laurasia');
      const continent2 = new Continent('Gondwana');
      world.addContinent(continent1);
      world.addContinent(continent2);
      expect(world.getContinents()).toHaveLength(2);
      expect(world.getContinents()[0]).toBe(continent1);
      expect(world.getContinents()[1]).toBe(continent2);
    });

    it('should throw a TypeError if a non-Continent object is added', () => {
      const notAContinent = { name: 'Not a real continent.' };
      expect(() => world.addContinent(notAContinent)).toThrow(TypeError);
    });

    it('should throw a TypeError for primitive values', () => {
      expect(() => world.addContinent('a string')).toThrow(TypeError);
      expect(() => world.addContinent(123)).toThrow(TypeError);
      expect(() => world.addContinent(null)).toThrow(TypeError);
      expect(() => world.addContinent(undefined)).toThrow(TypeError);
    });
  });

  describe('getName', () => {
    it('should return the name of the world', () => {
      const worldName = 'Earth';
      world = World.create(worldName);
      expect(world.getName()).toBe(worldName);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => World.create(123)).toThrow(TypeError);
      expect(() => World.create(null)).toThrow(TypeError);
      expect(() => World.create(undefined)).toThrow(TypeError);
    });
  });

});