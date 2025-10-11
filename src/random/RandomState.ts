/**
 * Serializable state for RandomComponent.
 * Used for save/load functionality and state restoration.
 */
export interface RandomState {
    seed: string;           // Original seed string
    internalState: number;  // PRNG internal state (implementation-dependent)
    callCount: number;      // Number of random() calls made
}
