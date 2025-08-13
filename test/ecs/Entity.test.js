import { Entity } from '../../src/ecs/Entity';
import { Component } from '../../src/ecs/Component';

// Mock components for testing. They must extend the base Component class.
class PositionComponent extends Component {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}

class VelocityComponent extends Component {
  constructor(dx, dy) {
    super();
    this.dx = dx;
    this.dy = dy;
  }
}

class HealthComponent extends Component {
  constructor(current, max) {
    super();
    this.current = current;
    this.max = max;
  }
}

describe('Entity', () => {
  // Mock TypeUtils to avoid dependency on the actual implementation's console logging
  const mockTypeUtils = {
    ensureInstanceOf: (value, type, message) => {
      if (!(value instanceof type)) {
        throw new TypeError(message || 'Type check failed');
      }
    },
    ensureFunction: (value, message) => {
      if (typeof value !== 'function') {
        throw new TypeError(message || 'Function check failed');
      }
    },
  };

  // In a real Jest setup, you would use jest.mock to replace the module.
  // For this example, we'll just acknowledge the dependency.

  describe('constructor', () => {
    it('should create an entity with a unique ID', () => {
      const entity = Entity.create();
      expect(entity).toBeInstanceOf(Entity);
      expect(typeof entity.getId()).toBe('string');
      expect(entity.getId()).toHaveLength(36); // UUID length
    });

    it('should create an entity with one component', () => {
      const position = new PositionComponent(10, 20);
      const entity = Entity.create(position, );

      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.getComponent(PositionComponent)).toBe(position);
    });

    it('should create an entity with two components', () => {
      const position = new PositionComponent(10, 20);
      const velocity = new VelocityComponent(1, -1);
      const entity = Entity.create(position, velocity);

      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.hasComponent(VelocityComponent)).toBe(true);
      expect(entity.getComponent(PositionComponent)).toBe(position);
    });

    it('should throw a TypeError if a non-component is passed to the constructor', () => {
      // This test relies on the internal implementation of the constructor's type check.
      // We simulate the expected behavior of TypeUtils.
      expect(() => Entity.create({})).toThrow(TypeError);
      expect(() => Entity.create(new PositionComponent(0, 0), 'not-a-component')).toThrow(TypeError);
    });
  });

  describe('component management', () => {
    let entity;
    let position;
    let velocity;

    beforeEach(() => {
      entity = Entity.create();
      position = new PositionComponent(10, 20);
      velocity = new VelocityComponent(1, -1);
    });

    it('should add a component with addComponent()', () => {
      entity.addComponent(position);
      expect(entity.hasComponent(PositionComponent)).toBe(true);
    });

    it('should return the entity instance after adding a component for chaining', () => {
      const result = entity.addComponent(position);
      expect(result).toBe(entity);
      result.addComponent(velocity);
      expect(entity.hasComponent(VelocityComponent)).toBe(true);
    });

    it('should throw an error when adding an invalid component', () => {
      expect(() => entity.addComponent(null)).toThrow(TypeError);
      expect(() => entity.addComponent({})).toThrow(TypeError);
      expect(() => entity.addComponent(123)).toThrow(TypeError);
    });

    it('should get a component that has been added with getComponent()', () => {
      entity.addComponent(position);
      const retrieved = entity.getComponent(PositionComponent);
      expect(retrieved).toBe(position);
      expect(retrieved.x).toBe(10);
    });

    it('should return undefined when getting a component that does not exist', () => {
      expect(entity.getComponent(HealthComponent)).toBeUndefined();
    });

    it('should check if a component exists with hasComponent()', () => {
      entity.addComponent(position);
      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.hasComponent(VelocityComponent)).toBe(false);
    });

    it('should remove a component', () => {
      entity.addComponent(position);
      expect(entity.hasComponent(PositionComponent)).toBe(true);
      const wasRemoved = entity.removeComponent(PositionComponent);
      expect(wasRemoved).toBe(true);
      expect(entity.hasComponent(PositionComponent)).toBe(false);
    });

    it('should return false when trying to remove a component that does not exist', () => {
      const wasRemoved = entity.removeComponent(HealthComponent);
      expect(wasRemoved).toBe(false);
    });

    it('should replace a component if one of the same type is added again', () => {
      const oldPosition = new PositionComponent(1, 1);
      const newPosition = new PositionComponent(99, 99);
      entity.addComponent(oldPosition);
      expect(entity.getComponent(PositionComponent).x).toBe(1);

      entity.addComponent(newPosition);
      const retrieved = entity.getComponent(PositionComponent);
      expect(retrieved).toBe(newPosition);
      expect(retrieved.x).toBe(99);
    });
  });

  describe('Entity.create static factory', () => {
    it('should create a new entity with no components', () => {
      const entity = Entity.create();
      expect(entity).toBeInstanceOf(Entity);
      expect(typeof entity.getId()).toBe('string');
    });

    it('should create a new entity with one component', () => {
      const position = new PositionComponent(10, 20);
      const entity = Entity.create(position);

      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.getComponent(PositionComponent)).toBe(position);
    });

    it('should create a new entity with multiple components', () => {
      const position = new PositionComponent(10, 20);
      const velocity = new VelocityComponent(1, -1);
      const entity = Entity.create(position, velocity);

      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.hasComponent(VelocityComponent)).toBe(true);
      expect(entity.getComponent(PositionComponent)).toBe(position);
      expect(entity.getComponent(VelocityComponent)).toBe(velocity);
    });

    it('should throw a TypeError if a non-component is passed to the factory', () => {
      expect(() => Entity.create({})).toThrow(TypeError);
      expect(() => Entity.create(new PositionComponent(0, 0), 'not-a-component')).toThrow(TypeError);
    });
  });
});