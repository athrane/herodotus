import { SyllableSets, type SyllableSet } from './SyllableSets';
import { MarkovChain } from './MarkovChain';
import { TypeUtils } from '../util/TypeUtils';

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
  private readonly syllableSets: Record<string, SyllableSet>;
  private readonly markovChains: Map<string, MarkovChain>;

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
   * @param setName - The key of the syllable set to use (e.g., 'GENERIC', 'GUTTURAL').
   * @returns A procedurally generated name.
   */
  generateSyllableName(setName: string): string {
    TypeUtils.ensureString(setName, 'Syllable set name must be a string.');
    TypeUtils.ensureNonEmptyString(setName, 'Syllable set name must not be empty.');
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
   * @param nameType - A unique identifier for the name type (e.g., 'continent', 'person').
   * @param trainingData - An array of example names to train the model.
   * @param order - The order of the Markov chain.
   */
  addMarkovChain(nameType: string, trainingData: string[], order: number): void {
    TypeUtils.ensureString(nameType, 'Name type must be a string.');
    TypeUtils.ensureNonEmptyString(nameType, 'Name type must not be empty.');
    TypeUtils.ensureArray(trainingData, 'Training data must be an array.');
    TypeUtils.ensureNumber(order, 'Order must be a number.');
    
    const chain = MarkovChain.create(trainingData, order);
    this.markovChains.set(nameType, chain);
  }

  /**
   * Generates a name using a pre-trained Markov chain model.
   * This method is ideal for creating names that need to follow complex
   * linguistic rules learned from a body of text.
   *
   * @param nameType - The type of name to generate, corresponding to a pre-trained model.
   * @param minLength - The minimum length of the generated name.
   * @param maxLength - The maximum length of the generated name.
   * @returns A procedurally generated name.
   */
  generateMarkovName(nameType: string, minLength: number, maxLength: number): string {
    TypeUtils.ensureString(nameType, 'Name type must be a string.');
    TypeUtils.ensureNonEmptyString(nameType, 'Name type must not be empty.');
    TypeUtils.ensureNumber(minLength, 'Minimum length must be a number.');
    TypeUtils.ensureNumber(maxLength, 'Maximum length must be a number.');        
    const chain = this.markovChains.get(nameType);
    if (!chain) {
      throw new Error(`Markov chain for "${nameType}" not found.`);
    }
    return chain.generateName(minLength, maxLength);
  }

  /**
   * Generates a name for a historical figure.
   * This method uses a combination of syllable sets and Markov chains to generate a name.
   *
   * @param culture - The culture to generate a name from.
   * @param minLength - The minimum length of the name.
   * @param maxLength - The maximum length of the name.
   * @returns The generated name.
   */
  generateHistoricalFigureName(culture: string, minLength: number, maxLength: number): string {
    TypeUtils.ensureString(culture, 'Culture must be a string.');
    TypeUtils.ensureNonEmptyString(culture, 'Culture must not be empty.');
    TypeUtils.ensureNumber(minLength, 'Minimum length must be a number.');
    TypeUtils.ensureNumber(maxLength, 'Maximum length must be a number.');
    const nameType = `historicalFigure_${culture}`;
    if (!this.markovChains.has(nameType)) {
      const syllableSet = this.syllableSets[culture];
      if (!syllableSet) {
        throw new Error(`Syllable set for culture "${culture}" not found.`);
      }
      const trainingData: string[] = [];
      for (let i = 0; i < 100; i++) {
        let name = '';
        name += syllableSet.initial[Math.floor(Math.random() * syllableSet.initial.length)];
        name += syllableSet.middle[Math.floor(Math.random() * syllableSet.middle.length)];
        name += syllableSet.final[Math.floor(Math.random() * syllableSet.final.length)];
        trainingData.push(name);
      }
      this.addMarkovChain(nameType, trainingData, 2);
    }
    return this.generateMarkovName(nameType, minLength, maxLength);
  }

  /**
   * Creates a new NameGenerator instance.
   *
   * @static
   * @returns A new NameGenerator instance.
   */
  static create(): NameGenerator {
    return new NameGenerator();
  }
}