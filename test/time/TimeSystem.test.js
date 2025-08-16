import { TimeSystem } from '../../src/time/TimeSystem.ts';
import { EntityManager } from '../../src/ecs/EntityManager';
import { TimeComponent } from '../../src/time/TimeComponent.ts';
import { Time } from '../../src/time/Time.ts';
import { System } from '../../src/ecs/System';

describe('TimeSystem', () => {
  let entityManager;
  let timeSystem;

  beforeEach(() => {
    entityManager = EntityManager.create();
    timeSystem = new TimeSystem(entityManager);
  });

  it('should be an instance of System', () => {
    expect(timeSystem).toBeInstanceOf(System);
  });

  it('should advance the time on an entity with a TimeComponent', () => {
    const initialTime = Time.create(100);
    const timeComponent = TimeComponent.create(initialTime);
    const entity = entityManager.createEntity(timeComponent);

    // Simulate an update after 0.5 seconds.
    // With YEARS_PER_SECOND = 10 (defined in the system), this should add 5 years.
    const deltaTime = 0.5;
    timeSystem.update(deltaTime);

    const updatedTimeComponent = entity.getComponent(TimeComponent);
    const newYear = updatedTimeComponent.getTime().getYear();

    // The new year should be 100 + (0.5 * 10) = 105.
    expect(newYear).toBe(105);
  });

  it('should not throw an error if no time entity exists', () => {
    // No entity created.
    const deltaTime = 0.5;
    expect(() => timeSystem.update(deltaTime)).not.toThrow();
  });

  it('should handle integer year values correctly', () => {
    const entity = entityManager.createEntity(TimeComponent.create(Time.create(50)));
    timeSystem.update(0.1); // Adds 1 year (0.1 * 10)
    expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(51);
  });

  describe('delta time edge cases', () => {
    it('should handle zero delta time', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      const originalYear = entity.getComponent(TimeComponent).getTime().getYear();
      
      timeSystem.update(0);
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(originalYear);
    });

    it('should handle very small delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(0.001); // Very small delta
      
      // Should round to nearest integer (0.001 * 10 = 0.01 ≈ 0)
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(100);
    });

    it('should handle large delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(0)));
      
      timeSystem.update(100); // Large delta: 100 * 10 = 1000 years
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1000);
    });

    it('should handle negative delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(-0.5); // Negative delta: -0.5 * 10 = -5 years
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(95);
    });

    it('should handle decimal results with proper rounding', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // 0.15 * 10 = 1.5, should round to 2
      timeSystem.update(0.15);
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(102);
      
      // Reset and test rounding down
      entity.getComponent(TimeComponent).setTime(Time.create(100));
      // 0.14 * 10 = 1.4, should round to 1
      timeSystem.update(0.14);
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(101);
    });
  });

  describe('multiple entities processing', () => {
    it('should process multiple entities independently', () => {
      const entity1 = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      const entity2 = entityManager.createEntity(TimeComponent.create(Time.create(200)));
      const entity3 = entityManager.createEntity(TimeComponent.create(Time.create(300)));
      
      timeSystem.update(0.5); // +5 years each
      
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(105);
      expect(entity2.getComponent(TimeComponent).getTime().getYear()).toBe(205);
      expect(entity3.getComponent(TimeComponent).getTime().getYear()).toBe(305);
    });

    it('should handle entities added during simulation', () => {
      // Start with one entity
      const entity1 = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(0.1); // +1 year
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(101);
      
      // Add second entity mid-simulation
      const entity2 = entityManager.createEntity(TimeComponent.create(Time.create(500)));
      
      timeSystem.update(0.2); // +2 years to both
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(103);
      expect(entity2.getComponent(TimeComponent).getTime().getYear()).toBe(502);
    });

    it('should handle empty entity list gracefully', () => {
      // Create entity then destroy it
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      entityManager.destroyEntity(entity.getId());
      
      expect(() => timeSystem.update(0.5)).not.toThrow();
    });
  });

  describe('time advancement consistency', () => {
    it('should maintain consistent time advancement rate', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(0)));
      
      // Multiple small updates should equal one large update
      timeSystem.update(0.1);
      timeSystem.update(0.1);
      timeSystem.update(0.1);
      timeSystem.update(0.1);
      timeSystem.update(0.1);
      
      // 5 * 0.1 * 10 = 5 years
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(5);
    });

    it('should handle fractional year accumulation with rounding', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(1000)));
      
      // Test multiple small fractional updates that round to zero
      for (let i = 0; i < 10; i++) {
        timeSystem.update(0.03); // 0.03 * 10 = 0.3 years each, rounds to 0
      }
      
      // Since each 0.3 year addition rounds to 0, total remains 1000
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1000);
    });
  });

  describe('boundary conditions', () => {
    it('should handle time starting at zero', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(0)));
      
      timeSystem.update(0.1);
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1);
    });

    it('should handle negative starting years', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(-1000)));
      
      timeSystem.update(0.5); // +5 years
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(-995);
    });

    it('should handle crossing zero boundary', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(-2)));
      
      timeSystem.update(0.5); // +5 years: -2 + 5 = 3
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(3);
    });

    it('should handle large year values', () => {
      const largeYear = 999999990;
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(largeYear)));
      
      timeSystem.update(0.1); // +1 year
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(largeYear + 1);
    });
  });

  describe('system constants and behavior', () => {
    it('should use the correct YEARS_PER_SECOND constant', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test that 1 second = 10 years (YEARS_PER_SECOND = 10)
      timeSystem.update(1.0);
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(110);
    });

    it('should create new Time instances (immutability)', () => {
      const originalTime = Time.create(100);
      const entity = entityManager.createEntity(TimeComponent.create(originalTime));
      
      timeSystem.update(0.1);
      
      const updatedTime = entity.getComponent(TimeComponent).getTime();
      
      // Should be a different Time instance
      expect(updatedTime).not.toBe(originalTime);
      expect(originalTime.getYear()).toBe(100); // Original unchanged
      expect(updatedTime.getYear()).toBe(101); // New instance updated
    });
  });

  describe('precision and rounding', () => {
    it('should round half-up consistently', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test 0.5 rounds up to 1
      entity.getComponent(TimeComponent).setTime(Time.create(100));
      timeSystem.update(0.05); // 0.05 * 10 = 0.5
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(101);
      
      // Test 1.5 rounds up to 2  
      entity.getComponent(TimeComponent).setTime(Time.create(100));
      timeSystem.update(0.15); // 0.15 * 10 = 1.5
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(102);
    });

    it('should handle floating point precision issues', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test values that might cause floating point precision issues
      timeSystem.update(0.1 + 0.2); // JavaScript: 0.1 + 0.2 = 0.30000000000000004
      
      // Should still work correctly: (0.1 + 0.2) * 10 ≈ 3
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(103);
    });
  });
});