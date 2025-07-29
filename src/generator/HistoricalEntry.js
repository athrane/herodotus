import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Represents a single, discrete entry in the chronicle, describing a historical event.
 */
export class HistoricalEntry {
  /**
   * @type {string}
   */
  #description;

  /**
   * Creates an instance of HistoricalEntry.
   * @param {string} description - A textual description of the historical event.
   */
  constructor(description) {
    TypeUtils.ensureString(description, 'HistoricalEntry description must be a string.');
    this.#description = description;
  }

  /**
   * Gets the description of the historical entry.
   * @returns {string}
   */
  get description() {
    return this.#description;
  }
}