import { World } from "../../geography/World.js";
import { TypeUtils } from "../TypeUtils.js";

/**
 * A helper class with static methods for logging application-specific details.
 * This provides a centralized place for logging formats.
 */
export class LogHelper {

    /**
     * Logs detailed information about the generated world, including its continents and their features.
     * This method makes assumptions about the world, continent, and feature object structures.
     * @param {object} world The world object to log. It should have getName() and getContinents() methods.
     */
    static logWorldDetails(world) {
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
}