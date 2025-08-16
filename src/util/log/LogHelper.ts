import { World } from "../../geography/World";
import { ChronicleEvent } from "../../chronicle/ChronicleEvent";
import { TypeUtils } from "../TypeUtils";

/**
 * A helper class with static methods for logging application-specific details.
 * This provides a centralized place for logging formats.
 */
export class LogHelper {

    /**
     * Logs detailed information about the generated world, including its continents and their features.
     * This method makes assumptions about the world, continent, and feature object structures.
     * @param world The world object to log. It should have getName() and getContinents() methods.
     */
    static logWorldDetails(world: World): void {
        TypeUtils.ensureInstanceOf(world, World);

        console.log("--- World Details ---");
        
        console.log(`World Name: ${world.getName()}`);
        
        const continents = world.getContinents();
        console.log(`Number of Continents: ${continents.length}`);

        for (const continent of continents) {
            console.log(`\n  Continent: ${continent.getName()}`);

            const features = continent.getFeatures(); 
            console.log(`  Number of Features: ${features.length}`);

            for (const feature of features) {
                const featureName = feature.getName();
                const featureType = feature.getType().getKey(); 
                console.log(`    Feature: ${featureName} (${featureType})`);
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
            console.log(`\nEvent Heading: ${event.getHeading()}`);
            console.log(`Year: ${event.getTime().getYear()}`);
            const figure = event.getFigure();
            console.log(`Figure: ${figure ? figure.getName() : 'N/A'}`);
            console.log(`Description: ${event.getDescription()}`);
            console.log(`Place: ${event.getPlace().getName()}`);
            console.log(`Type: ${event.getEventType().getName()}`);
            console.log(`Category: ${event.getEventType().getCategory()}`);            
            console.log("---------------------");
        }
    }   
}
