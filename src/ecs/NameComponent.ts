import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A component that provides a human-readable name .
 */
export class NameComponent extends Component {
  /**
   * @type {string}
   */
  private readonly text: string;

  /**
   * Creates an instance of NameComponent.
   * @param text - The name or description for the entity.
   */
  constructor(text: string) {
    super();
    TypeUtils.ensureString(text, 'Description text must be a string.');
  this.text = text;
  }

  /**
   * Gets the description text.
   * @returns The description text.
   */
  getText(): string {
  return this.text;
  }

  /**
   * Creates a new instance of NameComponent.
   * @param text - The name or description for the entity.
   * @returns A new NameComponent instance.
   */
  static create(text: string): NameComponent {
    return new NameComponent(text);
  }
}