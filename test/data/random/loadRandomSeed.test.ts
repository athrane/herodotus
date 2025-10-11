import { loadRandomSeed } from '../../../src/data/random/loadRandomSeed';
import { RandomSeedData } from '../../../src/data/random/RandomSeedData';

describe('loadRandomSeed', () => {
    describe('loading', () => {
        it('should load seed.json file and return RandomSeedData instance', () => {
            const seed = loadRandomSeed();
            
            expect(seed).toBeDefined();
            expect(seed).toBeInstanceOf(RandomSeedData);
            expect(seed.getSeed()).toBe('herodotus-default-seed');
        });

        it('should return immutable RandomSeedData instance', () => {
            const seed = loadRandomSeed();
            
            expect(Object.isFrozen(seed)).toBe(true);
        });

        it('should load consistently on multiple calls', () => {
            const seed1 = loadRandomSeed();
            const seed2 = loadRandomSeed();
            
            // Different instances but same data
            expect(seed1).not.toBe(seed2);
            expect(seed1.getSeed()).toBe(seed2.getSeed());
        });
    });
});
