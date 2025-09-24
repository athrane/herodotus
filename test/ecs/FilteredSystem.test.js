import { FilteredSystem } from '../../src/ecs/FilteredSystem';
import { Entity } from '../../src/ecs/Entity';
import { Component } from '../../src/ecs/Component';
import { EntityManager } from '../../src/ecs/EntityManager';
import { NameComponent } from '../../src/ecs/NameComponent';
import { EntityFilters } from '../../src/ecs/EntityFilters';

// Mock components for testing
class TestComponent extends Component {
  constructor(value) {
    super();
    this.value = value;
  }

  static create(value) {
    return new TestComponent(value);
  }
}

class AnotherTestComponent extends Component {
  constructor(data) {
    super();
    this.data = data;
  }

  static create(data) {
    return new AnotherTestComponent(data);
  }
}

// Test implementation of FilteredSystem
class TestFilteredSystem extends FilteredSystem {
  constructor(entityManager, requiredComponents, entityFilter) {
    super(entityManager, requiredComponents, entityFilter);
    this.processedEntities = [];
  }

  processFilteredEntity(entity, ...args) {
    this.processedEntities.push({ entity, args });
  }

  getProcessedEntities() {
    return this.processedEntities;
  }

  clearProcessedEntities() {
    this.processedEntities = [];
  }

  static create(entityManager, requiredComponents, entityFilter) {
    return new TestFilteredSystem(entityManager, requiredComponents, entityFilter);
  }
}

describe('FilteredSystem', () => {
  let entityManager;
  let entity1, entity2, entity3, entity4;

  beforeEach(() => {
    entityManager = EntityManager.create();
    
    // Create test entities with different components using EntityManager
    entity1 = entityManager.createEntity(NameComponent.create('TestEntity'), TestComponent.create('value1'));
    entity2 = entityManager.createEntity(NameComponent.create('AnotherEntity'), AnotherTestComponent.create('data1'));
    entity3 = entityManager.createEntity(TestComponent.create('value2'));
    entity4 = entityManager.createEntity(NameComponent.create('TestEntity'), TestComponent.create('value3'), AnotherTestComponent.create('data2'));
  });

  describe('constructor', () => {
    it('should create a FilteredSystem with valid parameters', () => {
      const filter = EntityFilters.byName('TestEntity');
      const system = new TestFilteredSystem(entityManager, [TestComponent], filter);
      
      expect(system).toBeInstanceOf(FilteredSystem);
      expect(system.getEntityManager()).toBe(entityManager);
      expect(system.getEntityFilter()).toBe(filter);
    });

    it('should throw TypeError for non-function filter', () => {
      expect(() => new TestFilteredSystem(entityManager, [TestComponent], 'not a function')).toThrow(TypeError);
      expect(() => new TestFilteredSystem(entityManager, [TestComponent], 123)).toThrow(TypeError);
      expect(() => new TestFilteredSystem(entityManager, [TestComponent], null)).toThrow(TypeError);
    });

    it('should inherit System constructor validation', () => {
      const filter = EntityFilters.all();
      expect(() => new TestFilteredSystem('not an entity manager', [TestComponent], filter)).toThrow(TypeError);
      expect(() => new TestFilteredSystem(entityManager, 'not an array', filter)).toThrow(TypeError);
    });
  });

  describe('processEntity', () => {
    it('should only process entities that pass the filter', () => {
      const nameFilter = EntityFilters.byName('TestEntity');
      const system = new TestFilteredSystem(entityManager, [TestComponent], nameFilter);
      
      // Process all entities
      system.processEntity(entity1);
      system.processEntity(entity2);
      system.processEntity(entity3);
      system.processEntity(entity4);
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(2); // Only entity1 and entity4 have name 'TestEntity'
      expect(processed[0].entity).toBe(entity1);
      expect(processed[1].entity).toBe(entity4);
    });

    it('should pass additional arguments to processFilteredEntity', () => {
      const allFilter = EntityFilters.all();
      const system = new TestFilteredSystem(entityManager, [], allFilter);
      
      const arg1 = 'test';
      const arg2 = { data: 'value' };
      system.processEntity(entity1, arg1, arg2);
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(1);
      expect(processed[0].args).toEqual([arg1, arg2]);
    });

    it('should not call processFilteredEntity for filtered out entities', () => {
      const noneFilter = EntityFilters.none();
      const system = new TestFilteredSystem(entityManager, [], noneFilter);
      
      system.processEntity(entity1);
      system.processEntity(entity2);
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(0);
    });

    it('should work with complex filters', () => {
      const complexFilter = EntityFilters.and(
        EntityFilters.hasComponent(NameComponent),
        EntityFilters.hasComponent(TestComponent)
      );
      const system = new TestFilteredSystem(entityManager, [], complexFilter);
      
      system.processEntity(entity1); // Has both NameComponent and TestComponent
      system.processEntity(entity2); // Has NameComponent but not TestComponent
      system.processEntity(entity3); // Has TestComponent but not NameComponent
      system.processEntity(entity4); // Has both NameComponent and TestComponent
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(2); // Only entity1 and entity4 pass
      expect(processed[0].entity).toBe(entity1);
      expect(processed[1].entity).toBe(entity4);
    });
  });

  describe('processFilteredEntity', () => {
    it('should throw error when not overridden', () => {
      const filter = EntityFilters.all();
      const system = new FilteredSystem(entityManager, [], filter);
      
      expect(() => system.processFilteredEntity(entity1)).toThrow('FilteredSystem.processFilteredEntity() must be implemented by a subclass.');
    });
  });

  describe('getEntityFilter', () => {
    it('should return the filter function provided in constructor', () => {
      const filter = EntityFilters.byName('Test');
      const system = new TestFilteredSystem(entityManager, [], filter);
      
      expect(system.getEntityFilter()).toBe(filter);
    });
  });

  describe('update method integration', () => {
    it('should work with inherited update method', () => {
      const nameFilter = EntityFilters.byName('TestEntity');
      const system = new TestFilteredSystem(entityManager, [TestComponent], nameFilter);
      
      // Update should process all entities with TestComponent that also pass name filter
      system.update();
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(2); // entity1 and entity4 have both TestComponent and name 'TestEntity'
      expect(processed[0].entity).toBe(entity1);
      expect(processed[1].entity).toBe(entity4);
    });

    it('should pass update arguments to processFilteredEntity', () => {
      const allFilter = EntityFilters.all();
      const system = new TestFilteredSystem(entityManager, [TestComponent], allFilter);
      
      const updateArg = 'update-arg';
      system.update(updateArg);
      
      const processed = system.getProcessedEntities();
      expect(processed.length).toBeGreaterThan(0);
      processed.forEach(p => {
        expect(p.args).toEqual([updateArg]);
      });
    });
  });

  describe('static createFilteredSystem', () => {
    it('should create a new FilteredSystem instance', () => {
      const filter = EntityFilters.hasComponent(TestComponent);
      const system = FilteredSystem.createFilteredSystem(entityManager, [TestComponent], filter);
      
      expect(system).toBeInstanceOf(FilteredSystem);
      expect(system.getEntityManager()).toBe(entityManager);
      expect(system.getEntityFilter()).toBe(filter);
    });

    it('should validate parameters through constructor', () => {
      const filter = EntityFilters.all();
      expect(() => FilteredSystem.createFilteredSystem('not an entity manager', [], filter)).toThrow(TypeError);
      expect(() => FilteredSystem.createFilteredSystem(entityManager, [], 'not a function')).toThrow(TypeError);
    });
  });

  describe('real-world usage scenarios', () => {
    it('should eliminate name checking boilerplate', () => {
      // Before: Manual name checking in processEntity
      // After: Automatic filtering with EntityFilters.byName
      const choiceScreenFilter = EntityFilters.byName('ChoicesScreen');
      const system = new TestFilteredSystem(entityManager, [], choiceScreenFilter);
      
      const choiceEntity = Entity.create(NameComponent.create('ChoicesScreen'));
      const otherEntity = Entity.create(NameComponent.create('OtherScreen'));
      
      system.processEntity(choiceEntity);
      system.processEntity(otherEntity);
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(1);
      expect(processed[0].entity).toBe(choiceEntity);
    });

    it('should support complex component-based filtering', () => {
      const visibleTestEntitiesFilter = EntityFilters.and(
        EntityFilters.hasComponent(TestComponent),
        EntityFilters.or(
          EntityFilters.byName('Visible1'),
          EntityFilters.byName('Visible2')
        )
      );
      
      const system = new TestFilteredSystem(entityManager, [], visibleTestEntitiesFilter);
      
      const visibleEntity1 = Entity.create(NameComponent.create('Visible1'), TestComponent.create('v1'));
      const visibleEntity2 = Entity.create(NameComponent.create('Visible2'), TestComponent.create('v2'));
      const hiddenEntity = Entity.create(NameComponent.create('Hidden'), TestComponent.create('h1'));
      const nonTestEntity = Entity.create(NameComponent.create('Visible1'));
      
      system.processEntity(visibleEntity1);
      system.processEntity(visibleEntity2);
      system.processEntity(hiddenEntity);
      system.processEntity(nonTestEntity);
      
      const processed = system.getProcessedEntities();
      expect(processed).toHaveLength(2); // Only visibleEntity1 and visibleEntity2 pass
      expect(processed[0].entity).toBe(visibleEntity1);
      expect(processed[1].entity).toBe(visibleEntity2);
    });
  });
});