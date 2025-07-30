import { FeatureType } from '../../../src/generator/geography/FeatureType.js';

describe('FeatureType', () => {
    describe('constructor', () => {
        it('should create a FeatureType instance with valid key and displayName', () => {
            const key = 'OCEAN';
            const displayName = 'Ocean';
            const featureType = new FeatureType(key, displayName);

            expect(featureType).toBeInstanceOf(FeatureType);
            expect(featureType.getKey()).toBe(key);
            expect(featureType.getName()).toBe(displayName);
        });

        it('should throw a TypeError if the key is not a string', () => {
            const displayName = 'Valid Name';
            expect(() => new FeatureType(123, displayName)).toThrow(TypeError);
            expect(() => new FeatureType(null, displayName)).toThrow(TypeError);
            expect(() => new FeatureType(undefined, displayName)).toThrow(TypeError);
            expect(() => new FeatureType({}, displayName)).toThrow(TypeError);
        });

        it('should throw a TypeError if the displayName is not a string', () => {
            const key = 'VALID_KEY';
            expect(() => new FeatureType(key, 123)).toThrow(TypeError);
            expect(() => new FeatureType(key, null)).toThrow(TypeError);
            expect(() => new FeatureType(key, undefined)).toThrow(TypeError);
            expect(() => new FeatureType(key, {})).toThrow(TypeError);
        });
    });

    describe('getters', () => {
        it('getKey() should return the correct key', () => {
            const key = 'FOREST';
            const featureType = new FeatureType(key, 'Forest');
            expect(featureType.getKey()).toBe(key);
        });

        it('getName() should return the correct displayName', () => {
            const displayName = 'Ancient Forest';
            const featureType = new FeatureType('ANCIENT_FOREST', displayName);
            expect(featureType.getName()).toBe(displayName);
        });
    });

    it('should be immutable after creation', () => {
        const featureType = new FeatureType('LAKE', 'Lake');

        expect(() => { featureType.key = 'POND'; }).toThrow(TypeError);
        expect(() => { featureType.displayName = 'Pond'; }).toThrow(TypeError);
    });
});