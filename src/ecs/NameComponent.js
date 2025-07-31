import { Component } from '../ecs/Component.js';
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * A component that provides a human-readable name .
 */
export class NameComponent extends Component {
  /**
   * @type {string}
   */
  #text;

  /**
   * Creates an instance of NameComponent.
   * @param {string} text - The name or description for the entity.
   */
  constructor(text) {
    super();
    TypeUtils.ensureString(text, 'Description text must be a string.');
    this.#text = text;
  }

  /**
   * Gets the description text.
   * @returns {string} The description text.
   */
  getText() {
    return this.#text;
  }

  /**
   * Creates a new instance of NameComponent.
   * @param {string} text - The name or description for the entity.
   * @returns {NameComponent} A new NameComponent instance.
   */
  static create(text) {
    return new NameComponent(text);
  }
}