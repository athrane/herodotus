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
        const worldComponent = entityWithWorldComponent.getComponent(WorldComponent);
        const world = worldComponent.get();
        LogHelper.logWorldDetails(world);
    }

    // start the simulation
    simulation.start();

    // run the simulation for a few ticks
    for (let i = 0; i < 100; i++) {
        simulation.tick();
    }

    // stop the simulation
    simulation.stop();

    // generate the chronicle

}

// Run the main function
main();