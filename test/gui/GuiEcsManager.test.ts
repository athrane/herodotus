import { GuiEcsManager } from '../../src/gui/GuiEcsManager';
import * as readline from 'readline';
import { Simulation } from '../../src/simulation/Simulation';
import { EntityManager } from '../../src/ecs/EntityManager';
import { SystemManager } from '../../src/ecs/SystemManager';

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
    // Create a mock simulation with necessary methods
    const mockEntityManager = new EntityManager();
    const mockSystemManager = new SystemManager(mockEntityManager);
    
    mockSimulation = {
      getEntityManager: () => mockEntityManager,
      getSystemManager: () => mockSystemManager,
      getIsRunning: () => true,
      start: jest.fn(),
      stop: jest.fn(),
      tick: jest.fn()
    } as any;

    guiEcsManager = new GuiEcsManager(mockReadlineInterface);
  });

  afterEach(() => {
    guiEcsManager.stop();
  });

  describe('constructor', () => {
    test('should create GUI ECS manager with separate entity and system managers', () => {
      expect(guiEcsManager).toBeInstanceOf(GuiEcsManager);
      expect(guiEcsManager.getEntityManager()).toBeInstanceOf(EntityManager);
      expect(guiEcsManager.getSystemManager()).toBeInstanceOf(SystemManager);
    });

    test('should have separate ECS instances from simulation', () => {
      const guiEntityManager = guiEcsManager.getEntityManager();
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

    test('should use default update frequency when not specified', () => {
      guiEcsManager.start();
      expect(guiEcsManager['isRunning']).toBe(true);
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
      const statusScreenId = guiEcsManager.getScreenEntityId('status');
      
      expect(() => {
        guiEcsManager.setActiveScreen(statusScreenId!);
      }).not.toThrow();
    });
  });

  describe('component access', () => {
    test('should provide access to GUI systems', () => {
      expect(guiEcsManager.getScreenRenderSystem()).toBeDefined();
      expect(guiEcsManager.getScreenManager()).toBeDefined();
    });
  });
});
