import { TypeUtils } from '../util/TypeUtils';
import { Component } from '../ecs/Component';
import { ChronicleEvent } from './ChronicleEvent';

/**
 * A component to store a logbook of significant historical events.
 * Typically attached to the primary World entity.
 */
export class ChronicleEventComponent extends Component {
  /** Internal list of events (ChronicleEvent instances only). */
  private events: ChronicleEvent[] = [];

  /**
   * @param events - Initial events to seed the component with.
   *                 Accepts only ChronicleEvent instances.
   */
  constructor(events: ChronicleEvent[] = []) {
    super();
    TypeUtils.ensureArray(events, 'ChronicleEventComponent events must be an array.');
    for (const event of events) {
      this.addEvent(event);
    }
  }

  /**
   * Adds a new event to the chronicle.
   * Accepts only ChronicleEvent instances.
   */
  addEvent(event: ChronicleEvent): void {
    TypeUtils.ensureInstanceOf(event, ChronicleEvent);
    this.events.push(event);
  }

  /** Creates a ChronicleEventComponent instance. */
  static create(events: ChronicleEvent[] = []): ChronicleEventComponent {
    return new ChronicleEventComponent(events);
  }

  /** Retrieves the list of events (read-only view). */
  getEvents(): ReadonlyArray<ChronicleEvent> {
    return Object.freeze([...this.events]);
  }
}
