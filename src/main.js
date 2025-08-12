import { LogHelper } from './util/log/LogHelper.js';
import { SimulationDirector } from './simulation/builder/SimulationDirector.js';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder.js';
import { WorldComponent } from './geography/WorldComponent.js';
import { ChronicleEventComponent } from './chronicle/ChronicleEventComponent.ts';

/**
 * The main entry point for the chronicle generation application.
 */
function main() {

    // create simulation
    const director = SimulationDirector.create(SimulationBuilder.create());
    const simulation = director.build();

    // log the world details
    const entityManager = simulation.getEntityManager();
    const worldComponent = entityManager.getSingletonComponent(WorldComponent);
    LogHelper.logWorldDetails(worldComponent.get());

    // start the simulation
    simulation.start();

    // run the simulation for a few ticks
    for (let i = 0; i < 100; i++) {
        simulation.tick();
    }

    // stop the simulation
    simulation.stop();

    // print the chronicle
    const chronicleComponent = entityManager.getSingletonComponent(ChronicleEventComponent);
    LogHelper.logChronicleDetails(chronicleComponent.getEvents());

}

// Run the main function
main();