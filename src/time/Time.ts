import { TypeUtils } from '../util/TypeUtils';

/**
 * Represents a point in time within the chronicle.
 */
export class Time {
  private readonly year: number;
  private static nullInstance: Time | null = null;

  /**
   * Creates an instance of Time.
   * @param year - The year of the event (must be a whole number).
   */
  constructor(year: number) {
    TypeUtils.ensureInteger(year, 'Time year must be a whole number.');
    this.year = year;
  }

  /**
   * Gets the year.
   * @returns The year.
   */
  getYear(): number {
    return this.year;
  }

  /**
   * Returns a null object instance of Time.
   * This instance serves as a safe, neutral placeholder when a Time is not available.
   * @returns A null Time instance with year 0.
   */
  static get Null(): Time {
    if (!Time.nullInstance) {
      const instance = Object.create(Time.prototype);
      instance.year = 0;
      Object.freeze(instance);
      Time.nullInstance = instance;
    }
    return Time.nullInstance!;
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