import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { MenuComponent } from './MenuComponent';
import { TextComponent } from '../rendering/TextComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';

/**
 * Processes a MenuComponent into a TextComponent for display.
 * The menu is rendered on a single line.
 * The currently selected item is indicated with a prefix.
 */
export class MenuTextUpdateSystem extends System {

    /**
     * Creates a new MenuTextUpdateSystem.
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
            return `${prefix}${item.getDisplayText()}`;
        }).join(' | ');

        // Update the text component with the menu string
        textComp.setText(menuString);
    }

    /**
     * Creates a new MenuTextUpdateSystem.
     * @param entityManager The entity manager for managing entities.
     * @returns A new instance of MenuTextUpdateSystem.
     */
    static create(entityManager: EntityManager): MenuTextUpdateSystem {
        return new MenuTextUpdateSystem(entityManager);
    }
}
