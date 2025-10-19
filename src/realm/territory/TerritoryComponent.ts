import { Component } from '../../ecs/Component';
import { ClaimStatus } from './ClaimStatus';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * Component that identifies an entity as a realm and tracks its territorial extent.
 * A realm represents a political entity that controls a collection of planets.
 * 
 * This component manages territorial claims, distinguishing this from RealmStateComponent
 * which manages the dynasty's resources (Treasury, Stability, etc.).
 */
export class TerritoryComponent extends Component {
    private readonly name: string;
    private readonly claimedPlanets: Map<string, ClaimStatus>;
    private foundingYear: number;

    /**
     * Creates a new TerritoryComponent.
     * @param name - The display name of the realm
     * @param foundingYear - The year the realm was established
     */
    constructor(name: string, foundingYear: number) {
        super();
        TypeUtils.ensureNonEmptyString(name, 'TerritoryComponent name must be a non-empty string.');
        TypeUtils.ensureNumber(foundingYear, 'TerritoryComponent foundingYear must be a number.');

        this.name = name;
        this.foundingYear = foundingYear;
        this.claimedPlanets = new Map<string, ClaimStatus>();
        Object.freeze(this);
    }

    /**
     * Gets the realm's display name.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the founding year of the realm.
     */
    getFoundingYear(): number {
        return this.foundingYear;
    }

    /**
     * Adds a planet to the realm's territory.
     * @param planetId - The entity ID of the planet
     * @param status - The claim status for this planet
     */
    addPlanet(planetId: string, status: ClaimStatus): void {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet ID must be a non-empty string.');
        if (!Object.values(ClaimStatus).includes(status)) {
            throw new TypeError('Status must be a valid ClaimStatus.');
        }
        this.claimedPlanets.set(planetId, status);
    }

    /**
     * Removes a planet from the realm's territory.
     * @param planetId - The entity ID of the planet
     */
    removePlanet(planetId: string): void {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet ID must be a non-empty string.');
        this.claimedPlanets.delete(planetId);
    }

    /**
     * Gets all planet IDs claimed by this realm.
     */
    getPlanets(): string[] {
        return Array.from(this.claimedPlanets.keys());
    }

    /**
     * Gets all planet IDs with Core status.
     */
    getCorePlanets(): string[] {
        return Array.from(this.claimedPlanets.entries())
            .filter(([, status]) => status === ClaimStatus.Core)
            .map(([planetId]) => planetId);
    }

    /**
     * Checks if the realm claims a specific planet.
     * @param planetId - The entity ID of the planet
     */
    hasPlanet(planetId: string): boolean {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet ID must be a non-empty string.');
        return this.claimedPlanets.has(planetId);
    }

    /**
     * Gets the claim status for a specific planet.
     * @param planetId - The entity ID of the planet
     * @returns The claim status, or null if the planet is not claimed
     */
    getClaimStatus(planetId: string): ClaimStatus | null {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet ID must be a non-empty string.');
        return this.claimedPlanets.get(planetId) ?? null;
    }

    /**
     * Gets the total number of planets claimed by this realm.
     */
    getPlanetCount(): number {
        return this.claimedPlanets.size;
    }

    /**
     * Static factory method for creating TerritoryComponent instances.
     * @param name - The display name of the realm
     * @param foundingYear - The year the realm was established
     */
    static create(name: string, foundingYear: number): TerritoryComponent {
        return new TerritoryComponent(name, foundingYear);
    }
}
