import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents realm generation configuration data loaded from JSON.
 * This class provides runtime validation and type safety for realm generation parameters.
 */
export class RealmData {
  private readonly numberOfRealms: number;
  private readonly minPlanetsPerRealm: number;
  private readonly maxPlanetsPerRealm: number;
  private readonly ensurePlayerRealm: boolean;
  private readonly spatialDistribution: 'random' | 'distributed' | 'sectored';

  private static instance: RealmData | null = null;

  /**
   * Creates a new RealmData instance from JSON data.
   * @param data - The JSON object containing realm generation configuration.
   */
  constructor(data: any) {
    TypeUtils.ensureNumber(data?.numberOfRealms, 'RealmData numberOfRealms must be a number.');
    TypeUtils.ensureNumber(data?.minPlanetsPerRealm, 'RealmData minPlanetsPerRealm must be a number.');
    TypeUtils.ensureNumber(data?.maxPlanetsPerRealm, 'RealmData maxPlanetsPerRealm must be a number.');
    
    if (typeof data?.ensurePlayerRealm !== 'boolean') {
      throw new TypeError('RealmData ensurePlayerRealm must be a boolean.');
    }
    
    TypeUtils.ensureString(data?.spatialDistribution, 'RealmData spatialDistribution must be a string.');

    if (data.minPlanetsPerRealm < 1) {
      throw new TypeError('RealmData minPlanetsPerRealm must be at least 1.');
    }
    if (data.maxPlanetsPerRealm < data.minPlanetsPerRealm) {
      throw new TypeError('RealmData maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
    }
    if (!['random', 'distributed', 'sectored'].includes(data.spatialDistribution)) {
      throw new TypeError('RealmData spatialDistribution must be one of: random, distributed, sectored.');
    }

    this.numberOfRealms = data.numberOfRealms;
    this.minPlanetsPerRealm = data.minPlanetsPerRealm;
    this.maxPlanetsPerRealm = data.maxPlanetsPerRealm;
    this.ensurePlayerRealm = data.ensurePlayerRealm;
    this.spatialDistribution = data.spatialDistribution;

    Object.freeze(this);
  }

  /**
   * Gets the number of realms to generate.
   * @returns The number of realms.
   */
  getNumberOfRealms(): number {
    return this.numberOfRealms;
  }

  /**
   * Gets the minimum number of planets per realm.
   * @returns The minimum planets per realm.
   */
  getMinPlanetsPerRealm(): number {
    return this.minPlanetsPerRealm;
  }

  /**
   * Gets the maximum number of planets per realm.
   * @returns The maximum planets per realm.
   */
  getMaxPlanetsPerRealm(): number {
    return this.maxPlanetsPerRealm;
  }

  /**
   * Gets whether to ensure a player realm exists.
   * @returns True if a player realm should be ensured.
   */
  getEnsurePlayerRealm(): boolean {
    return this.ensurePlayerRealm;
  }

  /**
   * Gets the spatial distribution strategy for realms.
   * @returns The spatial distribution type.
   */
  getSpatialDistribution(): 'random' | 'distributed' | 'sectored' {
    return this.spatialDistribution;
  }

  /**
   * Static factory method to create a RealmData instance.
   * @param data - The JSON object containing realm generation configuration.
   * @returns A new RealmData instance.
   */
  static create(data: any): RealmData {
    return new RealmData(data);
  }

  /**
   * Creates a null instance of RealmData with default values.
   * Uses lazy initialization to create singleton null instance.
   * @returns A null RealmData instance.
   */
  static createNull(): RealmData {
    if (!RealmData.instance) {
      RealmData.instance = RealmData.create({
        numberOfRealms: 0,
        minPlanetsPerRealm: 1,  // Use 1 instead of 0 to satisfy validation
        maxPlanetsPerRealm: 1,  // Use 1 instead of 0 to satisfy validation
        ensurePlayerRealm: false,
        spatialDistribution: 'random'
      });
    }
    return RealmData.instance;
  }
}
