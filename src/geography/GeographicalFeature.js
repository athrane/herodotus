import { TypeUtils } from '../util/TypeUtils.ts';
import { FeatureType } from './FeatureType.ts';
import { GeographicalFeatureTypeRegistry } from './GeographicalFeatureTypeRegistry.js';

/**
 * Represents a specific, named instance of a geographical feature in the world.
 * e.g., "The Misty Mountains" which is of type MOUNTAIN.
 */
export class GeographicalFeature {
    /** @type {string} */
    #name;

    /** @type {FeatureType} */
    #type;

    /**
     * Creates an instance of GeographicalFeature.
     * @param {string} name - The specific name of the feature (e.g., "The River Run").
     * @param {FeatureType} type - The registered type of the feature (e.g., GeographicalFeatureTypes.RIVER).
     * @throws {Error} if the name is not a string, or if the type is not a valid, registered FeatureType.
     */
    constructor(name, type) {
        TypeUtils.ensureString(name, 'GeographicalFeature name must be a string.');
        TypeUtils.ensureInstanceOf(type, FeatureType, 'GeographicalFeature type must be an instance of FeatureType.');

        if (!GeographicalFeatureTypeRegistry.has(type.getKey())) {
            throw new Error(`The provided FeatureType with key '${type.getKey()}' is not registered.`);
        }

        this.#name = name;
        this.#type = type;
        Object.freeze(this);
    }

    /**
     * Gets the specific name of the feature.
     * @returns {string}
     */
    getName() {
        return this.#name;
    }

    /**
     * Gets the FeatureType of this feature.
     * @returns {FeatureType}
     */
    getType() {
        return this.#type;
    }

    /**
     * Creates a new GeographicalFeature instance.
     * @param {string} name - The specific name of the feature.
     * @param {FeatureType} type - The registered type of the feature.
     * @returns {GeographicalFeature}
     */
    static create(name, type) {
        return new GeographicalFeature(name, type);
    }
}