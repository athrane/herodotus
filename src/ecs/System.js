import { TypeUtils } from '../util/TypeUtils.js';
import { EntityManager } from './EntityManager.js';

/**
 * A base class for all systems in the Entity-Component-System (ECS) architecture.
 * Systems contain the logic that operates on entities possessing a specific set of components.
 */
export class System {
  #entityManager;
  #requiredComponents;

  /**
   * @param {EntityManager} entityManager The entity manager instance.
   * @param {Function[]} [requiredComponents=[]] An array of component classes that an entity must have for this system to process it.
   */
  constructor(entityManager, requiredComponents = []) {
    TypeUtils.ensureInstanceOf(entityManager, EntityManager, 'entityManager must be an instance of EntityManager.');
    TypeUtils.ensureArray(requiredComponents, 'requiredComponents must be an array.');

    this.#entityManager = entityManager;
    this.#requiredComponents = requiredComponents;
  }

  /**
   * The main update loop for the system.
   * This method retrieves all relevant entities and calls the processEntity method for each one.
   * Concrete systems can override this for more complex update logic if needed.
   * @param {...any} args Additional arguments to pass to the processEntity method.
   */
  update(...args) {
    const entities = this.#entityManager.getEntitiesWithComponents(...this.#requiredComponents);
    for (const entity of entities) {
      this.processEntity(entity, ...args);
    }
  }

  /**
   * Get the (private) entity manager associated with this system.
   * @returns {EntityManager} The entity manager instance associated with this system.
   */
  getEntityManager() {
    return this.#entityManager;
  }

  /**
   * Processes a single entity. This method is intended to be overridden by concrete system implementations.
   * @param {Entity} entity The entity to process.
   * @param {...any} args Additional arguments passed from the update method.
   * @abstract
   */
  processEntity(entity, ...args) {
    throw new Error('System.processEntity() must be implemented by a subclass.');
  }
}