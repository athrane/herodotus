import { EntityManager } from '../ecs/EntityManager';
import { NameComponent } from '../ecs/NameComponent';
import { TextComponent } from './rendering/TextComponent';
import { IsVisibleComponent } from './rendering/IsVisibleComponent';
import { PositionComponent } from './rendering/PositionComponent';
import { Entity } from 'ecs/Entity';

/**
 * Helper class containing stateless utility functions for the GUI system.
 * Provides common GUI functionality used by both ECS and non-ECS implementations.
 */
export class GuiHelper {
    
    /**
     * Creates a debug entity for displaying debug information.
     * @param entityManager The entity manager to use for creating the entity.
     * @param entityName The name of the entity.
     * @param x The x position of the entity.
     * @param y The y position of the entity.
     */
    static createDebugEntity(entityManager: EntityManager, entityName: string, x: number, y: number): Entity {
        const actionDebugEntity = entityManager.createEntity();
        actionDebugEntity.addComponent(new NameComponent(entityName));
        actionDebugEntity.addComponent(new IsVisibleComponent(true, false));
        actionDebugEntity.addComponent(new PositionComponent(x, y));
        actionDebugEntity.addComponent(new TextComponent(`DEBUG:${entityName}`));
        return actionDebugEntity;
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
