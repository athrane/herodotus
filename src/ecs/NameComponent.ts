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
  private static nullInstance: NameComponent | null = null;

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
   * Returns a null object instance of NameComponent.
   * This instance serves as a safe, neutral placeholder when a NameComponent is not available.
   * @returns A null NameComponent instance with empty string text.
   */
  static get Null(): NameComponent {
    if (!NameComponent.nullInstance) {
      const instance = Object.create(NameComponent.prototype);
      instance.text = '';
      Object.freeze(instance);
      NameComponent.nullInstance = instance;
    }
    return NameComponent.nullInstance!;
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