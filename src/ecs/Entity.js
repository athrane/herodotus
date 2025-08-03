import { TypeUtils } from '../util/TypeUtils.js';
import { Component } from './Component.js';

/**
 * Represents an entity in the Entity-Component-System (ECS) architecture.
 * An entity is essentially a container for components, identified by a unique ID.
 * It acts as a lightweight wrapper that groups various components, which hold the actual data.
 */
export class Entity {
  #id;
  #components;

  /**
   * Do not instantiate Entity directly. Use an EntityManager to create entities.
   * @param {...Component} components - A list of components to attach to the entity upon creation.
   */
  constructor(...components) {
    this.#id = crypto.randomUUID();
    this.#components = new Map();

    // Add each component to the entity.
    TypeUtils.ensureArray(components, 'components must be an array of Component instances.');

    for (const component of components) {
      this.add(component);
    }
  }

  /**
   * Creates a new Entity with the given components.
   * @param {...Component} components - A list of components to attach to the entity.
   * @returns {Entity} A new entity instance.
   */
  static create(...components) {
    return new Entity(...components);
  }

  /**
   * Gets the unique ID of the entity.
   * @returns {number} The entity's ID.
   */
  getId() {
    return this.#id;
  }

  /**
   * Adds a component to the entity. If a component of the same type already exists, it will be replaced.
   * @param {object} component The component instance to add. The component must be a non-null object with a constructor.
   * @returns {Entity} The entity instance for chaining.
   */
  add(component) {
    TypeUtils.ensureInstanceOf(component, Component, 'component must be an instance of Component.');

    // The key is the component's constructor name (its type).
    this.#components.set(component.constructor.name, component);
    return this;
  }

  /**
   * Retrieves a component from the entity by its class.
   * @param {Function} ComponentClass The class (constructor function) of the component to retrieve.
   * @returns {object|undefined} The component instance, or undefined if not found.
   */
  get(ComponentClass) {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.get(ComponentClass.name);
  }

  /**
   * Checks if the entity has a component of a given class.
   * @param {Function} ComponentClass The class (constructor function) of the component to check for.
   * @returns {boolean} True if the component exists, false otherwise.
   */
  hasComponent(ComponentClass) {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.has(ComponentClass.name);
  }

  /**
   * Removes a component from the entity by its class.
   * @param {Function} ComponentClass The class (constructor function) of the component to remove.
   * @returns {boolean} True if a component was removed, false otherwise.
   */
  remove(ComponentClass) {
    TypeUtils.ensureFunction(ComponentClass, 'ComponentClass must be a class constructor.');
    return this.#components.delete(ComponentClass.name);
  }
}