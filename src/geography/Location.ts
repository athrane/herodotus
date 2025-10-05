import { TypeUtils } from '../util/TypeUtils';
import { GeographicalFeature } from './feature/GeographicalFeature';
import { PlanetComponent } from './planet/PlanetComponent';

/**
 * Represents a location in the simulation.
 * A location is defined by its geographical feature and the planet it belongs to.
 */
export class Location {
  private readonly feature: GeographicalFeature;
  private readonly planet: PlanetComponent;
  private readonly name: string;

  /**
   * Creates an instance of Location.
   * @param feature - The geographical feature at this location.
   * @param planet - The planet this location is on.
   */
  constructor(feature: GeographicalFeature, planet: PlanetComponent) {
    TypeUtils.ensureInstanceOf(feature, GeographicalFeature);
    TypeUtils.ensureInstanceOf(planet, PlanetComponent);
    this.feature = feature;
    this.planet = planet;
    
    // Generate the name based on feature and planet
    this.name = `${feature.getName()}, ${planet.getName()}`;
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
  getFeature(): GeographicalFeature {
    return this.feature;
  }

  /**
   * Gets the planet this location is on.
   */
  getPlanet(): PlanetComponent {
    return this.planet;
  }

  /**
   * Creates a new Location instance with a geographical feature and planet.
   * @param feature - The geographical feature at this location.
   * @param planet - The planet this location is on.
   */
  static create(feature: GeographicalFeature, planet: PlanetComponent): Location {
    return new Location(feature, planet);
  }
}
