import { TypeUtils } from '../util/TypeUtils';

/**
 * Represents a point in time within the chronicle.
 */
export class Time {
  readonly #year: number;

  /**
   * Creates an instance of Time.
   * @param year - The year of the event.
   */
  constructor(year: number) {
    TypeUtils.ensureNumber(year, 'Time year must be a number.');
    this.#year = year;
  }

  /**
   * Gets the year.
   * @returns The year.
   */
  getYear(): number {
    return this.#year;
  }

  /**
   * Creates a new instance of Time.
   * This static factory method provides a standardized way to construct Time objects.
   * @param year - The year of the event.
   * @returns A new Time instance.
   */
  static create(year: number): Time {
    return new Time(year);
  }
}