import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Represents a location where a historical event occurred.
 */
export class Place {
  /**
   * @type {string}
   */
  #name;

  /**
   * Creates an instance of Place.
   * @param {string} name - The name of the place.
   */
  constructor(name) {
    TypeUtils.ensureString(name, 'Place name must be a string.');
    this.#name = name;
  }

  /**
   * Gets the name of the place.
   * @returns {string}
   */
  getName() {
    return this.#name;
  }
}
