import { Continent } from '../../src/geography/Continent.js';
import { GeographicalFeature } from '../../src/geography/GeographicalFeature.js';
import { FeatureType } from '../../src/geography/FeatureType.ts';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/GeographicalFeatureTypeRegistry.js';

describe('Continent', () => {
    let featureType;
    let featureType2;

    // Before each test, clear the registry to ensure a clean, isolated state.
    // This is crucial because the registry is a static singleton and its state
    // would otherwise persist between tests.
    beforeEach(() => {
        GeographicalFeatureTypeRegistry.clear();

        const key = 'MOUNTAIN';
        const displayName = 'Mountain';
        featureType = GeographicalFeatureTypeRegistry.register(key, displayName);

        const key2 = 'RIVER';
        const displayName2 = 'River';
        featureType2 = GeographicalFeatureTypeRegistry.register(key2, displayName2);

    });

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

  describe('create', () => {
    it('should create a new Continent instance with a valid name', () => {
      const name = 'Elysium';
      const continent = Continent.create(name);
      expect(continent).toBeInstanceOf(Continent);
      expect(continent.getName()).toBe(name);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => Continent.create(123)).toThrow(TypeError);
      expect(() => Continent.create({})).toThrow(TypeError);
      expect(() => Continent.create(null)).toThrow(TypeError);
      expect(() => Continent.create(undefined)).toThrow(TypeError);
      expect(() => Continent.create([])).toThrow(TypeError);
    });
  }); 

  describe('name getter', () => {
    it('should return the name provided in the constructor', () => {
      const name = 'Mu';
      const continent = Continent.create(name);
      expect(continent.getName()).toBe(name);
    });
  });

  describe('getRandomFeature', () => {
    it('should return null if no features exist', () => {
      const continent = Continent.create('Empty Continent');
      expect(continent.getRandomFeature()).toBeNull();
    });

    it('should return a random feature from the continent', () => {
      const continent = Continent.create('Featureful Continent');
      const feature1 = GeographicalFeature.create('Mountain', featureType);
      const feature2 = GeographicalFeature.create('River', featureType2);
      continent.addFeature(feature1);
      continent.addFeature(feature2);
      const randomFeature = continent.getRandomFeature();
      expect(randomFeature).toBeInstanceOf(GeographicalFeature);
      expect([feature1, feature2]).toContain(randomFeature);
    });
  });   

  describe('addFeature', () => {
    it('should add a feature to the continent', () => {
      const continent = Continent.create('Featureful Continent');
      const feature = GeographicalFeature.create('Mountain', featureType);
      continent.addFeature(feature);
      const feature2 = GeographicalFeature.create('River', featureType2);
      continent.addFeature(feature2);
      expect(continent.getFeatures()).toContain(feature2);
    });

    it('should throw a TypeError if the feature is not an instance of GeographicalFeature', () => {
      const continent = Continent.create('Invalid Feature Continent');
      expect(() => continent.addFeature({})).toThrow(TypeError);
    });
  }); 

});