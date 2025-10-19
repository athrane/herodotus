import { Ecs } from '../../ecs/Ecs';
import { TypeUtils } from '../../util/TypeUtils';
import { NameGenerator } from '../../naming/NameGenerator';
import { GalaxyMapComponent } from '../../geography/galaxy/GalaxyMapComponent';
import { TerritoryComponent } from '../../realm/territory/TerritoryComponent';
import { TerritoryClaimComponent } from '../../realm/territory/TerritoryClaimComponent';
import { ClaimStatus } from '../../realm/territory/ClaimStatus';
import { NameComponent } from '../../ecs/NameComponent';
import { TimeComponent } from '../../time/TimeComponent';
import { RandomComponent } from '../../random/RandomComponent';
import type { RealmGeneratorConfig } from './RealmGeneratorConfig';

/**
 * Generator that creates the initial realm configuration of the galaxy.
 * Procedurally generates realms that control clusters of 3-5 neighboring planets,
 * establishing territorial boundaries for inter-realm dynamics.
 */
export class RealmGenerator {
    private readonly nameGenerator: NameGenerator;
    private readonly config: RealmGeneratorConfig;

    /**
     * Creates a new RealmGenerator.
     * @param nameGenerator - Name generator for realm names
     * @param config - Configuration for realm generation
     */
    constructor(nameGenerator: NameGenerator, config: RealmGeneratorConfig) {
        TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator);
        TypeUtils.ensureNumber(config.numberOfRealms, 'numberOfRealms must be a number.');
        TypeUtils.ensureNumber(config.minPlanetsPerRealm, 'minPlanetsPerRealm must be a number.');
        TypeUtils.ensureNumber(config.maxPlanetsPerRealm, 'maxPlanetsPerRealm must be a number.');

        if (config.minPlanetsPerRealm < 1) {
            throw new TypeError('minPlanetsPerRealm must be at least 1.');
        }
        if (config.maxPlanetsPerRealm < config.minPlanetsPerRealm) {
            throw new TypeError('maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
        }

        this.nameGenerator = nameGenerator;
        this.config = config;
    }

    /**
     * Generates realms, creating realm entities with territorial claims.
     * @param galaxyMap - Pre-generated galaxy map with planets
     * @param randomComponent - The random component for deterministic generation
     * @param ecs - The ECS instance to create entities in
     * @returns Array of realm entity IDs
     */
    generate(galaxyMap: GalaxyMapComponent, randomComponent: RandomComponent, ecs: Ecs): string[] {
        TypeUtils.ensureInstanceOf(galaxyMap, GalaxyMapComponent);
        TypeUtils.ensureInstanceOf(randomComponent, RandomComponent);
        TypeUtils.ensureInstanceOf(ecs, Ecs);

        const timeComponent = ecs.getEntityManager().getSingletonComponent(TimeComponent);
        const currentYear = timeComponent ? timeComponent.getTime().getYear() : 0;

        // Track which planets have been claimed
        const claimedPlanets = new Set<string>();
        const realmIds: string[] = [];

        // Determine how many realms we can actually create
        const totalPlanets = galaxyMap.getPlanetCount();
        const maxPossibleRealms = Math.floor(totalPlanets / this.config.minPlanetsPerRealm);
        const realmsToCreate = Math.min(this.config.numberOfRealms, maxPossibleRealms);

        if (realmsToCreate === 0) {
            console.warn('Not enough planets to create any realms.');
            return realmIds;
        }

        // Select seed planets for each realm
        const seedPlanets = this.selectSeedPlanets(galaxyMap, realmsToCreate, randomComponent);

        // Generate each realm
        for (const seedPlanetId of seedPlanets) {
            const targetSize = randomComponent.nextInt(
                this.config.minPlanetsPerRealm,
                this.config.maxPlanetsPerRealm
            );

            // Expand territory from seed planet
            const territoryPlanets = this.expandTerritory(
                seedPlanetId,
                targetSize,
                galaxyMap,
                claimedPlanets,
                randomComponent
            );

            if (territoryPlanets.length === 0) {
                continue;
            }

            // Mark planets as claimed
            territoryPlanets.forEach(planetId => claimedPlanets.add(planetId));

            // Generate realm name
            const realmName = this.nameGenerator.generateSyllableName('GENERIC');

            // Create realm entity
            const realmId = this.createRealmEntity(
                realmName,
                territoryPlanets,
                currentYear,
                ecs
            );

            realmIds.push(realmId);
        }

        return realmIds;
    }

    /**
     * Selects seed planets for realm generation.
     * @param galaxyMap - The galaxy map
     * @param count - Number of seed planets to select
     * @param randomComponent - Random number generator
     * @returns Array of planet IDs to use as seeds
     */
    private selectSeedPlanets(
        galaxyMap: GalaxyMapComponent,
        count: number,
        randomComponent: RandomComponent
    ): string[] {
        const allPlanetIds = Array.from({ length: galaxyMap.getPlanetCount() }, () => {
            const planet = galaxyMap.getRandomPlanet(randomComponent);
            return planet.getId();
        });

        // For simplicity, use random selection
        // TODO: Implement spatial distribution strategies (distributed, sectored)
        const seeds: string[] = [];
        const available = new Set(allPlanetIds);

        for (let i = 0; i < count && available.size > 0; i++) {
            const availableArray = Array.from(available);
            const index = randomComponent.nextInt(0, availableArray.length - 1);
            const selectedId = availableArray[index];
            seeds.push(selectedId);
            available.delete(selectedId);
        }

        return seeds;
    }

    /**
     * Expands territory from a seed planet using breadth-first search.
     * @param seedPlanetId - Starting planet ID
     * @param targetSize - Desired number of planets
     * @param galaxyMap - The galaxy map
     * @param claimedPlanets - Set of already-claimed planet IDs
     * @param randomComponent - Random number generator
     * @returns Array of planet IDs in the territory
     */
    private expandTerritory(
        seedPlanetId: string,
        targetSize: number,
        galaxyMap: GalaxyMapComponent,
        claimedPlanets: Set<string>,
        randomComponent: RandomComponent
    ): string[] {
        if (claimedPlanets.has(seedPlanetId)) {
            return [];
        }

        const territory: string[] = [seedPlanetId];
        const queue: string[] = [seedPlanetId];
        const visited = new Set<string>([seedPlanetId]);

        while (queue.length > 0 && territory.length < targetSize) {
            const currentPlanetId = queue.shift()!;
            const neighbors = galaxyMap.getConnectedPlanets(currentPlanetId);

            // Shuffle neighbors for variety
            const shuffledNeighbors = this.shuffleArray(neighbors, randomComponent);

            for (const neighborId of shuffledNeighbors) {
                if (territory.length >= targetSize) {
                    break;
                }

                if (!visited.has(neighborId) && !claimedPlanets.has(neighborId)) {
                    visited.add(neighborId);
                    territory.push(neighborId);
                    queue.push(neighborId);
                }
            }
        }

        return territory;
    }

    /**
     * Creates a realm entity with appropriate components.
     * @param name - Realm name
     * @param planetIds - Array of planet IDs in realm territory
     * @param foundingYear - Year the realm was founded
     * @param ecs - The ECS instance
     * @returns The created realm entity ID
     */
    private createRealmEntity(
        name: string,
        planetIds: string[],
        foundingYear: number,
        ecs: Ecs
    ): string {
        const entityManager = ecs.getEntityManager();
        const realmEntity = entityManager.createEntity();
        const realmId = realmEntity.getId();

        // Add name component
        realmEntity.addComponent(NameComponent.create(name));

        // Add territorial realm component
        const territoryComponent = TerritoryComponent.create(name, foundingYear);
        planetIds.forEach(planetId => {
            territoryComponent.addPlanet(planetId, ClaimStatus.Core);
        });
        realmEntity.addComponent(territoryComponent);

        // Add territory claim components to planets
        planetIds.forEach(planetId => {
            const planetEntity = entityManager.getEntity(planetId);
            if (!planetEntity) {
                console.warn(`Planet entity ${planetId} not found.`);
                return;
            }

            let claimComponent = planetEntity.getComponent(TerritoryClaimComponent);
            if (!claimComponent) {
                claimComponent = TerritoryClaimComponent.create();
                planetEntity.addComponent(claimComponent);
            }

            claimComponent.addClaim(realmId, ClaimStatus.Core);
        });

        return realmId;
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm.
     * @param array - Array to shuffle
     * @param randomComponent - Random number generator
     * @returns Shuffled array
     */
    private shuffleArray<T>(array: T[], randomComponent: RandomComponent): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = randomComponent.nextInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Static factory method for creating RealmGenerator instances.
     * @param nameGenerator - Name generator for realm names
     * @param config - Configuration for realm generation
     */
    static create(
        nameGenerator: NameGenerator,
        config: RealmGeneratorConfig
    ): RealmGenerator {
        return new RealmGenerator(nameGenerator, config);
    }
}
