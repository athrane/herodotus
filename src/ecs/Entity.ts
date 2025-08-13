import { TypeUtils } from '../util/TypeUtils';
import { Component } from './Component';

/**
 * Represents an entity in the Entity-Component-System (ECS) architecture.
 * An entity is essentially a container for components, identified by a unique ID.
 * It acts as a lightweight wrapper that groups various components, which hold the actual data.
 */
export class Entity {
  readonly #id: string;
  readonly #components: Map<string, Component>;

  /**
   * Do not instantiate Entity directly. Use an EntityManager to create entities.
   * @param components - A list of components to attach to the entity upon creation.
   */
  constructor(...components: Component[]) {
    this.#id = crypto.randomUUID();
    this.#components = new Map();

    // Add each component to the entity.
    TypeUtils.ensureArray(components);

    for (const component of components) {
      this.addComponent(component);
    }
  }

  /**
   * Gets the unique ID of the entity.
   * @returns The entity's ID.
   */
  getId(): string {
    return this.#id;
  }

  /**
   * Adds a component to the entity. If a component of the same type already exists, it will be replaced.
   * @param component The component instance to add. The component must be a non-null object with a constructor.
   * @returns The entity instance for chaining.
   */
  addComponent(component: Component): Entity {
    TypeUtils.ensureInstanceOf(component, Component);

    // The key is the component's constructor name (its type).
    this.#components.set(component.constructor.name, component);
    return this;
  }

  /**
   * Retrieves a component from the entity by its class.
   * @param ComponentClass The class (constructor function) of the component to retrieve.
   * @returns The component instance, or undefined if not found.
   */
  getComponent<T extends Component>(ComponentClass: new (...args: any[]) => T): T | undefined {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.get(ComponentClass.name) as T | undefined;
  }

  /**
   * Checks if the entity has a component of a given class.
   * @param ComponentClass The class (constructor function) of the component to check for.
   * @returns True if the component exists, false otherwise.
   */
  hasComponent(ComponentClass: new (...args: any[]) => Component): boolean {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.has(ComponentClass.name);
  }

  /**
   * Removes a component from the entity by its class.
   * @param ComponentClass The class (constructor function) of the component to remove.
   * @returns True if a component was removed, false otherwise.
   */
  removeComponent(ComponentClass: new (...args: any[]) => Component): boolean {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.delete(ComponentClass.name);
  }

  /**
   * Creates a new Entity with the given components.
   * @param components - A list of components to attach to the entity.
   * @returns A new entity instance.
   */
  static create(...components: Component[]): Entity {
    return new Entity(...components);
  }

}