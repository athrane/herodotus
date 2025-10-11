import { TypeUtils } from '../../util/TypeUtils.js';

/**
 * Represents random seed configuration data loaded from JSON.
 * This class provides runtime validation and type safety for random seed parameters.
 */
export class RandomSeedData {
    private readonly seed: string;

    private static instance: RandomSeedData | null = null;

    /**
     * Creates a new RandomSeedData instance from JSON data.
     * @param data - The JSON object containing random seed configuration.
     */
    constructor(data: any) {
        TypeUtils.ensureNonEmptyString(data?.seed, 'RandomSeedData seed must be a non-empty string.');

        this.seed = data.seed;

        Object.freeze(this); // Make instances immutable
    }

    /**
     * Static factory method to create a RandomSeedData instance.
     * @param data - The JSON object containing random seed configuration.
     * @returns A new RandomSeedData instance.
     */
    static create(data: any): RandomSeedData {
        return new RandomSeedData(data);
    }

    /**
     * Creates a null instance of RandomSeedData with default values.
     * Uses lazy initialization to create singleton null instance.
     * @returns A null RandomSeedData instance.
     */
    static createNull(): RandomSeedData {
        if (!RandomSeedData.instance) {
            RandomSeedData.instance = RandomSeedData.create({
                seed: 'default-null-seed'
            });
        }
        return RandomSeedData.instance;
    }

    /**
     * Gets the seed string.
     * @returns The seed string.
     */
    getSeed(): string {
        return this.seed;
    }
}
