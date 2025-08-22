import { Simulation } from '../../simulation/Simulation';
import { GuiHelper } from '../GuiHelper';
import { ChronicleComponent } from '../../chronicle/ChronicleComponent';
import * as readline from 'readline';

/**
 * Chronicle screen renderer function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function renderChronicleScreen(simulation: Simulation, readline: readline.Interface): Promise<void> {
    GuiHelper.clearScreen();
    
    const entityManager = simulation.getEntityManager();
    const chronicleEntities = entityManager.getEntitiesWithComponents(ChronicleComponent);
    
    console.log('='.repeat(80));
    console.log('CHRONICLE OF EVENTS');
    console.log('='.repeat(80));
    
    if (chronicleEntities.length === 0) {
        console.log('No chronicle entities found.');
    } else {
        // Collect all events from all chronicle entities
        let allEvents: any[] = [];
        chronicleEntities.forEach(entity => {
            const chronicleComponent = entity.getComponent(ChronicleComponent);
            if (chronicleComponent) {
                const events = chronicleComponent.getEvents();
                allEvents = allEvents.concat(Array.from(events));
            }
        });
        
        if (allEvents.length === 0) {
            console.log('No chronicle events recorded yet.');
        } else {
            console.log(`Total Events: ${allEvents.length}\n`);
            
            // Show the most recent 10 events
            const recentEvents = allEvents.slice(-10);
            
            console.log('Recent Events:');
            console.log('-'.repeat(40));
            
            recentEvents.forEach((event, index) => {
                console.log(`${index + 1}. Year ${event.getTime().getYear()}: ${event.getEventName()}`);
                console.log(`   Category: ${event.getCategory()}`);
                console.log(`   Type: ${event.getType()}`);
                console.log(`   Description: ${event.getDescription()}`);
                console.log('');
            });
        }
    }
    
    console.log('='.repeat(80));
    console.log('Press Enter to return to main menu...');
}

/**
 * Chronicle screen input handler function.
 */
export async function handleChronicleScreenInput(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: string, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    simulation: Simulation, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readline: readline.Interface
): Promise<boolean> {
    // Any input returns to main screen
    return true;
}
