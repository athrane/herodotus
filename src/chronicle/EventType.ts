import { TypeUtils } from '../util/TypeUtils';
import { EventCategory } from './EventCategory.js';

/**
 * Represents the type of a historical event, including its category and specific name.
 */
export class EventType {
  private readonly category: string;
  private readonly name: string;

  /**
   * Creates an instance of EventType.
   * @param category - The category of the event (from EventCategory).
   * @param name - The specific name of the event (e.g., 'Battle', 'Plague').
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

  /** Gets the category of the event. */
  getCategory(): string {
    return this.category;
  }

  /** Gets the name of the event. */
  getName(): string {
    return this.name;
  }

  /**
   * Creates a new EventType instance.
   */
  static create(category: string, name: string): EventType {
    return new EventType(category, name);
  }
}
