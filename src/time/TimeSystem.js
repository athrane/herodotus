import { System } from '../ecs/System.js';
import { TimeComponent } from '../../src/time/TimeComponent.js';
import { Time } from '../time/Time.js';

// Defines how many simulation years pass for each real-time second.
const YEARS_PER_SECOND = 10;

/**
 * A system that advances the simulation's global time.
 * It processes all entities with a TimeComponent and updates their time based on the delta time.
 */
export class TimeSystem extends System {
  /**
   * @param {EntityManager} entityManager The entity manager instance.
   */
  constructor(entityManager) {
    // This system will process all entities that have a TimeComponent.
    super(entityManager, [TimeComponent]);
  }

  /**
   * Processes a time-based entity.
   * @param {Entity} entity The entity to process.
   * @param {number} deltaTime - The time elapsed since the last frame in seconds.
   */
  processEntity(entity, deltaTime) {
    const timeComponent = entity.getComponent(TimeComponent);
    const currentTime = timeComponent.getTime();

    const yearsToAdd = deltaTime * YEARS_PER_SECOND;
    const newYear = currentTime.getYear() + yearsToAdd;

    // Create a new Time object to maintain immutability and update the component.
    timeComponent.setTime(Time.create(newYear));
  }
}