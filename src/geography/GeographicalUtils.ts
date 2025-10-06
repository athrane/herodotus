import { LocationComponent } from './LocationComponent';
import { GalaxyMapComponent } from './galaxy/GalaxyMapComponent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Utility class for geographical operations.
 * Provides centralized methods for working with geographical data and locations.
 */
export class GeographicalUtils {

    /**
     * Private constructor to prevent instantiation.
     * This is a utility class with static methods only.
     */
    private constructor() {
        // Private constructor - no instantiation
    }

    /**
     * Computes a random location from the galaxy map.
     * This method retrieves a random geographical feature from the galaxy map,
     * prioritizing specific features over general locations.
     * Uses the null object pattern - getRandomFeature() always returns a valid feature.
     *
     * @param galaxyMap - The galaxy map component to get a random location from.
     * @returns A LocationComponent instance representing a random location.
     * @throws {Error} If no planets are available in the galaxy map.
     */
    static computeRandomLocation(galaxyMap: GalaxyMapComponent): LocationComponent {
        TypeUtils.ensureInstanceOf(galaxyMap, GalaxyMapComponent);

        // Get a random planet from the galaxy map
        const planet = galaxyMap.getRandomPlanet();
        const randomContinent = planet.getRandomContinent();
        const randomFeature = randomContinent.getRandomFeature();
        return LocationComponent.create(randomFeature, planet);
    }

}
