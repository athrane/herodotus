import { Component } from '../../ecs/Component';
import { Continent } from '../../geography/planet/Continent';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * Enumerates the operational state of a planet.
 */
export enum PlanetStatus {
    NORMAL = 'Normal',
    BESIEGED = 'Besieged',
    REBELLIOUS = 'Rebellious',
    DEVASTATED = 'Devastated'
}

/**
 * Enumerates the primary economic or logistical focus of a planet.
 */
export enum PlanetResourceSpecialization {
    AGRICULTURE = 'Agriculture',
    INDUSTRY = 'Industry',
    COMMERCE = 'Commerce',
    MILITARY = 'Military'
}

/**
 * Component that encapsulates the mutable state of a single planet within the
 * galaxy. Planets act as nodes in the galactic map and expose their
 * characteristics for systems concerned with control, logistics, and events.
 */
export class PlanetComponent extends Component {
    private readonly id: string;
    private readonly name: string;
    private readonly sectorId: string;
    private ownership: string;
    private status: PlanetStatus;
    private developmentLevel: number;
    private fortificationLevel: number;
    private resourceSpecialization: PlanetResourceSpecialization;
    private readonly continents: Continent[];
    private static nullInstance: PlanetComponent | null = null;

    /**
     * Creates a new PlanetComponent.
     *
     * @param id - Unique identifier for the planet node in the galaxy graph.
     * @param name - Display name of the planet.
     * @param sectorId - Identifier of the sector containing the planet.
     * @param ownership - Name or tag of the controlling faction/realm.
     * @param status - Current control status of the planet.
     * @param developmentLevel - Infrastructure development level (1-10).
     * @param fortificationLevel - Fortification level (0-5).
     * @param resourceSpecialization - Economic focus of the planet.
     */
    constructor(
        id: string,
        name: string,
        sectorId: string,
        ownership: string,
        status: PlanetStatus,
        developmentLevel: number,
        fortificationLevel: number,
        resourceSpecialization: PlanetResourceSpecialization,
        continents: Continent[]
    ) {
        super();
        TypeUtils.ensureNonEmptyString(id, 'Planet id must be a non-empty string.');
        TypeUtils.ensureNonEmptyString(name, 'Planet name must be a non-empty string.');
        TypeUtils.ensureNonEmptyString(sectorId, 'Sector id must be a non-empty string.');
        TypeUtils.ensureString(ownership, 'Ownership must be a string.');
        TypeUtils.ensureNumber(developmentLevel, 'Development level must be a number.');
        TypeUtils.ensureNumber(fortificationLevel, 'Fortification level must be a number.');
        TypeUtils.ensureArray(continents, 'Continents must be provided as an array.');
        continents.forEach((continent, index) =>
            TypeUtils.ensureInstanceOf(continent, Continent, `Continent at index ${index} must be a Continent.`)
        );

        this.id = id;
        this.name = name;
        this.sectorId = sectorId;
        this.ownership = ownership;
        this.status = status;
        this.developmentLevel = PlanetComponent.clampDevelopment(developmentLevel);
        this.fortificationLevel = PlanetComponent.clampFortification(fortificationLevel);
        this.resourceSpecialization = resourceSpecialization;
    this.continents = [...continents];
    }

    /**
     * Returns a null object instance of PlanetComponent.
     * This instance serves as a safe, neutral placeholder when a PlanetComponent is not available.
     * @returns A null PlanetComponent instance with default values.
     */
    static get Null(): PlanetComponent {
        if (!PlanetComponent.nullInstance) {
            const instance = Object.create(PlanetComponent.prototype);
            instance.id = '';
            instance.name = '';
            instance.sectorId = '';
            instance.ownership = '';
            instance.status = PlanetStatus.NORMAL;
            instance.developmentLevel = 1;
            instance.fortificationLevel = 0;
            instance.resourceSpecialization = PlanetResourceSpecialization.AGRICULTURE;
            instance.continents = [];
            Object.freeze(instance);
            PlanetComponent.nullInstance = instance;
        }
        return PlanetComponent.nullInstance!;
    }

    /**
     * Gets the unique identifier of the planet.
     * @return The planet's unique identifier.
     */
    getId(): string {
        return this.id;
    }

    /**
     * Gets the display name of the planet.
     * @return The planet's display name.
     */
    getName(): string {
        return this.name;
    }

    /**
     * Gets the identifier of the sector containing this planet.
     * @return The sector identifier.
     */
    getSectorId(): string {
        return this.sectorId;
    }

    /**
     * Gets the ownership label of the planet.
     * @return The owning faction or realm.
     */
    getOwnership(): string {
        return this.ownership;
    }

    /**
     * Updates the owning faction of the planet.
     * @param ownership - The new owning faction or realm.
     */
    setOwnership(ownership: string): void {
        TypeUtils.ensureString(ownership, 'Ownership must be a string.');
        this.ownership = ownership;
    }

    /**
     * Returns the current status of the planet.
     * @return The planet's status.
     */
    getStatus(): PlanetStatus {
        return this.status;
    }

    /**
     * Updates the current status of the planet.
     * @param status - The new status of the planet.
     */
    setStatus(status: PlanetStatus): void {
        this.status = status;
    }

    /**
     * Returns the current development level (1-10).
     * @return The development level.
     */
    getDevelopmentLevel(): number {
        return this.developmentLevel;
    }

    /**
     * Adjusts the development level, enforcing bounds.
     * @param level - The new development level (1-10).
     */
    setDevelopmentLevel(level: number): void {
        TypeUtils.ensureNumber(level, 'Development level must be a number.');
        this.developmentLevel = PlanetComponent.clampDevelopment(level);
    }

    /**
     * Returns the fortification level (0-5).
     * @return The fortification level.
     */
    getFortificationLevel(): number {
        return this.fortificationLevel;
    }

    /**
     * Adjusts the fortification level, enforcing bounds.
     * @param level - The new fortification level (0-5).
     */
    setFortificationLevel(level: number): void {
        TypeUtils.ensureNumber(level, 'Fortification level must be a number.');
        this.fortificationLevel = PlanetComponent.clampFortification(level);
    }

    /**
     * Returns the economic focus of the planet.
     * @return The planet's resource specialization.
     */
    getResourceSpecialization(): PlanetResourceSpecialization {
        return this.resourceSpecialization;
    }

    /**
     * Updates the economic focus of the planet.
     * @param specialization - The new resource specialization.
     */
    setResourceSpecialization(specialization: PlanetResourceSpecialization): void {
        this.resourceSpecialization = specialization;
    }

    /**
     * Retrieves the continents present on the planet.
     * @returns An array of continent instances.
     */
    getContinents(): Continent[] {
        return [...this.continents];
    }

    /**
     * Adds a continent to the planet.
     * @param continent - The continent to add.
     */
    addContinent(continent: Continent): void {
        TypeUtils.ensureInstanceOf(continent, Continent, 'continent must be a Continent instance.');
        this.continents.push(continent);
    }

    /**
     * Factory method to create a planet component.
     * @param id - Unique identifier for the planet node in the galaxy graph.   
     * @param name - Display name of the planet.
     * @param sectorId - Identifier of the sector containing the planet.
     * @param ownership - Name or tag of the controlling faction/realm.
     * @param status - Current control status of the planet.
     * @param developmentLevel - Infrastructure development level (1-10).
     * @param fortificationLevel - Fortification level (0-5).
     * @param resourceSpecialization - Economic focus of the planet.
     * @param continents - Continents that exist on the planet.
     * @returns A new PlanetComponent instance.
     */
    static create(
        id: string,
        name: string,
        sectorId: string,
        ownership: string,
        status: PlanetStatus,
        developmentLevel: number,
        fortificationLevel: number,
        resourceSpecialization: PlanetResourceSpecialization,
        continents: Continent[]
    ): PlanetComponent {
        return new PlanetComponent(
            id,
            name,
            sectorId,
            ownership,
            status,
            developmentLevel,
            fortificationLevel,
            resourceSpecialization,
            continents
        );
    }

    /**
     * Clamps the development level to the range 1-10.
     * @param level - The level to clamp.
     * @returns The clamped level.
     */
    private static clampDevelopment(level: number): number {
        const clamped = Math.min(Math.max(Math.round(level), 1), 10);
        return clamped;
    }

    /**
     * Clamps the fortification level to the range 0-5.
     * @param level - The level to clamp.
     * @returns The clamped level.
     */
    private static clampFortification(level: number): number {
        const clamped = Math.min(Math.max(Math.round(level), 0), 5);
        return clamped;
    }
}
