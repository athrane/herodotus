import { World } from '../../src/geography/World.ts';
import { Continent } from '../../src/geography/planet/Continent.ts';

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

  describe('create', () => {
    it('should create a world with a valid name', () => {
      const worldName = 'Mythical World';
      const newWorld = World.create(worldName);
      expect(newWorld).toBeInstanceOf(World);
      expect(newWorld.getName()).toBe(worldName);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => World.create(123)).toThrow(TypeError);
      expect(() => World.create(null)).toThrow(TypeError);
      expect(() => World.create(undefined)).toThrow(TypeError);
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

  describe('getRandomContinent', () => {
    it('should return null if no continents exist', () => {
      expect(world.getRandomContinent()).toBeNull();
    });

    it('should return a random continent from the world', () => {
      const continent1 = new Continent('Atlantis');
      const continent2 = new Continent('Lemuria');
      world.addContinent(continent1);
      world.addContinent(continent2);
      const randomContinent = world.getRandomContinent();
      expect([continent1, continent2]).toContain(randomContinent);
    });
  });

  describe('getContinents', () => {
    it('should return an empty array if no continents have been added', () => {
      expect(world.getContinents()).toEqual([]);
    });

    it('should return all added continents', () => {
      const continent1 = new Continent('North America');
      const continent2 = new Continent('South America');
      world.addContinent(continent1);
      world.addContinent(continent2);
      expect(world.getContinents()).toEqual([continent1, continent2]);
    });
  }); 

});