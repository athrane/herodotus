import { System } from '../ecs/System';
import { TimeComponent } from './TimeComponent';
import { Time } from './Time';
import type { Entity } from '../ecs/Entity';
import type { EntityManager } from '../ecs/EntityManager';

/**
 * A system that advances the simulation's global time.
 * It processes all entities with a TimeComponent and updates their time based on the delta time.
 * The system uses a fixed timestep for time progression.
 * One second of real time corresponds to 10 years of simulation time.
 */
export class TimeSystem extends System {

  /**
   * Time acceleration factor, making One second of real time corresponds to 10 years of simulation time.
   */
  private static TIME_ACCELERATION = 10;

  /**
   * Raw simulation time in seconds.
   */
  private rawSimulationTime: number;

  /**
   * @param entityManager The entity manager instance.
   */
  constructor(entityManager: EntityManager) {
    // This system will process all entities that have a TimeComponent.
    super(entityManager, [TimeComponent]);
    this.rawSimulationTime = 0;
  }

  /**
   * Processes a time-based entity.
   * @param entity The entity to process.
   * @param deltaTime - The time elapsed since the last frame in seconds.
   */
  processEntity(entity: Entity, deltaTime: number): void {
    const timeComponent = entity.getComponent(TimeComponent)!; // Safe because system only processes entities with TimeComponent

    // Update the raw simulation time in seconds
    this.rawSimulationTime += deltaTime;

    // Calculate the year based on raw simulation time
    const newYear = Math.floor(this.rawSimulationTime * TimeSystem.TIME_ACCELERATION);

    // Create a new Time object to maintain immutability and update the component.
    timeComponent.setTime(Time.create(newYear));
  }
}