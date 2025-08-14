import { WorldGenerator } from '../../../src/generator/world/WorldGenerator.ts';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/GeographicalFeatureTypeRegistry.ts';
import { FeatureType } from '../../../src/geography/FeatureType.ts';

describe('WorldGenerator', () => {
  let nameGenerator;
  let worldGenerator;

  beforeEach(() => {
    // Mock NameGenerator by creating an object that inherits its prototype
    nameGenerator = Object.create(NameGenerator.prototype);
    nameGenerator.generateSyllableName = jest.fn();
    
    worldGenerator = new WorldGenerator(nameGenerator);

    // Mock the registry to return a predictable feature type
    const mockFeatureType = new FeatureType('Mountain', 'A large natural elevation of the earth\'s surface.');
    jest.spyOn(GeographicalFeatureTypeRegistry, 'getRandom').mockReturnValue(mockFeatureType);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance of WorldGenerator', () => {
      expect(worldGenerator).toBeInstanceOf(WorldGenerator);
    });

    it('should throw an error if nameGenerator is not an instance of NameGenerator', () => {
      expect(() => new WorldGenerator({})).toThrow(TypeError);
    });
  });

  /** 
  describe('generateContinent', () => {
    it('should generate a continent with the correct name and number of features', () => {
      nameGenerator.generateSyllableName.mockReturnValue('TestFeature');
      const continent = worldGenerator.generateContinent('TestContinent', 10);

      expect(continent).toBeInstanceOf(Continent);
      expect(continent.getName()).toBe('TestContinent');
      expect(continent.getFeatures().length).toBe(10);
      expect(nameGenerator.generateSyllableName).toHaveBeenCalledTimes(10);
    });
  });

  describe('generateWorld', () => {
    it('should generate a world with the correct name and number of continents', () => {
      nameGenerator.generateSyllableName.mockReturnValue('TestContinent');
      const world = worldGenerator.generateWorld('TestWorld');

      expect(world).toBeInstanceOf(World);
      expect(world.getName()).toBe('TestWorld');
      expect(world.getContinents().length).toBe(WorldGenerator.NUM_CONTINENTS);
      expect(nameGenerator.generateSyllableName).toHaveBeenCalledTimes(WorldGenerator.NUM_CONTINENTS);
    });

    it('should throw an error if worldName is not a string', () => {
        expect(() => worldGenerator.generateWorld(123)).toThrow('World name must be a string.');
    });
  });
  */

  describe('static create', () => {
    it('should return a new instance of WorldGenerator', () => {
      const newGenerator = WorldGenerator.create(nameGenerator);
      expect(newGenerator).toBeInstanceOf(WorldGenerator);
      expect(newGenerator).not.toBe(worldGenerator);
    });
  });
});
