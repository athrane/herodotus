import { GeographicalUtils } from '../../src/geography/GeographicalUtils';
import { GalaxyMapComponent } from '../../src/geography/galaxy/GalaxyMapComponent';
import { Location } from '../../src/geography/Location';

describe('GeographicalUtils', () => {
    let mockGalaxyMap;

    beforeEach(() => {
        // Create a proper GalaxyMapComponent instance
        mockGalaxyMap = GalaxyMapComponent.create();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('computeRandomPlace', () => {
        it('should return a place with feature and planet name when both are available', () => {
            // Mock a planet with continents and features
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'TestPlanet',
                getContinents: () => [{
                    getRandomFeature: () => ({
                        getName: () => 'TestFeature'
                    })
                }]
            });

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('TestFeature, TestPlanet');
        });

        it('should return only planet name when no features are available', () => {
            // Mock a planet with continents but no features
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'BarrenPlanet',
                getContinents: () => [{
                    getRandomFeature: () => null
                }]
            });

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('BarrenPlanet');
        });

        it('should return default fallback when no planet is available', () => {
            // Mock no planet
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(null);

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('Unknown Location');
        });

        it('should return default fallback when planet has no continents', () => {
            // Mock a planet with no continents
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'EmptyPlanet',
                getContinents: () => []
            });

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('Unknown Location');
        });

        it('should return default fallback when continents is null', () => {
            // Mock a planet with null continents
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'NullContinentsPlanet',
                getContinents: () => null
            });

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('Unknown Location');
        });

        it('should return default fallback when continents is undefined', () => {
            // Mock a planet with undefined continents
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'UndefinedContinentsPlanet',
                getContinents: () => undefined
            });

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe('Unknown Location');
        });

        it('should use custom fallback location when provided', () => {
            // Mock no planet
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue(null);

            const customFallback = 'The Council Chambers';
            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap, customFallback);

            expect(place).toBeInstanceOf(Location);
            expect(place.getName()).toBe(customFallback);
        });

        it('should handle multiple continents correctly', () => {
            // Mock a planet with multiple continents
            const mockContinents = [
                { getRandomFeature: () => ({ getName: () => 'Feature1' }) },
                { getRandomFeature: () => ({ getName: () => 'Feature2' }) },
                { getRandomFeature: () => ({ getName: () => 'Feature3' }) }
            ];

            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'MultiContinentPlanet',
                getContinents: () => mockContinents
            });

            // Mock Math.random to select a specific continent
            const originalRandom = Math.random;
            Math.random = jest.fn(() => 0.5); // Should select middle continent

            const place = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            expect(place).toBeInstanceOf(Location);
            // The name should contain the planet name
            expect(place.getName()).toContain('MultiContinentPlanet');
            // Should have a feature name
            expect(place.getName().split(', ').length).toBe(2);

            // Restore Math.random
            Math.random = originalRandom;
        });

        it('should throw TypeError when galaxyMap is not a GalaxyMapComponent', () => {
            console.error = jest.fn();
            console.trace = jest.fn();

            expect(() => {
                GeographicalUtils.computeRandomPlace({});
            }).toThrow(TypeError);

            expect(console.error).toHaveBeenCalled();
        });

        it('should throw TypeError when fallbackLocation is not a string', () => {
            console.error = jest.fn();
            console.trace = jest.fn();

            expect(() => {
                GeographicalUtils.computeRandomPlace(mockGalaxyMap, 123);
            }).toThrow(TypeError);

            expect(console.error).toHaveBeenCalled();
        });

        it('should return consistent Place instances for same input', () => {
            // Mock deterministic planet
            jest.spyOn(mockGalaxyMap, 'getRandomPlanet').mockReturnValue({
                getName: () => 'ConsistentPlanet',
                getContinents: () => [{
                    getRandomFeature: () => ({
                        getName: () => 'ConsistentFeature'
                    })
                }]
            });

            const place1 = GeographicalUtils.computeRandomPlace(mockGalaxyMap);
            const place2 = GeographicalUtils.computeRandomPlace(mockGalaxyMap);

            // Should be different instances
            expect(place1).not.toBe(place2);
            // But with same name
            expect(place1.getName()).toBe(place2.getName());
            expect(place1.getName()).toBe('ConsistentFeature, ConsistentPlanet');
        });
    });
});
