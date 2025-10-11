import { Component } from '../ecs/Component.js';
import { TypeUtils } from '../util/TypeUtils.js';
import { SeededRandom } from './SeededRandom.js';
import { RandomState } from './RandomState.js';
import { RandomSeedData } from '../data/random/RandomSeedData.js';

/**
 * RandomComponent provides deterministic random number generation for the simulation.
 * Uses a seedable pseudo-random number generator (PRNG) to ensure reproducibility.
 * 
 * This is a singleton component - only one instance should exist per simulation,
 * attached to the global ECS entity.
 */
export class RandomComponent extends Component {
    private seed: string;
    private rng: SeededRandom;
    private callCount: number;

    constructor(randomSeedData: RandomSeedData) {
        super();
        TypeUtils.ensureInstanceOf(randomSeedData, RandomSeedData, 'randomSeedData');
        this.seed = randomSeedData.getSeed();
        this.rng = SeededRandom.create(this.seed);
        this.callCount = 0;
    }

    /**
     * Generate random float in range [0, 1)
     * 
     * @returns Random float in [0, 1) range
     */
    next(): number {
        this.callCount++;
        return this.rng.next();
    }

    /**
     * Generate random integer in range [min, max] (inclusive)
     * 
     * @param min - Minimum value (inclusive)
     * @param max - Maximum value (inclusive)
     * @returns Random integer in [min, max] range
     */
    nextInt(min: number, max: number): number {
        TypeUtils.ensureNumber(min, 'min');
        TypeUtils.ensureNumber(max, 'max');

        if (min > max) {
            throw new TypeError(`min (${min}) must be <= max (${max})`);
        }

        if (min === max) {
            return min;
        }

        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Generate random boolean value
     * 
     * @returns Random boolean
     */
    nextBool(): boolean {
        return this.next() < 0.5;
    }

    /**
     * Select random element from array
     * 
     * @param array - Array to select from
     * @returns Random element from array
     * @throws TypeError if array is empty
     */
    nextChoice<T>(array: T[]): T {
        if (!Array.isArray(array)) {
            throw new TypeError('array must be an Array');
        }

        if (array.length === 0) {
            throw new TypeError('array must not be empty');
        }

        if (array.length === 1) {
            return array[0];
        }

        const index = this.nextInt(0, array.length - 1);
        return array[index];
    }

    /**
     * Get original seed string
     * 
     * @returns Original seed string
     */
    getSeed(): string {
        return this.seed;
    }

    /**
     * Get number of random() calls made
     * 
     * @returns Call count
     */
    getCallCount(): number {
        return this.callCount;
    }

    /**
     * Restore RNG state from serialized data
     * 
     * @param state - Serialized random state
     */
    setState(state: RandomState): void {
        TypeUtils.ensureNonEmptyString(state.seed, 'state.seed');
        TypeUtils.ensureNumber(state.internalState, 'state.internalState');
        TypeUtils.ensureNumber(state.callCount, 'state.callCount');

        this.seed = state.seed;
        this.rng = SeededRandom.create(state.seed);
        this.rng.setState(state.internalState);
        this.callCount = state.callCount;
    }

    /**
     * Serialize RNG state for save/load
     * 
     * @returns Serialized random state
     */
    getState(): RandomState {
        return {
            seed: this.seed,
            internalState: this.rng.getState(),
            callCount: this.callCount
        };
    }

    /**
     * Factory method to create RandomComponent instance.
     * 
     * @param randomSeedData - Random seed configuration data
     * @returns New RandomComponent instance
     */
    static create(randomSeedData: RandomSeedData): RandomComponent {
        return new RandomComponent(randomSeedData);
    }

    /**
     * Create null object instance (singleton pattern).
     * Returns a deterministic "null" random component for testing.
     * 
     * @returns Singleton null RandomComponent instance
     */
    private static nullInstance: RandomComponent | null = null;

    static createNull(): RandomComponent {
        if (!RandomComponent.nullInstance) {
            RandomComponent.nullInstance = RandomComponent.create(RandomSeedData.createNull());
        }
        return RandomComponent.nullInstance;
    }
}
