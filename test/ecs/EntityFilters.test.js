import { EntityFilters } from '../../src/ecs/EntityFilters';
import { Entity } from '../../src/ecs/Entity';
import { Component } from '../../src/ecs/Component';
import { NameComponent } from '../../src/ecs/NameComponent';

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

describe('EntityFilters', () => {
  let entity1, entity2, entity3;

  beforeEach(() => {
    // Create test entities with different components
    entity1 = Entity.create(NameComponent.create('TestEntity'), TestComponent.create('value1'));
    entity2 = Entity.create(NameComponent.create('AnotherEntity'), AnotherTestComponent.create('data1'));
    entity3 = Entity.create(TestComponent.create('value2'));
  });

  describe('byName', () => {
    it('should create a filter that matches entities by name', () => {
      const filter = EntityFilters.byName('TestEntity');
      
      expect(filter(entity1)).toBe(true);
      expect(filter(entity2)).toBe(false);
      expect(filter(entity3)).toBe(false);
    });

    it('should return false for entities without NameComponent', () => {
      const filter = EntityFilters.byName('TestEntity');
      
      expect(filter(entity3)).toBe(false);
    });

    it('should throw TypeError for non-string target name', () => {
      expect(() => EntityFilters.byName(123)).toThrow(TypeError);
      expect(() => EntityFilters.byName(null)).toThrow(TypeError);
      expect(() => EntityFilters.byName(undefined)).toThrow(TypeError);
    });

    it('should handle empty string names', () => {
      const emptyNameEntity = Entity.create(NameComponent.create(''));
      const filter = EntityFilters.byName('');
      
      expect(filter(emptyNameEntity)).toBe(true);
      expect(filter(entity1)).toBe(false);
    });
  });

  describe('hasComponent', () => {
    it('should create a filter that matches entities with specific component', () => {
      const filter = EntityFilters.hasComponent(TestComponent);
      
      expect(filter(entity1)).toBe(true);
      expect(filter(entity2)).toBe(false);
      expect(filter(entity3)).toBe(true);
    });

    it('should work with NameComponent', () => {
      const filter = EntityFilters.hasComponent(NameComponent);
      
      expect(filter(entity1)).toBe(true);
      expect(filter(entity2)).toBe(true);
      expect(filter(entity3)).toBe(false);
    });

    it('should work with AnotherTestComponent', () => {
      const filter = EntityFilters.hasComponent(AnotherTestComponent);
      
      expect(filter(entity1)).toBe(false);
      expect(filter(entity2)).toBe(true);
      expect(filter(entity3)).toBe(false);
    });
  });

  describe('lacksComponent', () => {
    it('should create a filter that matches entities without specific component', () => {
      const filter = EntityFilters.lacksComponent(TestComponent);
      
      expect(filter(entity1)).toBe(false);
      expect(filter(entity2)).toBe(true);
      expect(filter(entity3)).toBe(false);
    });

    it('should work with NameComponent', () => {
      const filter = EntityFilters.lacksComponent(NameComponent);
      
      expect(filter(entity1)).toBe(false);
      expect(filter(entity2)).toBe(false);
      expect(filter(entity3)).toBe(true);
    });

    it('should work with AnotherTestComponent', () => {
      const filter = EntityFilters.lacksComponent(AnotherTestComponent);
      
      expect(filter(entity1)).toBe(true);
      expect(filter(entity2)).toBe(false);
      expect(filter(entity3)).toBe(true);
    });
  });

  describe('and', () => {
    it('should combine filters with AND logic', () => {
      const nameFilter = EntityFilters.byName('TestEntity');
      const componentFilter = EntityFilters.hasComponent(TestComponent);
      const combinedFilter = EntityFilters.and(nameFilter, componentFilter);
      
      expect(combinedFilter(entity1)).toBe(true); // Has both name and component
      expect(combinedFilter(entity2)).toBe(false); // Wrong name
      expect(combinedFilter(entity3)).toBe(false); // No name component
    });

    it('should return true only when all filters pass', () => {
      const filter1 = EntityFilters.hasComponent(NameComponent);
      const filter2 = EntityFilters.hasComponent(TestComponent);
      const filter3 = EntityFilters.byName('TestEntity');
      const combinedFilter = EntityFilters.and(filter1, filter2, filter3);
      
      expect(combinedFilter(entity1)).toBe(true);
      expect(combinedFilter(entity2)).toBe(false);
      expect(combinedFilter(entity3)).toBe(false);
    });

    it('should handle empty filter array', () => {
      const combinedFilter = EntityFilters.and();
      
      expect(combinedFilter(entity1)).toBe(true);
      expect(combinedFilter(entity2)).toBe(true);
      expect(combinedFilter(entity3)).toBe(true);
    });

    it('should handle single non-filter arguments gracefully', () => {
      // Rest parameters convert single arguments to arrays, so these should work
      // but will fail when the non-filter functions are called
      const filter1 = EntityFilters.and('not a filter');
      const filter2 = EntityFilters.and(123);
      
      expect(() => filter1(entity1)).toThrow();
      expect(() => filter2(entity1)).toThrow();
    });
  });

  describe('or', () => {
    it('should combine filters with OR logic', () => {
      const nameFilter = EntityFilters.byName('NonexistentEntity');
      const componentFilter = EntityFilters.hasComponent(TestComponent);
      const combinedFilter = EntityFilters.or(nameFilter, componentFilter);
      
      expect(combinedFilter(entity1)).toBe(true); // Has TestComponent
      expect(combinedFilter(entity2)).toBe(false); // Has neither
      expect(combinedFilter(entity3)).toBe(true); // Has TestComponent
    });

    it('should return true when any filter passes', () => {
      const filter1 = EntityFilters.byName('TestEntity');
      const filter2 = EntityFilters.byName('AnotherEntity');
      const filter3 = EntityFilters.byName('ThirdEntity');
      const combinedFilter = EntityFilters.or(filter1, filter2, filter3);
      
      expect(combinedFilter(entity1)).toBe(true); // Matches filter1
      expect(combinedFilter(entity2)).toBe(true); // Matches filter2
      expect(combinedFilter(entity3)).toBe(false); // Matches none
    });

    it('should handle empty filter array', () => {
      const combinedFilter = EntityFilters.or();
      
      expect(combinedFilter(entity1)).toBe(false);
      expect(combinedFilter(entity2)).toBe(false);
      expect(combinedFilter(entity3)).toBe(false);
    });

    it('should handle single non-filter arguments gracefully', () => {
      // Rest parameters convert single arguments to arrays, so these should work
      // but will fail when the non-filter functions are called
      const filter1 = EntityFilters.or('not a filter');
      const filter2 = EntityFilters.or(null);
      
      expect(() => filter1(entity1)).toThrow();
      expect(() => filter2(entity1)).toThrow();
    });
  });

  describe('not', () => {
    it('should negate a filter function', () => {
      const nameFilter = EntityFilters.byName('TestEntity');
      const negatedFilter = EntityFilters.not(nameFilter);
      
      expect(negatedFilter(entity1)).toBe(false); // Original returns true
      expect(negatedFilter(entity2)).toBe(true); // Original returns false
      expect(negatedFilter(entity3)).toBe(true); // Original returns false
    });

    it('should work with component filters', () => {
      const componentFilter = EntityFilters.hasComponent(TestComponent);
      const negatedFilter = EntityFilters.not(componentFilter);
      
      expect(negatedFilter(entity1)).toBe(false); // Has TestComponent
      expect(negatedFilter(entity2)).toBe(true); // Doesn't have TestComponent
      expect(negatedFilter(entity3)).toBe(false); // Has TestComponent
    });

    it('should throw TypeError for non-function input', () => {
      expect(() => EntityFilters.not('not a function')).toThrow(TypeError);
      expect(() => EntityFilters.not(123)).toThrow(TypeError);
      expect(() => EntityFilters.not(null)).toThrow(TypeError);
    });
  });

  describe('all', () => {
    it('should create a filter that always returns true', () => {
      const filter = EntityFilters.all();
      
      expect(filter(entity1)).toBe(true);
      expect(filter(entity2)).toBe(true);
      expect(filter(entity3)).toBe(true);
    });
  });

  describe('none', () => {
    it('should create a filter that always returns false', () => {
      const filter = EntityFilters.none();
      
      expect(filter(entity1)).toBe(false);
      expect(filter(entity2)).toBe(false);
      expect(filter(entity3)).toBe(false);
    });
  });

  describe('complex filter combinations', () => {
    it('should support nested logical operations', () => {
      const hasName = EntityFilters.hasComponent(NameComponent);
      const hasTest = EntityFilters.hasComponent(TestComponent);
      const hasAnother = EntityFilters.hasComponent(AnotherTestComponent);
      
      // (hasName AND hasTest) OR hasAnother
      const complexFilter = EntityFilters.or(
        EntityFilters.and(hasName, hasTest),
        hasAnother
      );
      
      expect(complexFilter(entity1)).toBe(true); // hasName AND hasTest
      expect(complexFilter(entity2)).toBe(true); // hasAnother
      expect(complexFilter(entity3)).toBe(false); // Neither condition
    });

    it('should support NOT with complex expressions', () => {
      const hasTestComponent = EntityFilters.hasComponent(TestComponent);
      const isTestEntity = EntityFilters.byName('TestEntity');
      
      // NOT (hasTestComponent AND isTestEntity)
      const complexFilter = EntityFilters.not(
        EntityFilters.and(hasTestComponent, isTestEntity)
      );
      
      expect(complexFilter(entity1)).toBe(false); // Has both conditions
      expect(complexFilter(entity2)).toBe(true); // Missing both conditions
      expect(complexFilter(entity3)).toBe(true); // Has component but no name
    });
  });

  describe('static create', () => {
    it('should create a new EntityFilters instance', () => {
      const instance = EntityFilters.create();
      expect(instance).toBeInstanceOf(EntityFilters);
    });
  });
});