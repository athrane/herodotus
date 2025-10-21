import { TypeUtils } from '../../../util/TypeUtils';

/**
 * Represents galaxy generation configuration data loaded from JSON.
 * This class provides runtime validation and type safety for galaxy generation parameters.
 */
export class GalaxyGenData {
    private readonly numberSectors: number;
    private readonly galaxySize: number;

    private static instance: GalaxyGenData | null = null;

    /**
     * Creates a new GalaxyGenData instance from JSON data.
     * @param data - The JSON object containing galaxy generation configuration.
     */
    constructor(data: any) {
        TypeUtils.ensureNumber(data?.numberSectors, 'GalaxyGenData numberSectors must be a number.');
        TypeUtils.ensureNumber(data?.galaxySize, 'GalaxyGenData galaxySize must be a number.');

        if (data.numberSectors <= 0) {
            const message = 'GalaxyGenData numberSectors must be a positive number.';
            console.error(message);
            console.trace('GalaxyGenData validation failed');
            throw new TypeError(message);
        }

        if (data.galaxySize <= 0) {
            const message = 'GalaxyGenData galaxySize must be a positive number.';
            console.error(message);
            console.trace('GalaxyGenData validation failed');
            throw new TypeError(message);
        }

        this.numberSectors = data.numberSectors;
        this.galaxySize = data.galaxySize;

        Object.freeze(this);
    }

    /**
     * Static factory method to create a GalaxyGenData instance.
     * @param data - The JSON object containing galaxy generation configuration.
     * @returns A new GalaxyGenData instance.
     */
    static create(data: any): GalaxyGenData {
        return new GalaxyGenData(data);
    }

    /**
     * Creates a null instance of GalaxyGenData with default values.
     * Uses lazy initialization to create singleton null instance.
     * @returns A null GalaxyGenData instance.
     */
    static createNull(): GalaxyGenData {
        if (!GalaxyGenData.instance) {
            GalaxyGenData.instance = GalaxyGenData.create({
                numberSectors: 1,
                galaxySize: 1
            });
        }
        return GalaxyGenData.instance;
    }

    /**
     * Gets the number of sectors to generate in the galaxy.
     * @returns The number of sectors.
     */
    getNumberSectors(): number {
        return this.numberSectors;
    }

    /**
     * Gets the galaxy radius in light years.
     * @returns The galaxy size in light years.
     */
    getGalaxySize(): number {
        return this.galaxySize;
    }
}
