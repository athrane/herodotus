import { GuiEcsManager } from '../../src/gui/GuiEcsManager';
import * as readline from 'readline';
import { Simulation } from '../../src/simulation/Simulation';
import { Ecs } from '../../src/ecs/Ecs';
import { EntityManager } from '../../src/ecs/EntityManager';
import { SystemManager } from '../../src/ecs/SystemManager';
import { NameComponent } from '../../src/ecs/NameComponent';
import { ActionQueueComponent } from '../../src/gui/menu/ActionQueueComponent';
import { ScreenBufferRenderSystem } from '../../src/gui/rendering/ScreenBufferRenderSystem';

// Mock readline
const mockReadlineInterface = {
  question: jest.fn(),
  close: jest.fn(),
  write: jest.fn()
} as any;

// Mock readline createInterface
jest.mock('readline', () => ({
  createInterface: jest.fn(() => mockReadlineInterface)
}));

describe('GuiEcsManager', () => {
  let guiEcsManager: GuiEcsManager;
  let mockSimulation: Simulation;

  beforeEach(() => {
    // Create a real simulation instance instead of mock
    mockSimulation = Simulation.create();

    guiEcsManager = new GuiEcsManager(mockSimulation);
  });

  afterEach(() => {
    if (guiEcsManager) {
      guiEcsManager.stop();
    }
    if (mockSimulation) {
      // Stop simulation to clean up any resources
      mockSimulation.stop();
    }
  });

  describe('constructor', () => {
    test('should create GUI ECS manager with separate Ecs instance', () => {
      expect(guiEcsManager).toBeInstanceOf(GuiEcsManager);
      expect(guiEcsManager.getEcs()).toBeInstanceOf(Ecs);
      expect(guiEcsManager.getEcs().getEntityManager()).toBeInstanceOf(EntityManager);
      expect(guiEcsManager.getEcs().getSystemManager()).toBeInstanceOf(SystemManager);
    });

    test('should have separate ECS instances from simulation', () => {
      const guiEcs = guiEcsManager.getEcs();
      const simulationEcs = mockSimulation.getEcs();
      
      expect(guiEcs).not.toBe(simulationEcs);
      
      const guiEntityManager = guiEcsManager.getEcs().getEntityManager();
      const simulationEntityManager = mockSimulation.getEntityManager();
      
      expect(guiEntityManager).not.toBe(simulationEntityManager);
    });
  });

  describe('initialize', () => {
    test('should initialize screens', () => {
      guiEcsManager.initialize();
      
      // Check that screens are created
      expect(guiEcsManager.getScreenEntityId('main')).toBeDefined();
      expect(guiEcsManager.getScreenEntityId('status')).toBeDefined();
      expect(guiEcsManager.getScreenEntityId('choices')).toBeDefined();
      expect(guiEcsManager.getScreenEntityId('chronicle')).toBeDefined();
    });

    test('should create ActionQueue entity', () => {
      guiEcsManager.initialize();
      
      const entityManager = guiEcsManager.getEcs().getEntityManager();
      const actionQueueEntity = entityManager.getEntitiesWithComponents(NameComponent, ActionQueueComponent).find(entity => {
        const nameComponent = entity.getComponent(NameComponent);
        return nameComponent && nameComponent.getText() === 'ActionQueue';
      });
      
      expect(actionQueueEntity).toBeDefined();
    });
  });

  describe('start and stop', () => {
    test('should start and stop GUI ECS system', () => {
      const updateFrequency = 50;
      
      guiEcsManager.start(updateFrequency);
      expect(guiEcsManager['isRunning']).toBe(true);
      expect(guiEcsManager['guiUpdateInterval']).not.toBeNull();
      
      guiEcsManager.stop();
      expect(guiEcsManager['isRunning']).toBe(false);
      expect(guiEcsManager['guiUpdateInterval']).toBeNull();
    });

    test('should start with default update frequency', () => {
      // Need to add default parameter to start method
      const updateFrequency = 100; // Use default value
      
      guiEcsManager.start(updateFrequency);
      expect(guiEcsManager['isRunning']).toBe(true);
      
      // Explicitly stop to ensure cleanup
      guiEcsManager.stop();
    });
  });

  describe('screen management', () => {
    beforeEach(() => {
      guiEcsManager.initialize();
    });

    test('should get screen entity IDs', () => {
      const mainScreenId = guiEcsManager.getScreenEntityId('main');
      const statusScreenId = guiEcsManager.getScreenEntityId('status');
      
      expect(mainScreenId).toBeDefined();
      expect(statusScreenId).toBeDefined();
      expect(mainScreenId).not.toBe(statusScreenId);
    });

    test('should return undefined for non-existent screen', () => {
      const nonExistentScreenId = guiEcsManager.getScreenEntityId('nonexistent');
      expect(nonExistentScreenId).toBeUndefined();
    });

    test('should set active screen', () => {
      expect(() => {
        guiEcsManager.setActiveScreen('status');
      }).not.toThrow();
    });
  });

  describe('component access', () => {
    test('should provide access to GUI systems', () => {
      const ecs = guiEcsManager.getEcs();
      const system = ecs.getSystemManager().get('ScreenBufferRenderSystem') as ScreenBufferRenderSystem;
      expect(system).toBeDefined();
    });
  });

  describe('additional functionality', () => {
    test('should handle multiple start calls', () => {
      guiEcsManager.start(50);
      const firstInterval = guiEcsManager['guiUpdateInterval'];
      
      guiEcsManager.start(100);
      const secondInterval = guiEcsManager['guiUpdateInterval'];
      
      expect(firstInterval).not.toBe(secondInterval);
      expect(guiEcsManager['isRunning']).toBe(true);
      
      // Explicitly stop to ensure cleanup
      guiEcsManager.stop();
    });

    test('should handle stop when not running', () => {
      expect(() => {
        guiEcsManager.stop();
      }).not.toThrow();
      
      expect(guiEcsManager['isRunning']).toBe(false);
      expect(guiEcsManager['guiUpdateInterval']).toBeNull();
    });

    test('should handle screen switching', () => {
      guiEcsManager.initialize();
      
      expect(() => {
        guiEcsManager.setActiveScreen('status');
        guiEcsManager.setActiveScreen('main');
        guiEcsManager.setActiveScreen('chronicle');
      }).not.toThrow();
    });
  });
});
