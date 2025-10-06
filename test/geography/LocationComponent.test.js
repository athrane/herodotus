import { LocationComponent } from '../../src/geography/LocationComponent';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { PlanetComponent } from '../../src/geography/planet/PlanetComponent';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry';

describe('LocationComponent', () => {
  beforeEach(() => {
    // Clear registry to ensure clean state
    GeographicalFeatureTypeRegistry.clear();
  });

  describe('create', () => {
    it('should create a LocationComponent with valid feature and planet', () => {
      const featureType = GeographicalFeatureTypeRegistry.register('mountains', 'Mountain');
      const feature = GeographicalFeature.create('Mount Everest', featureType);
      const planet = PlanetComponent.createNullPlanet();

      const location = LocationComponent.create(feature, planet);

      expect(location).toBeInstanceOf(LocationComponent);
      expect(location.getName()).toBe('Mount Everest, Null Planet');
      expect(location.getFeature()).toBe(feature);
      expect(location.getPlanet()).toBe(planet);
    });

    it('should throw TypeError when feature is not a GeographicalFeature', () => {
      const planet = PlanetComponent.createNullPlanet();

      expect(() => LocationComponent.create(null, planet)).toThrow(TypeError);
      expect(() => LocationComponent.create(undefined, planet)).toThrow(TypeError);
      expect(() => LocationComponent.create('not a feature', planet)).toThrow(TypeError);
      expect(() => LocationComponent.create({}, planet)).toThrow(TypeError);
    });

    it('should throw TypeError when planet is not a PlanetComponent', () => {
      const feature = GeographicalFeature.createNullFeature();

      expect(() => LocationComponent.create(feature, null)).toThrow(TypeError);
      expect(() => LocationComponent.create(feature, undefined)).toThrow(TypeError);
      expect(() => LocationComponent.create(feature, 'not a planet')).toThrow(TypeError);
      expect(() => LocationComponent.create(feature, {})).toThrow(TypeError);
    });
  });

  describe('getName', () => {
    it('should return the formatted location name', () => {
      const featureType = GeographicalFeatureTypeRegistry.register('deserts', 'Desert');
      const feature = GeographicalFeature.create('Sahara Desert', featureType);
      const planet = PlanetComponent.createNullPlanet();

      const location = LocationComponent.create(feature, planet);

      expect(location.getName()).toBe('Sahara Desert, Null Planet');
    });
  });

  describe('getFeature', () => {
    it('should return the geographical feature', () => {
      const featureType = GeographicalFeatureTypeRegistry.register('forests', 'Rainforest');
      const feature = GeographicalFeature.create('Amazon Rainforest', featureType);
      const planet = PlanetComponent.createNullPlanet();

      const location = LocationComponent.create(feature, planet);

      expect(location.getFeature()).toBe(feature);
    });
  });

  describe('getPlanet', () => {
    it('should return the planet component', () => {
      const feature = GeographicalFeature.createNullFeature();
      const planet = PlanetComponent.createNullPlanet();

      const location = LocationComponent.create(feature, planet);

      expect(location.getPlanet()).toBe(planet);
    });
  });

  describe('createNullLocation', () => {
    it('should create a null LocationComponent instance', () => {
      const nullLocation = LocationComponent.createNullLocation();

      expect(nullLocation).toBeInstanceOf(LocationComponent);
      expect(nullLocation.getFeature()).toBeInstanceOf(GeographicalFeature);
      expect(nullLocation.getPlanet()).toBeInstanceOf(PlanetComponent);
    });

    it('should return the same singleton instance on multiple calls', () => {
      const nullLocation1 = LocationComponent.createNullLocation();
      const nullLocation2 = LocationComponent.createNullLocation();

      expect(nullLocation1).toBe(nullLocation2);
    });

    it('should have null feature and null planet', () => {
      const nullLocation = LocationComponent.createNullLocation();

      expect(nullLocation.getFeature()).toBe(GeographicalFeature.createNullFeature());
      expect(nullLocation.getPlanet()).toBe(PlanetComponent.createNullPlanet());
    });

    it('should have a formatted null location name', () => {
      const nullLocation = LocationComponent.createNullLocation();

      // The name should be based on null feature and null planet names
      expect(nullLocation.getName()).toBe('Unknown, Null Planet');
    });
  });
});
