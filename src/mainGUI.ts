import { LogHelper } from './util/log/LogHelper';
import { SimulationDirector } from './simulation/builder/SimulationDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { WorldComponent } from './geography/WorldComponent';
import { ChronicleComponent } from './chronicle/ChronicleComponent';
import { ECSTextBasedGUI } from './gui/ECSTextBasedGUI';

/**
 * The main entry point for the interactive chronicle generation application.
 * This version includes a text-based GUI for player interaction.
 */
async function mainWithGUI(): Promise<void> {
  console.log('Starting Herodotus Interactive Simulation...');
  
  // create simulation
  const director = SimulationDirector.create(SimulationBuilder.create());
  const simulation = director.build();

  // log the world details
  const entityManager = simulation.getEntityManager();
  const worldComponent = entityManager.getSingletonComponent(WorldComponent);
  if (worldComponent) {
    LogHelper.logWorldDetails(worldComponent.get());
  }

  // Create and start the GUI
  const gui = ECSTextBasedGUI.create(simulation);
  
  try {
    await gui.start();
  } finally {
    // Clean up
    gui.stop();    
  }
}

/**
 * The original main entry point for automated simulation.
 */
function main(): void {
  // create simulation
  const director = SimulationDirector.create(SimulationBuilder.create());
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

// Check command line arguments to decide which mode to run
const args = process.argv.slice(2);
if (args.includes('--gui') || args.includes('-g')) {
  // Run with GUI
  mainWithGUI().catch(console.error);
} else {
  // Run automated simulation (original behavior)
  main();
}
