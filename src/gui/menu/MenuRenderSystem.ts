import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { MenuComponent } from './MenuComponent';
import { TextComponent } from '../rendering/TextComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';

/**
 * Renders a MenuComponent into a TextComponent for display.
 */
export class MenuRenderSystem extends System {

    /**
     * Creates a new MenuRenderSystem.
     * @param entityManager The entity manager for managing entities.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [MenuComponent, TextComponent, IsVisibleComponent]);
    }

    /**
     * Processes a single entity.
     * @param entity The entity to process.
     * @returns 
     */
    processEntity(entity: Entity): void {
        const visibility = entity.getComponent(IsVisibleComponent);
        const textComp = entity.getComponent(TextComponent);
        const menu = entity.getComponent(MenuComponent);

        // Exit if text component is missing
        if (!textComp) return;

        // Exit if visibility component is missing or not visible
        if (!visibility || !visibility.isVisible()) {
            textComp.setText('');
            return;
        }

        // Exit if menu component is missing
        if (!menu) {
            textComp.setText('');
            return;
        }

        // Build the menu string with selected item indicator
        const menuString = menu.getItems().map((item, index) => {
            const prefix = index === menu.getSelectedItemIndex() ? '> ' : '  ';
            return `${prefix}${item.getText()}`;
        }).join('\n');

        // Update the text component with the menu string
        textComp.setText(menuString);
    }
}
