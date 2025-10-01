import { Place } from '../generator/Place';
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
     * Computes a random place from the galaxy map.
     * This method retrieves a random geographical feature from the galaxy map,
     * prioritizing specific features over general locations.
     * 
     * @param galaxyMap - The galaxy map component to get a random place from.
     * @param fallbackLocation - Optional fallback location name if no suitable place is found. Defaults to 'Unknown Location'.
     * @returns A Place instance representing a random location.
     */
    static computeRandomPlace(galaxyMap: GalaxyMapComponent, fallbackLocation: string = 'Unknown Location'): Place {
        TypeUtils.ensureInstanceOf(galaxyMap, GalaxyMapComponent);
        TypeUtils.ensureString(fallbackLocation, 'Fallback location must be a string.');

        // Get a random planet from the galaxy map
        const planet = galaxyMap.getRandomPlanet();
        if (planet) {
            const continents = planet.getContinents();
            if (continents && continents.length > 0) {
                // Get a random continent from the planet
                const randomContinent = continents[Math.floor(Math.random() * continents.length)];
                const randomFeature = randomContinent.getRandomFeature();
                if (randomFeature) {
                    // Return format: "FeatureName, PlanetName"
                    return Place.create(`${randomFeature.getName()}, ${planet.getName()}`);
                }
                // If no specific feature is available, return just the planet name
                return Place.create(planet.getName());
            }
        }
        
        // Return the fallback location if no suitable place is found
        return Place.create(fallbackLocation);
    }
}
