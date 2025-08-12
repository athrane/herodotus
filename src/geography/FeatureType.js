// @ts-check
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Represents a single geographical feature type.
 * This class ensures each type has a consistent structure (e.g., a unique key and a display name).
 */
export class FeatureType {
    /**
     * @param {string} key - A unique identifier for the feature type (e.g., 'MOUNTAIN').
     * @param {string} displayName - The display name for the feature type (e.g., 'Mountain').
     */
    /**
     * @param {string} key
     * @param {string} displayName
     */
    constructor(key, displayName) {
        TypeUtils.ensureString(key, "FeatureType key must be a string.");
        TypeUtils.ensureString(displayName, "FeatureType displayName must be a string.");

        this.key = key;
        this.displayName = displayName;
        Object.freeze(this); // Make instances immutable
    }

    /**
     * Returns the unique key of the feature type.
     * @returns {string}
     */
    /** @returns {string} */
    getKey() {
        return this.key;
    }
    /**
     * Returns the display name of the feature type.
     * @returns {string}
     */
    /** @returns {string} */
    getName() {
        return this.displayName;
    }
}