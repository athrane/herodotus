import { GeographicalFeaturesFactory } from '../../../src/geography/feature/GeographicalFeaturesFactory';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/feature/GeographicalFeatureTypeRegistry';

describe('GeographicalFeaturesFactory', () => {
    beforeEach(() => {
        // Clear the registry before each test to ensure a clean state
        GeographicalFeatureTypeRegistry.clear();
    });

    it('should register all geographical features in the registry', () => {
        GeographicalFeaturesFactory.create();

        // List of all feature keys that should be registered by the factory
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

        // Check that at least the expected features are registered
        // (may be more if other code has registered additional types like "UNKNOWN")
        expect(GeographicalFeatureTypeRegistry.size()).toBeGreaterThanOrEqual(expectedFeatureKeys.length);
    });
});