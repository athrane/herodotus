import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents a single geographical feature type.
 * This class ensures each type has a consistent structure (e.g., a unique key and a display name).
 */
export class FeatureType {
  private readonly key: string;
  private readonly displayName: string;

  /**
   * @param key - A unique identifier for the feature type (e.g., 'MOUNTAIN').
   * @param displayName - The display name for the feature type (e.g., 'Mountain').
   */
  constructor(key: string, displayName: string) {
    TypeUtils.ensureString(key, 'FeatureType key must be a string.');
    TypeUtils.ensureString(displayName, 'FeatureType displayName must be a string.');

    this.key = key;
    this.displayName = displayName;
    Object.freeze(this); // Make instances immutable
  }

  /**
   * Returns the unique key of the feature type.
   */
  getKey(): string {
    return this.key;
  }

  /**
   * Returns the display name of the feature type.
   */
  getName(): string {
    return this.displayName;
  }
}
