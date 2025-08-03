import { TypeUtils } from '../util/TypeUtils.js';
import { Continent } from './Continent.js';

/**
 * Represents the entire world, which can contain multiple continents.
 */
export class World {

  /**
   * @type {string} 
   * The name of the world.
   */
  #name;

  /**
   * @type {Continent[]}
   */
  #continents;

  /**
   * Creates an instance of World.
   */
  constructor(name) {
    TypeUtils.ensureString(name);
    this.#name = name;
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

  /**
   * Gets the name of the world.
   * @returns {string}  
   */
  getName() {
    return this.#name;
  }

  /**
   * Static method to create a new World instance with a name.
   * @param {string} name - The name of the world.
   * @return {World} A new World instance.
   */
  static create(name) {
    TypeUtils.ensureString(name, 'World name must be a string.');
    return new World(name);
    }

}