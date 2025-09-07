import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { Entity } from '../../ecs/Entity';
import { TypeUtils } from '../../util/TypeUtils';
import { ActionQueueComponent } from './ActionQueueComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ScreensComponent } from '../menu/ScreensComponent';
import { IsActiveScreenComponent } from '../rendering/IsActiveScreenComponent';
import { PlayerComponent } from '../../ecs/PlayerComponent';
import { DilemmaComponent } from '../../behaviour/DilemmaComponent';
import { DataSetEventComponent } from '../../data/DataSetEventComponent';
import { DataSetEvent } from '../../data/DataSetEvent';
import { Ecs } from '../../ecs/Ecs';

/*
 * Controller system for processing user actions and updating the GUI.
 * Processes actions from the ActionQueueComponent and updates which screen is visible.
 */
export class MainControllerSystem extends System {
  private readonly simulationEcs: Ecs;

  /**
   * Constructs the MainControllerSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulationEcs The simulation ECS instance for accessing simulation state.
   */
  constructor(entityManager: EntityManager, simulationEcs: Ecs) {
    TypeUtils.ensureInstanceOf(entityManager, EntityManager);
    TypeUtils.ensureInstanceOf(simulationEcs, Ecs);
    super(entityManager, [ActionQueueComponent]);
    this.simulationEcs = simulationEcs;
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
        if (actionId.startsWith('CHOICE_SELECT_')) {
          this.handleMenuSelection(actionId);
          break
        }

        // unknown action - no-op
        break;
    }
  }

  /**
   * Handles a menu selection action.
   * @param actionId The ID of the action to handle.
   */
  private handleMenuSelection(actionId: string): void {
  // Find the player in the simulation
  const simulationEntityManager = this.simulationEcs.getEntityManager();
  const players = simulationEntityManager.getEntitiesWithComponents(PlayerComponent, DilemmaComponent, DataSetEventComponent);
  if (players.length === 0) return;

    // Get the first player entity
    const player = players[0];

    // Get the dilemma and data set event components
    const dilemmaComponent = player.getComponent(DilemmaComponent);
    if (!dilemmaComponent) return;

    // Get the data set event component
    const dataSetEventComponent = player.getComponent(DataSetEventComponent);
    if (!dataSetEventComponent) return;

    // Handle the menu selection
    const choiceIndex = parseInt(actionId.split('_').pop() || '0');
    const selectedChoice = dilemmaComponent.getChoice(choiceIndex);
    if (!selectedChoice) return;

    // Ensure the selected choice is a DataSetEvent
    TypeUtils.ensureInstanceOf(selectedChoice, DataSetEvent, 'choice must be a DataSetEvent');

    // Set the selected choice in the DataSetEventComponent
    dataSetEventComponent.setDataSetEvent(selectedChoice);
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
   * Creates a new MainControllerSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulationEcs The simulation ECS instance for accessing simulation state.
   * @returns A new instance of MainControllerSystem.
   */
  static create(entityManager: EntityManager, simulationEcs: Ecs): MainControllerSystem {
  return new MainControllerSystem(entityManager, simulationEcs);
  }
}

