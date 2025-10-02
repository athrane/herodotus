import { TypeUtils } from '../util/TypeUtils';
import { GeographicalFeature } from './feature/GeographicalFeature';
import { PlanetComponent } from './planet/PlanetComponent';

/**
 * Represents a location in the simulation.
 * A location is defined by its geographical feature and the planet it belongs to.
 */
export class Location {
  private readonly feature: GeographicalFeature | null;
  private readonly planet: PlanetComponent | null;
  private readonly name: string;

  /**
   * Creates an instance of Location.
   * @param feature - The geographical feature at this location (optional).
   * @param planet - The planet this location is on (optional).
   * @param name - A fallback name for the location (used when feature/planet are not provided).
   */
  constructor(feature: GeographicalFeature | null, planet: PlanetComponent | null, name?: string) {
    // Allow duck-typing for testing purposes - check for required methods instead of strict instanceof
    if (feature !== null) {
      if (typeof feature !== 'object' || typeof (feature as any).getName !== 'function') {
        TypeUtils.ensureInstanceOf(feature, GeographicalFeature);
      }
    }
    if (planet !== null) {
      if (typeof planet !== 'object' || typeof (planet as any).getName !== 'function') {
        TypeUtils.ensureInstanceOf(planet, PlanetComponent);
      }
    }
    if (name !== undefined) {
      TypeUtils.ensureString(name, 'Location name must be a string.');
    }

    this.feature = feature;
    this.planet = planet;
    
    // Generate the name based on feature and planet, or use provided name
    if (feature && planet) {
      this.name = `${feature.getName()}, ${planet.getName()}`;
    } else if (planet) {
      this.name = planet.getName();
    } else if (name !== undefined) {
      this.name = name;
    } else {
      this.name = 'Unknown Location';
    }
  }

  /**
   * Gets the name of the location.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets the geographical feature at this location.
   */
  getFeature(): GeographicalFeature | null {
    return this.feature;
  }

  /**
   * Gets the planet this location is on.
   */
  getPlanet(): PlanetComponent | null {
    return this.planet;
  }

  /**
   * Creates a new Location instance with a geographical feature and planet.
   * @param feature - The geographical feature at this location.
   * @param planet - The planet this location is on.
   */
  static create(feature: GeographicalFeature | null, planet: PlanetComponent | null, name?: string): Location {
    return new Location(feature, planet, name);
  }
}
