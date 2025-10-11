import { RandomSeedComponent } from '../../../src/data/random/RandomSeedComponent';
import { RandomSeed } from '../../../src/data/random/RandomSeed';

describe('RandomSeedComponent', () => {
    describe('constructor', () => {
        it('should create component with valid RandomSeed', () => {
            const seed: RandomSeed = {
                version: '1.0',
                seed: 'test-seed',
                description: 'Test description'
            };
            const component = new RandomSeedComponent(seed);
            expect(component).toBeDefined();
            expect(component.getRandomSeed()).toEqual(seed);
        });

        it('should throw for missing version', () => {
            const seed = {
                version: '',
                seed: 'test-seed'
            } as RandomSeed;
            expect(() => new RandomSeedComponent(seed)).toThrow(TypeError);
        });

        it('should throw for missing seed', () => {
            const seed = {
                version: '1.0',
                seed: ''
            } as RandomSeed;
            expect(() => new RandomSeedComponent(seed)).toThrow(TypeError);
        });

        it('should accept optional description', () => {
            const seed: RandomSeed = {
                version: '1.0',
                seed: 'test-seed'
            };
            const component = new RandomSeedComponent(seed);
            expect(component.getRandomSeed()).toEqual(seed);
        });

        it('should throw for non-string description', () => {
            const seed = {
                version: '1.0',
                seed: 'test-seed',
                description: 123
            } as any;
            expect(() => new RandomSeedComponent(seed)).toThrow(TypeError);
        });
    });

    describe('getRandomSeed()', () => {
        it('should return stored RandomSeed', () => {
            const seed: RandomSeed = {
                version: '1.0',
                seed: 'my-seed',
                description: 'My custom seed'
            };
            const component = RandomSeedComponent.create(seed);
            const retrieved = component.getRandomSeed();
            expect(retrieved).toEqual(seed);
            expect(retrieved.version).toBe('1.0');
            expect(retrieved.seed).toBe('my-seed');
            expect(retrieved.description).toBe('My custom seed');
        });
    });

    describe('factory methods', () => {
        it('should create via create()', () => {
            const seed: RandomSeed = {
                version: '1.0',
                seed: 'factory-test'
            };
            const component = RandomSeedComponent.create(seed);
            expect(component).toBeInstanceOf(RandomSeedComponent);
        });

        it('should implement null object pattern', () => {
            const null1 = RandomSeedComponent.createNull();
            const null2 = RandomSeedComponent.createNull();
            expect(null1).toBe(null2); // Singleton
            
            const nullSeed = null1.getRandomSeed();
            expect(nullSeed.seed).toBe('null-seed');
            expect(nullSeed.version).toBe('1.0');
        });
    });
});
