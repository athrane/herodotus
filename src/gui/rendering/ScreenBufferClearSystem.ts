import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { ScreenBufferComponent } from './ScreenBufferComponent';

/**
 * ScreenBufferClearSystem is responsible for clearing the screen buffer
 * at the beginning of each frame before any text rendering occurs.
 * 
 * This system runs once per frame and clears the entire screen buffer
 * to ensure old content doesn't persist between frames.
 * 
 * @class ScreenBufferClearSystem
 * @extends {System}
 */
export class ScreenBufferClearSystem extends System {

    /**
     * Flag to track if the buffer has been cleared this frame
     */
    private hasCleared: boolean = false;

    /**
     * Creates a new instance of ScreenBufferClearSystem.
     * @param entityManager The entity manager to use for accessing entities.
     * @constructor
     */
    constructor(entityManager: EntityManager) {
        super(entityManager);
    }

    /**
     * Updates the system - resets the cleared flag for the next frame.
     * @param deltaTime The time elapsed since the last update.
     */
    update(deltaTime: number): void {
        // Reset the flag for the next frame
        this.hasCleared = false;
        super.update(deltaTime);
    }

    /**
     * Processes an entity with a ScreenBufferComponent.
     * Clears the screen buffer once per frame.
     * @param entity The entity to process.
     */
    processEntity(entity: any): void {
        // Only clear once per frame
        if (this.hasCleared) {
            return;
        }

        const screenBufferComponent = entity.getComponent(ScreenBufferComponent);
        if (screenBufferComponent) {
            screenBufferComponent.clear();
            this.hasCleared = true;
        }
    }

    /**
     * Gets the component types this system is interested in.
     * @returns An array of component constructors.
     */
    getComponentTypes(): any[] {
        return [ScreenBufferComponent];
    }

    /**
     * Static factory method to create a new instance of ScreenBufferClearSystem.
     * @param entityManager The entity manager to use for accessing entities.
     * @returns A new ScreenBufferClearSystem instance.
     */
    static create(entityManager: EntityManager): ScreenBufferClearSystem {
        return new ScreenBufferClearSystem(entityManager);
    }
}
