/**
 * Data structure representing a random seed configuration.
 */
export interface RandomSeed {
    version: string;        // Schema version (e.g., "1.0")
    seed: string;           // Seed string (any non-empty string)
    description?: string;   // Optional human-readable description
}
