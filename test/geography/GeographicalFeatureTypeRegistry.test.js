import { GeographicalFeatureTypeRegistry } from '../../src/geography/GeographicalFeatureTypeRegistry.js';
import { FeatureType } from '../../src/geography/FeatureType.js';

describe('GeographicalFeatureTypeRegistry', () => {

    // Before each test, clear the registry to ensure a clean, isolated state.
    // This is crucial because the registry is a static singleton and its state
    // would otherwise persist between tests.
    beforeEach(() => {
        GeographicalFeatureTypeRegistry.clear();
    });

    describe('register()', () => {
        it('should register a new feature type and return it', () => {
            const key = 'TEST_FEATURE';
            const displayName = 'Test Feature';
            const featureType = GeographicalFeatureTypeRegistry.register(key, displayName);

            expect(featureType).toBeInstanceOf(FeatureType);
            expect(featureType.getKey()).toBe(key);
            expect(featureType.getName()).toBe(displayName);

            // Verify it was actually added to the registry
            expect(GeographicalFeatureTypeRegistry.has(key)).toBe(true);
            expect(GeographicalFeatureTypeRegistry.get(key)).toBe(featureType);
        });

        it('should throw an error if a key is already registered', () => {
            const key = 'DUPLICATE_KEY';
            GeographicalFeatureTypeRegistry.register(key, 'First Display Name');

            const expectedErrorMessage = `GeographicalFeatureType with key '${key}' already registered.`;
            expect(() => {
                GeographicalFeatureTypeRegistry.register(key, 'Second Display Name');
            }).toThrow(expectedErrorMessage);
        });

        it('should throw a TypeError if the key is not a string', () => {
            expect(() => GeographicalFeatureTypeRegistry.register(123, 'Display Name')).toThrow(TypeError);
        });

        it('should throw a TypeError if the displayName is not a string', () => {
            expect(() => GeographicalFeatureTypeRegistry.register('KEY', 123)).toThrow(TypeError);
        });
    });

    describe('get()', () => {
        it('should return the correct FeatureType for a registered key', () => {
            const key = 'GET_KEY';
            const displayName = 'Get Test';
            const registeredType = GeographicalFeatureTypeRegistry.register(key, displayName);

            const retrievedType = GeographicalFeatureTypeRegistry.get(key);
            expect(retrievedType).toBe(registeredType);
        });

        it('should return undefined for an unregistered key', () => {
            expect(GeographicalFeatureTypeRegistry.get('NON_EXISTENT_KEY')).toBeUndefined();
        });

        it('should throw a TypeError if the key is not a string', () => {
            expect(() => GeographicalFeatureTypeRegistry.get(123)).toThrow(TypeError);
        });
    });

    describe('has()', () => {
        it('should return true for a registered key', () => {
            const key = 'HAS_KEY';
            GeographicalFeatureTypeRegistry.register(key, 'Has Test');
            expect(GeographicalFeatureTypeRegistry.has(key)).toBe(true);
        });

        it('should return false for an unregistered key', () => {
            expect(GeographicalFeatureTypeRegistry.has('NON_EXISTENT_KEY')).toBe(false);
        });
    });

    describe('getAll()', () => {
        it('should return an empty array when the registry is empty', () => {
            expect(GeographicalFeatureTypeRegistry.getAll()).toEqual([]);
        });

        it('should return an array of all registered FeatureType instances', () => {
            const type1 = GeographicalFeatureTypeRegistry.register('TYPE_1', 'Type 1');
            const type2 = GeographicalFeatureTypeRegistry.register('TYPE_2', 'Type 2');

            const allTypes = GeographicalFeatureTypeRegistry.getAll();
            expect(allTypes).toBeInstanceOf(Array);
            expect(allTypes.length).toBe(2);
            expect(allTypes).toContain(type1);
            expect(allTypes).toContain(type2);
        });
    });

    describe('getRandom()', () => {
        it('should return undefined when the registry is empty', () => {
            expect(GeographicalFeatureTypeRegistry.getRandom()).toBeUndefined();
        });

        it('should return a registered FeatureType when the registry is not empty', () => {
            const type1 = GeographicalFeatureTypeRegistry.register('RANDOM_1', 'Random 1');
            const type2 = GeographicalFeatureTypeRegistry.register('RANDOM_2', 'Random 2');

            const randomType = GeographicalFeatureTypeRegistry.getRandom();
            expect(randomType).toBeInstanceOf(FeatureType);
            expect([type1, type2]).toContain(randomType);
        });

        it('should return the only registered item', () => {
            const type1 = GeographicalFeatureTypeRegistry.register('ONLY_ONE', 'Only One');
            expect(GeographicalFeatureTypeRegistry.getRandom()).toBe(type1);
        });
    });
});