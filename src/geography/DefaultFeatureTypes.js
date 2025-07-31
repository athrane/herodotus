import { GeographicalFeatureTypeRegistry } from './GeographicalFeatureTypeRegistry.js';

/**
 * This file pre-registers a set of default geographical feature types
 * into the GeographicalFeatureTypeRegistry.
 * 
 * It exports a single, immutable object `GeographicalFeatureTypes` that acts
 * as an enum-like container for all default types. This prevents namespace
 * pollution and allows for easy access to all types.
 * 
 * @example
 * import { GeographicalFeatureTypes } from './DefaultFeatureTypes.js';
 * const mountainType = GeographicalFeatureTypes.MOUNTAIN;
 */
export const GeographicalFeatureTypes = Object.freeze({
    MOUNTAIN: GeographicalFeatureTypeRegistry.register('MOUNTAIN', 'Mountain'),
    FOREST: GeographicalFeatureTypeRegistry.register('FOREST', 'Forest'),
    LAKE: GeographicalFeatureTypeRegistry.register('LAKE', 'Lake'),
    DESERT: GeographicalFeatureTypeRegistry.register('DESERT', 'Desert'),
    PLAIN: GeographicalFeatureTypeRegistry.register('PLAIN', 'Plain'),
    GRASSY_PLAINS: GeographicalFeatureTypeRegistry.register('GRASSY_PLAINS', 'Wide open spaces of fertile land, ideal for agriculture and grazing.'),
    DENSE_FOREST: GeographicalFeatureTypeRegistry.register('DENSE_FOREST', 'A vast woodland with thick canopy, teeming with life and mystery.'),
    RIVER: GeographicalFeatureTypeRegistry.register('RIVER', 'A flowing body of water, crucial for early settlements.'),
    COASTLINE: GeographicalFeatureTypeRegistry.register('COASTLINE', 'The border between land and a great ocean.'),
    MOUNTAIN_RANGE: GeographicalFeatureTypeRegistry.register('MOUNTAIN_RANGE', 'A series of high, rugged mountains, often a source of minerals and a natural barrier.'),
    SWAMP: GeographicalFeatureTypeRegistry.register('SWAMP', 'A waterlogged area of land, difficult to traverse but rich in certain resources.'),
    ARID_DESERT: GeographicalFeatureTypeRegistry.register('ARID_DESERT', 'A dry, barren wasteland with extreme temperatures.'),
    VOLCANO: GeographicalFeatureTypeRegistry.register('VOLCANO', 'A mountain that can erupt with lava and ash, both destroying and creating land.'),
    CRYSTAL_CAVES: GeographicalFeatureTypeRegistry.register('CRYSTAL_CAVES', 'Underground caverns filled with luminous crystals.'),
    ANCIENT_RUINS: GeographicalFeatureTypeRegistry.register('ANCIENT_RUINS', 'The crumbling remains of a forgotten, older civilization.')
});
