import { Simulation } from '../simulation/Simulation';
import { PlayerComponent } from '../ecs/PlayerComponent';
import { TimeComponent } from '../time/TimeComponent';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';

/**
 * Helper class containing stateless utility functions for the TextBasedGUI.
 * Extracted to minimize the size of the main TextBasedGUI class.
 */
export class GuiHelper {
    
    /**
     * Clears the terminal screen.
     * This uses ANSI escape codes to clear the screen and move the cursor to the top-left.
     */
    static clearScreen(): void {
        // ANSI escape codes to clear screen and move cursor to top-left
        process.stdout.write('\x1b[2J\x1b[0f');
    }

    /**
     * Gets the player entity from the simulation.
     * This returns the first player entity found, or null if none exists.
     * @returns The player entity or null if not found.
     */
    static getPlayerEntity(simulation: Simulation) {
        const entityManager = simulation.getEntityManager();
        const playerEntities = entityManager.getEntitiesWithComponents(PlayerComponent);
        return playerEntities.length > 0 ? playerEntities[0] : null;
    }

    /**
     * Displays the header with current game status.
     */
    static displayHeader(simulation: Simulation): void {
        // Get current year, simulation state, player info, and status for header
        const entityManager = simulation.getEntityManager();
        const timeComponent = entityManager.getSingletonComponent(TimeComponent);
        const currentYear = timeComponent ? timeComponent.getTime().getYear().toString().padStart(4, '0') : '0000';
        const simulationState = simulation.getIsRunning() ? 'Running' : 'Stopped';

        console.log(`Year: ${currentYear} | Simulation: ${simulationState} | Herodotus 1.0.0`);
        console.log('-'.repeat(80));
    }

    /**
     * Displays pending dilemmas inline.
     */
    static displayPendingDilemmasInline(simulation: Simulation): void {
        const playerEntity = GuiHelper.getPlayerEntity(simulation);
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (!dilemmaComponent) return;

        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) {
            console.log('No current dilemmas.');
            return;
        }

        console.log('*** DECISION REQUIRED ***');
        choices.forEach((choice, index) => {
            console.log(`[${index + 1}] ${choice.getEventName()}`);
            console.log(`    ${choice.getDescription()}`);
            if (choice.getConsequence && choice.getConsequence()) {
                console.log(`    → ${choice.getConsequence()}`);
            }
            console.log('');
        });
    }

    /**
     * Creates a promise-based wrapper for readline question.
     * This allows for cleaner async/await usage in the GUI.
     * @returns A promise that resolves with the user's input.
     */
    static askQuestion(readline: any, question: string): Promise<string> {
        return new Promise((resolve) => {
            readline.question(question, resolve);
        });
    }
}
