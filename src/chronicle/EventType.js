import { TypeUtils } from '../util/TypeUtils.js';
import { EventCategory } from './EventCategory.js';

/**
 * Represents the type of a historical event, including its category and specific name.
 */
export class EventType {
  /**
   * @type {string}
   */
  #category;

  /**
   * @type {string}
   */
  #name;

  /**
   * Creates an instance of EventType.
   * @param {string} category - The category of the event (from EventCategory).
   * @param {string} name - The specific name of the event (e.g., 'Battle', 'Plague').
   */
  constructor(category, name) {
    TypeUtils.ensureString(category, 'EventType category must be a string.');
    TypeUtils.ensureString(name, 'EventType name must be a string.');

    if (!Object.values(EventCategory).includes(category)) {
      throw new TypeError(`Invalid event category: ${category}`);
    }

    this.#category = category;
    this.#name = name;
  }

  /**
   * Gets the category of the event.
   * @returns {string}
   */
  getCategory() {
    return this.#category;
  }

  /**
   * Gets the name of the event.
   * @returns {string}
   */
  getName() {
    return this.#name;
  }

  /**
   * Creates a new EventType instance.
   * @param {string} category - The category of the event.
   * @param {string} name - The specific name of the event.
   * @returns {EventType}
   */
  static create(category, name) {
    return new EventType(category, name);
  }

}