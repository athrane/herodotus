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

  /**
   * Creates a new instance of Time.
   * This static factory method provides a standardized way to construct Time objects.
   * @param {number} year - The year of the event.
   * @returns {Time} A new Time instance.
   */
  static create(year) {
    return new Time(year);
  }
}