import { Entity } from './Entity.js';
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * Manages the lifecycle of entities in the ECS architecture.
 * It is responsible for creating, retrieving, destroying, and querying entities.
 */
export class EntityManager {
  #entities;

  constructor() {
    this.#entities = new Map();
  }

  /**
   * Creates a new entity with a unique ID.
   * @param {...Component} components - A list of components to attach to the entity upon creation.
   * @returns {Entity} The newly created entity.
   */
  createEntity(...components) {
    const entity = Entity.create(...components);
    this.#entities.set(entity.getId(), entity);
    return entity;
  }

  /**
   * Retrieves an entity by its ID.
   * @param {string} id The ID of the entity to retrieve.
   * @returns {Entity|undefined} The entity if found, otherwise undefined.
   */
  getEntity(id) {
    TypeUtils.ensureString(id);
    return this.#entities.get(id);
  }

  /**
   * Destroys an entity, removing it from the manager.
   * @param {string} id The ID of the entity to destroy.
   * @returns {boolean} True if the entity was found and destroyed, false otherwise.
   */
  destroyEntity(id) {
    TypeUtils.ensureString(id);
    return this.#entities.delete(id);
  }

  /**
   * Finds all entities that possess a given set of components.
   * If no component classes are provided, it returns all entities.
   * 
   * @example // Get all entities with PositionComponent and VelocityComponent
   * entityManager.getEntitiesWithComponents(PositionComponent, VelocityComponent);
   * 
   * @param {...Function} componentClasses The component classes to query for.
   * @returns {Entity[]} An array of entities that have all the specified components.
   */
  getEntitiesWithComponents(...componentClasses) {
    const allEntities = [...this.#entities.values()];
    if (componentClasses.length === 0) {
      return allEntities;
    }

    return allEntities.filter(entity => {
      for (const componentClass of componentClasses) {
        if (!entity.hasComponent(componentClass)) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Retrieves a component from an entity that is expected to be a "singleton"
   * for that component type. A singleton component is a component that is expected
   * to exist on only one entity in the entire manager.
   *
   * This method is useful for accessing global or system-wide components,
   * such as TimeComponent or WorldComponent, without needing to know which
   * entity they are attached to.
   *
   * @param {Function} componentClass - The class of the component to retrieve.
   * @returns {Component|undefined} The singleton component instance, or undefined if no entity has it.
   * @throws {Error} If more than one entity has the specified component.
   */
  getSingletonComponent(componentClass) {
    const entities = this.getEntitiesWithComponents(componentClass);

    if (entities.length > 1) {
      throw new Error(
        `Expected to find one entity with ${componentClass.name} but found ${entities.length}.`
      );
    }

    if (entities.length === 0) {
      return undefined;
    }

    // return first entity with the specified component
    return entities[0].getComponent(componentClass);
  }

  /**
   * Returns the total number of entities currently managed.
   * @returns {number} The number of entities.
   */
  count() {
    return this.#entities.size;
  }

  /**
   * Creates a new instance of EntityManager.
   * This static factory method provides a standardized way to construct EntityManager objects.
   * @returns {EntityManager} A new instance of EntityManager.
   */
  static create() {
    return new EntityManager();
  }

}