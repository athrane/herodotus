import { TypeUtils } from '../../util/TypeUtils';
import { GeographicalFeature } from '../feature/GeographicalFeature';
import type { PlanetComponent } from './PlanetComponent';

/**
 * Represents a continent in the world.
 */
export class Continent {
  private readonly name: string;
  private readonly features: GeographicalFeature[];
  private static nullContinent: Continent | null = null;
  private static nullPlanetRef: PlanetComponent | null = null;

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
   * @returns A random geographical feature, or the null feature if none exist.
   */
  getRandomFeature(): GeographicalFeature {
    if (this.features.length === 0) {
      return GeographicalFeature.createNullFeature();
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

  /**
   * Creates a Continent instance representing a null or unknown continent.
   * Uses lazy initialization to return a singleton null instance.
   * @returns A Continent instance representing a null or unknown continent.
   */
  static createNullContinent(): Continent {
    if (!Continent.nullContinent) {
      const nullFeature = GeographicalFeature.createNullFeature();
      const continent = Continent.create('Null Continent');
      continent.addFeature(nullFeature);
      Continent.nullContinent = continent;
    }
    return Continent.nullContinent;
  }

  /**
   * Sets the reference to the null planet for the null continent.
   * This allows the Continent class to hold a reference to the null planet
   * without creating a circular dependency at initialization time.
   * @param nullPlanet - The null planet instance to reference.
   */
  static setNullPlanetReference(nullPlanet: PlanetComponent): void {
    Continent.nullPlanetRef = nullPlanet;
  }

  /**
   * Gets the reference to the null planet.
   * @returns The null planet instance, or null if not set.
   */
  static getNullPlanetReference(): PlanetComponent | null {
    return Continent.nullPlanetRef;
  }

  /**
   * Creates a deep copy of this Continent.
   * Copies the continent's name and all features.
   * @returns A new Continent instance with the same name and cloned features.
   */
  clone(): Continent {
    const clonedContinent = Continent.create(this.name);
    for (const feature of this.features) {
      clonedContinent.addFeature(feature.clone());
    }
    return clonedContinent;
  }

}