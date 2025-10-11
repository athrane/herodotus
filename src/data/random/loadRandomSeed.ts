import randomSeedDataRaw from '../../../data/random/seed.json';
import { RandomSeedData } from './RandomSeedData.js';

/**
 * Loads random seed configuration from a JSON file.
 * @returns A RandomSeedData instance containing the configuration.
 */
export function loadRandomSeed(): RandomSeedData {
    return RandomSeedData.create(randomSeedDataRaw);
}
