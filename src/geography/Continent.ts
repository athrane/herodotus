import { TypeUtils } from '../util/TypeUtils';
import { GeographicalFeature } from './GeographicalFeature';

/**
 * Represents a continent in the world.
 */
export class Continent {
  private readonly name: string;
  private readonly features: GeographicalFeature[];

  /**
   * Creates an instance of Continent.
   * @param name - The name of the continent.
   */
  constructor(name: string) {
    TypeUtils.ensureString(name, 'Continent name must be a string.');
    this.name = name;
    this.features = [];
  }

  /**
   * Gets the name of the continent.
   * @returns The name of the continent.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Adds a geographical feature to the continent.
   * @param feature - The feature to add.
   */
  addFeature(feature: GeographicalFeature): void {
    TypeUtils.ensureInstanceOf(feature, GeographicalFeature);
    this.features.push(feature);
  }

  /**
   * Gets the list of geographical features on the continent.
   * @returns The list of geographical features on the continent.
   */
  getFeatures(): GeographicalFeature[] {
    return this.features;
  }

  /**
   * Gets a random geographical feature from the continent.
   * @returns A random geographical feature or null if none exist.
   */
  getRandomFeature(): GeographicalFeature | null {
    if (this.features.length === 0) {
      return null;
    }
    return this.features[Math.floor(Math.random() * this.features.length)];
  }

  /**
   * Creates a new Continent instance.
   * @param name - The name of the continent.
   * @returns A new Continent instance.
   */
  static create(name: string): Continent {
    return new Continent(name);
  } 
}