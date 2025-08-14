import eventsRaw from '../../data/events-flashp6-1.0.json';
import { DataSetEvent } from './DataSetEvent';

/**
 * Loads events from a JSON file.
 * @returns An array of DataSetEvent instances.
 */
export function loadEvents(): DataSetEvent[] {
  return DataSetEvent.fromJsonArray(eventsRaw);
}
