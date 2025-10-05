import { TypeUtils } from '../util/TypeUtils';

/**
 * Represents a location where a historical event occurred.
 * @deprecated This class is deprecated and will be removed in future versions.
 */
export class Place {
  private readonly name: string;
  private static nullInstance: Place | null = null;

  /**
   * Creates an instance of Place.
   * @param name - The name of the place.
   */
  constructor(name: string) {
    TypeUtils.ensureString(name, 'Place name must be a string.');
    this.name = name;
  }

  /**
   * Gets the name of the place.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns a null object instance of Place.
   * This instance serves as a safe, neutral placeholder when a Place is not available.
   * @returns A null Place instance with empty string name.
   */
  static get Null(): Place {
    if (!Place.nullInstance) {
      const instance = Object.create(Place.prototype);
      instance.name = '';
      Object.freeze(instance);
      Place.nullInstance = instance;
    }
    return Place.nullInstance!;
  }

  /**
   * Creates a new Place instance.
   * @param name - The name of the place.
   */
  static create(name: string): Place {
    return new Place(name);
  }
}