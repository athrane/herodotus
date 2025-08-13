import { TypeUtils } from '../util/TypeUtils';
import { EntityManager } from './EntityManager';
import { Entity } from './Entity';
import { Component } from './Component';

/**
 * A base class for all systems in the Entity-Component-System (ECS) architecture.
 * Systems contain the logic that operates on entities possessing a specific set of components.
 */
export class System {
  readonly #entityManager: EntityManager;
  readonly #requiredComponents: Array<new (...args: any[]) => Component>;

  /**
   * @param entityManager The entity manager instance.
   * @param requiredComponents An array of component classes that an entity must have for this system to process it.
   */
  constructor(entityManager: EntityManager, requiredComponents: Array<new (...args: any[]) => Component> = []) {
    TypeUtils.ensureInstanceOf(entityManager, EntityManager);
    TypeUtils.ensureArray(requiredComponents, 'requiredComponents must be an array.');

    this.#entityManager = entityManager;
    this.#requiredComponents = requiredComponents;
  }

  /**
   * The main update loop for the system.
   * This method retrieves all relevant entities and calls the processEntity method for each one.
   * Concrete systems can override this for more complex update logic if needed.
   * @param args Additional arguments to pass to the processEntity method.
   */
  update(...args: any[]): void {
    const entities = this.#entityManager.getEntitiesWithComponents(...this.#requiredComponents);
    for (const entity of entities) {
      this.processEntity(entity, ...args);
    }
  }

  /**
   * Get the (private) entity manager associated with this system.
   * @returns The entity manager instance associated with this system.
   */
  getEntityManager(): EntityManager {
    return this.#entityManager;
  }

  /**
   * Processes a single entity. This method is intended to be overridden by concrete system implementations.
   * @param entity The entity to process.
   * @param args Additional arguments passed from the update method.
   * @abstract
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  processEntity(entity: Entity, ...args: any[]): void {
    throw new Error('System.processEntity() must be implemented by a subclass.');
  }
}