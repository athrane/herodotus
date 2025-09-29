import { GeographicalFeatureTypeRegistry } from './GeographicalFeatureTypeRegistry';

/**
 * GeographicalFeaturesFactory is responsible for creating and registering
 * various geographical feature types in the GeographicalFeatureTypeRegistry.
 *
 * This factory method initializes the registry with a comprehensive list of
 * geographical features, allowing for easy access and management of these types
 * throughout the application.
 */
export class GeographicalFeaturesFactory {
    /**
     * Static factory method to create and register geographical feature types.
     * This method populates the GeographicalFeatureTypeRegistry with a variety of
     * geographical features, each identified by a unique key.
     */
    static create(): void {
        GeographicalFeatureTypeRegistry.register('MOUNTAIN', 'Mountain');
        GeographicalFeatureTypeRegistry.register('RIVER', 'River');
        GeographicalFeatureTypeRegistry.register('LAKE', 'Lake');
        GeographicalFeatureTypeRegistry.register('FOREST', 'Forest');
        GeographicalFeatureTypeRegistry.register('DESERT', 'Desert');
        GeographicalFeatureTypeRegistry.register('SWAMP', 'Swamp');
        GeographicalFeatureTypeRegistry.register('PLAIN', 'Plain');
        GeographicalFeatureTypeRegistry.register('HILL', 'Hill');
        GeographicalFeatureTypeRegistry.register('VOLCANO', 'Volcano');
        GeographicalFeatureTypeRegistry.register('GLACIER', 'Glacier');
        GeographicalFeatureTypeRegistry.register('ISLAND', 'Island');
        GeographicalFeatureTypeRegistry.register('ARCHIPELAGO', 'Archipelago');
        GeographicalFeatureTypeRegistry.register('CANYON', 'Canyon');
        GeographicalFeatureTypeRegistry.register('BAY', 'Bay');
        GeographicalFeatureTypeRegistry.register('GULF', 'Gulf');
        GeographicalFeatureTypeRegistry.register('PLATEAU', 'Plateau');
        GeographicalFeatureTypeRegistry.register('FJORD', 'Fjord');
        GeographicalFeatureTypeRegistry.register('OASIS', 'Oasis');
        GeographicalFeatureTypeRegistry.register('MARSH', 'Marsh');
        GeographicalFeatureTypeRegistry.register('CAVE', 'Cave');
        GeographicalFeatureTypeRegistry.register('CLIFF', 'Cliff');
        GeographicalFeatureTypeRegistry.register('WATERFALL', 'Waterfall');
        GeographicalFeatureTypeRegistry.register('CORAL_REEF', 'Coral Reef');
        GeographicalFeatureTypeRegistry.register('TUNDRA', 'Tundra');
        GeographicalFeatureTypeRegistry.register('VOLCANIC_ISLAND', 'Volcanic Island');
        GeographicalFeatureTypeRegistry.register('SAND_DUNE', 'Sand Dune');
        GeographicalFeatureTypeRegistry.register('RIVER_DELTA', 'River Delta');
        GeographicalFeatureTypeRegistry.register('ESTUARY', 'Estuary');
        GeographicalFeatureTypeRegistry.register('BORDER', 'Border');
        GeographicalFeatureTypeRegistry.register('MOUNTAIN_RANGE', 'Mountain Range');
        GeographicalFeatureTypeRegistry.register('WETLAND', 'Wetland');
    }
}
