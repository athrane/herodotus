/**
 * Represents a Markov chain for procedural name generation.
 * This class learns from a set of example names and can generate new names
 * that mimic the patterns found in the input data. It is particularly useful
 * for creating names that have a consistent linguistic feel.
 *
 * The chain is built by analyzing the frequency of character sequences
 * (of a specified order) in the training data. It can then generate new
* sequences by making probabilistic choices based on the learned frequencies.
 */
export class MarkovChain {
    /**
     * Creates an instance of MarkovChain.
     * @param {string[]} trainingData - An array of strings to train the model.
     * @param {number} order - The order of the Markov chain (the length of the character sequences to analyze).
     */
    constructor(trainingData, order) {
        this.order = order;
        this.chains = new Map();
        this._train(trainingData);
    }

    /**
     * Trains the Markov chain model with the provided data.
     * It analyzes the frequency of character sequences to build the probabilistic model.
     * @param {string[]} trainingData - An array of strings to train the model.
     * @private
     */
    _train(trainingData) {
        trainingData.forEach(word => {
            for (let i = 0; i <= word.length - this.order; i++) {
                const gram = word.substring(i, i + this.order);
                const next = word[i + this.order] || '';

                if (!this.chains.has(gram)) {
                    this.chains.set(gram, []);
                }
                this.chains.get(gram).push(next);
            }
        });
    }

    /**
     * Generates a name using the trained Markov chain.
     * The generation process starts with a random gram from the training data
     * and iteratively adds characters based on the learned probabilities.
     *
     * @param {number} minLength - The minimum length of the generated name.
     * @param {number} maxLength - The maximum length of the generated name.
     * @returns {string} A procedurally generated name.
     */
    generateName(minLength, maxLength) {
        const startingGrams = Array.from(this.chains.keys()).filter(gram => gram.length === this.order);
        if (startingGrams.length === 0) {
            return '';
        }

        let currentGram = startingGrams[Math.floor(Math.random() * startingGrams.length)];
        let result = currentGram;

        while (result.length < maxLength) {
            const nextChars = this.chains.get(currentGram);
            if (!nextChars || nextChars.length === 0) {
                break;
            }

            const nextChar = nextChars[Math.floor(Math.random() * nextChars.length)];
            if (nextChar === '') {
                break;
            }

            result += nextChar;
            currentGram = result.substring(result.length - this.order);
        }

        if (result.length < minLength) {
            return this.generateName(minLength, maxLength);
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    /**
     * Creates a new MarkovChain instance.
     *
     * @static
     * @param {string[]} trainingData - An array of strings to train the model.
     * @param {number} order - The order of the Markov chain.
     * @returns {MarkovChain} A new MarkovChain instance.
     */
    static create(trainingData, order) {
        return new MarkovChain(trainingData, order);
    }
}
