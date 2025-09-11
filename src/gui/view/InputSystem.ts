import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { Entity } from '../../ecs/Entity';
import { TypeUtils } from '../../util/TypeUtils';
import { InputComponent } from './InputComponent';
import { MenuComponent } from '../menu/MenuComponent';
import { ScrollStrategy } from '../menu/ScrollStrategy';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ActionQueueComponent } from '../controller/ActionQueueComponent';

/**
 * Processes user input for menu navigation and selection.
 */
export class InputSystem extends System {

    /**
     * Creates an instance of InputSystem.
     * @param entityManager The entity manager for managing entities.
     */
    constructor(entityManager: EntityManager) {
        TypeUtils.ensureInstanceOf(entityManager, EntityManager);
        super(entityManager, [MenuComponent, IsVisibleComponent]);
    }

    /**
     * Updates the system.
     * @param entitys The entities to process.
     */
    processEntity(entity: Entity): void {
        // Get the input component
        const inputComponent = this.getEntityManager().getSingletonComponent(InputComponent);
        if (!inputComponent) return;

        // Get the last input
        const lastInput = inputComponent.getLastInput();
        if (lastInput == null) return;

        // Only process if this entity is visible
        const visibleComponent = entity.getComponent(IsVisibleComponent);
        if (!visibleComponent || !visibleComponent.isVisible()) return;

        // Get menu component
        const menuComponent = entity.getComponent(MenuComponent);
        if (!menuComponent) return;

        // Pass input on for potential processing due to menu navigation
        const isProcessedByMenu = this.processInputByMenuNavigation(lastInput, menuComponent);
        if (isProcessedByMenu) {
            inputComponent.clear();
            return;
        }

        // Pass input on for potential processing by action
        const isProcessedByAction = this.processInputByAction(lastInput, menuComponent);
        if (isProcessedByAction) {
            inputComponent.clear();
            return;
        }
    }

    /**
     * Processes input with active menu navigation.
     * Supports both vertical and horizontal scroll strategies.
     * @param lastInput The last input received.
     * @param menuComponent The menu component to navigate.
     * @returns True if the input was processed, false otherwise.
     */
    processInputByMenuNavigation(lastInput: string, menuComponent: MenuComponent): boolean {
        const scrollStrategy = menuComponent.getScrollStrategy();
        
        if (scrollStrategy === ScrollStrategy.VERTICAL) {
            // Vertical navigation: w/up for previous, s/down for next
            switch (lastInput) {
                case 'w':
                case 'up':
                    menuComponent.selectPrevious();
                    return true;
                case 's':
                case 'down':
                    menuComponent.selectNext();
                    return true;
                case 'enter': {
                    // Get the selected menu item and add its action to the queue
                    const selectedItem = menuComponent.getSelectedItem();
                    if (selectedItem) {
                        const actionQueueComponent = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
                        if (actionQueueComponent) {
                            actionQueueComponent.addAction(selectedItem.getActionID());
                        }
                    }
                    return true;
                }
                default: {
                    return false;
                }
            }
        } else {
            // Horizontal navigation: a/left for previous, d/right for next (default behavior)
            switch (lastInput) {
                case 'a':
                case 'left':
                    menuComponent.selectPrevious();
                    return true;
                case 'd':
                case 'right':
                    menuComponent.selectNext();
                    return true;
                case 'enter': {
                    // Get the selected menu item and add its action to the queue
                    const selectedItem = menuComponent.getSelectedItem();
                    if (selectedItem) {
                        const actionQueueComponent = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
                        if (actionQueueComponent) {
                            actionQueueComponent.addAction(selectedItem.getActionID());
                        }
                    }
                    return true;
                }
                default: {
                    return false;
                }
            }
        }
    }

    /**
     * Process input by action. 
     * If input is processed then an action is posted based on the last input and the menu component.
     * @param lastInput The last input received.
     * @param menuComponent The menu component to check against.
     * @returns True if the input was processed, false otherwise.
     */
    processInputByAction(lastInput: string, menuComponent: MenuComponent): boolean {

        // Check if the input matches any menu item hotkey
        const menuItems = menuComponent.getItems();
        const matchingItem = menuItems.find(item => item.getHotkey() === lastInput);

        // Exit if no matching item is found
        if (!matchingItem) return false;

        // Add action to the queue
        const actionQueueComponent = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
        if (!actionQueueComponent) return false;
        actionQueueComponent.addAction(matchingItem.getActionID());

        // Mark input as processed
        return true;
    }

    /**
     * Creates a new instance of InputSystem.
     * @param entityManager The entity manager to use.
     * @returns A new instance of InputSystem.
     */
    static create(entityManager: EntityManager): InputSystem {
        return new InputSystem(entityManager);
    }
}
