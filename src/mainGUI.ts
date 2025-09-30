import { BuilderDirector } from './ecs/builder/BuilderDirector';
import { SimulationBuilder } from './simulation/builder/SimulationBuilder';
import { GuiBuilder } from './gui/builder/GuiBuilder';
import { TextBasedGui } from './gui/TextBasedGui';
import { Simulation } from 'simulation/Simulation';

/**
 * The main entry point for the interactive chronicle generation application.
 * This version includes a text-based GUI for player interaction.
 */
async function mainWithGUI(): Promise<void> {
  console.log('Starting Herodotus Interactive Simulation...');
  
  // create simulation ECS
  const director = BuilderDirector.create(SimulationBuilder.create());
  const simulationEcs = director.build();

  // create simulation
  const simulation = Simulation.create(simulationEcs);

  // create GUI ECS
  const guiBuilder = GuiBuilder.create(simulationEcs);
  const guiDirector = BuilderDirector.create(guiBuilder)
  const guiEcs = guiDirector.build();

  // Create and start the GUI with pre-built ECS
  const gui = TextBasedGui.create(simulation, guiEcs);
  
  try {
    await gui.start();
  } finally {
    // Clean up
    gui.stop();    
  }
}

mainWithGUI().catch(console.error);
