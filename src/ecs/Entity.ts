import { TypeUtils } from '../util/TypeUtils';
import { Component } from './Component';

/**
 * Represents an entity in the Entity-Component-System (ECS) architecture.
 * An entity is essentially a container for components, identified by a unique ID.
 * It acts as a lightweight wrapper that groups various components, which hold the actual data.
 *
 * Component matching behavior:
 * - hasComponent(Foo) returns true if the entity has a Foo component OR any subclass of Foo (instanceof semantics).
 * - getComponent(Foo) prefers an exact Foo instance when present; otherwise returns the first component that is an instance of Foo (e.g., a subclass).
 * - Systems that require [Foo] will process entities with Foo or subclasses. Use guards inside processEntity if stricter filtering is needed.
 */
export class Entity {
  private readonly id: string;
  private readonly components: Map<string, Component>;

  /**
   * Do not instantiate Entity directly. Use an EntityManager to create entities.
   * @param components - A list of components to attach to the entity upon creation.
   */
  constructor(...components: Component[]) {
  this.id = crypto.randomUUID();
  this.components = new Map();

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
  return this.id;
  }

  /**
   * Adds a component to the entity. If a component of the same type already exists, it will be replaced.
   * @param component The component instance to add. The component must be a non-null object with a constructor.
   * @returns The entity instance for chaining.
   */
  addComponent(component: Component): Entity {
    TypeUtils.ensureInstanceOf(component, Component);

    // The key is the component's constructor name (its type).
  this.components.set(component.constructor.name, component);
    return this;
  }

  /**
   * Retrieves a component from the entity by its class.
  * Matching rules:
  * - Exact class match is preferred when available.
  * - If no exact match is found, the first component that is an instanceof the requested class is returned.
  * @param ComponentClass The class (constructor function) of the component to retrieve.
  * @returns The component instance (exact or subclass), or undefined if not found.
   */
  getComponent<T extends Component>(ComponentClass: new (...args: any[]) => T): T | undefined {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    // Prefer exact match if present
    const exact = this.components.get(ComponentClass.name) as T | undefined;
    if (exact) return exact;

    // Fallback: return the first component that is an instance of the requested class (supports inheritance)
    for (const comp of this.components.values()) {
      if (comp instanceof ComponentClass) {
        return comp as T;
      }
    }
    return undefined;
  }

  /**
   * Checks if the entity has a component of a given class.
  * Uses instanceof semantics: returns true for exact type or any subclass instance.
  * @param ComponentClass The class (constructor function) of the component to check for.
  * @returns True if a matching component exists, false otherwise.
   */
  hasComponent(ComponentClass: new (...args: any[]) => Component): boolean {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    if (this.components.has(ComponentClass.name)) return true;
    for (const comp of this.components.values()) {
      if (comp instanceof ComponentClass) return true;
    }
    return false;
  }

  /**
   * Removes a component from the entity by its class.
   * @param ComponentClass The class (constructor function) of the component to remove.
   * @returns True if a component was removed, false otherwise.
   */
  removeComponent(ComponentClass: new (...args: any[]) => Component): boolean {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
  return this.components.delete(ComponentClass.name);
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