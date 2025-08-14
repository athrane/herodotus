import { Event } from './Event';

/**
 * Data set event class representing an event in the system.
 * Extends base Event for compatibility with tests expecting Event instances.
 */
export class DataSetEvent extends Event {

    /**
     * Constructs a DataSetEvent instance from a JSON object.
     * @param data - The JSON object containing event data.
     */
  constructor(data: any) {
    super(data);
  }

    /**
     * Creates an array of DataSetEvent instances from a JSON array.
     * @param json - The JSON array containing event data.
     * @returns An array of DataSetEvent instances.
     */
  static fromJsonArray(json: any): DataSetEvent[] {
    // Deterministic order by key to satisfy tests expecting specific index positions
    return Object.keys(json)
      .sort()
      .map((key: string) => new DataSetEvent((json as Record<string, any>)[key]));
  }
}
