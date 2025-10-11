import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Seedable pseudo-random number generator using Mulberry32 algorithm.
 * Fast, high-quality PRNG suitable for game simulations.
 * 
 * Reference: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
export class SeededRandom {
    private state: number;

    constructor(seed: string) {
        TypeUtils.ensureNonEmptyString(seed, 'seed');
        this.state = SeededRandom.hashString(seed);
    }

    /**
     * Generate random float in range [0, 1)
     * Uses Mulberry32 algorithm for high-quality pseudo-random numbers.
     * 
     * @returns Random float in [0, 1) range
     */
    next(): number {
        this.state = (this.state + 0x6D2B79F5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), this.state | 1);
        t = t ^ (t + Math.imul(t ^ (t >>> 7), t | 61));
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * Get current internal PRNG state.
     * Used for state serialization.
     * 
     * @returns Current state value
     */
    getState(): number {
        return this.state;
    }

    /**
     * Set internal PRNG state.
     * Used for state restoration from serialized data.
     * 
     * @param state - State value to restore
     */
    setState(state: number): void {
        TypeUtils.ensureNumber(state, 'state');
        this.state = state | 0; // Ensure 32-bit integer
    }

    /**
     * Convert string seed to 32-bit integer using FNV-1a hash.
     * 
     * @param seed - String seed to hash
     * @returns 32-bit unsigned integer hash
     */
    static hashString(seed: string): number {
        TypeUtils.ensureNonEmptyString(seed, 'seed');
        let hash = 2166136261; // FNV offset basis
        for (let i = 0; i < seed.length; i++) {
            hash ^= seed.charCodeAt(i);
            hash = Math.imul(hash, 16777619); // FNV prime
        }
        return hash >>> 0; // Convert to unsigned 32-bit
    }

    /**
     * Factory method to create SeededRandom instance.
     * 
     * @param seed - String seed for PRNG initialization
     * @returns New SeededRandom instance
     */
    static create(seed: string): SeededRandom {
        return new SeededRandom(seed);
    }
}
