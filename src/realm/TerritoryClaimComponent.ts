import { Component } from '../ecs/Component';
import { ClaimStatus } from './ClaimStatus';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Component attached to planet entities to track which realms claim them.
 * A planet can be claimed by multiple realms simultaneously (contested claims).
 */
export class TerritoryClaimComponent extends Component {
    private readonly claims: Map<string, ClaimStatus>;

    /**
     * Creates a new TerritoryClaimComponent.
     */
    constructor() {
        super();
        this.claims = new Map<string, ClaimStatus>();
        Object.freeze(this);
    }

    /**
     * Adds a claim to this planet from a realm.
     * @param realmId - The entity ID of the realm making the claim
     * @param status - The claim status
     */
    addClaim(realmId: string, status: ClaimStatus): void {
        TypeUtils.ensureNonEmptyString(realmId, 'Realm ID must be a non-empty string.');
        if (!Object.values(ClaimStatus).includes(status)) {
            throw new TypeError('Status must be a valid ClaimStatus.');
        }
        this.claims.set(realmId, status);
    }

    /**
     * Removes a claim from this planet.
     * @param realmId - The entity ID of the realm removing the claim
     */
    removeClaim(realmId: string): void {
        TypeUtils.ensureNonEmptyString(realmId, 'Realm ID must be a non-empty string.');
        this.claims.delete(realmId);
    }

    /**
     * Gets all claims on this planet.
     * Returns a defensive copy to prevent external modification.
     */
    getClaims(): ReadonlyMap<string, ClaimStatus> {
        return new Map(this.claims);
    }

    /**
     * Checks if this planet has contesting claims (multiple realms with claims).
     */
    hasContestingClaims(): boolean {
        return this.claims.size > 1;
    }

    /**
     * Gets the realm ID that controls this planet (has Core status).
     * Returns null if no realm has core control, or if multiple realms have core claims.
     * @returns The controlling realm ID, or null
     */
    getControllingRealm(): string | null {
        const coreRealms = Array.from(this.claims.entries())
            .filter(([, status]) => status === ClaimStatus.Core)
            .map(([realmId]) => realmId);

        return coreRealms.length === 1 ? coreRealms[0] : null;
    }

    /**
     * Gets the claim status for a specific realm.
     * @param realmId - The entity ID of the realm
     * @returns The claim status, or null if the realm has no claim
     */
    getClaimStatus(realmId: string): ClaimStatus | null {
        TypeUtils.ensureNonEmptyString(realmId, 'Realm ID must be a non-empty string.');
        return this.claims.get(realmId) ?? null;
    }

    /**
     * Checks if a specific realm has any claim on this planet.
     * @param realmId - The entity ID of the realm
     */
    hasClaim(realmId: string): boolean {
        TypeUtils.ensureNonEmptyString(realmId, 'Realm ID must be a non-empty string.');
        return this.claims.has(realmId);
    }

    /**
     * Gets the total number of claims on this planet.
     */
    getClaimCount(): number {
        return this.claims.size;
    }

    /**
     * Static factory method for creating TerritoryClaimComponent instances.
     */
    static create(): TerritoryClaimComponent {
        return new TerritoryClaimComponent();
    }
}
