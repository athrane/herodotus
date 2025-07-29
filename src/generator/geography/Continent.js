import { TypeUtils } from '../../util/TypeUtils.js';

/**
 * Represents a continent in the world.
 */
export class Continent {
  /**
   * @type {string}
   */
  #name;

  /**
   * Creates an instance of Continent.
   * @param {string} name - The name of the continent.
   */
  constructor(name) {
    TypeUtils.ensureString(name, 'Continent name must be a string.');
    this.#name = name;
  }

  /**
   * Gets the name of the continent.
   * @returns {string}
   */
  getName() {
    return this.#name;
  }
}