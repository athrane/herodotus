import { RealmGenerator } from '../../../src/generator/realm/RealmGenerator';
import { RealmData } from '../../../src/data/realm/RealmData';
import { Ecs } from '../../../src/ecs/Ecs';
import { GalaxyMapComponent } from '../../../src/geography/galaxy/GalaxyMapComponent';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { RandomComponent } from '../../../src/random/RandomComponent';
import { TerritoryComponent } from '../../../src/realm/territory/TerritoryComponent';
import { TerritoryClaimComponent } from '../../../src/realm/territory/TerritoryClaimComponent';
import { ClaimStatus } from '../../../src/realm/territory/ClaimStatus';
import { Sector } from '../../../src/geography/galaxy/Sector';
import { createTestRandomComponent } from '../../util/RandomTestUtils';

describe('RealmGenerator', () => {
    let ecs: Ecs;
    let galaxyMap: GalaxyMapComponent;
    let nameGenerator: NameGenerator;
    let randomComponent: RandomComponent;
    let realmData: RealmData;

    beforeEach(() => {
        ecs = Ecs.create();
        randomComponent = createTestRandomComponent('realm-generator-test-seed');
        
        // Create singleton entity with components
        const singletonEntity = ecs.getEntityManager().createEntity(randomComponent);
        
        nameGenerator = new NameGenerator(randomComponent);
        galaxyMap = GalaxyMapComponent.create();

        realmData = RealmData.create({
            numberOfRealms: 3,
            minPlanetsPerRealm: 2,
            maxPlanetsPerRealm: 4,
            ensurePlayerRealm: false,
            spatialDistribution: 'random'
        });
    });

    describe('constructor validation', () => {
        it('should create with valid config', () => {
            const generator = RealmGenerator.create(nameGenerator, realmData);
            expect(generator).toBeInstanceOf(RealmGenerator);
        });

        it('should throw error for minPlanetsPerRealm < 1', () => {
            expect(() => RealmData.create({ 
                numberOfRealms: 3,
                minPlanetsPerRealm: 0,
                maxPlanetsPerRealm: 4,
                ensurePlayerRealm: false,
                spatialDistribution: 'random'
            }))
                .toThrow('RealmData minPlanetsPerRealm must be at least 1.');
        });

        it('should throw error for maxPlanetsPerRealm < minPlanetsPerRealm', () => {
            expect(() => RealmData.create({ 
                numberOfRealms: 3,
                minPlanetsPerRealm: 5,
                maxPlanetsPerRealm: 3,
                ensurePlayerRealm: false,
                spatialDistribution: 'random'
            }))
                .toThrow('RealmData maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
        });
    });

    describe('generate with insufficient planets', () => {
        it('should return empty array when no planets exist', () => {
            const mapEntity = ecs.getEntityManager().createEntity(galaxyMap);
            const generator = RealmGenerator.create(nameGenerator, realmData);

            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);
            expect(realmIds).toEqual([]);
        });

        it('should create fewer realms when not enough planets', () => {
            // Create 5 planets, realmData wants 3 realms with 2-4 planets each
            // Can only create 2 realms (5 / 2 = 2)
            setupGalaxyWithPlanets(5, galaxyMap, ecs);
            const mapEntity = ecs.getEntityManager().createEntity(galaxyMap);

            const customData = RealmData.create({
                numberOfRealms: 3,
                minPlanetsPerRealm: 2,
                maxPlanetsPerRealm: 4,
                ensurePlayerRealm: false,
                spatialDistribution: 'random'
            });

            const generator = RealmGenerator.create(nameGenerator, customData);
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
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            expect(realmIds.length).toBe(3);
        });

        it('should create realm entities with TerritoryComponent', () => {
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                expect(realmEntity).toBeDefined();
                
                const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
                expect(territoryComponent).toBeDefined();
            });
        });

        it('should assign planets to realms with Core status', () => {
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
                
                expect(territoryComponent!.getPlanetCount()).toBeGreaterThanOrEqual(realmData.getMinPlanetsPerRealm());
                expect(territoryComponent!.getPlanetCount()).toBeLessThanOrEqual(realmData.getMaxPlanetsPerRealm());

                // All planets should be Core status
                const planets = territoryComponent!.getPlanets();
                planets.forEach(planetId => {
                    expect(territoryComponent!.getClaimStatus(planetId)).toBe(ClaimStatus.Core);
                });
            });
        });

        it('should add TerritoryClaimComponent to claimed planets', () => {
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
                const planets = territoryComponent!.getPlanets();

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
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            const allClaimedPlanets = new Set<string>();

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
                const planets = territoryComponent!.getPlanets();

                planets.forEach(planetId => {
                    expect(allClaimedPlanets.has(planetId)).toBe(false);
                    allClaimedPlanets.add(planetId);
                });
            });
        });

        it('should create bidirectional references between realms and planets', () => {
            const generator = RealmGenerator.create(nameGenerator, realmData);
            const realmIds = generator.generate(galaxyMap, randomComponent, ecs);

            realmIds.forEach(realmId => {
                const realmEntity = ecs.getEntityManager().getEntity(realmId);
                const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
                const planets = territoryComponent!.getPlanets();

                planets.forEach(planetId => {
                    // Check realm -> planet reference
                    expect(territoryComponent!.hasPlanet(planetId)).toBe(true);

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
