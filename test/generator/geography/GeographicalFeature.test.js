import { GeographicalFeature } from '../../../src/generator/geography/GeographicalFeature.js';
import { FeatureType } from '../../../src/generator/geography/FeatureType.js';
import { GeographicalFeatureTypes } from '../../../src/generator/geography/DefaultFeatureTypes.js';

// The import of DefaultFeatureTypes automatically populates the registry for our tests.

describe('GeographicalFeature', () => {

    it('should create an instance with a valid name and a registered type', () => {
        const featureName = 'The Misty Mountains';
        const featureType = GeographicalFeatureTypes.MOUNTAIN;

        const feature = new GeographicalFeature(featureName, featureType);

        expect(feature).toBeInstanceOf(GeographicalFeature);
        expect(feature.getName()).toBe(featureName);
        expect(feature.getType()).toBe(featureType);
    });

    describe('Constructor Validation', () => {
        it('should throw a TypeError if the name is not a string', () => {
            const featureType = GeographicalFeatureTypes.RIVER;
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
        const feature = new GeographicalFeature('The Shire', GeographicalFeatureTypes.PLAIN);

        // Attempting to change a property on a frozen object throws a TypeError in strict mode.
        // Jest tests run in strict mode by default.
        expect(() => {
            feature.name = 'Mordor';
        }).toThrow(TypeError);

        expect(() => {
            feature.type = GeographicalFeatureTypes.DESERT;
        }).toThrow(TypeError);
    });

});