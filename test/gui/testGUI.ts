import { LogHelper } from '../../src/util/log/LogHelper';
import { SimulationDirector } from '../../src/simulation/builder/SimulationDirector';
import { SimulationBuilder } from '../../src/simulation/builder/SimulationBuilder';
import { TextBasedGUI } from '../../src/gui/TextBasedGUI';

/**
 * A simple test to verify the GUI works correctly.
 * This creates a minimal simulation and starts the GUI.
 */
async function testGUI(): Promise<void> {
  console.log('Testing Herodotus GUI...');
  
  try {
    // create simulation
    const director = SimulationDirector.create(SimulationBuilder.create());
    const simulation = director.build();

    // Create and start the GUI
    const gui = TextBasedGUI.create(simulation);
    
    console.log('GUI created successfully!');
    console.log('Simulation has been built and is ready to run.');
    console.log('You can now start the GUI with: npm run start:gui');
    
  } catch (error) {
    console.error('Error during GUI test:', error);
  }
}

// Run the test
testGUI();
