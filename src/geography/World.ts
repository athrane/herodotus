import { TypeUtils } from '../util/TypeUtils';
import { Continent } from '../geography/planet/Continent';

/**
 * Represents the entire world, which can contain multiple continents.
 */
export class World {
  /**
   * The name of the world.
   */
  private readonly name: string;
  private readonly continents: Continent[];

  /**
   * Creates an instance of World.
   * @param name - The name of the world.
   */
  constructor(name: string) {
    TypeUtils.ensureString(name, 'World name must be a string.');
    this.name = name;
    this.continents = [];
  }

  /**
   * Adds a continent to the world.
   * @param continent - The continent to add.
   */
  addContinent(continent: Continent): void {
    TypeUtils.ensureInstanceOf(continent, Continent);
    this.continents.push(continent);
  }

  /**
   * Gets the list of continents.
   * @returns The list of continents.
   */
  getContinents(): Continent[] {
    return this.continents;
  }

  /**
   * Gets the name of the world.
   * @returns The name of the world.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets a random continent from the world.
   * @returns A random continent or null if none exist.
   */
  getRandomContinent(): Continent | null {
    if (this.continents.length === 0) {
      return null;
    }
    return this.continents[Math.floor(Math.random() * this.continents.length)];
  }

  /**
   * Static method to create a new World instance with a name.
   * @param name - The name of the world.
   * @returns A new World instance.
   */
  static create(name: string): World {
    TypeUtils.ensureString(name, 'World name must be a string.');
    return new World(name);
  }
}