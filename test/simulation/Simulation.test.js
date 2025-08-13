import { Simulation } from '../../src/simulation/Simulation.js';
import { EntityManager } from '../../src/ecs/EntityManager';
import { SystemManager } from '../../src/ecs/SystemManager';
import { TimeComponent } from '../../src/time/TimeComponent.js';
import { NameComponent } from '../../src/ecs/NameComponent';

describe('Simulation', () => {
  let simulation;

  // Mock browser/environment APIs
  beforeAll(() => {
    global.performance = {
      now: jest.fn(),
    };
  });

  beforeEach(() => {
    // Reset mocks and simulation instance before each test
    jest.clearAllMocks();
    performance.now.mockReturnValue(0);
    simulation = Simulation.create();
  });

  describe('constructor', () => {
    it('should initialize with an EntityManager and a SystemManager', () => {
      expect(simulation.getEntityManager()).toBeInstanceOf(EntityManager);
      expect(simulation.getSystemManager()).toBeInstanceOf(SystemManager);
    });

    it('should start in a not-running state', () => {
      expect(simulation.isRunning()).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return the EntityManager instance', () => {
      expect(simulation.getEntityManager()).toBeInstanceOf(EntityManager);
    });

    it('should return the SystemManager instance', () => {
      expect(simulation.getSystemManager()).toBeInstanceOf(SystemManager);
    });

  });

  describe('start', () => {
    it('should set isRunning to true', () => {
      simulation.start();
      expect(simulation.isRunning()).toBe(true);
    });

    it('should set the last tick time using performance.now', () => {
      performance.now.mockReturnValue(100);
      simulation.start();
      expect(performance.now).toHaveBeenCalledTimes(2);
    });

    it('should not do anything if already running', () => {
      simulation.start(); // First call
      expect(simulation.isRunning()).toBe(true);

      simulation.start(); // Second call
    });
  });

  describe('stop', () => {
    it('should set isRunning to false', () => {
      simulation.start();
      simulation.stop();
      expect(simulation.isRunning()).toBe(false);
    });
  });

  describe('static create', () => {
    it('should return a new instance of Simulation', () => {
      const newSim = Simulation.create();
      expect(newSim).toBeInstanceOf(Simulation);
      expect(newSim).not.toBe(simulation);
    });
  });
});