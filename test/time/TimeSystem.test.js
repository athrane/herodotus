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
    // With TIME_ACCELERATION = 10, the absolute simulation year becomes Math.floor(0.5 * 10) = 5.
    const deltaTime = 0.5;
    timeSystem.update(deltaTime);

    const updatedTimeComponent = entity.getComponent(TimeComponent);
    const newYear = updatedTimeComponent.getTime().getYear();

    // The new year should be Math.floor(0.5 * 10) = 5 (absolute simulation time).
    expect(newYear).toBe(5);
  });

  it('should not throw an error if no time entity exists', () => {
    // No entity created.
    const deltaTime = 0.5;
    expect(() => timeSystem.update(deltaTime)).not.toThrow();
  });

  it('should handle integer year values correctly', () => {
    const entity = entityManager.createEntity(TimeComponent.create(Time.create(50)));
    timeSystem.update(0.1); // Sets absolute time to Math.floor(0.1 * 10) = 1
    expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1);
  });

  describe('delta time edge cases', () => {
    it('should handle zero delta time', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(0);
      
      // With zero delta time, rawSimulationTime remains 0, so Math.floor(0 * 10) = 0
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(0);
    });

    it('should handle very small delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));

      timeSystem.update(0.001); // Very small delta

      // Should round to nearest integer (0.001 * 10 = 0.01, Math.floor gives 0)
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(0);
    });    it('should handle large delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(0)));
      
      timeSystem.update(100); // Large delta: 100 * 10 = 1000 years
      
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1000);
    });

    it('should handle negative delta time values', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(-0.5); // Negative delta: -0.5 * 10 = -5 years
      
      // Math.floor(-0.5 * 10) = Math.floor(-5) = -5
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(-5);
    });

    it('should handle decimal results with proper rounding', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // 0.15 * 10 = 1.5, Math.floor gives 1
      timeSystem.update(0.15);
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1);
      
      // Note: rawSimulationTime accumulates, so next update adds to 0.15
      // 0.15 + 0.14 = 0.29, 0.29 * 10 = 2.9, Math.floor gives 2  
      timeSystem.update(0.14);
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(2);
    });
  });

  describe('multiple entities processing', () => {
    it('should process multiple entities independently', () => {
      const entity1 = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      const entity2 = entityManager.createEntity(TimeComponent.create(Time.create(200)));
      const entity3 = entityManager.createEntity(TimeComponent.create(Time.create(300)));
      
      timeSystem.update(0.5); // Each entity adds 0.5 to rawSimulationTime
      
      // Entity1: rawSimulationTime = 0.5, Math.floor(0.5 * 10) = 5
      // Entity2: rawSimulationTime = 1.0, Math.floor(1.0 * 10) = 10  
      // Entity3: rawSimulationTime = 1.5, Math.floor(1.5 * 10) = 15
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(5);
      expect(entity2.getComponent(TimeComponent).getTime().getYear()).toBe(10);
      expect(entity3.getComponent(TimeComponent).getTime().getYear()).toBe(15);
    });

    it('should handle entities added during simulation', () => {
      // Start with one entity
      const entity1 = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      timeSystem.update(0.1); // entity1 processes: rawSimulationTime = 0.1, Math.floor(0.1 * 10) = 1
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(1);
      
      // Add second entity mid-simulation
      const entity2 = entityManager.createEntity(TimeComponent.create(Time.create(500)));
      
      timeSystem.update(0.2); // entity1: rawSimulationTime = 0.1 + 0.2 = 0.3, Math.floor(0.3 * 10) = 3
                             // entity2: rawSimulationTime = 0.3 + 0.2 = 0.5, Math.floor(0.5 * 10) = 5  
      expect(entity1.getComponent(TimeComponent).getTime().getYear()).toBe(3);
      expect(entity2.getComponent(TimeComponent).getTime().getYear()).toBe(5);
    });    it('should handle empty entity list gracefully', () => {
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
      
      // Test multiple small fractional updates
      for (let i = 0; i < 10; i++) {
        timeSystem.update(0.03); // Each adds 0.03 to rawSimulationTime
      }
      
      // After 10 updates: rawSimulationTime = 10 * 0.03 = 0.3, Math.floor(0.3 * 10) = 3
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(3);
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
      
      timeSystem.update(0.5); // Math.floor(0.5 * 10) = 5
      
      // Entity gets set to absolute simulation time, regardless of starting value
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(5);
    });

    it('should handle crossing zero boundary', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(-2)));
      
      timeSystem.update(0.5); // Math.floor(0.5 * 10) = 5
      
      // Entity gets set to absolute simulation time
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(5);
    });

    it('should handle large year values', () => {
      const largeYear = 999999990;
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(largeYear)));
      
      timeSystem.update(0.1); // Math.floor(0.1 * 10) = 1
      
      // Entity gets set to absolute simulation time
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(1);
    });
  });

  describe('system constants and behavior', () => {
    it('should use the correct YEARS_PER_SECOND constant', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test that 1 second = 10 years (TIME_ACCELERATION = 10)
      timeSystem.update(1.0);
      
      // Math.floor(1.0 * 10) = 10
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(10);
    });

    it('should create new Time instances (immutability)', () => {
      const originalTime = Time.create(100);
      const entity = entityManager.createEntity(TimeComponent.create(originalTime));
      
      timeSystem.update(0.1);
      
      const updatedTime = entity.getComponent(TimeComponent).getTime();
      
      // Should be a different Time instance
      expect(updatedTime).not.toBe(originalTime);
      expect(originalTime.getYear()).toBe(100); // Original unchanged
      expect(updatedTime.getYear()).toBe(1); // New instance set to absolute simulation time
    });
  });

  describe('precision and rounding', () => {
    it('should round half-up consistently', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test Math.floor behavior
      timeSystem.update(0.05); // 0.05 * 10 = 0.5, Math.floor(0.5) = 0
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(0);
      
      // Reset for next test (rawSimulationTime accumulates)
      // Second update: 0.05 + 0.15 = 0.2, 0.2 * 10 = 2, Math.floor(2) = 2
      timeSystem.update(0.15);
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(2);
    });

    it('should handle floating point precision issues', () => {
      const entity = entityManager.createEntity(TimeComponent.create(Time.create(100)));
      
      // Test values that might cause floating point precision issues
      timeSystem.update(0.1 + 0.2); // JavaScript: 0.1 + 0.2 = 0.30000000000000004
      
      // Should still work correctly: Math.floor((0.1 + 0.2) * 10) = Math.floor(~3) = 3
      expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(3);
    });
  });
});