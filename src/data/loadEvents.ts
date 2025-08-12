import eventsRaw from '../../data/events-flashp6-1.0.json';
import { Event } from './Event';

/**
 * Loads events from a JSON file.
 * @returns An array of Event instances.
 */
export function loadEvents(): Event[] {
  return Event.fromJsonArray(eventsRaw);
}
