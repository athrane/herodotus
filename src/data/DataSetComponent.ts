import { TypeUtils } from '../util/TypeUtils';
import { DataSetEvent } from './DataSetEvent';

/**
 * Component holding all loaded data set events (immutable snapshot at load time).
 * Stored internally as a Map keyed by EventTrigger.
 */
export class DataSetComponent {

  /**
   * Map of EventTrigger to DataSetEvent.
   */
  private readonly eventMap: Map<string, DataSetEvent>;

  /**
   * Immutable array of all Events.
   */
  private readonly events: ReadonlyArray<DataSetEvent>;

  /**
   * Private constructor to enforce usage of factory method.
   * @param events - Array of DataSetEvent instances.
   */
  private constructor(events: DataSetEvent[]) {
    // Narrow to DataSetEvent[] and validate shape of items
    TypeUtils.ensureArray<DataSetEvent>(events, 'events must be an array of DataSetEvent');
    const map = new Map<string, DataSetEvent>();

    for (const e of events as unknown[]) {
      // Keep an explicit instance check to preserve error semantics expected by tests
      TypeUtils.ensureInstanceOf<DataSetEvent>(e, DataSetEvent, 'All items must be DataSetEvent instances');
      const evt = e as DataSetEvent; // narrowed by assertion above
      TypeUtils.ensureNonEmptyString(evt.EventTrigger, 'Each DataSetEvent must have a non-empty EventTrigger string');
      
      // add if event with same trigger doesn't exist
      if (!map.has(evt.EventTrigger)) {
        map.set(evt.EventTrigger, evt);
      }
    }
    this.eventMap = map;
    this.events = Object.freeze(Array.from(map.values()));
  }

  /**
   * Get immutable array snapshot of events
   * @returns {ReadonlyArray<DataSetEvent>} - Immutable array of events
   */
  getEvents(): ReadonlyArray<DataSetEvent> {
    return this.events;
  }

  /** 
   * Get underlying map (do not mutate)
   * @returns {ReadonlyMap<string, DataSetEvent>} - Immutable map of events
   */
  getEventMap(): ReadonlyMap<string, DataSetEvent> {
    return this.eventMap;
  }

  /**
   * Retrieve an DataSetEvent by its EventTrigger
   * @param trigger - The EventTrigger string
   * @returns The DataSetEvent associated with the trigger, or undefined if not found
   */
  getByTrigger(trigger: string): DataSetEvent | undefined {
    TypeUtils.ensureString(trigger, 'trigger must be a string');
    return this.eventMap.get(trigger);
  }

  /**
   * Filter events by predicate
   * @param predicate - The function to test each event
   * @returns An array of events that match the predicate
   */
  find(predicate: (e: DataSetEvent) => boolean): DataSetEvent[] {
    TypeUtils.ensureFunction(predicate, 'predicate must be a function');
    return this.events.filter(predicate);
  }

  /**
   * Factory method to create a DataSetComponent.
   * @param events - Array of DataSetEvent instances.
   * @returns A new DataSetComponent instance.
   */
  public static create(events: DataSetEvent[]): DataSetComponent {
    return new DataSetComponent(events);
  }

}
