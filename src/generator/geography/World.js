import { TypeUtils } from '../../util/TypeUtils.js';
import { Continent } from './Continent.js';

/**
 * Represents the entire world, which can contain multiple continents.
 */
export class World {
  /**
   * @type {Continent[]}
   */
  #continents;

  /**
   * Creates an instance of World.
   */
  constructor() {
    this.#continents = [];
  }

  /**
   * Adds a continent to the world.
   * @param {Continent} continent - The continent to add.
   */
  addContinent(continent) {
    TypeUtils.ensureInstanceOf(continent, Continent, 'Only Continent instances can be added to the World.');
    this.#continents.push(continent);
  }

  /**
   * Gets the list of continents.
   * @returns {Continent[]}
   */
  getContinents() {
    return this.#continents;
  }
}