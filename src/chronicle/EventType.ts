import { TypeUtils } from '../util/TypeUtils';
import { EventCategory } from './EventCategory';

/**
 * Represents the type of a historical event, including its category and specific name.
 */
export class EventType {
  private readonly category: string;
  private readonly name: string;
  private static nullInstance: EventType | null = null;

  /**
   * Creates an instance of EventType.
   *
   * @param category - The category of the event (one of the values from EventCategory).
   * @param name - The specific name of the event (e.g., 'Battle', 'Plague').
   * @throws {TypeError} If inputs are not strings or category is not a valid EventCategory value.
   */
  constructor(category: string, name: string) {
    TypeUtils.ensureString(category, 'EventType category must be a string.');
    TypeUtils.ensureString(name, 'EventType name must be a string.');

    const categories = Object.values(EventCategory) as string[];
    if (!categories.includes(category)) {
      throw new TypeError(`Invalid event category: ${category}`);
    }

    this.category = category;
    this.name = name;
    Object.freeze(this);
  }

  /**
   * Gets the category of the event.
   * @returns {string}
   */
  getCategory(): string {
    return this.category;
  }

  /**
   * Gets the specific name of the event.
   * @returns {string}
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns a null object instance of EventType.
   * This instance serves as a safe, neutral placeholder when an EventType is not available.
   * @returns A null EventType instance with Social category and empty name.
   */
  static get Null(): EventType {
    if (!EventType.nullInstance) {
      const instance = Object.create(EventType.prototype);
      instance.category = EventCategory.SOCIAL;
      instance.name = '';
      Object.freeze(instance);
      EventType.nullInstance = instance;
    }
    return EventType.nullInstance!;
  }

  /**
   * Creates a new EventType instance.
   *
   * @param category - The category of the event (one of the values from EventCategory).
   * @param name - The specific name of the event.
   * @returns {EventType}
   */
  static create(category: string, name: string): EventType {
    return new EventType(category, name);
  }
}
