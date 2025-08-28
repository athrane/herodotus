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
            const vis = e.getComponent(IsVisibleComponent);
            return !!vis && vis.isVisible();
        });

        // Exit if no active menu entity is found, reset input
        if (!menuEntity) {
            inputComponent.setLastInput(null);
            return;
        }

        // Get the menu component
        const menuComponent = menuEntity.getComponent(MenuComponent);
        if (!menuComponent) {
            inputComponent.setLastInput(null);
            return;
        }

        // Handle menu navigation input
        switch (lastInput) {
            case 'w':
                menuComponent.selectPrevious();
                break;
            case 's':
                menuComponent.selectNext();
                break;
            case 'enter': {
                const selected = menuComponent.getSelectedItem();
                if (selected) {
                    // Add action to the queue instead of calling actionSystem directly
                    const actionQueue = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
                    if (actionQueue) {
                        actionQueue.addAction((selected as any).getActionID());
                    }
                }
                break;
            }
            default:
                // unhandled input
                break;
        }

        // consume input
        inputComponent.setLastInput(null);
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
