import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { InputComponent } from './InputComponent';
import { MenuComponent } from './MenuComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ActionQueueComponent } from './ActionQueueComponent';
import { GuiHelper } from '../GuiHelper';

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

        // post debug message
        GuiHelper.postDebugText(this.getEntityManager(), 'I1', `[CP1:Last input=${inputComponent.getLastInput()}]`);

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

        GuiHelper.postDebugText(this.getEntityManager(), 'I2', `[CP2:isMenuProcessed=${isMenuProcessed}]`);

        if (isMenuProcessed) {

            // consume input and exit 
            inputComponent.setLastInput(null);
            return;
        }

        // Post action if input was not processed by menu navigation
        this.postAction(lastInput, menuComponent);

        // consume input
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
                menuComponent.selectPrevious();
                return true;
            case 's':
                menuComponent.selectNext();
                return true;
            case 'enter': {
                //menuComponent.activateSelected();
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
        GuiHelper.postDebugText(this.getEntityManager(), 'I3', `[CP3:lastInput=${lastInput}]`);

        // Check if the input matches any menu item hotkey
        const menuItems = menuComponent.getItems();
        const matchingItem = menuItems.find(item => item.getHotkey() === lastInput);

        // Exit if no matching item is found
        if (!matchingItem) {
            GuiHelper.postDebugText(this.getEntityManager(), 'I3', `[CP4:No matching hotkey for input=${lastInput}]`);
            return;
        }

        GuiHelper.postDebugText(this.getEntityManager(), 'I3', `[CP5:Hotkey=${lastInput}|Action=${matchingItem.getActionID()}]`);

        // Add action to the queue
        const actionQueueComponent = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
        if (!actionQueueComponent) {
            GuiHelper.postDebugText(this.getEntityManager(), 'I3', `[CP6:ActionQueueComponent not found]`);
            return;
        }

        GuiHelper.postDebugText(this.getEntityManager(), 'I3', `[CP7:Adding action=${matchingItem.getActionID()}]`);

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
