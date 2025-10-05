import { TypeUtils } from '../util/TypeUtils';
import { Component } from '../ecs/Component';
import { ChronicleEvent } from './ChronicleEvent';

/**
 * A component to store a chronicle of significant historical events.
 * Typically attached to the primary World entity.
 */
export class ChronicleComponent extends Component {
  /** Internal list of events (ChronicleEvent instances only). */
  private events: ChronicleEvent[] = [];
  private static nullInstance: ChronicleComponent | null = null;

  /**
   * @param events - Initial events to seed the component with.
   *                 Accepts only ChronicleEvent instances.
   */
  constructor(events: ChronicleEvent[] = []) {
    super();
    TypeUtils.ensureArray(events, 'ChronicleComponent events must be an array.');
    for (const event of events) {
      this.addEvent(event);
    }
  }

  /**
   * Returns a null object instance of ChronicleComponent.
   * This instance serves as a safe, neutral placeholder when a ChronicleComponent is not available.
   * @returns A null ChronicleComponent instance with empty events array.
   */
  static get Null(): ChronicleComponent {
    if (!ChronicleComponent.nullInstance) {
      const instance = Object.create(ChronicleComponent.prototype);
      instance.events = [];
      Object.freeze(instance);
      ChronicleComponent.nullInstance = instance;
    }
    return ChronicleComponent.nullInstance!;
  }

  /**
   * Adds a new event to the chronicle.
   * Accepts only ChronicleEvent instances.
   */
  addEvent(event: ChronicleEvent): void {
    TypeUtils.ensureInstanceOf(event, ChronicleEvent);
    this.events.push(event);
  }

  /** Creates a ChronicleComponent instance. */
  static create(events: ChronicleEvent[] = []): ChronicleComponent {
    return new ChronicleComponent(events);
  }

  /** Retrieves the list of events (read-only view). */
  getEvents(): ReadonlyArray<ChronicleEvent> {
    return Object.freeze([...this.events]);
  }
}
