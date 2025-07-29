import { Chronicle } from './Chronicle.js';
import { HistoricalEntry } from './HistoricalEntry.js';
import { EventCategory } from './event/EventCategory.js';
import { EventType } from './event/EventType.js';
import { HistoricalFigure } from './HistoricalFigure.js';
import { Place } from './Place.js';
import { Time } from './time/Time.js';

/**
 * Generates a historical chronicle.
 */
export class Generator {
  /**
   * Generates a complete chronicle.
   * @returns {Chronicle} The generated chronicle.
   */
  generate() {
    const chronicle = new Chronicle();

    const entry = new HistoricalEntry(
      'Birth of a Legend',
      new EventType(EventCategory.SOCIAL, 'Birth'),
      new Time(1),
      new Place('The Great Plains'),
      'In the first year of the new era, a figure of destiny was born.',
      new HistoricalFigure('Aethelred')
    );

    chronicle.addEntry(entry);

    return chronicle;
  }
}