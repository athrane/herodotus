import { LogHelper } from './util/log/LogHelper';
import { SimulationDirector } from './simulation/builder/SimulationDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { WorldComponent } from './geography/WorldComponent';
import { TextBasedGui2 } from './gui/TextBasedGui2';

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
  const gui = TextBasedGui2.create(simulation);
  
  try {
    await gui.start();
  } finally {
    // Clean up
    gui.stop();    
  }
}

mainWithGUI().catch(console.error);
