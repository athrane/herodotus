import { Simulation } from '../simulation/Simulation';
import { PlayerComponent } from '../ecs/PlayerComponent';
import { TimeComponent } from '../time/TimeComponent';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';
import { EntityManager } from '../ecs/EntityManager';
import { NameComponent } from '../ecs/NameComponent';
import { TextComponent } from './rendering/TextComponent';
import { IsVisibleComponent } from './rendering/IsVisibleComponent';
import { PositionComponent } from './rendering/PositionComponent';

/**
 * Helper class containing stateless utility functions for the GUI system.
 * Provides common GUI functionality used by both ECS and non-ECS implementations.
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

    /**
     * Creates a debug entity for displaying debug information.
     * @param entityManager The entity manager to use for creating the entity.
     * @param entityName The name of the entity.
     * @param x The x position of the entity.
     * @param y The y position of the entity.
     */
    static createDebugEntity(entityManager: EntityManager, entityName: string, x: number, y: number): void {
        const actionDebugEntity = entityManager.createEntity();
        actionDebugEntity.addComponent(new NameComponent(entityName));
        actionDebugEntity.addComponent(new IsVisibleComponent(true));
        actionDebugEntity.addComponent(new PositionComponent(x, y));
        actionDebugEntity.addComponent(new TextComponent(`DEBUG:${entityName}`));
    }

    /**
     * Posts a debug message to a specific entity.
     * @param entityManager The entity manager to use for finding the entity.
     * @param entityName The name of the entity to post the message to.
     * @param message The debug message to post.
     */
    static postDebugText(entityManager: EntityManager, entityName: string, message: string): void {
        const debugEntity = entityManager.getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === entityName);
        if (!debugEntity) return;

        const textComponent = debugEntity.getComponent(TextComponent);
        if (!textComponent) return;

        textComponent.setText(`DEBUG/${entityName}:${message}`);
    }



}
