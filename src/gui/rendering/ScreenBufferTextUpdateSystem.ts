import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { PositionComponent } from './PositionComponent';
import { TextComponent } from './TextComponent';
import { IsVisibleComponent } from './IsVisibleComponent';
import { Entity } from '../../ecs/Entity';
import { ScreenBufferComponent } from './ScreenBufferComponent';

/**
 * System responsible adding entities with visibile text components to the
 * screen buffer component for subsequenct rendering.
 */
export class ScreenBufferTextUpdateSystem extends System {

    /**
     * Constructor for the TextRegistrationForRenderingSystem.
     * @param entityManager The entity manager to use for querying entities.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [PositionComponent, TextComponent, IsVisibleComponent]);
    }
    
    processEntity(entity: Entity): void {
        // Get the screen buffer component first
        const screenBufferComponent = this.getEntityManager().getSingletonComponent(ScreenBufferComponent);
        if (!screenBufferComponent) return;

        // Get visibility component
        const visibilityComponent = entity.getComponent(IsVisibleComponent);
        if (!visibilityComponent) return;

        // Get position component
        const positionComponent = entity.getComponent(PositionComponent);
        if (!positionComponent) return;

        // Get text component
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // If visible, then render
        if(visibilityComponent.isVisible()) {
            const lines = textComponent.getTexts();
            const x = positionComponent.getX();
            let y = positionComponent.getY();
            for (const line of lines) {
                screenBufferComponent.writeAt(y, x, line);
                y++;
            }
        }
    }

    /**
     * Called before processing entities in each update cycle.
     * Resets the frame flag to ensure the buffer is cleared once per frame.
    /**
     * Creates a new instance of the ScreenBufferTextUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @returns A new instance of the ScreenBufferTextUpdateSystem.
     */
    static create(entityManager: EntityManager): ScreenBufferTextUpdateSystem {
        return new ScreenBufferTextUpdateSystem(entityManager);
    }   

}