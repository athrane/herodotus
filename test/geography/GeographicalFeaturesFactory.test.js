import { GeographicalFeaturesFactory } from '../../src/geography/GeographicalFeaturesFactory';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/GeographicalFeatureTypeRegistry';

describe('GeographicalFeaturesFactory', () => {
    beforeEach(() => {
        // Clear the registry before each test to ensure a clean state
        GeographicalFeatureTypeRegistry.clear();
    });

    it('should register all geographical features in the registry', () => {
        GeographicalFeaturesFactory.create();

        // List of all feature keys that should be registered
        const expectedFeatureKeys = [
            'MOUNTAIN', 'RIVER', 'LAKE', 'FOREST', 'DESERT', 'SWAMP', 'PLAIN', 'HILL',
            'VOLCANO', 'GLACIER', 'ISLAND', 'ARCHIPELAGO', 'CANYON', 'BAY', 'GULF',
            'PLATEAU', 'FJORD', 'OASIS', 'MARSH', 'CAVE', 'CLIFF', 'WATERFALL',
            'CORAL_REEF', 'TUNDRA', 'VOLCANIC_ISLAND', 'SAND_DUNE', 'RIVER_DELTA',
            'ESTUARY', 'BORDER', 'MOUNTAIN_RANGE', 'WETLAND'
        ];

        // Check if each feature key is registered
        expectedFeatureKeys.forEach(key => {
            expect(GeographicalFeatureTypeRegistry.has(key)).toBe(true);
        });

        // Optionally, check that the number of registered features matches the expected number
        expect(GeographicalFeatureTypeRegistry.size()).toBe(expectedFeatureKeys.length);
    });
});