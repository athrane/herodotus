
import { SyllableSets } from './SyllableSets.js';
import { MarkovChain } from './MarkovChain.js';

/**
 * Provides a flexible and powerful system for procedurally generating names.
 * This class supports multiple generation strategies, including syllable-based
 * combination and Markov chains, allowing for a wide range of linguistic styles.
 *
 * It is designed to be the central point for all name generation needs within
 * the application, from continents and geographical features to historical
 * figures and settlements.
 */
export class NameGenerator {
    /**
     * Creates an instance of NameGenerator.
     * Initializes with a set of predefined syllable-based name generation patterns.
     */
    constructor() {
        this.syllableSets = SyllableSets;
        this.markovChains = new Map();
    }

    /**
     * Generates a name by combining syllables from a specified set.
     * This method constructs names by randomly selecting initial, middle, and
     * final syllables, providing a simple yet effective way to create names
     * with a specific feel.
     *
     * @param {string} setName - The key of the syllable set to use (e.g., 'GENERIC', 'GUTTURAL').
     * @returns {string} A procedurally generated name.
     */
    generateSyllableName(setName) {
        const set = this.syllableSets[setName];
        if (!set) {
            throw new Error(`Syllable set "${setName}" not found.`);
        }

        const initial = set.initial[Math.floor(Math.random() * set.initial.length)];
        const middle = set.middle[Math.floor(Math.random() * set.middle.length)];
        const final = set.final[Math.floor(Math.random() * set.final.length)];

        const name = `${initial}${middle}${final}`;

        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    /**
     * Adds a Markov chain model for a specific name type.
     * This allows for the generation of names that are stylistically consistent
     * with a provided set of training data.
     *
     * @param {string} nameType - A unique identifier for the name type (e.g., 'continent', 'person').
     * @param {string[]} trainingData - An array of example names to train the model.
     * @param {number} order - The order of the Markov chain.
     */
    addMarkovChain(nameType, trainingData, order) {
        const chain = MarkovChain.create(trainingData, order);
        this.markovChains.set(nameType, chain);
    }

    /**
     * Generates a name using a pre-trained Markov chain model.
     * This method is ideal for creating names that need to follow complex
     * linguistic rules learned from a body of text.
     *
     * @param {string} nameType - The type of name to generate, corresponding to a pre-trained model.
     * @param {number} minLength - The minimum length of the generated name.
     * @param {number} maxLength - The maximum length of the generated name.
     * @returns {string} A procedurally generated name.
     */
    generateMarkovName(nameType, minLength, maxLength) {
        const chain = this.markovChains.get(nameType);
        if (!chain) {
            throw new Error(`Markov chain for "${nameType}" not found.`);
        }
        return chain.generateName(minLength, maxLength);
    }

    /**
     * Creates a new NameGenerator instance.
     *
     * @static
     * @returns {NameGenerator} A new NameGenerator instance.
     */
    static create() {
        return new NameGenerator();
    }
}
