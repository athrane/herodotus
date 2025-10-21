import { GalaxyGenerator } from '../../../src/generator/galaxy/GalaxyGenerator';
import { RandomComponent } from '../../../src/random/RandomComponent';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { GalaxyGenData } from '../../../src/data/geography/galaxy/GalaxyGenData';
import { RandomSeedData } from '../../../src/data/random/RandomSeedData';

describe('GalaxyGenerator', () => {
    let randomComponent: RandomComponent;
    let nameGenerator: NameGenerator;
    let config: GalaxyGenData;

    beforeEach(() => {
        const seedData = RandomSeedData.create({ seed: 'test-seed' });
        randomComponent = RandomComponent.create(seedData);
        nameGenerator = NameGenerator.create(randomComponent);
        config = GalaxyGenData.create({
            numberSectors: 10,
            galaxySize: 5
        });
    });

    it('generates correct number of sectors', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        expect(galaxyMap.sectors).toHaveLength(10);
    });

    it('all sectors have unique IDs', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        const ids = galaxyMap.sectors.map(s => s.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(10);
    });

    it('all sectors have non-empty names', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        galaxyMap.sectors.forEach(sector => {
            expect(sector.name).toBeTruthy();
            expect(typeof sector.name).toBe('string');
            expect(sector.name.length).toBeGreaterThan(0);
        });
    });

    it('all sectors have valid position', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        galaxyMap.sectors.forEach(sector => {
            expect(sector.position).toBeDefined();
            expect(typeof sector.position.x).toBe('number');
            expect(typeof sector.position.y).toBe('number');
            expect(typeof sector.position.z).toBe('number');
        });
    });

    it('central sector at origin', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        const centralSector = galaxyMap.sectors[0];
        expect(centralSector.position.x).toBe(0);
        expect(centralSector.position.y).toBe(0);
        expect(centralSector.position.z).toBe(0);
    });

    it('all sectors within galaxy radius', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        const galaxySize = config.getGalaxySize();
        galaxyMap.sectors.forEach(sector => {
            const distance = Math.sqrt(
                sector.position.x ** 2 +
                sector.position.y ** 2 +
                sector.position.z ** 2
            );
            expect(distance).toBeLessThanOrEqual(galaxySize + 0.01); // Small epsilon for floating point
        });
    });

    it('all sectors have z-coordinate of 0', () => {
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMap = generator.generateGalaxyMap();

        galaxyMap.sectors.forEach(sector => {
            expect(sector.position.z).toBe(0);
        });
    });

    it('deterministic generation with same seed', () => {
        const seedData1 = RandomSeedData.create({ seed: 'deterministic-test' });
        const random1 = RandomComponent.create(seedData1);
        const nameGen1 = NameGenerator.create(random1);
        const generator1 = GalaxyGenerator.create(random1, nameGen1, config);
        const map1 = generator1.generateGalaxyMap();

        const seedData2 = RandomSeedData.create({ seed: 'deterministic-test' });
        const random2 = RandomComponent.create(seedData2);
        const nameGen2 = NameGenerator.create(random2);
        const generator2 = GalaxyGenerator.create(random2, nameGen2, config);
        const map2 = generator2.generateGalaxyMap();

        expect(map1.sectors.length).toBe(map2.sectors.length);
        for (let i = 0; i < map1.sectors.length; i++) {
            expect(map1.sectors[i].id).toBe(map2.sectors[i].id);
            expect(map1.sectors[i].name).toBe(map2.sectors[i].name);
            expect(map1.sectors[i].position.x).toBe(map2.sectors[i].position.x);
            expect(map1.sectors[i].position.y).toBe(map2.sectors[i].position.y);
            expect(map1.sectors[i].position.z).toBe(map2.sectors[i].position.z);
        }
    });

    it('handles single sector configuration', () => {
        const singleSectorConfig = GalaxyGenData.create({
            numberSectors: 1,
            galaxySize: 5
        });
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, singleSectorConfig);
        const galaxyMap = generator.generateGalaxyMap();

        expect(galaxyMap.sectors).toHaveLength(1);
        expect(galaxyMap.sectors[0].position.x).toBe(0);
        expect(galaxyMap.sectors[0].position.y).toBe(0);
        expect(galaxyMap.sectors[0].position.z).toBe(0);
    });

    it('validates RandomComponent parameter', () => {
        expect(() => {
            GalaxyGenerator.create('invalid' as any, nameGenerator, config);
        }).toThrow(TypeError);
    });

    it('validates NameGenerator parameter', () => {
        expect(() => {
            GalaxyGenerator.create(randomComponent, 'invalid' as any, config);
        }).toThrow(TypeError);
    });

    it('validates GalaxyGenData parameter', () => {
        expect(() => {
            GalaxyGenerator.create(randomComponent, nameGenerator, 'invalid' as any);
        }).toThrow(TypeError);
    });
});
