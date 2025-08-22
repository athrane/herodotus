import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { IsActiveComponent } from './IsActiveComponent';
import { ScreenComponent } from './ScreenComponent';
import { Simulation } from '../simulation/Simulation';
import * as readline from 'readline';

/**
 * System responsible for rendering the currently active screen.
 * Finds the entity with IsActiveComponent and renders its ScreenComponent.
 */
export class ScreenRenderSystem extends System {
    private readline: readline.Interface;

    constructor(entityManager: EntityManager, readline: readline.Interface) {
        super(entityManager);
        this.readline = readline;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(simulation: Simulation): void {
        // This system doesn't need regular updates
        // Rendering is done explicitly via renderActiveScreen()
    }

    /**
     * Renders the currently active screen.
     */
    async renderActiveScreen(simulation: Simulation): Promise<void> {
        const activeEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveComponent, ScreenComponent);
        
        if (activeEntities.length === 0) {
            console.log('No active screen found');
            return;
        }

        if (activeEntities.length > 1) {
            console.warn('Multiple active screens found, using the first one');
        }

        const activeEntity = activeEntities[0];
        const screenComponent = activeEntity.getComponent(ScreenComponent);
        
        if (screenComponent) {
            await screenComponent.render(simulation, this.readline);
        }
    }

    /**
     * Handles input for the currently active screen.
     * @param command The user input command
     * @param simulation The simulation instance
     * @returns True if the input was handled by the screen, false otherwise
     */
    async handleActiveScreenInput(command: string, simulation: Simulation): Promise<boolean> {
        const activeEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveComponent, ScreenComponent);
        
        if (activeEntities.length === 0) {
            return false;
        }

        const activeEntity = activeEntities[0];
        const screenComponent = activeEntity.getComponent(ScreenComponent);
        
        if (screenComponent) {
            return await screenComponent.handleInput(command, simulation, this.readline);
        }

        return false;
    }

    /**
     * Sets the active screen by removing IsActiveComponent from all entities
     * and adding it to the specified entity.
     */
    setActiveScreen(entityId: string): void {
        // Remove IsActiveComponent from all entities
        const allActiveEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveComponent);
        allActiveEntities.forEach(entity => {
            entity.removeComponent(IsActiveComponent);
        });

        // Add IsActiveComponent to the specified entity
        const targetEntity = this.getEntityManager().getEntity(entityId);
        if (targetEntity) {
            targetEntity.addComponent(new IsActiveComponent());
        }
    }
}
