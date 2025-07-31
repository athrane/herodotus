import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Represents a point in time within the chronicle.
 */
export class Time {
  /**
   * @type {number}
   */
  #year;

  /**
   * Creates an instance of Time.
   * @param {number} year - The year of the event.
   */
  constructor(year) {
    TypeUtils.ensureNumber(year, 'Time year must be a number.');
    this.#year = year;
  }

  /**
   * Gets the year.
   * @returns {number}
   */
  getYear() {
    return this.#year;
  }
}