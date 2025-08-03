import { TypeUtils } from '../util/TypeUtils.js';
import { FeatureType } from './FeatureType.js';

/**
 * A registry for managing and providing access to all defined geographical feature types.
 * This acts as the central point for defining and retrieving types, making it extensible.
 * This is implemented as a static class to enforce a single registry instance.
 */
export class GeographicalFeatureTypeRegistry {
    /**
     * @type {Map<string, FeatureType>}
     * A map to store FeatureType instances, keyed by their unique 'key'.
     */
    static #types = new Map();

    /**
     * Registers a new geographical feature type.
     * @param {string} key - The unique identifier for the type (e.g., 'VOLCANO').
     * @param {string} displayName - The human-readable name (e.g., 'Volcano').
     * @returns {FeatureType} The newly created and registered FeatureType instance.
     * @throws {Error} If a type with the given key is already registered.
     */
    static register(key, displayName) {
        TypeUtils.ensureString(key);
        TypeUtils.ensureString(displayName);
        if (this.#types.has(key)) {
            throw new Error(`GeographicalFeatureType with key '${key}' already registered.`);
        }
        const newType = new FeatureType(key, displayName);
        this.#types.set(key, newType);
        return newType;
    }

    /**
     * Retrieves a registered geographical feature type by its key.
     * @param {string} key - The unique identifier of the type to retrieve.
     * @returns {FeatureType|undefined} The FeatureType instance, or undefined if not found.
     */
    static get(key) {
        TypeUtils.ensureString(key);
        return this.#types.get(key);
    }

    /**
     * Checks if a type with the given key is registered.
     * @param {string} key - The unique identifier of the type to check.
     * @returns {boolean} True if the type is registered, false otherwise.
     */
    static has(key) {
        TypeUtils.ensureString(key);
        return this.#types.has(key);
    }

    /**
     * Returns an array of all registered FeatureType instances.
     * @returns {FeatureType[]}
     */
    static getAll() {
        return Array.from(this.#types.values());
    }

    /**
     * Returns an array of all registered FeatureType keys.
     * @returns {string[]}
     */
    static getAllKeys() {
        return Array.from(this.#types.keys());
    }

    /**
     * Returns the number of registered FeatureTypes.
     * @returns {number} The count of registered FeatureTypes.
     */
    static size() {
        return this.#types.size;
    }

    /**
     * Returns a random FeatureType from the registry.
     * @returns {FeatureType|undefined} A random FeatureType, or undefined if no types are registered.
     */
    static getRandom() {
        const types = this.getAll();
        if (types.length > 0) {
            const randomIndex = Math.floor(Math.random() * types.length);
            return types[randomIndex];
        }
        return undefined;
    }   

    /**
     * Clears all registered types from the registry.
     * NOTE: This is intended for testing purposes to ensure a clean state between tests.
     */
    static clear() {
        this.#types.clear();
    }
}
