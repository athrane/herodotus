import { TypeUtils } from '../util/TypeUtils';

/**
 * Represents a location where a historical event occurred.
 * @deprecated This class is deprecated and will be removed in future versions.
 */
export class Place {
  private readonly name: string;

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
   * Creates a new Place instance.
   * @param name - The name of the place.
   */
  static create(name: string): Place {
    return new Place(name);
  }
}