import { ActionSystem } from '../../../src/gui/menu/ActionSystem';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { GuiEcsManager } from '../../../src/gui/GuiEcsManager';
import { ActionQueueComponent } from '../../../src/gui/menu/ActionQueueComponent';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('ActionSystem', () => {
  let mockEntityManager: EntityManager;
  let mockGuiManager: jest.Mocked<GuiEcsManager>;
  let system: ActionSystem;
  let actionQueueComponent: ActionQueueComponent;

  beforeEach(() => {
    // Use a real EntityManager instance so runtime instance checks pass
    mockEntityManager = EntityManager.create();
    mockGuiManager = {
      setActiveScreen: jest.fn(),
      stop: jest.fn(),
    } as unknown as jest.Mocked<GuiEcsManager>;
  // Make the plain mock object pass `instanceof GuiEcsManager` checks
  Object.setPrototypeOf(mockGuiManager, GuiEcsManager.prototype);

    // Create action queue entity
    const actionQueueEntity = mockEntityManager.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueComponent = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueueComponent);

    system = new ActionSystem(mockEntityManager as any, mockGuiManager as any);
    
    // Spy on the system's setActiveScreen method to avoid needing full ECS setup
    jest.spyOn(system, 'setActiveScreen').mockImplementation(() => {});
  });

  test('processes NAV_STATUS action from queue', () => {
    actionQueueComponent.addAction('NAV_STATUS');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('StatusScreen');
  });

  test('processes NAV_MAIN action from queue', () => {
    actionQueueComponent.addAction('NAV_MAIN');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('MainInterfaceScreen');
  });

  test('processes NAV_CHRONICLE action from queue', () => {
    actionQueueComponent.addAction('NAV_CHRONICLE');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('ChronicleScreen');
  });

  test('processes NAV_CHOICES action from queue', () => {
    actionQueueComponent.addAction('NAV_CHOICES');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('ChoicesScreen');
  });

  test('processes QUIT action from queue', () => {
    actionQueueComponent.addAction('QUIT');
    system.update();
    expect(mockGuiManager.stop).toHaveBeenCalled();
  });

  test('unknown action does not call gui manager', () => {
    actionQueueComponent.addAction('SOME_UNKNOWN_ACTION');
    system.update();
    expect(system.setActiveScreen).not.toHaveBeenCalled();
    expect(mockGuiManager.stop).not.toHaveBeenCalled();
  });

  test('processes multiple actions in queue', () => {
    actionQueueComponent.addAction('NAV_STATUS');
    actionQueueComponent.addAction('NAV_MAIN');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('StatusScreen');
    expect(system.setActiveScreen).toHaveBeenCalledWith('MainInterfaceScreen');
    expect(system.setActiveScreen).toHaveBeenCalledTimes(2);
  });

  test('clears queue after processing', () => {
    actionQueueComponent.addAction('NAV_STATUS');
    expect(actionQueueComponent.getActions()).toHaveLength(1);
    system.update();
    expect(actionQueueComponent.getActions()).toHaveLength(0);
  });

  test('does nothing when queue is empty', () => {
    system.update();
    expect(mockGuiManager.setActiveScreen).not.toHaveBeenCalled();
    expect(mockGuiManager.stop).not.toHaveBeenCalled();
  });

  test('does nothing when no ActionQueueComponent exists', () => {
    // Create a new entity manager without action queue
    const emptyEntityManager = EntityManager.create();
    const systemWithoutQueue = new ActionSystem(emptyEntityManager as any, mockGuiManager as any);
    
    systemWithoutQueue.update();
    expect(mockGuiManager.setActiveScreen).not.toHaveBeenCalled();
    expect(mockGuiManager.stop).not.toHaveBeenCalled();
  });
});
