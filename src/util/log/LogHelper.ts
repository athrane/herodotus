import { ChronicleEvent } from "../../chronicle/ChronicleEvent";
import { TypeUtils } from "../TypeUtils";
import { GalaxyMapComponent } from "../../geography/galaxy/GalaxyMapComponent";

/**
 * A helper class with static methods for logging application-specific details.
 * This provides a centralized place for logging formats.
 */
export class LogHelper {

    /**
     * Logs detailed information about the generated galaxy map, including its sectors and planets.
     * This method displays the structure of the galaxy with all sectors and their associated planets.
     * @param galaxyMap The galaxy map component to log. It should be a GalaxyMapComponent instance.
     */
    static logGalaxyMapDetails(galaxyMap: GalaxyMapComponent): void {
        TypeUtils.ensureInstanceOf(galaxyMap, GalaxyMapComponent);

        console.log("--- Galaxy Map Details ---");
        
        const sectors = galaxyMap.getSectors();
        console.log(`Number of Sectors: ${sectors.length}`);
        console.log(`Total Planets: ${galaxyMap.getPlanetCount()}`);

        for (const sector of sectors) {
            console.log(`\n  Sector: ${sector.getName()} (ID: ${sector.getId()})`);

            const planets = galaxyMap.getPlanetsInSector(sector.getId());
            console.log(`  Number of Planets: ${planets.length}`);

            for (const planet of planets) {
                const connections = galaxyMap.getConnectedPlanets(planet.getId());
                const continents = planet.getContinents();
                console.log(`    Planet: ${planet.getName()} (ID: ${planet.getId()})`);
                console.log(`      Ownership: ${planet.getOwnership()}`);
                console.log(`      Status: ${planet.getStatus()}`);
                console.log(`      Development Level: ${planet.getDevelopmentLevel()}/10`);
                console.log(`      Fortification Level: ${planet.getFortificationLevel()}/5`);
                console.log(`      Specialization: ${planet.getResourceSpecialization()}`);
                console.log(`      Continents: ${continents.length}`);
                console.log(`      Connected to: ${connections.length} planets`);
            }   
        }
        console.log("---------------------\n");
    }

    /**
     * Logs detailed information about the chronicle, including its events.
     * @param events The chronicle array containing event objects.
     */
    static logChronicleDetails(events: readonly ChronicleEvent[]): void {
        TypeUtils.ensureArray(events);

        console.log("--- Chronicle Details ---");
        
        if (events.length === 0) {
            console.log("No events recorded in the chronicle.");
            return;
        }

        for (const event of events) {
            console.log(`Event Heading: ${event.getHeading()}`);
            console.log(`Year: ${event.getTime().getYear()}`);
            const figure = event.getFigure();
            console.log(`Figure: ${figure ? figure.getName() : 'N/A'}`);
            console.log(`Description: ${event.getDescription()}`);
            console.log(`Place: ${event.getLocation().getName()}`);
            console.log(`Type: ${event.getEventType().getName()}`);
            console.log(`Category: ${event.getEventType().getCategory()}`);            
            console.log("---------------------");
        }

        console.log("--- Chronicle End ---");
    }
}
