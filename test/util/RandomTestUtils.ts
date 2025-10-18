import { RandomComponent } from '../../src/random/RandomComponent';
import { RandomSeedData } from '../../src/data/random/RandomSeedData';

/**
 * Creates a RandomComponent with a deterministic seed for testing.
 * @param seed - The seed string to use for random generation (default: 'test-seed')
 * @returns A RandomComponent instance initialized with the given seed
 */
export function createTestRandomComponent(seed: string = 'test-seed'): RandomComponent {
    const seedData = RandomSeedData.create({ seed });
    return RandomComponent.create(seedData);
}

/**
 * Verifies two operations produce identical results with same seed.
 * This helper function tests determinism by running an operation twice with
 * the same seed and asserting the results are equal.
 * @param operation - Function that takes a RandomComponent and returns a result
 * @param seed - The seed to use for both operations (default: 'determinism-test')
 * @throws {Error} If the two operations produce different results
 */
export function assertDeterministic<T>(
    operation: (random: RandomComponent) => T,
    seed: string = 'determinism-test'
): void {
    const random1 = createTestRandomComponent(seed);
    const random2 = createTestRandomComponent(seed);
    
    const result1 = operation(random1);
    const result2 = operation(random2);
    
    expect(result1).toEqual(result2);
}
