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

  /**
   * Creates a new HistoricalFigure instance.
   * @param {string} name - The name of the historical figure.
   * @returns {HistoricalFigure} A new HistoricalFigure instance.
   */
  static create(name) {
    return new HistoricalFigure(name);
  }

  /**
   * Generates a new historical figure with a random name.
   * @param {string} culture - The culture to generate a name from.
   * @param {NameGenerator} nameGenerator - The name generator to use.
   * @returns {HistoricalFigure} A new historical figure.
   */
  static generate(culture, nameGenerator) {
    const name = nameGenerator.generateHistoricalFigureName(culture, 4, 8);
    return new HistoricalFigure(name);
  }
}