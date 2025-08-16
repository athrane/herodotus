import { System } from '../ecs/System';
import { TimeComponent } from './TimeComponent';
import { Time } from './Time';
import type { Entity } from '../ecs/Entity';
import type { EntityManager } from '../ecs/EntityManager';

// Defines how many simulation years pass for each real-time second.
const YEARS_PER_SECOND = 10;

/**
 * A system that advances the simulation's global time.
 * It processes all entities with a TimeComponent and updates their time based on the delta time.
 */
export class TimeSystem extends System {
  /**
   * @param entityManager The entity manager instance.
   */
  constructor(entityManager: EntityManager) {
    // This system will process all entities that have a TimeComponent.
    super(entityManager, [TimeComponent]);
  }

  /**
   * Processes a time-based entity.
   * @param entity The entity to process.
   * @param deltaTime - The time elapsed since the last frame in seconds.
   */
  processEntity(entity: Entity, deltaTime: number): void {
    const timeComponent = entity.getComponent(TimeComponent)!; // Safe because system only processes entities with TimeComponent
    const currentTime = timeComponent.getTime();

    const yearsToAdd = deltaTime * YEARS_PER_SECOND;
    const newYear = Math.round(currentTime.getYear() + yearsToAdd);

    // Create a new Time object to maintain immutability and update the component.
    timeComponent.setTime(Time.create(newYear));
  }
}