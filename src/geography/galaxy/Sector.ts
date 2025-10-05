import { TypeUtils } from '../../util/TypeUtils';

/**
 * A sector encapsulates a named region of the galaxy and tracks the planets
 * that belong to it. Sectors provide regional context for gameplay systems
 * such as control, logistics, and narrative events.
 */
export class Sector {
    private readonly id: string;
    private readonly name: string;
    private readonly planetIds: Set<string>;
    private static nullInstance: Sector | null = null;

    /**
     * Creates a new Sector instance.
    * @param id - Unique identifier for the sector.
     * @param name - Display name of the sector.
     * @param planetIds - Optional iterable of planet identifiers belonging to the sector.
     */
    constructor(id: string, name: string, planetIds?: Iterable<string>) {
        TypeUtils.ensureNonEmptyString(id, 'Sector id must be a non-empty string.');
        TypeUtils.ensureNonEmptyString(name, 'Sector name must be a non-empty string.');

        this.id = id;
        this.name = name;
        this.planetIds = new Set<string>();

        if (planetIds) {
            for (const planetId of planetIds) {
                TypeUtils.ensureNonEmptyString(planetId, 'Planet identifier must be a non-empty string.');
                this.planetIds.add(planetId);
            }
        }
    }

    /**
     * Returns a null object instance of Sector.
     * This instance serves as a safe, neutral placeholder when a Sector is not available.
     * @returns A null Sector instance with default values.
     */
    static get Null(): Sector {
        if (!Sector.nullInstance) {
            const instance = Object.create(Sector.prototype);
            instance.id = '';
            instance.name = '';
            instance.planetIds = new Set<string>();
            Object.freeze(instance);
            Sector.nullInstance = instance;
        }
        return Sector.nullInstance!;
    }

    /**
     * Gets the unique identifier of the sector.
     * @return The sector's unique identifier.
     */
    getId(): string {
        return this.id;
    }

    /**
     * Gets the display name of the sector.
     * @return The sector's display name.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Returns the identifiers of all planets contained in the sector.
     * @return An array of planet identifiers.
     */
    getPlanetIds(): string[] {
        return Array.from(this.planetIds);
    }

    /**
     * Registers a planet with this sector.
     *     * @param planetId - Identifier of the planet to add.
     */
    addPlanet(planetId: string): void {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet identifier must be a non-empty string.');
        this.planetIds.add(planetId);
    }

    /**
     * Checks whether a planet is already registered within this sector.
     * @param planetId - Identifier of the planet.
     */
    hasPlanet(planetId: string): boolean {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet identifier must be a non-empty string.');
        return this.planetIds.has(planetId);
    }

    /**
     * Removes a planet from this sector.
     * @param planetId - Identifier of the planet to remove.
     */
    removePlanet(planetId: string): void {
        TypeUtils.ensureNonEmptyString(planetId, 'Planet identifier must be a non-empty string.');
        this.planetIds.delete(planetId);
    }

    /**
     * Static factory method to create a Sector.
     * @param id - Unique identifier for the sector.
     * @param name - Display name of the sector.
     * @param planetIds - Optional iterable of planet identifiers belonging to the sector.
     * @return A new Sector instance.
     */
    static create(id: string, name: string, planetIds?: Iterable<string>): Sector {
        return new Sector(id, name, planetIds);
    }
}
