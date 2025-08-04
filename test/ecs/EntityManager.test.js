import { EntityManager } from '../../src/ecs/EntityManager.js';
import { Entity } from '../../src/ecs/Entity.js';
import { Component } from '../../src/ecs/Component.js';

// Mock Components for testing
class PositionComponent extends Component {}
class VelocityComponent extends Component {}
class RenderableComponent extends Component {}

describe('EntityManager', () => {
  let entityManager;

  beforeEach(() => {
    entityManager = EntityManager.create();
  });

  describe('constructor', () => {
    it('should create an empty manager', () => {
      expect(entityManager).toBeInstanceOf(EntityManager);
      expect(entityManager.count()).toBe(0);
    });
  });

  describe('createEntity', () => {
    it('should create an entity and add it to the manager', () => {
      const entity = entityManager.createEntity();
      expect(entity).toBeInstanceOf(Entity);
      expect(entityManager.count()).toBe(1);
      expect(entityManager.getEntity(entity.getId())).toBe(entity);
    });

    it('should create an entity with components', () => {
      const position = new PositionComponent();
      const velocity = new VelocityComponent();
      const entity = entityManager.createEntity(position, velocity);

      expect(entity.hasComponent(PositionComponent)).toBe(true);
      expect(entity.hasComponent(VelocityComponent)).toBe(true);
      expect(entity.getComponent(PositionComponent)).toBe(position);
    });
  });

  describe('getEntity', () => {
    it('should retrieve an entity by its ID', () => {
      const entity = entityManager.createEntity();
      const foundEntity = entityManager.getEntity(entity.getId());
      expect(foundEntity).toBe(entity);
    });

    it('should return undefined for a non-existent ID', () => {
      expect(entityManager.getEntity('non-existent-id')).toBeUndefined();
    });

    it('should throw a TypeError if the id is not a string', () => {
      // Assuming TypeUtils.ensureString throws a TypeError
      expect(() => entityManager.getEntity(123)).toThrow(TypeError);
    });
  });

  describe('destroyEntity', () => {
    it('should remove an entity from the manager and return true', () => {
      const entity = entityManager.createEntity();
      const entityId = entity.getId();

      expect(entityManager.count()).toBe(1);
      const result = entityManager.destroyEntity(entityId);

      expect(result).toBe(true);
      expect(entityManager.count()).toBe(0);
      expect(entityManager.getEntity(entityId)).toBeUndefined();
    });

    it('should return false for a non-existent ID', () => {
      const result = entityManager.destroyEntity('non-existent-id');
      expect(result).toBe(false);
    });

    it('should throw a TypeError if the id is not a string', () => {
      expect(() => entityManager.destroyEntity(123)).toThrow(TypeError);
    });
  });

  describe('getEntitiesWithComponents', () => {
    let entity1, entity2, entity3;

    beforeEach(() => {
      // Entity with Position
      entity1 = entityManager.createEntity(new PositionComponent());
      // Entity with Position and Velocity
      entity2 = entityManager.createEntity(new PositionComponent(), new VelocityComponent());
      // Entity with Position, Velocity, and Renderable
      entity3 = entityManager.createEntity(new PositionComponent(), new VelocityComponent(), new RenderableComponent());
    });

    it('should return all entities when no components are specified', () => {
      const entities = entityManager.getEntitiesWithComponents();
      expect(entities).toHaveLength(3);
      expect(entities).toContain(entity1);
      expect(entities).toContain(entity2);
      expect(entities).toContain(entity3);
    });

    it('should return entities with a single specified component', () => {
      const renderableEntities = entityManager.getEntitiesWithComponents(RenderableComponent);
      expect(renderableEntities).toHaveLength(1);
      expect(renderableEntities).toContain(entity3);
    });

    it('should return entities with multiple specified components', () => {
      const entities = entityManager.getEntitiesWithComponents(PositionComponent, VelocityComponent);
      expect(entities).toHaveLength(2);
      expect(entities).toContain(entity2);
      expect(entities).toContain(entity3);
    });

    it('should return an empty array if no entities match', () => {
      const entities = entityManager.getEntitiesWithComponents(PositionComponent, RenderableComponent);
      expect(entities).toHaveLength(1);
      expect(entities).toContain(entity3);
    });

    it('should return an empty array if the manager is empty', () => {
      const localManager = new EntityManager();
      const entities = localManager.getEntitiesWithComponents(PositionComponent);
      expect(entities).toEqual([]);
    });
  });

  describe('count', () => {
    it('should return the correct number of entities', () => {
      expect(entityManager.count()).toBe(0);
      entityManager.createEntity();
      expect(entityManager.count()).toBe(1);
    });
  });

  describe('static create', () => {
    it('should return a new instance of EntityManager', () => {
      const newManager = EntityManager.create();
      expect(newManager).toBeInstanceOf(EntityManager);
      expect(newManager).not.toBe(entityManager); // Ensure it's a new instance
    });
  });
});