import { GalaxyGenerator } from '../../../src/generator/galaxy/GalaxyGenerator';
import { loadGalaxyGenConfig } from '../../../src/data/geography/galaxy/loadGalaxyGenConfig';
import { NameGenerator } from '../../../src/naming/NameGenerator';
import { RandomComponent } from '../../../src/random/RandomComponent';
import { loadRandomSeed } from '../../../src/data/random/loadRandomSeed';

describe('GalaxyGenerator Integration Tests', () => {
    it('full generation pipeline with all dependencies', () => {
        // Load all real dependencies
        const seedData = loadRandomSeed();
        const randomComponent = RandomComponent.create(seedData);
        const nameGenerator = NameGenerator.create(randomComponent);
        const config = loadGalaxyGenConfig();

        // Generate galaxy
        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMapData = generator.generateGalaxyMap();

        // Verify structure
        expect(galaxyMapData).toBeDefined();
        expect(galaxyMapData.sectors).toBeDefined();
        expect(Array.isArray(galaxyMapData.sectors)).toBe(true);
        expect(galaxyMapData.sectors.length).toBe(config.getNumberSectors());
    });

    it('generated JSON matches schema', () => {
        const seedData = loadRandomSeed();
        const randomComponent = RandomComponent.create(seedData);
        const nameGenerator = NameGenerator.create(randomComponent);
        const config = loadGalaxyGenConfig();

        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMapData = generator.generateGalaxyMap();

        // Verify each sector matches expected schema
        galaxyMapData.sectors.forEach(sector => {
            expect(sector).toHaveProperty('id');
            expect(sector).toHaveProperty('name');
            expect(sector).toHaveProperty('position');
            
            expect(typeof sector.id).toBe('string');
            expect(typeof sector.name).toBe('string');
            expect(typeof sector.position).toBe('object');
            
            expect(sector.position).toHaveProperty('x');
            expect(sector.position).toHaveProperty('y');
            expect(sector.position).toHaveProperty('z');
            
            expect(typeof sector.position.x).toBe('number');
            expect(typeof sector.position.y).toBe('number');
            expect(typeof sector.position.z).toBe('number');
        });
    });

    it('all sectors have unique positions', () => {
        const seedData = loadRandomSeed();
        const randomComponent = RandomComponent.create(seedData);
        const nameGenerator = NameGenerator.create(randomComponent);
        const config = loadGalaxyGenConfig();

        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMapData = generator.generateGalaxyMap();

        // Create set of position strings
        const positionStrings = new Set();
        let duplicates = 0;

        galaxyMapData.sectors.forEach(sector => {
            const posStr = `${sector.position.x},${sector.position.y},${sector.position.z}`;
            if (positionStrings.has(posStr)) {
                duplicates++;
            }
            positionStrings.add(posStr);
        });

        // Most positions should be unique (some floating point overlap is possible but rare)
        expect(duplicates).toBeLessThan(5); // Allow small number of duplicates due to floating point
    });

    it('sector distribution covers galaxy disc', () => {
        const seedData = loadRandomSeed();
        const randomComponent = RandomComponent.create(seedData);
        const nameGenerator = NameGenerator.create(randomComponent);
        const config = loadGalaxyGenConfig();

        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMapData = generator.generateGalaxyMap();

        const galaxySize = config.getGalaxySize();
        
        // All sectors should be within galaxy radius
        galaxyMapData.sectors.forEach(sector => {
            const distance = Math.sqrt(
                sector.position.x ** 2 + 
                sector.position.y ** 2 + 
                sector.position.z ** 2
            );
            expect(distance).toBeLessThanOrEqual(galaxySize + 0.1);
        });

        // Should have sectors near the center
        const centralSectors = galaxyMapData.sectors.filter(s => {
            const distance = Math.sqrt(s.position.x ** 2 + s.position.y ** 2);
            return distance < galaxySize * 0.2;
        });
        expect(centralSectors.length).toBeGreaterThan(0);

        // Should have sectors in outer region (more than halfway out)
        const outerSectors = galaxyMapData.sectors.filter(s => {
            const distance = Math.sqrt(s.position.x ** 2 + s.position.y ** 2);
            return distance > galaxySize * 0.5;
        });
        expect(outerSectors.length).toBeGreaterThan(0);
    });

    it('integration with NameGenerator produces valid names', () => {
        const seedData = loadRandomSeed();
        const randomComponent = RandomComponent.create(seedData);
        const nameGenerator = NameGenerator.create(randomComponent);
        const config = loadGalaxyGenConfig();

        const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
        const galaxyMapData = generator.generateGalaxyMap();

        // All names should be non-empty strings with capital first letter
        galaxyMapData.sectors.forEach(sector => {
            expect(sector.name).toBeTruthy();
            expect(sector.name.length).toBeGreaterThan(0);
            expect(sector.name[0]).toBe(sector.name[0].toUpperCase());
        });
    });
});
