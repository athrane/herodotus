import { Event } from './Event';

/**
 * Component holding all loaded Event data (immutable snapshot at load time).
 * Stored internally as a Map keyed by EventTrigger.
 */
export class DataEventComponent {

  /**
   * Map of EventTrigger to Event.
   */
  private readonly eventMap: Map<string, Event>;

  /**
   * Immutable array of all Events.
   */
  private readonly events: ReadonlyArray<Event>;

  /**
   * Private constructor to enforce usage of factory method.
   */
  private constructor(events: Event[]) {
    if (!Array.isArray(events)) throw new Error('events must be an array');
    const map = new Map<string, Event>();
    for (const e of events) {
      if (!(e instanceof Event)) throw new Error('All items must be Event instances');
      if (typeof e.EventTrigger !== 'string' || !e.EventTrigger) {
        throw new Error('Each Event must have a non-empty EventTrigger string');
      }
      if (!map.has(e.EventTrigger)) {
        map.set(e.EventTrigger, e);
      }
    }
    this.eventMap = map;
    this.events = Object.freeze(Array.from(map.values()));
  }

  /** Get immutable array snapshot of events */
  getEvents(): ReadonlyArray<Event> {
    return this.events;
  }

  /** Get underlying map (do not mutate) */
  getEventMap(): ReadonlyMap<string, Event> {
    return this.eventMap;
  }

  /** Retrieve an Event by its EventTrigger */
  getByTrigger(trigger: string): Event | undefined {
    if (typeof trigger !== 'string') throw new Error('trigger must be a string');
    return this.eventMap.get(trigger);
  }

  /** Filter events by predicate */
  find(predicate: (e: Event) => boolean): Event[] {
    if (typeof predicate !== 'function') throw new Error('predicate must be a function');
    return this.events.filter(predicate);
  }

  /**
   * Factory method to create a DataEventComponent.
   * @param events - Array of Event instances.
   * @returns A new DataEventComponent instance.
   */
  public static create(events: Event[]): DataEventComponent {
    return new DataEventComponent(events);
  }

}
