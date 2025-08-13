import { TimeSystem } from '../../src/time/TimeSystem.js';
import { EntityManager } from '../../src/ecs/EntityManager';
import { TimeComponent } from '../../src/time/TimeComponent.js';
import { Time } from '../../src/time/Time.js';
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

  it('should handle floating point year values correctly', () => {
    const entity = entityManager.createEntity(TimeComponent.create(Time.create(50.25)));
    timeSystem.update(0.1); // Adds 1 year (0.1 * 10)
    expect(entity.getComponent(TimeComponent).getTime().getYear()).toBe(51.25);
  });
});