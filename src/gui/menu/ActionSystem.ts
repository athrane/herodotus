import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { Entity } from '../../ecs/Entity';
import { TypeUtils } from '../../util/TypeUtils';
import { ActionQueueComponent } from './ActionQueueComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ScreensComponent } from './ScreensComponent';
import { IsActiveScreenComponent } from '../rendering/IsActiveScreenComponent';

/*
 * Action system for handling user actions and updating the GUI.
 * Processes actions from the ActionQueueComponent and updates which screen is visible.
 * 
 * A screen is made visible by setting its IsVisibleComponent to true and adding IsActiveScreenComponent.
 * A screen is hidden by setting its IsVisibleComponent to false and removing IsActiveScreenComponent.
 * Only one screen should have IsActiveScreenComponent at a time.
 * 
 * A screen is identified by a key in the ScreensComponent singleton, which maps to an entity ID.
 */
export class ActionSystem extends System {

  /**
   * Constructs the ActionSystem.
   * @param entityManager The entity manager for managing entities.
   */
  constructor(entityManager: EntityManager) {
    TypeUtils.ensureInstanceOf(entityManager, EntityManager);
    super(entityManager, [ActionQueueComponent]);
  }

  /**
   * Updates the system by processing queued actions.
   */
   
  processEntity(entity: Entity): void {
    const actionQueueComponent = entity.getComponent(ActionQueueComponent);
    if (!actionQueueComponent) return;

    const actions = actionQueueComponent.getActions();
    if (actions.length === 0) return;

    // Clear the queue immediately to prevent reprocessing
    actionQueueComponent.clear();

    // Process each action
    for (const actionId of actions) {
      this.executeAction(actionId);
    }
  }

  /**
 * Handles a user action.
 * @param actionId The ID of the action to handle.
 */
  private executeAction(actionId: string): void {
    switch (actionId) {
      case 'NAV_STATUS':
        this.setActiveScreen('status');
        break;
      case 'NAV_MAIN':
        this.setActiveScreen('main');
        break;
      case 'NAV_CHOICES':
        this.setActiveScreen('choices');
        break;
      case 'NAV_CHRONICLE':
        this.setActiveScreen('chronicle');
        break;
      default:
        // unknown action - no-op
        break;
    }
  }

  /**
   * Sets the active screen by name.
   * Hides all other UI elements except header and footer.
   * Shows the UI elements associated with the target screen.
   * @param screenName The name of the screen to activate.
   */
  setActiveScreen(screenName: string): void {
    const entityManager = this.getEntityManager();

    // Deactivate the current screen
    const activeScreenEntities = entityManager.getEntitiesWithComponents(IsActiveScreenComponent, IsVisibleComponent);
    if (activeScreenEntities.length > 0) {
        const currentScreenEntity = activeScreenEntities[0];
        currentScreenEntity.getComponent(IsVisibleComponent)?.setVisibility(false);
        currentScreenEntity.removeComponent(IsActiveScreenComponent);
    }

    // Activate the new screen
    const screensComponent = entityManager.getSingletonComponent(ScreensComponent);
    if (!screensComponent) return;

    const newScreenEntityId = screensComponent.getScreen(screenName);
    if (!newScreenEntityId) return;

    const newScreenEntity = entityManager.getEntity(newScreenEntityId);
    if (!newScreenEntity) return;

    newScreenEntity.getComponent(IsVisibleComponent)?.setVisibility(true);
    if (!newScreenEntity.hasComponent(IsActiveScreenComponent)) {
        newScreenEntity.addComponent(new IsActiveScreenComponent());
    }
  }

  /**
   * Creates a new ActionSystem.
   * @param entityManager The entity manager for managing entities.
   * @returns A new instance of ActionSystem.
   */
  static create(entityManager: EntityManager): ActionSystem {
    return new ActionSystem(entityManager);
  }
}
