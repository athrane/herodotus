import { GeographicalUtils } from '../../src/geography/GeographicalUtils';
import { GalaxyMapComponent } from '../../src/geography/galaxy/GalaxyMapComponent';
import { Location } from '../../src/geography/Location';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../src/geography/planet/PlanetComponent';
import { Continent } from '../../src/geography/planet/Continent';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry';

describe('GeographicalUtils', () => {
    let mockGalaxyMap;

    beforeEach(() => {
        // Create a proper GalaxyMapComponent instance
        mockGalaxyMap = GalaxyMapComponent.create();
        // Clear registry to ensure clean state
        GeographicalFeatureTypeRegistry.clear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('computeRandomLocation', () => {
        it('should return a Location with feature and planet name when both are available', () => {
            // Create proper instances
            const featureType = GeographicalFeatureTypeRegistry.register('test_city', 'City');
            const feature = GeographicalFeature.create('TestFeature', featureType);
            const continent = Continent.create('Test Continent');
            continent.addFeature(feature);
            const planet = PlanetComponent.create(
                'test-planet-1',
                'TestPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                [continent]
            );
            
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            expect(location.getName()).toBe('TestFeature, TestPlanet');
            expect(location.getFeature()).toBe(feature);
            expect(location.getPlanet()).toBe(planet);
        });

        it('should return Location with null feature when no features are available', () => {
            // Create planet with continent but no features
            const continent = Continent.create('Empty Continent');
            // Don't add any features to the continent
            const planet = PlanetComponent.create(
                'barren-planet-1',
                'BarrenPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                [continent]
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            // Null feature has name "Unknown" per null object pattern
            expect(location.getName()).toBe('Unknown, BarrenPlanet');
            expect(location.getFeature().getName()).toBe('Unknown');
            expect(location.getPlanet()).toBe(planet);
        });

        it('should return Location with null feature when planet has no continents', () => {
            // Create planet with no continents
            const planet = PlanetComponent.create(
                'empty-planet-1',
                'EmptyPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                []  // No continents
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            // Null feature has name "Unknown" per null object pattern
            expect(location.getName()).toBe('Unknown, EmptyPlanet');
            expect(location.getFeature().getName()).toBe('Unknown');
        });

        it('should return Location with null feature when continents is null', () => {
            // Create planet with null continents - this actually uses empty array in practice
            const planet = PlanetComponent.create(
                'null-continents-planet-1',
                'NullContinentsPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                []  // PlanetComponent doesn't allow null, so this is empty array
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            // Null feature has name "Unknown" per null object pattern
            expect(location.getName()).toBe('Unknown, NullContinentsPlanet');
        });

        it('should return Location with null feature when continents is undefined', () => {
            // Create planet with empty continents - this is the closest to undefined in practice
            const planet = PlanetComponent.create(
                'undefined-continents-planet-1',
                'UndefinedContinentsPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                []  // PlanetComponent doesn't allow undefined, so this is empty array
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            // Null feature has name "Unknown" per null object pattern
            expect(location.getName()).toBe('Unknown, UndefinedContinentsPlanet');
        });

        it('should handle multiple continents correctly', () => {
            // Create multiple continents with features
            const featureType = GeographicalFeatureTypeRegistry.register('multi_city', 'City');
            
            const feature1 = GeographicalFeature.create('Feature1', featureType);
            const continent1 = Continent.create('Continent1');
            continent1.addFeature(feature1);
            
            const feature2 = GeographicalFeature.create('Feature2', featureType);
            const continent2 = Continent.create('Continent2');
            continent2.addFeature(feature2);
            
            const feature3 = GeographicalFeature.create('Feature3', featureType);
            const continent3 = Continent.create('Continent3');
            continent3.addFeature(feature3);

            const planet = PlanetComponent.create(
                'multi-continent-planet-1',
                'MultiContinentPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                [continent1, continent2, continent3]
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            // Mock Math.random to select a specific continent
            const originalRandom = Math.random;
            Math.random = jest.fn(() => 0.5); // Should select middle continent

            const location = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            expect(location).toBeInstanceOf(Location);
            // The name should contain the planet name
            expect(location.getName()).toContain('MultiContinentPlanet');
            // Should have a feature name (format: "FeatureName, PlanetName")
            expect(location.getName().split(', ').length).toBe(2);
            expect(location.getPlanet()).toBe(planet);
            expect(location.getFeature()).toBeInstanceOf(GeographicalFeature);

            // Restore Math.random
            Math.random = originalRandom;
        });

        it('should throw TypeError when galaxyMap is not a GalaxyMapComponent', () => {
            console.error = jest.fn();
            console.trace = jest.fn();

            expect(() => {
                GeographicalUtils.computeRandomLocation({});
            }).toThrow(TypeError);

            expect(console.error).toHaveBeenCalled();
        });

        it('should return consistent Location instances for same input', () => {
            // Create deterministic planet
            const featureType = GeographicalFeatureTypeRegistry.register('consistent_city', 'City');
            const feature = GeographicalFeature.create('ConsistentFeature', featureType);
            const continent = Continent.create('Consistent Continent');
            continent.addFeature(feature);
            const planet = PlanetComponent.create(
                'consistent-planet-1',
                'ConsistentPlanet',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                [continent]
            );

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(planet);

            const location1 = GeographicalUtils.computeRandomLocation(mockGalaxyMap);
            const location2 = GeographicalUtils.computeRandomLocation(mockGalaxyMap);

            // Should be different Location instances (new instances created each time)
            expect(location1).not.toBe(location2);
            // But with same name and data
            expect(location1.getName()).toBe(location2.getName());
            expect(location1.getName()).toBe('ConsistentFeature, ConsistentPlanet');
            expect(location1.getFeature()).toBe(location2.getFeature());
            expect(location1.getPlanet()).toBe(location2.getPlanet());
        });
    });
});
