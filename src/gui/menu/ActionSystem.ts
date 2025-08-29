import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { GuiEcsManager } from '../GuiEcsManager';
import { ActionQueueComponent } from './ActionQueueComponent';
import { TypeUtils } from '../../util/TypeUtils';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { NameComponent } from '../../ecs/NameComponent';
import { HeaderUpdateSystem } from '../rendering/HeaderUpdateSystem';
import { FooterUpdateSystem } from '../rendering/FooterUpdateSystem';
import { ScreensComponent } from './ScreensComponent';

/*
 * Action system for handling user actions and updating the GUI.
 */
export class ActionSystem extends System {
  private guiManager: GuiEcsManager;

  /**
   * Constructs the ActionSystem.
   * @param entityManager The entity manager for managing entities.
   * @param guiManager The GUI manager for updating the user interface.
   */
  constructor(entityManager: EntityManager, guiManager: GuiEcsManager) {
    super(entityManager, []);
    TypeUtils.ensureInstanceOf(guiManager, GuiEcsManager, "Expected guiManager to be an instance of GuiEcsManager");
    this.guiManager = guiManager;
  }

  /**
   * Updates the system by processing queued actions.
   */
  public update(): void {

    // Get the singleton ActionQueueComponent
    const actionQueue = this.getEntityManager().getSingletonComponent(ActionQueueComponent);
    if (!actionQueue) return;

    // Get the current actions and check if queue is empty
    const actions = actionQueue.getActions();
    if (actions.length === 0) return;

    // Clear the queue immediately to prevent reprocessing
    actionQueue.clear();

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
        this.setActiveScreen('StatusScreen');
        break;
      case 'NAV_MAIN':
        this.setActiveScreen('MainInterfaceScreen');
        break;
      case 'NAV_CHOICES':
        this.setActiveScreen('ChoicesScreen');
        break;
      case 'NAV_CHRONICLE':
        this.setActiveScreen('ChronicleScreen');
        break;
      case 'QUIT':
        this.guiManager.stop();
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

    // Get all entities with IsVisibleComponent
    const allVisibleEntities = this.getEntityManager().getEntitiesWithComponents(IsVisibleComponent);

    // Hide all visible UI elements
    allVisibleEntities.forEach(entity => {
      const visibleComponent = entity.getComponent(IsVisibleComponent);
      if (visibleComponent) {
        visibleComponent.setVisibility(false);
      }
    });

    // set Header visible
    const headerEntity = this.getEntityManager().getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === HeaderUpdateSystem.HEADER_ENTITY_NAME);
    if (headerEntity) {
      const headerVisibleComponent = headerEntity.getComponent(IsVisibleComponent);
      if (headerVisibleComponent) {
        headerVisibleComponent.setVisibility(true);
      }
    }

    // Set footer visible
    const footerEntity = this.getEntityManager().getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === FooterUpdateSystem.FOOTER_ENTITY_NAME);
    if (footerEntity) {
      const footerVisibleComponent = footerEntity.getComponent(IsVisibleComponent);
      if (footerVisibleComponent) {
        footerVisibleComponent.setVisibility(true);
      }
    }

    // Set Debug info visible
    const debugEntity = this.getEntityManager().getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === GuiEcsManager.DEBUG_ENTITY_NAME);
    if (debugEntity) {
      const debugVisibleComponent = debugEntity.getComponent(IsVisibleComponent);
      if (debugVisibleComponent) {
        debugVisibleComponent.setVisibility(true);
      }
    }

    // Get screens component
    const screensComponent = this.getEntityManager().getSingletonComponent(ScreensComponent);
    if (!screensComponent) return;

    // Get the ID of the target screen entity
    const screenEntityId = screensComponent.getScreen(screenName);
    if (!screenEntityId) return;

    // set the entity associated with the target screen as visible
    const screenEntity = this.getEntityManager().getEntity(screenEntityId);
    if (!screenEntity) return;

    // set entity visibility
    const visibleComponent = screenEntity.getComponent(IsVisibleComponent);
    if (!visibleComponent) return;

    visibleComponent.setVisibility(true);
  }

  /**
   * Creates a new ActionSystem.
   * @param entityManager The entity manager for managing entities.
   * @param guiManager The GUI manager for updating the user interface.
   * @returns A new instance of ActionSystem.
   */
  static create(entityManager: EntityManager, guiManager: GuiEcsManager): ActionSystem {
    return new ActionSystem(entityManager, guiManager);
  }
}
