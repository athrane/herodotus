import { Continent } from '../../geography/planet/Continent';
import { GeographicalFeature } from '../../geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../geography/feature/GeographicalFeatureTypeRegistry';
import { World } from '../../geography/World';
import { GalaxyMapComponent } from '../../geography/galaxy/GalaxyMapComponent';
import { Sector } from '../../geography/galaxy/Sector';
import { PlanetComponent, PlanetResourceSpecialization, PlanetStatus } from '../../geography/planet/PlanetComponent';
import { TypeUtils } from '../../util/TypeUtils';
import { NameGenerator } from '../../naming/NameGenerator';

/**
 * A self-contained generator that orchestrates the creation of a world,
 * including its geography and history.
 */
export class WorldGenerator {

    /**
     * @constant
     * @description The number of continents to generate in the world.
     * @default 3   
     */
    static readonly NUM_CONTINENTS: number = 3;

    /**
     * @constant
     * @description The number of sectors to generate in the galaxy.
     * @default 3
     */
    static readonly NUM_SECTORS: number = 3;

    /**
     * @constant
     * @description The number of planets to generate per sector.
     * @default 64
     */
    static readonly PLANETS_PER_SECTOR: number = 64;

    /**
     * @constant
     * @description The number of geographical features to generate per continent.
     * @default 50
     */
    static readonly FEATURES_PER_CONTINENT: number = 50;

    /**
     * @constant
     * @description The number of continents to generate for each planet.
     * @default 5
     */
    static readonly CONTINENTS_PER_PLANET: number = 5;

    /**
     * @constant
     * @description The number of geographical features to generate per planetary continent.
     * @default 64
     */
    static readonly FEATURES_PER_PLANET_CONTINENT: number = 64;

    private readonly nameGenerator: NameGenerator;
    private latestGalaxyMap: GalaxyMapComponent | null;

    /**
     * Creates an instance of WorldGenerator.
     *
     * @param nameGenerator - The name generator to use.
     */
    constructor(nameGenerator: NameGenerator) {
        TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator);
        this.nameGenerator = nameGenerator;
        this.latestGalaxyMap = null;
    }

    /**
     * Generates a single continent with a specified number of features.
     *
     * @param name - The name of the continent.
     * @param numFeatures - The number of geographical features to generate.
     * @returns A new continent object.
     */
    generateContinent(name: string, numFeatures: number): Continent {
        const continent = new Continent(name);
        for (let i = 0; i < numFeatures; i++) {
            const featureType = GeographicalFeatureTypeRegistry.getRandom();
            if (featureType) {
                const featureName = this.nameGenerator.generateSyllableName('GENERIC');
                const feature = new GeographicalFeature(featureName, featureType);
                continent.addFeature(feature);
            }
        }
        return continent;
    }

    /**
     * Generates a world with 3 continents, each having 50 geographical features.
     *
     * @param worldName - The name of the world.
     * @returns A new world object.
     */
    generateWorld(worldName: string): World {
        TypeUtils.ensureString(worldName, 'World name must be a string.');
        const world = new World(worldName);

        for (let i = 0; i < WorldGenerator.NUM_CONTINENTS; i++) {
            const continentName = this.nameGenerator.generateSyllableName('GENERIC');
            const continent = this.generateContinent(continentName, WorldGenerator.FEATURES_PER_CONTINENT);
            world.addContinent(continent);
        }
        return world;
    }

    /**
     * Generates a galaxy map composed of sectors and planets interconnected by space lanes.
     * The generated galaxy is cached and can be retrieved via {@link getLatestGalaxy}.
     */
    generateGalaxyMap(): GalaxyMapComponent {
        const galaxyMap = GalaxyMapComponent.create();
        galaxyMap.reset();

        // Create sectors and planets
        for (let sectorIndex = 0; sectorIndex < WorldGenerator.NUM_SECTORS; sectorIndex++) {
            const sectorId = `sector-${sectorIndex + 1}`;
            const sectorName = this.nameGenerator.generateSyllableName('SECTOR');
            const sector = Sector.create(sectorId, sectorName);
            galaxyMap.addSector(sector);

            let previousPlanetId: string | null = null;

            // Create planets within the sector
            for (let planetIndex = 0; planetIndex < WorldGenerator.PLANETS_PER_SECTOR; planetIndex++) {
                const planetId = `${sectorId}-planet-${planetIndex + 1}`;
                const planetName = this.nameGenerator.generateSyllableName('PLANET');
                const continents = this.generatePlanetContinents();
                const planet = PlanetComponent.create(
                    planetId,
                    planetName,
                    sectorId,
                    'Unclaimed',
                    PlanetStatus.NORMAL,
                    this.randomIntInclusive(3, 8),
                    this.randomIntInclusive(0, 3),
                    this.pickRandomResourceSpecialization(),
                    continents
                );

                // Register the planet with the galaxy map
                galaxyMap.registerPlanet(planet);

                // Connect the planet to the previous planet in the sector
                if (previousPlanetId) {
                    galaxyMap.connectPlanets(previousPlanetId, planetId);
                }

                previousPlanetId = planetId;
            }
        }

        // Link sectors via their gateway planets
        this.linkSectorGateways(galaxyMap);

        // Cache the generated galaxy map
        this.latestGalaxyMap = galaxyMap;
        return galaxyMap;
    }

    /**
     * Generates continents for a planet.
     * @returns An array of generated continents.
     */
    private generatePlanetContinents(): Continent[] {
        const continents: Continent[] = [];
        for (let i = 0; i < WorldGenerator.CONTINENTS_PER_PLANET; i++) {
            const continentName = this.nameGenerator.generateSyllableName('GENERIC');
            const continent = this.generateContinent(
                continentName,
                WorldGenerator.FEATURES_PER_PLANET_CONTINENT
            );
            continents.push(continent);
        }
        return continents;
    }

    /**
     * Retrieves the most recently generated galaxy map.
     *
     * @throws {Error} When no galaxy map has been generated yet.
     */
    getLatestGalaxyMap(): GalaxyMapComponent {
        if (!this.latestGalaxyMap) {
            const message = 'Galaxy map has not been generated yet.';
            console.error(message);
            console.trace('getLatestGalaxyMap');
            throw new Error(message);
        }
        return this.latestGalaxyMap;
    }

    /**
     * Links gateway planets between sectors to ensure inter-sector connectivity.
     * Each sector's first planet is connected to the first planet of the next sector,
     * forming a circular connection among all sectors.
     * @param galaxyMap - The galaxy map to modify.
     */
    private linkSectorGateways(galaxyMap: GalaxyMapComponent): void {
        const sectors = galaxyMap.getSectors();

        // No linking needed if there is only one or no sectors
        if (sectors.length <= 1) {
            return;
        }

        // Link each sector's first planet to the next sector's first planet
        for (let i = 0; i < sectors.length; i++) {
            const currentSector = sectors[i];
            const nextSector = sectors[(i + 1) % sectors.length];

            const currentGatePlanetId = `${currentSector.getId()}-planet-1`;
            const nextGatePlanetId = `${nextSector.getId()}-planet-1`;

            // Ensure both gateway planets exist before connecting
            if (galaxyMap.getPlanetById(currentGatePlanetId) && galaxyMap.getPlanetById(nextGatePlanetId)) {
                galaxyMap.connectPlanets(currentGatePlanetId, nextGatePlanetId);
            }
        }
    }

    /**
     * Picks a random resource specialization from the available options.
     * @returns A randomly selected PlanetResourceSpecialization.
     */
    private pickRandomResourceSpecialization(): PlanetResourceSpecialization {
        const values = Object.values(PlanetResourceSpecialization);
        const index = this.randomIntInclusive(0, values.length - 1);
        return values[index];
    }

    /**
     * Generates a random integer between min and max, inclusive.
     * @param min - The minimum value (inclusive).
     * @param max - The maximum value (inclusive).
     * @returns A random integer between min and max, inclusive.
     */
    private randomIntInclusive(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Creates a new instance of WorldGenerator.
     *
     * @param nameGenerator - The name generator to use.
     * @returns A new WorldGenerator instance.
     */
    static create(nameGenerator: NameGenerator): WorldGenerator {
        return new WorldGenerator(nameGenerator);
    }
}