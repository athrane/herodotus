import { PoliticalLandscapeGenerator } from '../../../src/generator/realm/PoliticalLandscapeGenerator';
import { PoliticalLandscapeConfig } from '../../../src/generator/realm/PoliticalLandscapeConfig';
import { Ecs } from '../../../src/ecs/Ecs';
import { GalaxyMapComponent } from '../../../src/geography/galaxy/GalaxyMapComponent';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { RandomComponent } from '../../../src/random/RandomComponent';
import { TerritorialRealmComponent } from '../../../src/realm/TerritorialRealmComponent';
import { TerritoryClaimComponent } from '../../../src/realm/TerritoryClaimComponent';
import { ClaimStatus } from '../../../src/realm/ClaimStatus';
import { Sector } from '../../../src/geography/galaxy/Sector';
import { createTestRandomComponent } from '../../util/RandomTestUtils';

describe('PoliticalLandscapeGenerator', () => {
    let ecs: Ecs;
    let galaxyMap: GalaxyMapComponent;
    let nameGenerator: NameGenerator;
    let randomComponent: RandomComponent;
    let config: PoliticalLandscapeConfig;

    beforeEach(() => {
        ecs = Ecs.create();
        randomComponent = createTestRandomComponent('political-landscape-test-seed');
        
        // Create singleton entity with components
        const singletonEntity = ecs.getEntityManager().createEntity(randomComponent);
        
        nameGenerator = new NameGenerator(randomComponent);
        galaxyMap = GalaxyMapComponent.create();

        config = {
            numberOfRealms: 3,
            minPlanetsPerRealm: 2,
            maxPlanetsPerRealm: 4,
            ensurePlayerRealm: false,
            spatialDistribution: 'random'
        };
    });

    describe('constructor validation', () => {
        it('should create with valid config', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            expect(generator).toBeInstanceOf(PoliticalLandscapeGenerator);
        });

        it('should throw error for minPlanetsPerRealm < 1', () => {
            const invalidConfig = { ...config, minPlanetsPerRealm: 0 };
            expect(() => PoliticalLandscapeGenerator.create(nameGenerator, invalidConfig))
                .toThrow('minPlanetsPerRealm must be at least 1.');
        });

        it('should throw error for maxPlanetsPerRealm < minPlanetsPerRealm', () => {
            const invalidConfig = { ...config, minPlanetsPerRealm: 5, maxPlanetsPerRealm: 3 };
            expect(() => PoliticalLandscapeGenerator.create(nameGenerator, invalidConfig))
                .toThrow('maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
        });
    });

    describe('generate with insufficient planets', () => {
        it('should return empty array when no planets exist', () => {
            const mapEntity = ecs.getEntityManager().createEntity(galaxyMap);
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);

            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);
            expect(realmIds).toEqual([]);
        });

        it('should create fewer realms when not enough planets', () => {
            // Create 5 planets, config wants 3 realms with 2-4 planets each
            // Can only create 2 realms (5 / 2 = 2)
            setupGalaxyWithPlanets(5, galaxyMap, ecs);
            const mapEntity = ecs.getEntityManager().createEntity(galaxyMap);

            config.numberOfRealms = 3;
            config.minPlanetsPerRealm = 2;

            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            expect(realmIds.length).toBeLessThanOrEqual(2);
        });
    });

    describe('generate with sufficient planets', () => {
        beforeEach(() => {
            // Create 20 connected planets in a chain
            setupGalaxyWithPlanets(20, galaxyMap, ecs);
            const mapEntity = ecs.getEntityManager().createEntity(galaxyMap);
        });

        it('should create requested number of realms', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            expect(realmIds.length).toBe(3);
        });

        it('should create realm entities with TerritorialRealmComponent', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                expect(realmEntity).toBeDefined();
                
                const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);
                expect(territorialComponent).toBeDefined();
            });
        });

        it('should assign planets to realms with Core status', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);
                
                expect(territorialComponent!.getPlanetCount()).toBeGreaterThanOrEqual(config.minPlanetsPerRealm);
                expect(territorialComponent!.getPlanetCount()).toBeLessThanOrEqual(config.maxPlanetsPerRealm);

                // All planets should be Core status
                const planets = territorialComponent!.getPlanets();
                planets.forEach(planetId => {
                    expect(territorialComponent!.getClaimStatus(planetId)).toBe(ClaimStatus.Core);
                });
            });
        });

        it('should add TerritoryClaimComponent to claimed planets', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);
                const planets = territorialComponent!.getPlanets();

                planets.forEach(planetId => {
                    const planetEntity = ecs.getEntityManager().getEntity(planetId);
                    expect(planetEntity).toBeDefined();

                    const claimComponent = planetEntity!.getComponent(TerritoryClaimComponent);
                    expect(claimComponent).toBeDefined();
                    expect(claimComponent!.hasClaim(realmId)).toBe(true);
                    expect(claimComponent!.getClaimStatus(realmId)).toBe(ClaimStatus.Core);
                });
            });
        });

        it('should not overlap planet claims between realms', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            const allClaimedPlanets = new Set<string>();

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);
                const planets = territorialComponent!.getPlanets();

                planets.forEach(planetId => {
                    expect(allClaimedPlanets.has(planetId)).toBe(false);
                    allClaimedPlanets.add(planetId);
                });
            });
        });

        it('should create bidirectional references between realms and planets', () => {
            const generator = PoliticalLandscapeGenerator.create(nameGenerator, config);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);
                const planets = territorialComponent!.getPlanets();

                planets.forEach(planetId => {
                    // Check realm -> planet reference
                    expect(territorialComponent!.hasPlanet(planetId)).toBe(true);

                    // Check planet -> realm reference
                    const planetEntity = ecs.getEntityManager().getEntity(planetId);
                    const claimComponent = planetEntity!.getComponent(TerritoryClaimComponent);
                    expect(claimComponent!.hasClaim(realmId)).toBe(true);
                });
            });
        });
    });
});

/**
 * Helper function to set up a galaxy map with connected planets.
 * Creates planets in a chain topology for easy testing.
 */
function setupGalaxyWithPlanets(count: number, galaxyMap: GalaxyMapComponent, ecs: Ecs): void {
    const sector = Sector.create('sector-1', 'Test Sector');
    galaxyMap.addSector(sector);

    const planetIds: string[] = [];

    // Create planets
    for (let i = 0; i < count; i++) {
        const planetEntity = ecs.getEntityManager().createEntity();
        const planetId = planetEntity.getId();
        
        const planetComponent = PlanetComponent.create(
            planetId,
            `Planet ${i}`,
            'sector-1',
            'Test Owner',
            PlanetStatus.NORMAL,
            5,
            1,
            PlanetResourceSpecialization.AGRICULTURE,
            []
        );
        
        planetEntity.addComponent(planetComponent);
        galaxyMap.registerPlanet(planetComponent);
        planetIds.push(planetId);
    }

    // Connect planets in a chain
    for (let i = 0; i < planetIds.length - 1; i++) {
        galaxyMap.connectPlanets(planetIds[i], planetIds[i + 1]);
    }
}
