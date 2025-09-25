import { WorldGenerator } from '../../../src/generator/world/WorldGenerator';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/GeographicalFeatureTypeRegistry';
import { FeatureType } from '../../../src/geography/FeatureType';
import { GalaxyMapComponent } from '../../../src/geography/galaxy/GalaxyMapComponent';
import { Continent } from '../../../src/geography/planet/Continent';

describe('WorldGenerator', () => {
  let nameGenerator;
  let worldGenerator;

  beforeEach(() => {
    // Mock NameGenerator by creating an object that inherits its prototype
    nameGenerator = Object.create(NameGenerator.prototype);
    nameGenerator.generateSyllableName = jest.fn();
    
    worldGenerator = new WorldGenerator(nameGenerator);
    GalaxyMapComponent.create().reset();

    // Mock the registry to return a predictable feature type
    const mockFeatureType = new FeatureType('Mountain', 'A large natural elevation of the earth\'s surface.');
    jest.spyOn(GeographicalFeatureTypeRegistry, 'getRandom').mockReturnValue(mockFeatureType);
    jest.spyOn(GeographicalFeatureTypeRegistry, 'has').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    GalaxyMapComponent.create().reset();
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

  describe('generateGalaxyMap', () => {
    it('should generate a galaxy with the expected number of sectors and planets', () => {
      nameGenerator.generateSyllableName.mockImplementation((category) => `${category}-name`);

      const galaxyMap = worldGenerator.generateGalaxyMap();

      expect(galaxyMap).toBeInstanceOf(GalaxyMapComponent);
      expect(galaxyMap.getSectorCount()).toBe(WorldGenerator.NUM_SECTORS);
      expect(galaxyMap.getPlanetCount()).toBe(WorldGenerator.NUM_SECTORS * WorldGenerator.PLANETS_PER_SECTOR);

      const sectors = galaxyMap.getSectors();
      sectors.forEach((sector) => {
        const planets = galaxyMap.getPlanetsInSector(sector.getId());
        expect(planets.length).toBe(WorldGenerator.PLANETS_PER_SECTOR);
      });

      const samplePlanetId = `${sectors[0].getId()}-planet-1`;
      const samplePlanet = galaxyMap.getPlanetById(samplePlanetId);
      expect(samplePlanet).toBeDefined();
      if (!samplePlanet) {
        throw new Error('Expected sample planet to be defined');
      }

      const continents = samplePlanet.getContinents();
      expect(continents).toHaveLength(WorldGenerator.CONTINENTS_PER_PLANET);
      continents.forEach((continent) => {
        expect(continent).toBeInstanceOf(Continent);
        expect(continent.getFeatures().length).toBe(WorldGenerator.FEATURES_PER_PLANET_CONTINENT);
      });

      const primaryGate = `${sectors[0].getId()}-planet-1`;
      const neighbours = galaxyMap.getConnectedPlanets(primaryGate);
      expect(neighbours.length).toBeGreaterThanOrEqual(2);
    });

    it('should cache the generated galaxy map for later retrieval', () => {
      nameGenerator.generateSyllableName.mockReturnValue('cached-name');

      const galaxyMap = worldGenerator.generateGalaxyMap();
      const cached = worldGenerator.getLatestGalaxyMap();

      expect(cached).toBe(galaxyMap);
    });

    it('should throw if the latest galaxy map is requested before generation', () => {
      const generator = WorldGenerator.create(nameGenerator);
      expect(() => generator.getLatestGalaxyMap()).toThrow('Galaxy map has not been generated yet.');
    });
  });
});
