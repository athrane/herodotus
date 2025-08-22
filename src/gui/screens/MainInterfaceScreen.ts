import { Simulation } from '../../simulation/Simulation';
import { GuiHelper } from '../GuiHelper';
import * as readline from 'readline';

/**
 * Main interface screen renderer function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function renderMainInterface(simulation: Simulation, readline: readline.Interface): Promise<void> {
    GuiHelper.clearScreen();
    
    GuiHelper.displayHeader(simulation);
    
    console.log('='.repeat(60));
    
    // Check for and display any pending dilemmas
    GuiHelper.displayPendingDilemmasInline(simulation);
    
    console.log('='.repeat(60));
    console.log('Commands: [H]elp [S]tatus [C]hoices Ch[r]onicle [Q]uit');
    console.log('='.repeat(60));
}

/**
 * Main interface screen input handler function.
 */
export async function handleMainInterfaceInput(
    command: string, 
    simulation: Simulation, 
    readline: readline.Interface
): Promise<boolean> {
    switch (command) {
        case 'help':
        case 'h':
            console.log('\nAvailable Commands:');
            console.log('  [H]elp     - Show this help message');
            console.log('  [S]tatus   - Show detailed simulation status');
            console.log('  [C]hoices  - Show and handle dilemma choices');
            console.log('  Ch[r]onicle- View historical events');
            console.log('  [Q]uit     - Exit the application');
            console.log('\nPress Enter to continue...');
            await GuiHelper.askQuestion(readline, '');
            return true;
        case 'quit':
        case 'q':
            console.log('Goodbye!');
            return true;
        default:
            return false; // Let other systems handle this command
    }
}
