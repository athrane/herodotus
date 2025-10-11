import { RandomSeedData } from '../../../src/data/random/RandomSeedData';

describe('RandomSeedData', () => {
    // Mock console.error and console.trace to suppress expected error output in tests
    let consoleErrorSpy: jest.SpyInstance;
    let consoleTraceSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleTraceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleTraceSpy.mockRestore();
    });

    describe('constructor', () => {
        it('should create RandomSeedData with valid data', () => {
            const data = {
                seed: 'test-seed-12345'
            };

            const randomSeed = new RandomSeedData(data);

            expect(randomSeed.getSeed()).toBe('test-seed-12345');
        });

        it('should throw TypeError for missing seed', () => {
            const data = {};

            expect(() => new RandomSeedData(data)).toThrow(TypeError);
        });

        it('should throw TypeError for empty seed', () => {
            const data = {
                seed: ''
            };

            expect(() => new RandomSeedData(data)).toThrow(TypeError);
        });

        it('should throw TypeError for non-string seed', () => {
            const data = {
                seed: 12345
            };

            expect(() => new RandomSeedData(data)).toThrow(TypeError);
        });

        it('should be immutable after construction', () => {
            const data = {
                seed: 'test-seed'
            };

            const randomSeed = new RandomSeedData(data);

            expect(Object.isFrozen(randomSeed)).toBe(true);
        });
    });

    describe('create()', () => {
        it('should create RandomSeedData instance via factory method', () => {
            const data = {
                seed: 'test-seed'
            };

            const randomSeed = RandomSeedData.create(data);

            expect(randomSeed).toBeInstanceOf(RandomSeedData);
            expect(randomSeed.getSeed()).toBe('test-seed');
        });
    });

    describe('createNull()', () => {
        it('should return singleton null instance', () => {
            const null1 = RandomSeedData.createNull();
            const null2 = RandomSeedData.createNull();

            expect(null1).toBe(null2); // Same instance
            expect(null1).toBeInstanceOf(RandomSeedData);
        });

        it('should have default null values', () => {
            const nullSeed = RandomSeedData.createNull();

            expect(nullSeed.getSeed()).toBe('default-null-seed');
        });

        it('should be immutable', () => {
            const nullSeed = RandomSeedData.createNull();

            expect(Object.isFrozen(nullSeed)).toBe(true);
        });
    });

    describe('getSeed()', () => {
        it('should return the seed string', () => {
            const randomSeed = RandomSeedData.create({
                seed: 'my-custom-seed'
            });

            expect(randomSeed.getSeed()).toBe('my-custom-seed');
        });
    });
});
