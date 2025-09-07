import { LogHelper } from './util/log/LogHelper';
import { BuilderDirector } from './ecs/builder/BuilderDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { WorldComponent } from './geography/WorldComponent';
import { ChronicleComponent } from './chronicle/ChronicleComponent';

/**
 * The main entry point for the chronicle generation application.
 */
function main(): void {
  // create simulation
  const director = BuilderDirector.create(SimulationBuilder.create());
  const simulation = director.build();

  // log the world details
  const entityManager = simulation.getEntityManager();
  const worldComponent = entityManager.getSingletonComponent(WorldComponent);
  if (worldComponent) {
    LogHelper.logWorldDetails(worldComponent.get());
  }

  // start the simulation
  simulation.start();

  // run the simulation for a few ticks
  for (let i = 0; i < 1000; i++) {
    simulation.tick();
  }

  // stop the simulation
  simulation.stop();

  // print the chronicle
  const chronicleComponent = entityManager.getSingletonComponent(ChronicleComponent);
  if (chronicleComponent) {
    LogHelper.logChronicleDetails(chronicleComponent.getEvents());
  }
}

// Run the main function
main();
