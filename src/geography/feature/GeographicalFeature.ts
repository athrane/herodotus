import { TypeUtils } from '../../util/TypeUtils';
import { FeatureType } from './FeatureType';
import { GeographicalFeatureTypeRegistry } from './GeographicalFeatureTypeRegistry';

/**
 * Represents a specific, named instance of a geographical feature in the world.
 * e.g., "The Misty Mountains" which is of type MOUNTAIN.
 */
export class GeographicalFeature {
    private readonly name: string;
    private readonly type: FeatureType;

    /**
     * A singleton instance representing a null geographical feature.
     */
    private static nullFeature: GeographicalFeature | null = null;

    /**
     * Creates an instance of GeographicalFeature.
     * @param name - The specific name of the feature (e.g., "The River Run").
     * @param type - The registered type of the feature (e.g., GeographicalFeatureTypes.RIVER).
     * @throws {Error} if the name is not a string, or if the type is not a valid, registered FeatureType.
     */
    constructor(name: string, type: FeatureType) {
        TypeUtils.ensureString(name, 'GeographicalFeature name must be a string.');
        TypeUtils.ensureInstanceOf(type, FeatureType);

        if (!GeographicalFeatureTypeRegistry.has(type.getKey())) {
            throw new Error(`The provided FeatureType with key '${type.getKey()}' is not registered.`);
        }

        this.name = name;
        this.type = type;
        Object.freeze(this);
    }

    /**
     * Gets the specific name of the feature.
     * @returns The specific name of the feature.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the FeatureType of this feature.
     * @returns The FeatureType of this feature.
     */
    getType(): FeatureType {
        return this.type;
    }

    /**
     * Creates a new GeographicalFeature instance.
     * @param name - The specific name of the feature.
     * @param type - The registered type of the feature.
     * @returns A new GeographicalFeature instance.
     */
    static create(name: string, type: FeatureType): GeographicalFeature {
        return new GeographicalFeature(name, type);
    }

/**
     * Creates a null geographical feature representing an unknown feature.
     * Uses lazy initialization to return the same instance on subsequent calls.
     * @returns A GeographicalFeature instance representing an unknown feature.
     */
    static createNullFeature(): GeographicalFeature {
        if (!GeographicalFeature.nullFeature) {
            const nullType = GeographicalFeatureTypeRegistry.getNullFeatureType();
            GeographicalFeature.nullFeature = GeographicalFeature.create('Unknown', nullType);
        }
        return GeographicalFeature.nullFeature;
    }

    /**
     * Creates a deep copy of this GeographicalFeature.
     * Since GeographicalFeature is immutable (frozen), this returns a new instance with the same values.
     * Ensures the FeatureType is registered before creating the clone.
     * @returns A new GeographicalFeature instance with the same name and type.
     */
    clone(): GeographicalFeature {
        // Ensure the feature type is registered before cloning
        // This is necessary for null features or features created before the registry was populated
        if (!GeographicalFeatureTypeRegistry.has(this.type.getKey())) {
            GeographicalFeatureTypeRegistry.register(this.type.getKey(), this.type.getName());
        }
        return GeographicalFeature.create(this.name, this.type);
    }

}
