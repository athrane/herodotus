import { TypeUtils } from '../../../util/TypeUtils';

/**
 * Represents geographical feature data loaded from JSON.
 * This class provides runtime validation and type safety for feature definitions.
 */
export class GeographicalFeatureData {
  private readonly key: string;
  private readonly displayName: string;

  /**
   * Creates a new GeographicalFeatureData instance from JSON data.
   * @param data - The JSON object containing feature data.
   */
  constructor(data: any) {
    TypeUtils.ensureString(data?.key, 'GeographicalFeatureData key must be a string.');
    TypeUtils.ensureString(data?.displayName, 'GeographicalFeatureData displayName must be a string.');

    this.key = data.key;
    this.displayName = data.displayName;
    Object.freeze(this); // Make instances immutable
  }

  /**
   * Static factory method to create a GeographicalFeatureData instance.
   * @param data - The JSON object containing feature data.
   * @returns A new GeographicalFeatureData instance.
   */
  static create(data: any): GeographicalFeatureData {
    return new GeographicalFeatureData(data);
  }

  /**
   * Gets the unique key of the geographical feature.
   * @returns The feature key.
   */
  getKey(): string {
    return this.key;
  }

  /**
   * Gets the display name of the geographical feature.
   * @returns The feature display name.
   */
  getDisplayName(): string {
    return this.displayName;
  }

  /**
   * Creates an array of GeographicalFeatureData instances from a JSON object.
   * @param json - The JSON object containing feature data keyed by feature keys.
   * @returns An array of GeographicalFeatureData instances.
   */
  static fromJsonObject(json: any): GeographicalFeatureData[] {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
      throw new TypeError('Expected JSON object for geographical features data.');
    }

    // Deterministic order by key to ensure consistent behavior
    return Object.keys(json)
      .sort()
      .map((key: string) => GeographicalFeatureData.create((json as Record<string, any>)[key]));
  }
}