import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { IsActiveScreenComponent } from './IsActiveScreenComponent';
import { ScreenComponent } from '../ScreenComponent';
import { Simulation } from '../../simulation/Simulation';
import * as readline from 'readline';
import { Entity } from 'ecs/Entity';

/**
 * System responsible for rendering the currently active screen.
 * Finds the entity with IsActiveScreenComponent and renders its ScreenComponent.
 */
export class ScreenRenderSystem extends System {
    private readline: readline.Interface;

    constructor(entityManager: EntityManager, readline: readline.Interface) {
        super(entityManager, [IsActiveScreenComponent, ScreenComponent]);
        this.readline = readline;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars    
    processEntity(entity: Entity, ...args: any[]): void {
        //const screenComponent = entity.getComponent(ScreenComponent);

        // This system does not process entities in the traditional sense
        // Rendering is done explicitly via renderActiveScreen()
        return;      
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
        const activeEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveScreenComponent, ScreenComponent);
        
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
        const activeEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveScreenComponent, ScreenComponent);
        
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
        const allActiveEntities = this.getEntityManager().getEntitiesWithComponents(IsActiveScreenComponent);
        allActiveEntities.forEach(entity => {
            entity.removeComponent(IsActiveScreenComponent);
        });

        // Add IsActiveComponent to the specified entity
        const targetEntity = this.getEntityManager().getEntity(entityId);
        if (targetEntity) {
            targetEntity.addComponent(new IsActiveScreenComponent());
        }
    }

    /**
     * Creates a new instance of the ScreenRenderSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @param readline The readline interface for handling user input.
     * @returns A new instance of the ScreenRenderSystem.
     */
    static create(entityManager: EntityManager, readline: readline.Interface): ScreenRenderSystem {
        return new ScreenRenderSystem(entityManager, readline);
    }
}
