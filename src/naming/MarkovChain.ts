import { TypeUtils } from '../util/TypeUtils';

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
  private readonly order: number;
  private readonly chains: Map<string, string[]>;

  /**
   * Creates an instance of MarkovChain.
   * @param trainingData - An array of strings to train the model.
   * @param order - The order of the Markov chain (the length of the character sequences to analyze).
   */
  constructor(trainingData: string[], order: number) {
    TypeUtils.ensureArray(trainingData, 'Training data must be an array.');
    TypeUtils.ensureNumber(order, 'Order must be a number.');
    
    this.order = order;
    this.chains = new Map();
    this._train(trainingData);
  }

  /**
   * Trains the Markov chain model with the provided data.
   * It analyzes the frequency of character sequences to build the probabilistic model.
   * @param trainingData - An array of strings to train the model.
   * @private
   */
  private _train(trainingData: string[]): void {
    trainingData.forEach(word => {
      for (let i = 0; i <= word.length - this.order; i++) {
        const gram = word.substring(i, i + this.order);
        const next = word[i + this.order] || '';

        if (!this.chains.has(gram)) {
          this.chains.set(gram, []);
        }
        this.chains.get(gram)!.push(next);
      }
    });
  }

  /**
   * Generates a name using the trained Markov chain.
   * The generation process starts with a random gram from the training data
   * and iteratively adds characters based on the learned probabilities.
   *
   * @param minLength - The minimum length of the generated name.
   * @param maxLength - The maximum length of the generated name.
   * @returns A procedurally generated name.
   */
  generateName(minLength: number, maxLength: number): string {
    TypeUtils.ensureNumber(minLength, 'Minimum length must be a number.');
    TypeUtils.ensureNumber(maxLength, 'Maximum length must be a number.');
    
    const startingGrams = Array.from(this.chains.keys()).filter(gram => gram.length === this.order);
    if (startingGrams.length === 0) {
      return '';
    }

    let currentGram = startingGrams[Math.floor(Math.random() * startingGrams.length)];
    let result = currentGram;

    while (result.length < maxLength) {
      const nextChars = this.getFollowers(currentGram);
      if (nextChars.length === 0) {
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
   * Gets the possible next characters for a given gram.
   * @param gram - The current gram.
   * @returns An array of possible next characters.
   */
  getFollowers(gram: string): string[] {
    TypeUtils.ensureString(gram, 'Gram must be a string.');
    return this.chains.get(gram) || [];
  }

  /**
   * Creates a new MarkovChain instance.
   *
   * @static
   * @param trainingData - An array of strings to train the model.
   * @param order - The order of the Markov chain.
   * @returns A new MarkovChain instance.
   */
  static create(trainingData: string[], order: number): MarkovChain {
    return new MarkovChain(trainingData, order);
  }
}