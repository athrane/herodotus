import { TypeUtils } from '../util/TypeUtils.js';
import { FeatureType } from './FeatureType.js';
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
        TypeUtils.ensureString(name);
        TypeUtils.ensureInstanceOf(type, FeatureType);

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
}