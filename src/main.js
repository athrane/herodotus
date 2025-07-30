import { ChronicleGenerator } from './generator/chronicle/ChronicleGenerator.js';
import { WorldGenerator } from './generator/world/WorldGenerator.js';

/**
 * The main entry point for the chronicle generation application.
 */
function main() {
    console.log("Initializing World Generation...");

    // 1. Instantiate the generators.
    // The WorldGenerator now creates and manages its own feature types.
    const worldGenerator = new WorldGenerator();
    const chronicleGenerator = new ChronicleGenerator();
    console.log("Generators are ready.");

    // 2. Define world name and generate the world.
    // The number of continents and features are now defined within the generator.
    const WORLD_NAME = "Aethel";

    console.log(`\nGenerating world '${WORLD_NAME}'...`);
    const world = worldGenerator.generateWorld(WORLD_NAME);
    console.log("World generation complete.\n");

    // 3. Generate and print a chronicle for each continent.
    // The chronicle is directly influenced by the randomly generated geography.
    for (const continent of world.getContinents()) {
        const chronicleText = chronicleGenerator.generateForContinent(continent);
        console.log(chronicleText);
    }
}

// Run the main function
main();