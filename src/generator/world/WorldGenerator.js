import { Continent } from '../../geography/Continent.js';
import { GeographicalFeature } from '../../geography/GeographicalFeature.js';
import { GeographicalFeatureTypeRegistry } from '../../geography/GeographicalFeatureTypeRegistry.js';
import { World } from '../../geography/World.js';
import { TypeUtils } from '../../util/TypeUtils.js';
import { NameGenerator } from '../../naming/NameGenerator.js';

/**
 * A self-contained generator that orchestrates the creation of a world,
 * including its geography and history.
 */
export class WorldGenerator {

    /**
     * @constant
     * @type {number}
     * @description The number of continents to generate in the world.
     * @default 3   
     */
    static NUM_CONTINENTS = 3;

    /**
     * @constant
     * @type {number}
     * @description The number of geographical features to generate per continent.
     * @default 50
     */
    static FEATURES_PER_CONTINENT = 50;

    /**
     * Creates an instance of WorldGenerator.
     *
     * @param {NameGenerator} nameGenerator - The name generator to use.
     */
    constructor(nameGenerator) {
        TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator, 'nameGenerator must be an instance of NameGenerator.');
        this.nameGenerator = nameGenerator;
    }

    /**
     * Generates a single continent with a specified number of features.
     *
     * @param {string} name - The name of the continent.
     * @param {number} numFeatures - The number of geographical features to generate.
     * @returns {Continent} A new continent object.
     */
    generateContinent(name, numFeatures) {
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
     * @param {string} worldName - The name of the world.
     * @returns {World} A new world object.
     */
    generateWorld(worldName) {
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
     * @static
     * @param {NameGenerator} nameGenerator - The name generator to use.
     * @returns {WorldGenerator} A new WorldGenerator instance.
     */
    static create(nameGenerator) {
        return new WorldGenerator(nameGenerator);
    }
}
