import { WorldGenData } from '../../../../src/data/geography/worldgen/WorldGenData';

describe('WorldGenData', () => {
  describe('constructor and create', () => {
    it('should create a WorldGenData instance with valid data', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      const worldGenData = WorldGenData.create(data);

      expect(worldGenData).toBeInstanceOf(WorldGenData);
      expect(worldGenData.getNumContinents()).toBe(3);
      expect(worldGenData.getNumSectors()).toBe(3);
      expect(worldGenData.getPlanetsPerSector()).toBe(64);
      expect(worldGenData.getFeaturesPerContinent()).toBe(50);
      expect(worldGenData.getContinentsPerPlanet()).toBe(5);
      expect(worldGenData.getFeaturesPerPlanetContinent()).toBe(64);
    });

    it('should be immutable after creation', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      const worldGenData = WorldGenData.create(data);

      expect(Object.isFrozen(worldGenData)).toBe(true);
    });

    it('should throw TypeError when numContinents is not a number', () => {
      const data = {
        numContinents: '3',
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });

    it('should throw TypeError when numSectors is not a number', () => {
      const data = {
        numContinents: 3,
        numSectors: '3',
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });

    it('should throw TypeError when planetsPerSector is not a number', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: '64',
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });

    it('should throw TypeError when featuresPerContinent is not a number', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: '50',
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: 64
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });

    it('should throw TypeError when continentsPerPlanet is not a number', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: '5',
        featuresPerPlanetContinent: 64
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });

    it('should throw TypeError when featuresPerPlanetContinent is not a number', () => {
      const data = {
        numContinents: 3,
        numSectors: 3,
        planetsPerSector: 64,
        featuresPerContinent: 50,
        continentsPerPlanet: 5,
        featuresPerPlanetContinent: '64'
      };

      expect(() => WorldGenData.create(data)).toThrow(TypeError);
    });
  });

  describe('createNull', () => {
    it('should create a null instance with all values as 0', () => {
      const nullInstance = WorldGenData.createNull();

      expect(nullInstance).toBeInstanceOf(WorldGenData);
      expect(nullInstance.getNumContinents()).toBe(0);
      expect(nullInstance.getNumSectors()).toBe(0);
      expect(nullInstance.getPlanetsPerSector()).toBe(0);
      expect(nullInstance.getFeaturesPerContinent()).toBe(0);
      expect(nullInstance.getContinentsPerPlanet()).toBe(0);
      expect(nullInstance.getFeaturesPerPlanetContinent()).toBe(0);
    });

    it('should return the same singleton instance on multiple calls', () => {
      const instance1 = WorldGenData.createNull();
      const instance2 = WorldGenData.createNull();

      expect(instance1).toBe(instance2);
    });
  });

  describe('getters', () => {
    let worldGenData: WorldGenData;

    beforeEach(() => {
      const data = {
        numContinents: 5,
        numSectors: 7,
        planetsPerSector: 32,
        featuresPerContinent: 25,
        continentsPerPlanet: 3,
        featuresPerPlanetContinent: 48
      };
      worldGenData = WorldGenData.create(data);
    });

    it('should return correct numContinents', () => {
      expect(worldGenData.getNumContinents()).toBe(5);
    });

    it('should return correct numSectors', () => {
      expect(worldGenData.getNumSectors()).toBe(7);
    });

    it('should return correct planetsPerSector', () => {
      expect(worldGenData.getPlanetsPerSector()).toBe(32);
    });

    it('should return correct featuresPerContinent', () => {
      expect(worldGenData.getFeaturesPerContinent()).toBe(25);
    });

    it('should return correct continentsPerPlanet', () => {
      expect(worldGenData.getContinentsPerPlanet()).toBe(3);
    });

    it('should return correct featuresPerPlanetContinent', () => {
      expect(worldGenData.getFeaturesPerPlanetContinent()).toBe(48);
    });
  });
});
