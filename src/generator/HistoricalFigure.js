import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Represents a historical figure involved in an event.
 */
export class HistoricalFigure {
  /**
   * @type {string}
   */
  #name;

  /**
   * Creates an instance of HistoricalFigure.
   * @param {string} name - The name of the historical figure.
   */
  constructor(name) {
    TypeUtils.ensureString(name, 'HistoricalFigure name must be a string.');
    this.#name = name;
  }

  /**
   * Gets the name of the historical figure.
   * @returns {string}
   */
  getName() {
    return this.#name;
  }
}