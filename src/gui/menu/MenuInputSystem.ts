import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { InputComponent } from './InputComponent';
import { MenuComponent } from './MenuComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ActionQueueComponent } from './ActionQueueComponent';

/**
 * Processes user input for menu navigation and selection.
 */
export class MenuInputSystem extends System {

    /**
     * Creates an instance of MenuInputSystem.
     * @param entityManager The entity manager for managing entities.
     */
    constructor(entityManager: EntityManager) {
        // This system finds entities dynamically; no required components for construction
        super(entityManager, []);
    }

    /**
     * Updates the system.
     */
    update(): void {

        // Get the input component
        const inputComponent = this.getEntityManager().getSingletonComponent(InputComponent);
        if (!inputComponent) return;

        // Get the last input
        const lastInput = inputComponent.getLastInput();
        if (lastInput == null) return;

        // Find a visible menu entity
        const entities = this.getEntityManager().getEntitiesWithComponents(MenuComponent, IsVisibleComponent);

        // Find the active menu entity
        const menuEntity = entities.find(e => {
            const visibleComponent = e.getComponent(IsVisibleComponent);
            return visibleComponent?.isVisible();
        });

        // Exit if no active menu entity is found
        if (!menuEntity) {
            return;
        }

        // Get menu component
        const menuComponent = menuEntity.getComponent(MenuComponent);
        if (!menuComponent) return;

        // Exit if input was processed by menu navigation 
        const isMenuProcessed = this.processInputWithActiveMenuNavigation(lastInput, menuComponent);

        // If menu was processed, then consume input and exit
        if (isMenuProcessed) {
            inputComponent.setLastInput(null);
            return;
        }

        // Post action if input was not processed by menu navigation
        this.postAction(lastInput, menuComponent);

        // Consume input
        inputComponent.setLastInput(null);
    }

    /**
     * Processes input with the active menu navigation
     * @param lastInput The last input received.
     * @returns True if the input was processed, false otherwise.
     */
    processInputWithActiveMenuNavigation(lastInput: string, menuComponent: MenuComponent): boolean {
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
    }

    /**
     * Posts an action based on the last input and the menu component.
     * @param lastInput The last input received.
     * @param menuComponent The menu component to check against.
     */
    postAction(lastInput: string, menuComponent: MenuComponent): void {

        // Check if the input matches any menu item hotkey
        const menuItems = menuComponent.getItems();
        const matchingItem = menuItems.find(item => item.getHotkey() === lastInput);

        // Exit if no matching item is found
        if (!matchingItem) return;

        // Add action to the queue
        const actionQueueComponent = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
        if (!actionQueueComponent) return;
        actionQueueComponent.addAction(matchingItem.getActionID());
    }

    /**
     * Creates a new instance of MenuInputSystem.
     * @param entityManager The entity manager to use.
     * @returns A new instance of MenuInputSystem.
     */
    static create(entityManager: EntityManager): MenuInputSystem {
        return new MenuInputSystem(entityManager);
    }
}
