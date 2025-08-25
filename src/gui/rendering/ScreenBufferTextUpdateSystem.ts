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
        const positionComponent = entity.getComponent(PositionComponent);
        if (!positionComponent) return;

        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;
        
        const visibilityComponent = entity.getComponent(IsVisibleComponent);
        if (!visibilityComponent) return;

        // Get the screen buffer component
        const screenBufferComponent = this.getEntityManager().getSingletonComponent(ScreenBufferComponent);
        if (!screenBufferComponent) return;

        // If visible, the render
        if(visibilityComponent.isVisible()) {
            screenBufferComponent.writeAt(positionComponent.getY(), positionComponent.getX(), textComponent.getText());
        }
    }

    /**
     * Creates a new instance of the ScreenBufferTextUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @returns A new instance of the ScreenBufferTextUpdateSystem.
     */
    static create(entityManager: EntityManager): ScreenBufferTextUpdateSystem {
        return new ScreenBufferTextUpdateSystem(entityManager);
    }   

}