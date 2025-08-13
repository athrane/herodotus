import { SystemManager } from '../../src/ecs/SystemManager';
import { EntityManager } from '../../src/ecs/EntityManager';
import { System } from '../../src/ecs/System';

// Mock System for testing purposes
class MockSystemA extends System {
  constructor(entityManager) {
    super(entityManager);
    this.update = jest.fn(); // Mock the update method
  }
}

// Another mock system to test multiple system interactions
class MockSystemB extends System {
  constructor(entityManager) {
    super(entityManager);
    this.update = jest.fn();
  }
}

describe('SystemManager', () => {
  let entityManager;
  let systemManager;

  beforeEach(() => {
    entityManager = EntityManager.create();
    systemManager = SystemManager.create(entityManager);
  });

  describe('constructor', () => {
    it('should initialize correctly with a valid EntityManager', () => {
      expect(systemManager).toBeInstanceOf(SystemManager);
    });

    it('should throw a TypeError if the entityManager is not an instance of EntityManager', () => {
      expect(() => new SystemManager(null)).toThrow(TypeError);
      expect(() => new SystemManager({})).toThrow(TypeError);
    });
  });

  describe('register()', () => {
    it('should register a system successfully', () => {
      const systemA = new MockSystemA(entityManager);
      systemManager.register(systemA);
      expect(systemManager.get('MockSystemA')).toBe(systemA);
    });

    it('should throw an error if a system of the same class is already registered', () => {
      systemManager.register(new MockSystemA(entityManager));
      expect(() => systemManager.register(new MockSystemA(entityManager))).toThrow(Error);
    });

    it('should throw a TypeError if the object to register is not a System instance', () => {
      expect(() => systemManager.register({})).toThrow(TypeError);
    });
  });

  describe('delete()', () => {
    it('should unregister a system successfully', () => {
      const systemA = new MockSystemA(entityManager);
      systemManager.register(systemA);
      expect(systemManager.get('MockSystemA')).toBe(systemA);

      systemManager.delete('MockSystemA');
      expect(systemManager.get('MockSystemA')).toBeUndefined();
    });

    it('should throw an error if the system to delete is not registered', () => {
      expect(() => systemManager.delete('NonExistentSystem')).toThrow(Error);
    });

    it('should throw a TypeError if the systemClassName is not a string', () => {
      expect(() => systemManager.delete(123)).toThrow(TypeError);
    });
  });

  describe('get()', () => {
    it('should return the system instance if it is registered', () => {
      const systemA = new MockSystemA(entityManager);
      systemManager.register(systemA);
      expect(systemManager.get('MockSystemA')).toBe(systemA);
    });

    it('should return undefined if the system is not registered', () => {
      expect(systemManager.get('NonExistentSystem')).toBeUndefined();
    });

    it('should throw a TypeError if the systemClassName is not a string', () => {
      const expectedError = 'systemClassName must be a string.';
      expect(() => systemManager.get(123)).toThrow(expectedError);
    });
  });

  describe('update()', () => {
    it('should call the update method on all registered systems', () => {
      const systemA = new MockSystemA(entityManager);
      const systemB = new MockSystemB(entityManager);
      systemManager.register(systemA);
      systemManager.register(systemB);

      systemManager.update();

      expect(systemA.update).toHaveBeenCalledTimes(1);
      expect(systemB.update).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the systems update methods', () => {
      const systemA = new MockSystemA(entityManager);
      systemManager.register(systemA);
      const deltaTime = 0.16;

      systemManager.update(deltaTime);

      expect(systemA.update).toHaveBeenCalledWith(deltaTime);
    });

    it('should not throw an error if no systems are registered', () => {
      expect(() => systemManager.update()).not.toThrow();
    });
  });
});

describe('System', () => {
  describe('getEntityManager()', () => {
    it('should return the entity manager associated with the system', () => {
      const entityManager = EntityManager.create();
      const system = new MockSystemA(entityManager);
      expect(system.getEntityManager()).toBe(entityManager);
    });
  });
});