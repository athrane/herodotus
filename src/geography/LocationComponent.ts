import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';
import { GeographicalFeature } from './feature/GeographicalFeature';
import { PlanetComponent } from './planet/PlanetComponent';

/**
 * Component representing a location in the simulation.
 * A location is defined by its geographical feature and the planet it belongs to.
 * This component can be attached to any entity that has a position in the world.
 */
export class LocationComponent extends Component {
  private static nullLocation: LocationComponent | null = null;
  
  private readonly feature: GeographicalFeature;
  private readonly planet: PlanetComponent;
  private readonly name: string;

  /**
   * Creates an instance of LocationComponent.
   * @param feature - The geographical feature at this location.
   * @param planet - The planet this location is on.
   */
  constructor(feature: GeographicalFeature, planet: PlanetComponent) {
    super();
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
   * Creates a new LocationComponent instance with a geographical feature and planet.
   * @param feature - The geographical feature at this location.
   * @param planet - The planet this location is on.
   */
  static create(feature: GeographicalFeature, planet: PlanetComponent): LocationComponent {
    return new LocationComponent(feature, planet);
  }

  /**
   * Creates or returns a singleton null LocationComponent instance.
   * This null object represents an invalid or uninitialized location.
   * Uses lazy initialization to create the null instance only on first access.
   * @returns A singleton null LocationComponent instance.
   */
  static createNullLocation(): LocationComponent {
    if (!LocationComponent.nullLocation) {
      LocationComponent.nullLocation = LocationComponent.create(
        GeographicalFeature.createNullFeature(),
        PlanetComponent.createNullPlanet()
      );
    }
    return LocationComponent.nullLocation;
  }

  /**
   * Creates a deep copy of this LocationComponent.
   * Clones the geographical feature and planet to ensure complete immutability.
   * @returns A new LocationComponent instance with cloned feature and planet.
   */
  clone(): LocationComponent {
    return LocationComponent.create(
      this.feature.clone(),
      this.planet.clone()
    );
  }
}
