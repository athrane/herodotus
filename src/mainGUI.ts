import { LogHelper } from './util/log/LogHelper';
import { BuilderDirector } from './ecs/builder/BuilderDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { GuiBuilder } from './gui/builder/GuiBuilder';
import { WorldComponent } from './geography/WorldComponent';
import { TextBasedGui2 } from './gui/TextBasedGui2';

/**
 * The main entry point for the interactive chronicle generation application.
 * This version includes a text-based GUI for player interaction.
 */
async function mainWithGUI(): Promise<void> {
  console.log('Starting Herodotus Interactive Simulation...');
  
  // create simulation
  const simulationDirector = BuilderDirector.create(SimulationBuilder.create());
  const simulation = simulationDirector.build();

  // log the world details
  const entityManager = simulation.getEntityManager();
  const worldComponent = entityManager.getSingletonComponent(WorldComponent);
  if (worldComponent) {
    LogHelper.logWorldDetails(worldComponent.get());
  }

  // create GUI ECS
  const guiBuilder = GuiBuilder.create(simulation);
  const guiDirector = BuilderDirector.create(guiBuilder);
  guiDirector.build();
  const guiEcs = guiBuilder.getGuiEcs();

  // Create and start the GUI with pre-built ECS
  const gui = TextBasedGui2.create(simulation, guiEcs);
  
  try {
    await gui.start();
  } finally {
    // Clean up
    gui.stop();    
  }
}

mainWithGUI().catch(console.error);
