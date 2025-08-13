import { TypeUtils } from '../util/TypeUtils';
import { Component } from '../ecs/Component';
import { ChronicleEvent } from './ChronicleEvent';

/**
 * A component to store a logbook of significant historical events.
 * Typically attached to the primary World entity.
 */
export class ChronicleEventComponent extends Component {
  /** Internal list of events (ChronicleEvent or plain objects during migration). */
  private events: Array<ChronicleEvent | Record<string, unknown>> = [];

  /**
   * @param events - Initial events to seed the component with.
   *                 Accepts ChronicleEvent instances or plain objects.
   */
  constructor(events: Array<ChronicleEvent | Record<string, unknown>> = []) {
    super();
    TypeUtils.ensureArray(events, 'ChronicleEventComponent events must be an array.');
    for (const event of events) {
      this.addEvent(event);
    }
  }

  /**
   * Adds a new event to the chronicle.
   * Accepts ChronicleEvent instances, but also tolerates plain objects produced by systems.
   */
  addEvent(event: ChronicleEvent | Record<string, unknown>): void {
    if (event instanceof ChronicleEvent) {
      this.events.push(event);
      return;
    }
    // Fallback: accept any object and store it as-is to keep simulation running.
    this.events.push(event);
  }

  /** Creates a ChronicleEventComponent instance. */
  static create(events: Array<ChronicleEvent | Record<string, unknown>> = []): ChronicleEventComponent {
    return new ChronicleEventComponent(events);
  }

  /** Retrieves the list of events (read-only view). */
  getEvents(): ReadonlyArray<ChronicleEvent | Record<string, unknown>> {
    return this.events;
  }
}
