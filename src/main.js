import { ChronicleGenerator } from './generator/chronicle/ChronicleGenerator.js';
import { LogHelper } from './util/log/LogHelper.js';
import { SimulationDirector } from './simulation/builder/SimulationDirector.js';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder.js';
import { WorldComponent } from './geography/WorldComponent.js';

/**
 * The main entry point for the chronicle generation application.
 */
function main() {

    // create the generators
    const chronicleGenerator = new ChronicleGenerator();

    // create simulation
    const director = SimulationDirector.create(SimulationBuilder.create());
    const simulation = director.build();

    // log the world details
    const entityManager = simulation.getEntityManager();
    const entityWithWorldComponent = entityManager.getEntitiesWithComponents(WorldComponent)[0];
    if (entityWithWorldComponent) {
        const worldComponent = entityWithWorldComponent.get(WorldComponent);
        const world = worldComponent.get();
        LogHelper.logWorldDetails(world);
    }

    // start the simulation
    simulation.start();

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