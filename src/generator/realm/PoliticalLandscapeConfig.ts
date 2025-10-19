/**
 * Configuration for political landscape generation.
 */
export interface PoliticalLandscapeConfig {
    /**
     * Total number of realms to generate (default: 5-7).
     */
    numberOfRealms: number;

    /**
     * Minimum planets per realm (default: 3).
     */
    minPlanetsPerRealm: number;

    /**
     * Maximum planets per realm (default: 5).
     */
    maxPlanetsPerRealm: number;

    /**
     * Whether to designate one realm as player-controlled.
     */
    ensurePlayerRealm: boolean;

    /**
     * How to distribute seed planets across the galaxy.
     * - 'random': Random placement
     * - 'distributed': Attempt even spacing
     * - 'sectored': Cluster realms in distinct sectors
     */
    spatialDistribution: 'random' | 'distributed' | 'sectored';
}
