import { FeatureType } from '../../src/geography/FeatureType.js';

describe('FeatureType', () => {
    it('should correctly initialize with a key and displayName', () => {
        const key = 'MOUNTAIN';
        const displayName = 'Mountain';
        const featureType = new FeatureType(key, displayName);

        expect(featureType).toBeInstanceOf(FeatureType);
        expect(featureType.getKey()).toBe(key);
        expect(featureType.getName()).toBe(displayName);
    });

    it('should throw a TypeError if the key is not a string', () => {
        const expectedErrorMessage = 'FeatureType key must be a string.';
        expect(() => new FeatureType(123, 'Mountain')).toThrow(expectedErrorMessage);
        expect(() => new FeatureType(null, 'Mountain')).toThrow(expectedErrorMessage);
        expect(() => new FeatureType(undefined, 'Mountain')).toThrow(expectedErrorMessage);
        expect(() => new FeatureType({}, 'Mountain')).toThrow(expectedErrorMessage);
    });

    it('should throw a TypeError if the displayName is not a string', () => {
        const expectedErrorMessage = 'FeatureType displayName must be a string.';
        expect(() => new FeatureType('MOUNTAIN', 123)).toThrow(expectedErrorMessage);
        expect(() => new FeatureType('MOUNTAIN', null)).toThrow(expectedErrorMessage);
        expect(() => new FeatureType('MOUNTAIN', undefined)).toThrow(expectedErrorMessage);
        expect(() => new FeatureType('MOUNTAIN', {})).toThrow(expectedErrorMessage);
    });

    it('should be immutable after creation', () => {
        const featureType = new FeatureType('LAKE', 'Lake');

        // In strict mode (default for ES modules), assigning to a frozen object throws an error.
        expect(() => {
            featureType.key = 'RIVER';
        }).toThrow(TypeError);

        expect(() => {
            featureType.displayName = 'River';
        }).toThrow(TypeError);

        // Verify properties did not change
        expect(featureType.getKey()).toBe('LAKE');
        expect(featureType.getName()).toBe('Lake');
    });
});