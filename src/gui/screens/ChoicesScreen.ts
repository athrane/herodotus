import { Simulation } from '../../simulation/Simulation';
import { GuiHelper } from '../GuiHelper';
import { DilemmaComponent } from '../../behaviour/DilemmaComponent';
import * as readline from 'readline';

/** 
 * @deprecated Delete when logic is implemented elsewhere.
 * Choices screen renderer function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function renderChoicesScreen(simulation: Simulation, readline: readline.Interface): Promise<void> {
    GuiHelper.clearScreen();
    
    const playerEntity = GuiHelper.getPlayerEntity(simulation);
    if (!playerEntity) {
        console.log('No player entity found.');
        console.log('Press Enter to return to main menu...');
        return;
    }

    const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
    if (!dilemmaComponent) {
        console.log('No dilemma component found.');
        console.log('Press Enter to return to main menu...');
        return;
    }

    const choices = dilemmaComponent.getChoices();
    if (choices.length === 0) {
        console.log('No pending choices at this time.');
        console.log('Press Enter to return to main menu...');
        return;
    }

    console.log('='.repeat(80));
    console.log('PENDING DECISIONS');
    console.log('='.repeat(80));
    
    choices.forEach((choice, index) => {
        console.log(`[${index + 1}] ${choice.getEventName()}`);
        console.log(`    Description: ${choice.getDescription()}`);
        if (choice.getConsequence && choice.getConsequence()) {
            console.log(`    Consequence: ${choice.getConsequence()}`);
        }
        console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('Enter choice number (1-' + choices.length + ') or [B]ack to main menu:');
}

/**
 * Choices screen input handler function.
 */
export async function handleChoicesScreenInput(
    command: string, 
    simulation: Simulation, 
    readline: readline.Interface
): Promise<boolean> {
    const playerEntity = GuiHelper.getPlayerEntity(simulation);
    if (!playerEntity) {
        return true; // Go back to main screen
    }

    const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
    if (!dilemmaComponent) {
        return true; // Go back to main screen
    }

    const choices = dilemmaComponent.getChoices();
    if (choices.length === 0) {
        return true; // Go back to main screen
    }

    // Handle back command
    if (command === 'b' || command === 'back') {
        return true;
    }

    // Handle choice selection
    const choiceIndex = parseInt(command, 10) - 1;
    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= choices.length) {
        console.log('Invalid choice. Please enter a number between 1 and ' + choices.length + ', or [B]ack.');
        console.log('Press Enter to continue...');
        await GuiHelper.askQuestion(readline, '');
        return false; // Stay on this screen
    }

    // Process the choice
    const selectedChoice = choices[choiceIndex];
    console.log(`\nYou selected: ${selectedChoice.getEventName()}`);
    
    // For now, we'll just display the consequence
    console.log(`Consequence: ${selectedChoice.getConsequence()}`);
    
    // Clear all choices after selection (simplified approach)
    dilemmaComponent.clearChoices();
    
    console.log('Press Enter to continue...');
    await GuiHelper.askQuestion(readline, '');
    
    return true; // Return to main screen
}
