import { Component } from '../../ecs/Component';
import { TypeUtils } from '../../util/TypeUtils';
import { PlanetComponent } from '../planet/PlanetComponent';
import { Sector } from './Sector';

/**
 * Component that models the galactic map as a graph of planets (nodes)
 * connected by space lanes (edges). 
 * 
 * Planets are grouped into sectors for high-level regional play. 
 * 
 * The component offers query utilities that will be consumed by systems handling territorial control, logistics, and events.
 */
export class GalaxyMapComponent extends Component {
    private readonly sectors: Map<string, Sector>;
    private readonly planets: Map<string, PlanetComponent>;
    private readonly adjacency: Map<string, Set<string>>;

    /**
     * Constructor.
     */
    constructor() {
        super();
        this.sectors = new Map<string, Sector>();
        this.planets = new Map<string, PlanetComponent>();
        this.adjacency = new Map<string, Set<string>>();
    }

    /**
     * Clears all registered sectors, planets, and connections. Useful when
     * regenerating the galaxy map.
     */
    reset(): void {
        this.sectors.clear();
        this.planets.clear();
        this.adjacency.clear();
    }

    /**
     * Registers a sector within the galaxy map.
     * @param sector - The sector to add.
     */
    addSector(sector: Sector): void {
        TypeUtils.ensureInstanceOf(sector, Sector);
        const sectorId = sector.getId();
        if (!this.sectors.has(sectorId)) {
            this.sectors.set(sectorId, sector);
        }
    }

    /**
     * Adds a new planet to the galactic map and associates it with its sector.
     * @param planet - The planet component describing the world.
     */
    registerPlanet(planet: PlanetComponent): void {
        TypeUtils.ensureInstanceOf(planet, PlanetComponent);
        const planetId = planet.getId();
        const sectorId = planet.getSectorId();

        if (!this.sectors.has(sectorId)) {
            const message = `Planet ${planetId} references unknown sector ${sectorId}.`;
            console.error(message);
            console.trace('registerPlanet');
            throw new Error(message);
        }

        this.planets.set(planetId, planet);
        this.ensureAdjacencyEntry(planetId);
        const sector = this.sectors.get(sectorId);
        if (sector && !sector.hasPlanet(planetId)) {
            sector.addPlanet(planetId);
        }
    }

    /**
     * Connects two planets with a bidirectional space lane.
     *
     * @param planetAId - Identifier of the first planet.
     * @param planetBId - Identifier of the second planet.
     */
    connectPlanets(planetAId: string, planetBId: string): void {
        TypeUtils.ensureNonEmptyString(planetAId, 'planetAId must be a non-empty string.');
        TypeUtils.ensureNonEmptyString(planetBId, 'planetBId must be a non-empty string.');

        if (!this.planets.has(planetAId) || !this.planets.has(planetBId)) {
            const message = `Cannot connect unknown planets ${planetAId} and ${planetBId}.`;
            console.error(message);
            console.trace('connectPlanets');
            throw new Error(message);
        }

        this.ensureAdjacencyEntry(planetAId).add(planetBId);
        this.ensureAdjacencyEntry(planetBId).add(planetAId);
    }

    /**
     * Retrieves the sector registered with the provided identifier.
     * @returns The sector if found, otherwise undefined.
     */
    getSectorById(sectorId: string): Sector | undefined {
        TypeUtils.ensureNonEmptyString(sectorId, 'sectorId must be a non-empty string.');
        return this.sectors.get(sectorId);
    }

    /**
     * Returns all sectors currently registered with the galaxy.
     * @returns An array of all sectors.
     */
    getSectors(): Sector[] {
        return Array.from(this.sectors.values());
    }

    /**
     * Returns the planet registered with the provided identifier, if available.
     * @returns The planet if found, otherwise undefined.
     */
    getPlanetById(planetId: string): PlanetComponent | undefined {
        TypeUtils.ensureNonEmptyString(planetId, 'planetId must be a non-empty string.');
        return this.planets.get(planetId);
    }

    /**
     * Returns all planets grouped within the specified sector.
     * @returns An array of planets in the sector, or an empty array if the sector does not exist.
     */
    getPlanetsInSector(sectorId: string): PlanetComponent[] {
        TypeUtils.ensureNonEmptyString(sectorId, 'sectorId must be a non-empty string.');
        const sector = this.sectors.get(sectorId);
        if (!sector) {
            return [];
        }
        return sector.getPlanetIds()
            .map((planetId) => this.planets.get(planetId))
            .filter((planet): planet is PlanetComponent => Boolean(planet));
    }

    /**
     * Retrieves the neighbouring planets connected to the specified planet.
     * @return An array of connected planet identifiers, or an empty array if none exist.
     */
    getConnectedPlanets(planetId: string): string[] {
        TypeUtils.ensureNonEmptyString(planetId, 'planetId must be a non-empty string.');
        const neighbours = this.adjacency.get(planetId);
        if (!neighbours) {
            return [];
        }
        return Array.from(neighbours.values());
    }

    /**
     * Returns the number of registered planets.
     * @return The count of registered planets.
     */
    getPlanetCount(): number {
        return this.planets.size;
    }

    /**
     * Returns the number of registered sectors.
     * @return The count of registered sectors.
     */
    getSectorCount(): number {
        return this.sectors.size;
    }

    /**
     * Returns a random planet from the galaxy map.
     * @returns A random planet component, or undefined if no planets exist.
     */
    getRandomPlanet(): PlanetComponent | undefined {
        if (this.planets.size === 0) {
            return undefined;
        }
        const planetsArray = Array.from(this.planets.values());
        const randomIndex = Math.floor(Math.random() * planetsArray.length);
        return planetsArray[randomIndex];
    }

    /**
     * Static factory method to create GalaxyMapComponent.
     * @returns GalaxyMapComponent instance.
     */
    static create(): GalaxyMapComponent {
        return new GalaxyMapComponent();
    }

    /**
     * Ensures an adjacency entry exists for the provided planet.
     * @param planetId - Identifier of the planet.
     * @returns The adjacency set for the planet.
     */
    private ensureAdjacencyEntry(planetId: string): Set<string> {
        let adjacencyEntry = this.adjacency.get(planetId);
        if (!adjacencyEntry) {
            adjacencyEntry = new Set<string>();
            this.adjacency.set(planetId, adjacencyEntry);
        }
        return adjacencyEntry;
    }
}
