import { GeographicalFeatureTypeRegistry } from '../../../src/geography/feature/GeographicalFeatureTypeRegistry.ts';
import { FeatureType } from '../../../src/geography/feature/FeatureType.ts';

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
        it('should register and return the null feature type when the registry is empty', () => {
            const randomType = GeographicalFeatureTypeRegistry.getRandom();
            
            // Should automatically register the UNKNOWN type
            expect(randomType).toBeInstanceOf(FeatureType);
            expect(randomType.getKey()).toBe(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            expect(randomType.getName()).toBe('Unknown');
            
            // Verify it was registered in the registry
            expect(GeographicalFeatureTypeRegistry.has(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL)).toBe(true);
            expect(GeographicalFeatureTypeRegistry.size()).toBe(1);
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

    describe('registerNullFeatureType()', () => {
        it('should register the null feature type if not already registered', () => {
            expect(GeographicalFeatureTypeRegistry.has(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL)).toBe(false);
            
            GeographicalFeatureTypeRegistry.registerNullFeatureType();
            
            expect(GeographicalFeatureTypeRegistry.has(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL)).toBe(true);
            expect(GeographicalFeatureTypeRegistry.size()).toBe(1);
            
            const nullType = GeographicalFeatureTypeRegistry.get(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            expect(nullType).toBeInstanceOf(FeatureType);
            expect(nullType.getKey()).toBe('UNKNOWN');
            expect(nullType.getName()).toBe('Unknown');
        });

        it('should not register duplicate null feature type if already registered', () => {
            GeographicalFeatureTypeRegistry.registerNullFeatureType();
            expect(GeographicalFeatureTypeRegistry.size()).toBe(1);
            
            // Call again - should not throw or add duplicate
            GeographicalFeatureTypeRegistry.registerNullFeatureType();
            expect(GeographicalFeatureTypeRegistry.size()).toBe(1);
        });

        it('should be idempotent when called multiple times', () => {
            const firstCall = GeographicalFeatureTypeRegistry.registerNullFeatureType();
            const firstType = GeographicalFeatureTypeRegistry.get(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            
            const secondCall = GeographicalFeatureTypeRegistry.registerNullFeatureType();
            const secondType = GeographicalFeatureTypeRegistry.get(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            
            const thirdCall = GeographicalFeatureTypeRegistry.registerNullFeatureType();
            const thirdType = GeographicalFeatureTypeRegistry.get(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            
            // All should return the same registered instance
            expect(firstType).toBe(secondType);
            expect(secondType).toBe(thirdType);
            expect(GeographicalFeatureTypeRegistry.size()).toBe(1);
        });
    });

    describe('getNullFeatureType()', () => {
        it('should return the null feature type', () => {
            const nullType = GeographicalFeatureTypeRegistry.getNullFeatureType();
            
            expect(nullType).toBeInstanceOf(FeatureType);
            expect(nullType.getKey()).toBe('UNKNOWN');
            expect(nullType.getName()).toBe('Unknown');
        });

        it('should automatically register the null feature type if not already registered', () => {
            expect(GeographicalFeatureTypeRegistry.has(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL)).toBe(false);
            
            const nullType = GeographicalFeatureTypeRegistry.getNullFeatureType();
            
            expect(GeographicalFeatureTypeRegistry.has(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL)).toBe(true);
            expect(nullType).toBeInstanceOf(FeatureType);
        });

        it('should return the same instance on multiple calls', () => {
            const firstCall = GeographicalFeatureTypeRegistry.getNullFeatureType();
            const secondCall = GeographicalFeatureTypeRegistry.getNullFeatureType();
            const thirdCall = GeographicalFeatureTypeRegistry.getNullFeatureType();
            
            expect(firstCall).toBe(secondCall);
            expect(secondCall).toBe(thirdCall);
        });

        it('should return the already registered null type if it exists', () => {
            // Manually register first
            GeographicalFeatureTypeRegistry.registerNullFeatureType();
            const registeredType = GeographicalFeatureTypeRegistry.get(GeographicalFeatureTypeRegistry.GEOGRAPHICAL_FEATURE_NULL);
            
            // getNullFeatureType should return the same instance
            const retrievedType = GeographicalFeatureTypeRegistry.getNullFeatureType();
            expect(retrievedType).toBe(registeredType);
        });

        it('should work correctly when other types are already registered', () => {
            GeographicalFeatureTypeRegistry.register('MOUNTAIN', 'Mountain');
            GeographicalFeatureTypeRegistry.register('RIVER', 'River');
            expect(GeographicalFeatureTypeRegistry.size()).toBe(2);
            
            const nullType = GeographicalFeatureTypeRegistry.getNullFeatureType();
            
            expect(nullType.getKey()).toBe('UNKNOWN');
            expect(GeographicalFeatureTypeRegistry.size()).toBe(3);
        });
    });
});