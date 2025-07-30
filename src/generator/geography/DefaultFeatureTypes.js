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
    RIVER:    GeographicalFeatureTypeRegistry.register('RIVER', 'River'),
    FOREST:   GeographicalFeatureTypeRegistry.register('FOREST', 'Forest'),
    LAKE:     GeographicalFeatureTypeRegistry.register('LAKE', 'Lake'),
    DESERT:   GeographicalFeatureTypeRegistry.register('DESERT', 'Desert'),
    PLAIN:    GeographicalFeatureTypeRegistry.register('PLAIN', 'Plain'),
});