import { TypeUtils } from '../util/TypeUtils';
import { FeatureType } from './FeatureType';

/**
 * A registry for managing and providing access to all defined geographical feature types.
 * This acts as the central point for defining and retrieving types, making it extensible.
 * This is implemented as a static class to enforce a single registry instance.
 */
export class GeographicalFeatureTypeRegistry {
    /**
     * A map to store FeatureType instances, keyed by their unique 'key'.
     */
    private static types = new Map<string, FeatureType>();

    /**
     * Registers a new geographical feature type.
     * @param key - The unique identifier for the type (e.g., 'VOLCANO').
     * @param displayName - The human-readable name (e.g., 'Volcano').
     * @returns The newly created and registered FeatureType instance.
     * @throws {Error} If a type with the given key is already registered.
     */
    static register(key: string, displayName: string): FeatureType {
        TypeUtils.ensureString(key);
        TypeUtils.ensureString(displayName);
        if (this.types.has(key)) {
            throw new Error(`GeographicalFeatureType with key '${key}' already registered.`);
        }
        const newType = new FeatureType(key, displayName);
        this.types.set(key, newType);
        return newType;
    }

    /**
     * Retrieves a registered geographical feature type by its key.
     * @param key - The unique identifier of the type to retrieve.
     * @returns The FeatureType instance, or undefined if not found.
     */
    static get(key: string): FeatureType | undefined {
        TypeUtils.ensureString(key);
        return this.types.get(key);
    }

    /**
     * Checks if a type with the given key is registered.
     * @param key - The unique identifier of the type to check.
     * @returns True if the type is registered, false otherwise.
     */
    static has(key: string): boolean {
        TypeUtils.ensureString(key);
        return this.types.has(key);
    }

    /**
     * Returns an array of all registered FeatureType instances.
     * @returns All registered FeatureType instances.
     */
    static getAll(): FeatureType[] {
        return Array.from(this.types.values());
    }

    /**
     * Returns an array of all registered FeatureType keys.
     * @returns All registered FeatureType keys.
     */
    static getAllKeys(): string[] {
        return Array.from(this.types.keys());
    }

    /**
     * Returns the number of registered FeatureTypes.
     * @returns The count of registered FeatureTypes.
     */
    static size(): number {
        return this.types.size;
    }

    /**
     * Returns a random FeatureType from the registry.
     * @returns A random FeatureType, or undefined if no types are registered.
     */
    static getRandom(): FeatureType | undefined {
        if (this.types.size === 0) {
            return undefined;
        }   
        const types = this.getAll();
        const randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    }   

    /**
     * Clears all registered types from the registry.
     * NOTE: This is intended for testing purposes to ensure a clean state between tests.
     */
    static clear(): void {
        this.types.clear();
    }
}