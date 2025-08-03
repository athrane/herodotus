import { ChronicleGenerator } from './generator/chronicle/ChronicleGenerator.js';
import { WorldGenerator } from './generator/world/WorldGenerator.js';
import { LogHelper } from './util/log/LogHelper.js';
import { Simulation } from './simulation/Simulation.js';
import { GeographicalFeatureTypeRegistry } from './geography/GeographicalFeatureTypeRegistry.js';
import { GeographicalFeaturesFactory } from './geography/GeographicalFeaturesFactory.js';

/**
 * The main entry point for the chronicle generation application.
 */
function main() {

    // create the generators
    const worldGenerator = new WorldGenerator();
    const chronicleGenerator = new ChronicleGenerator();

    // create simulation
    const simulation = Simulation.create();

    // get ECS core classes
    const entityManager = simulation.getEntityManager();
    const systemManager = simulation.getSystemManager();

    // generate the world 
    // The number of continents and features are now defined within the generator.
    const featureFactory = GeographicalFeaturesFactory.create();
    const WORLD_NAME = "Aethel";
    const world = worldGenerator.generateWorld(WORLD_NAME);

    // log world details
    LogHelper.logWorldDetails(world);

    // 3. Generate and print a chronicle for each continent.
    // The chronicle is directly influenced by the randomly generated geography.
    /**
    for (const continent of world.getContinents()) {
        const chronicleText = chronicleGenerator.generateForContinent(continent);
        console.log(chronicleText);
    }
    */
    // For now, we will just log the world details.
}

// Run the main function
main();