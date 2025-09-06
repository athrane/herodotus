import { ActionSystem } from '../../../src/gui/menu/ActionSystem';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { ActionQueueComponent } from '../../../src/gui/menu/ActionQueueComponent';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('ActionSystem', () => {
  let mockEntityManager: EntityManager;
  let system: ActionSystem;
  let actionQueueComponent: ActionQueueComponent;

  beforeEach(() => {
    // Use a real EntityManager instance so runtime instance checks pass
    mockEntityManager = EntityManager.create();

    // Create action queue entity
    const actionQueueEntity = mockEntityManager.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueComponent = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueueComponent);

    system = new ActionSystem(mockEntityManager as any);
    
    // Spy on the system's setActiveScreen method to avoid needing full ECS setup
    jest.spyOn(system, 'setActiveScreen').mockImplementation(() => {});
  });

  test('processes NAV_STATUS action from queue', () => {
    actionQueueComponent.addAction('NAV_STATUS');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('status');
  });

  test('processes NAV_MAIN action from queue', () => {
    actionQueueComponent.addAction('NAV_MAIN');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('main');
  });

  test('processes NAV_CHRONICLE action from queue', () => {
    actionQueueComponent.addAction('NAV_CHRONICLE');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('chronicle');
  });

  test('processes NAV_CHOICES action from queue', () => {
    actionQueueComponent.addAction('NAV_CHOICES');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('choices');
  });

  test('NAV_QUIT action is ignored (handled by TextBasedGui2)', () => {
    actionQueueComponent.addAction('NAV_QUIT');
    system.update();
    // NAV_QUIT should be a no-op in ActionSystem since stopping is handled by TextBasedGui2
    expect(system.setActiveScreen).not.toHaveBeenCalled();
  });

  test('unknown action does not call setActiveScreen', () => {
    actionQueueComponent.addAction('SOME_UNKNOWN_ACTION');
    system.update();
    expect(system.setActiveScreen).not.toHaveBeenCalled();
  });

  test('processes multiple actions in queue', () => {
    actionQueueComponent.addAction('NAV_STATUS');
    actionQueueComponent.addAction('NAV_MAIN');
    system.update();
    expect(system.setActiveScreen).toHaveBeenCalledWith('status');
    expect(system.setActiveScreen).toHaveBeenCalledWith('main');
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
    expect(system.setActiveScreen).not.toHaveBeenCalled();
  });

  test('handles rapid successive actions', () => {
    const actions = ['NAV_STATUS', 'NAV_MAIN', 'NAV_CHRONICLE', 'NAV_STATUS'];
    const expectedScreens = ['status', 'main', 'chronicle', 'status'];
    
    actions.forEach(action => actionQueueComponent.addAction(action));
    system.update();
    
    expectedScreens.forEach(screen => {
      expect(system.setActiveScreen).toHaveBeenCalledWith(screen);
    });
    expect(system.setActiveScreen).toHaveBeenCalledTimes(4);
  });

  test('processes FIFO order correctly', () => {
    actionQueueComponent.addAction('NAV_MAIN');
    actionQueueComponent.addAction('NAV_STATUS');
    actionQueueComponent.addAction('NAV_CHRONICLE');
    
    const calls: string[] = [];
    jest.mocked(system.setActiveScreen).mockImplementation((screen: string) => {
      calls.push(screen);
    });
    
    system.update();
    expect(calls).toEqual(['main', 'status', 'chronicle']);
  });

  test('handles mixed navigation and quit actions', () => {
    actionQueueComponent.addAction('NAV_MAIN');
    actionQueueComponent.addAction('NAV_QUIT');
    actionQueueComponent.addAction('NAV_STATUS');
    
    system.update();
    
    expect(system.setActiveScreen).toHaveBeenCalledWith('main');
    // NAV_QUIT should be ignored by ActionSystem
    expect(system.setActiveScreen).toHaveBeenCalledWith('status');
    expect(system.setActiveScreen).toHaveBeenCalledTimes(2);
  });

  test('action queue state consistency after processing', () => {
    const initialLength = actionQueueComponent.getActions().length;
    expect(initialLength).toBe(0);
    
    actionQueueComponent.addAction('NAV_STATUS');
    actionQueueComponent.addAction('NAV_MAIN');
    expect(actionQueueComponent.getActions()).toHaveLength(2);
    
    system.update();
    expect(actionQueueComponent.getActions()).toHaveLength(0);
  });

  test('error handling with malformed actions', () => {
    // Test with undefined/null actions (edge case)
    actionQueueComponent.addAction('');
    actionQueueComponent.addAction('NAV_STATUS');
    
    system.update();
    
    // Should still process the valid action
    expect(system.setActiveScreen).toHaveBeenCalledWith('status');
    expect(system.setActiveScreen).toHaveBeenCalledTimes(1);
  });

  test('performance with large action queues', () => {
    // Add many actions to test performance
    const actionCount = 100;
    for (let i = 0; i < actionCount; i++) {
      actionQueueComponent.addAction('NAV_STATUS');
    }
    
    const startTime = Date.now();
    system.update();
    const endTime = Date.now();
    
    expect(system.setActiveScreen).toHaveBeenCalledTimes(actionCount);
    expect(endTime - startTime).toBeLessThan(100); // Should process quickly
  });

  test('does nothing when no ActionQueueComponent exists', () => {
    // Create a new entity manager without action queue
    const emptyEntityManager = EntityManager.create();
    const systemWithoutQueue = new ActionSystem(emptyEntityManager as any);
    
    systemWithoutQueue.update();
    expect(system.setActiveScreen).not.toHaveBeenCalled();
  });
});
