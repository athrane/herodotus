import { RealmData } from '../../../src/data/realm/RealmData';

describe('RealmData', () => {
  describe('create', () => {
    it('should create a valid RealmData instance with all fields', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      const realmData = RealmData.create(data);

      expect(realmData.getNumberOfRealms()).toBe(5);
      expect(realmData.getMinPlanetsPerRealm()).toBe(3);
      expect(realmData.getMaxPlanetsPerRealm()).toBe(5);
      expect(realmData.getEnsurePlayerRealm()).toBe(true);
      expect(realmData.getSpatialDistribution()).toBe('random');
    });

    it('should create an immutable instance', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      const realmData = RealmData.create(data);

      expect(Object.isFrozen(realmData)).toBe(true);
    });

    it('should accept distributed spatial distribution', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'distributed'
      };

      const realmData = RealmData.create(data);

      expect(realmData.getSpatialDistribution()).toBe('distributed');
    });

    it('should accept sectored spatial distribution', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'sectored'
      };

      const realmData = RealmData.create(data);

      expect(realmData.getSpatialDistribution()).toBe('sectored');
    });
  });

  describe('validation', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(console, 'trace').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      jest.restoreAllMocks();
    });

    it('should throw TypeError when numberOfRealms is not a number', () => {
      const data = {
        numberOfRealms: 'not-a-number',
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData numberOfRealms must be a number.');
    });

    it('should throw TypeError when minPlanetsPerRealm is not a number', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 'not-a-number',
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData minPlanetsPerRealm must be a number.');
    });

    it('should throw TypeError when maxPlanetsPerRealm is not a number', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 'not-a-number',
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData maxPlanetsPerRealm must be a number.');
    });

    it('should throw TypeError when ensurePlayerRealm is not a boolean', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: 'not-a-boolean',
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData ensurePlayerRealm must be a boolean.');
    });

    it('should throw TypeError when spatialDistribution is not a string', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 123
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData spatialDistribution must be a string.');
    });

    it('should throw TypeError when minPlanetsPerRealm is less than 1', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 0,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData minPlanetsPerRealm must be at least 1.');
    });

    it('should throw TypeError when maxPlanetsPerRealm is less than minPlanetsPerRealm', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 5,
        maxPlanetsPerRealm: 3,
        ensurePlayerRealm: true,
        spatialDistribution: 'random'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
    });

    it('should throw TypeError when spatialDistribution is invalid', () => {
      const data = {
        numberOfRealms: 5,
        minPlanetsPerRealm: 3,
        maxPlanetsPerRealm: 5,
        ensurePlayerRealm: true,
        spatialDistribution: 'invalid'
      };

      expect(() => RealmData.create(data)).toThrow(TypeError);
      expect(() => RealmData.create(data)).toThrow('RealmData spatialDistribution must be one of: random, distributed, sectored.');
    });

    it('should throw TypeError when data is null', () => {
      expect(() => RealmData.create(null)).toThrow(TypeError);
    });

    it('should throw TypeError when data is undefined', () => {
      expect(() => RealmData.create(undefined)).toThrow(TypeError);
    });
  });

  describe('createNull', () => {
    it('should create a null instance with default values', () => {
      const nullInstance = RealmData.createNull();

      expect(nullInstance.getNumberOfRealms()).toBe(0);
      expect(nullInstance.getMinPlanetsPerRealm()).toBe(1);
      expect(nullInstance.getMaxPlanetsPerRealm()).toBe(1);
      expect(nullInstance.getEnsurePlayerRealm()).toBe(false);
      expect(nullInstance.getSpatialDistribution()).toBe('random');
    });

    it('should return the same singleton instance on multiple calls', () => {
      const instance1 = RealmData.createNull();
      const instance2 = RealmData.createNull();

      expect(instance1).toBe(instance2);
    });

    it('should create an immutable null instance', () => {
      const nullInstance = RealmData.createNull();

      expect(Object.isFrozen(nullInstance)).toBe(true);
    });
  });
});
