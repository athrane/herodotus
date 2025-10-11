import { BuilderDirector } from './ecs/builder/BuilderDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { ChronicleComponent } from './chronicle/ChronicleComponent';
import { Simulation } from 'simulation/Simulation';

/**
 * The main entry point for the chronicle generation application.
 */
async function main(): Promise<void> {

  // create simulation ECS
  const director = BuilderDirector.create(SimulationBuilder.create());
  const simulationEcs = await director.build();

  // create simulation
  const simulation = Simulation.create(simulationEcs);

  // start the simulation
  simulation.start();

  // run the simulation for a few ticks
  for (let i = 0; i < 1000; i++) {
    simulation.tick();
  }

  // stop the simulation
  simulation.stop();

  // print the chronicle
  const entityManager = simulation.getEntityManager();
  const chronicleComponent = entityManager.getSingletonComponent(ChronicleComponent);
  if (chronicleComponent) {
    console.log("--- Chronicle Summary ---");
    console.log(`Total events: ${chronicleComponent.getEvents().length}`);
  }
}

// Run the main function
main();
