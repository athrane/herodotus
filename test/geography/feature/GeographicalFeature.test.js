import { GeographicalFeature } from '../../../src/geography/feature/GeographicalFeature.ts';
import { FeatureType } from '../../../src/geography/feature/FeatureType.ts';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/feature/GeographicalFeatureTypeRegistry.ts';

// The import of DefaultFeatureTypes automatically populates the registry for our tests.

describe('GeographicalFeature', () => {

    // Before each test, clear the registry to ensure a clean, isolated state.
    // This is crucial because the registry is a static singleton and its state
    // would otherwise persist between tests.
    beforeEach(() => {
        GeographicalFeatureTypeRegistry.clear();
    });


    it('should create an instance with a valid name and a registered type', () => {
        const key = 'MOUNTAIN';
        const displayName = 'Mountain';
        const featureType = GeographicalFeatureTypeRegistry.register(key, displayName);

        const featureName = 'The Misty Mountains';
        const feature = new GeographicalFeature(featureName, featureType);

        expect(feature).toBeInstanceOf(GeographicalFeature);
        expect(feature.getName()).toBe(featureName);
        expect(feature.getType()).toBe(featureType);
    });

    describe('Constructor Validation', () => {
        it('should throw a TypeError if the name is not a string', () => {
            const key = 'MOUNTAIN';
            const displayName = 'Mountain';
            const featureType = GeographicalFeatureTypeRegistry.register(key, displayName);

            // The custom message in ensureString is not checked here, just the TypeError.
            expect(() => new GeographicalFeature(123, featureType)).toThrow(TypeError);
            expect(() => new GeographicalFeature(null, featureType)).toThrow(TypeError);
            expect(() => new GeographicalFeature(undefined, featureType)).toThrow(TypeError);
        });

        it('should throw a TypeError if the type is not an instance of FeatureType', () => {
            const featureName = 'The Great Forest';
            // The custom message in ensureInstanceOf is not checked here, just the TypeError.
            expect(() => new GeographicalFeature(featureName, 'FOREST')).toThrow(TypeError);
            expect(() => new GeographicalFeature(featureName, {})).toThrow(TypeError);
            expect(() => new GeographicalFeature(featureName, null)).toThrow(TypeError);
        });

        it('should throw an Error if the FeatureType is not registered', () => {
            // Create a new FeatureType instance that is NOT in the registry.
            const unregisteredType = new FeatureType('SOMEWHERE STRANGE', 'Swamp');
            const featureName = 'The Dead Marshes';
            expect(() => new GeographicalFeature(featureName, unregisteredType)).toThrow(Error);
        });
    });

    it('should be immutable after creation', () => {
        const key = 'MOUNTAIN';
        const displayName = 'Mountain';
        const featureType = GeographicalFeatureTypeRegistry.register(key, displayName);
        const key2 = 'DESERT';
        const displayName2 = 'Desert';
        const featureType2 = GeographicalFeatureTypeRegistry.register(key2, displayName2);

        const feature = new GeographicalFeature('The Shire', featureType);

        // Attempting to change a property on a frozen object throws a TypeError in strict mode.
        // Jest tests run in strict mode by default.
        expect(() => {
            feature.name = 'Mordor';
        }).toThrow(TypeError);

        expect(() => {
            feature.type = featureType2;
        }).toThrow(TypeError);
    });

});