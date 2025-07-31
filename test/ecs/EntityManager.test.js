import { EntityManager } from '../../src/ecs/EntityManager.js';
import { Entity } from '../../src/ecs/Entity.js';
import { Component } from '../../src/ecs/Component.js';

// Mock components for testing
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
class RenderableComponent extends Component {}

describe('EntityManager', () => {
  let manager;

  beforeEach(() => {
    manager = new EntityManager();
  });

  describe('createEntity', () => {
    it('should create a new entity with no components', () => {
      const entity = manager.createEntity();
      expect(entity).toBeInstanceOf(Entity);
    });

    it('should store the created entity', () => {
      const entity = manager.createEntity();
      expect(manager.getEntity(entity.getId())).toBe(entity);
    });

    it('should create an entity with single component', () => {
      const position = new PositionComponent(10, 20);
      const entity = manager.createEntity(position);
      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.get(PositionComponent)).toBe(position);
    });

    it('should create an entity with multiple components', () => {
      const position = new PositionComponent(10, 20);
      const velocity = new VelocityComponent(5, 5);
      const entity = manager.createEntity(position, velocity);
      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.get(PositionComponent)).toBe(position);
      expect(entity.hasComponent(VelocityComponent)).toBe(true);
      expect(entity.get(VelocityComponent)).toBe(velocity);
    });

    it('should throw an error if creating with a non-component', () => {
      expect(() => manager.createEntity({})).toThrow(TypeError);
    });
  });

  describe('getEntity', () => {
    it('should retrieve an existing entity by its ID', () => {
      const entity = manager.createEntity();
      const retrievedEntity = manager.getEntity(entity.getId());
      expect(retrievedEntity).toBe(entity);
    });

    it('should return undefined for a non-existent entity ID', () => {
      expect(manager.getEntity('non-existent-uuid')).toBeUndefined();
    });

    it('should throw a TypeError if the ID is not a string', () => {
      expect(() => manager.getEntity(123)).toThrow(TypeError);
    });
  });

  describe('destroyEntity', () => {
    it('should remove an entity from the manager', () => {
      const entity = manager.createEntity();
      const id = entity.getId();
      expect(manager.getEntity(id)).toBeDefined();

      const wasDestroyed = manager.destroyEntity(id);
      expect(wasDestroyed).toBe(true);
      expect(manager.getEntity(id)).toBeUndefined();
    });

    it('should return false if the entity to destroy does not exist', () => {
      const wasDestroyed = manager.destroyEntity('non-existent-uuid');
      expect(wasDestroyed).toBe(false);
    });

    it('should throw a TypeError if the ID is not a string', () => {
      expect(() => manager.destroyEntity(123)).toThrow(TypeError);
    });
  });

  describe('getEntitiesWithComponents', () => {
    let entity1, entity2, entity3;

    beforeEach(() => {
      entity1 = manager.createEntity(new PositionComponent(0, 0));
      entity2 = manager.createEntity(new PositionComponent(1, 1), new VelocityComponent(5, 5));
      entity3 = manager.createEntity(new PositionComponent(2, 2), new VelocityComponent(10, 10), new RenderableComponent());
    });

    it('should return all entities if no components are specified', () => {
      const entities = manager.getEntitiesWithComponents();
      expect(entities).toHaveLength(3);
      expect(entities).toEqual(expect.arrayContaining([entity1, entity2, entity3]));
    });

    it('should return entities that have a single specified component', () => {
      const posEntities = manager.getEntitiesWithComponents(PositionComponent);
      expect(posEntities).toHaveLength(3);
      expect(posEntities).toEqual(expect.arrayContaining([entity1, entity2, entity3]));

      const velEntities = manager.getEntitiesWithComponents(VelocityComponent);
      expect(velEntities).toHaveLength(2);
      expect(velEntities).toEqual(expect.arrayContaining([entity2, entity3]));
    });

    it('should return entities that have all specified components', () => {
      const entities = manager.getEntitiesWithComponents(PositionComponent, VelocityComponent);
      expect(entities).toHaveLength(2);
      expect(entities).toEqual(expect.arrayContaining([entity2, entity3]));
      expect(entities).not.toContain(entity1);
    });

    it('should return entities that have a more complex combination of components', () => {
      const entities = manager.getEntitiesWithComponents(PositionComponent, VelocityComponent, RenderableComponent);
      expect(entities).toHaveLength(1);
      expect(entities).toContain(entity3);
    });

    it('should return an empty array if no entities match', () => {
      manager.destroyEntity(entity3.getId());
      const entities = manager.getEntitiesWithComponents(PositionComponent, VelocityComponent, RenderableComponent);
      expect(entities).toHaveLength(0);
    });
  });
});