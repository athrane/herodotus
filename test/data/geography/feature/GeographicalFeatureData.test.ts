import { GeographicalFeatureData } from '../../../../src/data/geography/feature/GeographicalFeatureData';

describe('GeographicalFeatureData', () => {
    describe('constructor and static factory', () => {
        it('should correctly initialize with valid data', () => {
            const data = { key: 'MOUNTAIN', displayName: 'Mountain' };
            const featureData = GeographicalFeatureData.create(data);

            expect(featureData).toBeInstanceOf(GeographicalFeatureData);
            expect(featureData.getKey()).toBe('MOUNTAIN');
            expect(featureData.getDisplayName()).toBe('Mountain');
        });

        it('should be immutable after creation', () => {
            const featureData = GeographicalFeatureData.create({ key: 'LAKE', displayName: 'Lake' });

            expect(() => {
                (featureData as any).key = 'RIVER';
            }).toThrow(TypeError);

            expect(() => {
                (featureData as any).displayName = 'River';
            }).toThrow(TypeError);

            expect(featureData.getKey()).toBe('LAKE');
            expect(featureData.getDisplayName()).toBe('Lake');
        });
    });

    describe('validation', () => {
        it('should throw TypeError for invalid key types', () => {
            const invalidKeys = [null, undefined, 123, {}, []];
            
            invalidKeys.forEach(invalidKey => {
                expect(() => {
                    GeographicalFeatureData.create({ key: invalidKey, displayName: 'Mountain' });
                }).toThrow(TypeError);
            });
        });

        it('should throw TypeError for invalid displayName types', () => {
            const invalidDisplayNames = [null, undefined, 123, {}, []];
            
            invalidDisplayNames.forEach(invalidDisplayName => {
                expect(() => {
                    GeographicalFeatureData.create({ key: 'MOUNTAIN', displayName: invalidDisplayName });
                }).toThrow(TypeError);
            });
        });

        it('should throw TypeError for missing key', () => {
            expect(() => {
                GeographicalFeatureData.create({ displayName: 'Mountain' });
            }).toThrow(TypeError);
        });

        it('should throw TypeError for missing displayName', () => {
            expect(() => {
                GeographicalFeatureData.create({ key: 'MOUNTAIN' });
            }).toThrow(TypeError);
        });
    });

    describe('fromJsonObject', () => {
        it('should create array from valid JSON object', () => {
            const json = {
                MOUNTAIN: { key: 'MOUNTAIN', displayName: 'Mountain' },
                RIVER: { key: 'RIVER', displayName: 'River' },
                LAKE: { key: 'LAKE', displayName: 'Lake' }
            };

            const features = GeographicalFeatureData.fromJsonObject(json);

            expect(features).toHaveLength(3);
            expect(features[0]).toBeInstanceOf(GeographicalFeatureData);
            expect(features[0].getKey()).toBe('LAKE'); // Sorted alphabetically
            expect(features[1].getKey()).toBe('MOUNTAIN');
            expect(features[2].getKey()).toBe('RIVER');
        });

        it('should return empty array for empty JSON object', () => {
            const features = GeographicalFeatureData.fromJsonObject({});
            expect(features).toHaveLength(0);
        });

        it('should throw TypeError for invalid JSON parameter', () => {
            const invalidJsonValues = [null, undefined, 'string', 123, []];
            
            invalidJsonValues.forEach(invalidJson => {
                expect(() => {
                    GeographicalFeatureData.fromJsonObject(invalidJson);
                }).toThrow(TypeError);
            });
        });

        it('should maintain deterministic order based on keys', () => {
            const json = {
                ZEBRA: { key: 'ZEBRA', displayName: 'Zebra Feature' },
                ALPHA: { key: 'ALPHA', displayName: 'Alpha Feature' },
                BETA: { key: 'BETA', displayName: 'Beta Feature' }
            };

            const features1 = GeographicalFeatureData.fromJsonObject(json);
            const features2 = GeographicalFeatureData.fromJsonObject(json);

            expect(features1.map(f => f.getKey())).toEqual(['ALPHA', 'BETA', 'ZEBRA']);
            expect(features2.map(f => f.getKey())).toEqual(['ALPHA', 'BETA', 'ZEBRA']);
        });
    });
});