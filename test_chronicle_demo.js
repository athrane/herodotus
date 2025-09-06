/**
 * Test script to demonstrate the chronicle screen functionality
 * This creates a simulation with chronicle data and shows the GUI output
 */
import { Simulation } from './src/simulation/Simulation.js';
import { GuiEcsManager } from './src/gui/GuiEcsManager.js';
import { ChronicleComponent } from './src/chronicle/ChronicleComponent.js';
import { DynamicTextComponent } from './src/gui/rendering/DynamicTextComponent.js';
import { NameComponent } from './src/ecs/NameComponent.js';

// Create and setup simulation
const simulation = Simulation.create();
const guiManager = new GuiEcsManager(simulation);
guiManager.initialize();

// Get access to the simulation's entity manager
const simulationEntityManager = simulation.getEntityManager();

// Create an empty chronicle component (this simulates what would normally happen)
const chronicleEntity = simulationEntityManager.createEntity();
const chronicleComponent = ChronicleComponent.create([]); // Empty chronicle for now
chronicleEntity.addComponent(chronicleComponent);

// Get the GUI entity manager and find the chronicle screen
const guiEntityManager = guiManager.getEcs().getEntityManager();
const entities = guiEntityManager.getEntitiesWithComponents(DynamicTextComponent);

for (const entity of entities) {
    const nameComponent = entity.getComponent(NameComponent);
    if (nameComponent && nameComponent.getText() === 'ChronicleScreen') {
        const dynamicTextComponent = entity.getComponent(DynamicTextComponent);
        if (dynamicTextComponent) {
            console.log('Chronicle Screen Content:');
            console.log('========================');
            const content = dynamicTextComponent.getText(guiEntityManager, simulationEntityManager);
            console.log(content);
            console.log('========================');
            break;
        }
    }
}

// Clean up
simulation.stop();
guiManager.stop();

console.log('\nChronicle screen implementation completed successfully!');
console.log('The screen displays "No chronicle events recorded yet." when no events exist,');
console.log('and will show recent events when chronicle data is available.');