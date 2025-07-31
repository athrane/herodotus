import { Continent } from '../../geography/Continent.js';
import { GeographicalFeature } from '../../geography/GeographicalFeature.js';
import { GeographicalFeatureTypeRegistry } from '../../geography/GeographicalFeatureTypeRegistry.js';
import { World } from '../../geography/World.js';
 
/**
 * A self-contained generator that orchestrates the creation of a world,
 * including its geography and history.
 */
export class WorldGenerator {
    constructor() {

        // Data for procedural name generation
        this.continentNameParts = {
            prefixes: ['Al', 'An', 'Bal', 'Cor', 'Dra', 'Eth', 'Fen', 'Gor', 'Hel', 'Ish'],
            suffixes: ['ia', 'os', 'dor', 'mar', 'gar', 'land', 'ana', 'eth', 'or']
        };

        this.featureNameParts = {
            adjectives: ['Whispering', 'Sunken', 'Dragon\'s', 'Forgotten', 'Glimmering', 'Misty', 'Burning', 'Frozen', 'Shattered', 'Weeping'],
            nouns: ['Peak', 'Valley', 'Expanse', 'Folly', 'Landing', 'Reach', 'Pass', 'Depths', 'Woods', 'Wastes']
        };
    }

    /**
     * Generates a random name from a set of parts.
     * @param {object} parts - An object containing arrays of name components (e.g., prefixes, suffixes).
     * @returns {string} A procedurally generated name.
     */
    _generateName(parts) {
        const keys = Object.keys(parts);
        return keys.map(key => {
            const partArray = parts[key];
            return partArray[Math.floor(Math.random() * partArray.length)];
        }).join('');
    }

    /**
     * Generates a unique name for a geographical feature.
     * @returns {string} A procedurally generated feature name.
     */
    _generateFeatureName() {
        const adj = this.featureNameParts.adjectives[Math.floor(Math.random() * this.featureNameParts.adjectives.length)];
        const noun = this.featureNameParts.nouns[Math.floor(Math.random() * this.featureNameParts.nouns.length)];
        return `The ${adj} ${noun}`;
    }

    /**
     * Generates a single continent with a specified number of features.
     * @param {string} name - The name of the continent.
     * @param {number} numFeatures - The number of geographical features to generate.
     * @returns {Continent} A new continent object.
     */
    generateContinent(name, numFeatures) {
        const continent = new Continent(name);
        for (let i = 0; i < numFeatures; i++) {
            const featureType = GeographicalFeatureTypeRegistry.getRandom();
            if (featureType) {
                const featureName = this._generateFeatureName();
                const feature = new GeographicalFeature(featureName, featureType);
                continent.addFeature(feature);
            }
        }
        return continent;
    }

    /**
     * Generates a world with 3 continents, each having 50 geographical features.
     * @param {string} worldName - The name of the world.
     * @returns {World} A new world object.
     */
    generateWorld(worldName) {
        const world = new World(worldName);
        const NUM_CONTINENTS = 3;
        const FEATURES_PER_CONTINENT = 50;

        for (let i = 0; i < NUM_CONTINENTS; i++) {
            const continentName = this._generateName(this.continentNameParts);
            const continent = this.generateContinent(continentName, FEATURES_PER_CONTINENT);
            world.addContinent(continent);
        }
        return world;
    }
}
