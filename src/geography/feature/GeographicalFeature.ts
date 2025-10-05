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
    private static nullInstance: GeographicalFeature | null = null;

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
     * Returns a null object instance of GeographicalFeature.
     * This instance serves as a safe, neutral placeholder when a GeographicalFeature is not available.
     * @returns A null GeographicalFeature instance with empty name and FeatureType.Null.
     */
    static get Null(): GeographicalFeature {
        if (!GeographicalFeature.nullInstance) {
            const instance = Object.create(GeographicalFeature.prototype);
            instance.name = '';
            instance.type = FeatureType.Null;
            Object.freeze(instance);
            GeographicalFeature.nullInstance = instance;
        }
        return GeographicalFeature.nullInstance!;
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
}
