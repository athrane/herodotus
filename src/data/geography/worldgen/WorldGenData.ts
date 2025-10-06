import { TypeUtils } from '../../../util/TypeUtils';

/**
 * Represents world generation configuration data loaded from JSON.
 * This class provides runtime validation and type safety for world generation parameters.
 */
export class WorldGenData {
  private readonly numContinents: number;
  private readonly numSectors: number;
  private readonly planetsPerSector: number;
  private readonly featuresPerContinent: number;
  private readonly continentsPerPlanet: number;
  private readonly featuresPerPlanetContinent: number;

  private static instance: WorldGenData | null = null;

  /**
   * Creates a new WorldGenData instance from JSON data.
   * @param data - The JSON object containing world generation configuration.
   */
  constructor(data: any) {
    TypeUtils.ensureNumber(data?.numContinents, 'WorldGenData numContinents must be a number.');
    TypeUtils.ensureNumber(data?.numSectors, 'WorldGenData numSectors must be a number.');
    TypeUtils.ensureNumber(data?.planetsPerSector, 'WorldGenData planetsPerSector must be a number.');
    TypeUtils.ensureNumber(data?.featuresPerContinent, 'WorldGenData featuresPerContinent must be a number.');
    TypeUtils.ensureNumber(data?.continentsPerPlanet, 'WorldGenData continentsPerPlanet must be a number.');
    TypeUtils.ensureNumber(data?.featuresPerPlanetContinent, 'WorldGenData featuresPerPlanetContinent must be a number.');

    this.numContinents = data.numContinents;
    this.numSectors = data.numSectors;
    this.planetsPerSector = data.planetsPerSector;
    this.featuresPerContinent = data.featuresPerContinent;
    this.continentsPerPlanet = data.continentsPerPlanet;
    this.featuresPerPlanetContinent = data.featuresPerPlanetContinent;
    Object.freeze(this); // Make instances immutable
  }

  /**
   * Static factory method to create a WorldGenData instance.
   * @param data - The JSON object containing world generation configuration.
   * @returns A new WorldGenData instance.
   */
  static create(data: any): WorldGenData {
    return new WorldGenData(data);
  }

  /**
   * Creates a null instance of WorldGenData with default values.
   * Uses lazy initialization to create singleton null instance.
   * @returns A null WorldGenData instance.
   */
  static createNull(): WorldGenData {
    if (!WorldGenData.instance) {
      WorldGenData.instance = WorldGenData.create({
        numContinents: 0,
        numSectors: 0,
        planetsPerSector: 0,
        featuresPerContinent: 0,
        continentsPerPlanet: 0,
        featuresPerPlanetContinent: 0
      });
    }
    return WorldGenData.instance;
  }

  /**
   * Gets the number of continents to generate in the world.
   * @returns The number of continents.
   */
  getNumContinents(): number {
    return this.numContinents;
  }

  /**
   * Gets the number of sectors to generate in the galaxy.
   * @returns The number of sectors.
   */
  getNumSectors(): number {
    return this.numSectors;
  }

  /**
   * Gets the number of planets to generate per sector.
   * @returns The number of planets per sector.
   */
  getPlanetsPerSector(): number {
    return this.planetsPerSector;
  }

  /**
   * Gets the number of geographical features to generate per continent.
   * @returns The number of features per continent.
   */
  getFeaturesPerContinent(): number {
    return this.featuresPerContinent;
  }

  /**
   * Gets the number of continents to generate for each planet.
   * @returns The number of continents per planet.
   */
  getContinentsPerPlanet(): number {
    return this.continentsPerPlanet;
  }

  /**
   * Gets the number of geographical features to generate per planetary continent.
   * @returns The number of features per planetary continent.
   */
  getFeaturesPerPlanetContinent(): number {
    return this.featuresPerPlanetContinent;
  }
}
