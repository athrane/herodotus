import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { GuiEcsManager } from '../GuiEcsManager';
import { TypeUtils } from '../../util/TypeUtils';

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
   * Handles a user action.
   * @param actionId The ID of the action to handle.
   */
  public handleAction(actionId: string): void {
  switch (actionId) {
      case 'NAV_STATUS':
    this.guiManager.setActiveScreen('StatusScreen');
        break;
      case 'NAV_MAIN':
        this.guiManager.setActiveScreen('MainInterfaceScreen');
        break;
      case 'NAV_CHRONICLE':
        this.guiManager.setActiveScreen('ChronicleScreen');
        break;
      case 'NAV_CHOICES':
        this.guiManager.setActiveScreen('ChoicesScreen');
        break;
      case 'QUIT':
        this.guiManager.stop();
        break;
      default:
        // unknown action - no-op
        break;
    }
  }

  public update(): void {
  // No periodic work; actions are handled via handleAction
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
