import { Continent } from '../../geography/Continent';
import { GeographicalFeature } from '../../geography/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../geography/GeographicalFeatureTypeRegistry';
import { World } from '../../geography/World';
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
     * @description The number of geographical features to generate per continent.
     * @default 50
     */
    static readonly FEATURES_PER_CONTINENT: number = 50;

    private readonly nameGenerator: NameGenerator;

    /**
     * Creates an instance of WorldGenerator.
     *
     * @param nameGenerator - The name generator to use.
     */
    constructor(nameGenerator: NameGenerator) {
        TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator);
        this.nameGenerator = nameGenerator;
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
     * Creates a new instance of WorldGenerator.
     *
     * @param nameGenerator - The name generator to use.
     * @returns A new WorldGenerator instance.
     */
    static create(nameGenerator: NameGenerator): WorldGenerator {
        return new WorldGenerator(nameGenerator);
    }
}