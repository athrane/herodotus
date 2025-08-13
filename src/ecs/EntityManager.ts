import { Entity } from './Entity';
import { Component } from './Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Manages the lifecycle of entities in the ECS architecture.
 * It is responsible for creating, retrieving, destroying, and querying entities.
 */
export class EntityManager {
  readonly #entities: Map<string, Entity>;

  constructor() {
    this.#entities = new Map();
  }

  /**
   * Creates a new entity with a unique ID.
   * @param components - A list of components to attach to the entity upon creation.
   * @returns The newly created entity.
   */
  createEntity(...components: Component[]): Entity {
    const entity = Entity.create(...components);
    this.#entities.set(entity.getId(), entity);
    return entity;
  }

  /**
   * Retrieves an entity by its ID.
   * @param id The ID of the entity to retrieve.
   * @returns The entity if found, otherwise undefined.
   */
  getEntity(id: string): Entity | undefined {
    TypeUtils.ensureString(id);
    return this.#entities.get(id);
  }

  /**
   * Destroys an entity, removing it from the manager.
   * @param id The ID of the entity to destroy.
   * @returns True if the entity was found and destroyed, false otherwise.
   */
  destroyEntity(id: string): boolean {
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
   * @param componentClasses The component classes to query for.
   * @returns An array of entities that have all the specified components.
   */
  getEntitiesWithComponents(...componentClasses: Array<new (...args: any[]) => Component>): Entity[] {
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
   * @param componentClass - The class of the component to retrieve.
   * @returns The singleton component instance, or undefined if no entity has it.
   * @throws If more than one entity has the specified component.
   */
  getSingletonComponent<T extends Component>(componentClass: new (...args: any[]) => T): T | undefined {
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
   * @returns The number of entities.
   */
  count(): number {
    return this.#entities.size;
  }

  /**
   * Creates a new instance of EntityManager.
   * This static factory method provides a standardized way to construct EntityManager objects.
   * @returns A new instance of EntityManager.
   */
  static create(): EntityManager {
    return new EntityManager();
  }

}