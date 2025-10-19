/**
 * Represents the status of a territorial claim on a planet.
 */
export enum ClaimStatus {
    /**
     * Integral part of the realm (starting planets, fully integrated).
     */
    Core = 'Core',

    /**
     * Recently acquired territory that needs integration.
     */
    Claimed = 'Claimed',

    /**
     * Territory claimed by multiple realms simultaneously.
     */
    Contested = 'Contested'
}
