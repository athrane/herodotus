import { TypeUtils } from '../../util/TypeUtils';
import { RandomComponent } from '../../random/RandomComponent';
import { NameGenerator } from '../../naming/NameGenerator';
import { GalaxyGenData } from '../../data/geography/galaxy/GalaxyGenData';
import { Sector } from '../../geography/galaxy/Sector';
import { Position } from '../../geography/galaxy/Position';
import { GalaxyMapData } from './GalaxyMapData';

/**
 * A standalone tool class that procedurally generates a 2D spiral galaxy map
 * consisting of sectors positioned across a galactic disc.
 * 
 * The generator creates empty sectors without planets, establishing the spatial
 * foundation for future world-building features.
 */
export class GalaxyGenerator {
    private readonly randomComponent: RandomComponent;
    private readonly nameGenerator: NameGenerator;
    private readonly config: GalaxyGenData;

    /**
     * Creates a new GalaxyGenerator instance.
     * @param randomComponent - The RandomComponent for deterministic random number generation.
     * @param nameGenerator - The NameGenerator for generating sector names.
     * @param config - The galaxy generation configuration.
     */
    constructor(randomComponent: RandomComponent, nameGenerator: NameGenerator, config: GalaxyGenData) {
        TypeUtils.ensureInstanceOf(randomComponent, RandomComponent, 'randomComponent must be a RandomComponent instance.');
        TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator, 'nameGenerator must be a NameGenerator instance.');
        TypeUtils.ensureInstanceOf(config, GalaxyGenData, 'config must be a GalaxyGenData instance.');

        this.randomComponent = randomComponent;
        this.nameGenerator = nameGenerator;
        this.config = config;
    }

    /**
     * Generates a galaxy map with sectors distributed across a 2D disc.
     * Uses a radial distribution algorithm to position sectors in concentric rings.
     * @returns A GalaxyMapData object containing the generated sectors.
     */
    generateGalaxyMap(): GalaxyMapData {
        const sectors: Sector[] = [];
        const numberSectors = this.config.getNumberSectors();
        const galaxySize = this.config.getGalaxySize();

        // Create central sector at origin
        const centralSectorId = 'sector-1';
        const centralSectorName = this.nameGenerator.generateSyllableName('SECTOR');
        const centralPosition = Position.create(0, 0, 0);
        const centralSector = Sector.create(centralSectorId, centralSectorName, centralPosition);
        sectors.push(centralSector);

        // Calculate remaining sectors to distribute in rings
        const remainingSectors = numberSectors - 1;
        
        if (remainingSectors > 0) {
            // Distribute remaining sectors in concentric rings
            const ringsNeeded = Math.ceil(Math.sqrt(remainingSectors));
            let sectorIndex = 2; // Start from 2 since central is 1

            for (let ring = 1; ring <= ringsNeeded && sectorIndex <= numberSectors; ring++) {
                const radius = (ring / ringsNeeded) * galaxySize;
                
                // Calculate sectors for this ring (more sectors in outer rings)
                const sectorsInRing = Math.min(
                    Math.ceil(ring * 6), // 6, 12, 18, 24, etc.
                    numberSectors - sectorIndex + 1 // Don't exceed total
                );

                const angleStep = (2 * Math.PI) / sectorsInRing;

                for (let i = 0; i < sectorsInRing && sectorIndex <= numberSectors; i++) {
                    const angle = i * angleStep;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    const sectorId = `sector-${sectorIndex}`;
                    const sectorName = this.nameGenerator.generateSyllableName('SECTOR');
                    const position = Position.create(x, y, 0);
                    const sector = Sector.create(sectorId, sectorName, position);
                    
                    sectors.push(sector);
                    sectorIndex++;
                }
            }
        }

        // Convert sectors to JSON format
        return {
            sectors: sectors.map(sector => sector.toJSON())
        };
    }

    /**
     * Static factory method to create a GalaxyGenerator instance.
     * @param randomComponent - The RandomComponent for deterministic random number generation.
     * @param nameGenerator - The NameGenerator for generating sector names.
     * @param config - The galaxy generation configuration.
     * @returns A new GalaxyGenerator instance.
     */
    static create(randomComponent: RandomComponent, nameGenerator: NameGenerator, config: GalaxyGenData): GalaxyGenerator {
        return new GalaxyGenerator(randomComponent, nameGenerator, config);
    }
}
