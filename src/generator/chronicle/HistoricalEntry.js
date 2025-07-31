import { TypeUtils } from '../../util/TypeUtils.js';
import { Time } from '../../time/Time.js';
import { HistoricalFigure } from '../HistoricalFigure.js';
import { Place } from '../Place.js';
import { EventType } from '../event/EventType.js';

/**
 * Represents a single, discrete entry in the chronicle, describing a historical event.
 */
export class HistoricalEntry {
  /**
   * @type {string}
   */
  #heading;

  /**
   * @type {EventType}
   */
  #eventType;

  /**
   * @type {string}
   */
  #description;

  /**
   * @type {Time}
   */
  #time;

  /**
   * @type {HistoricalFigure | null}
   */
  #figure;

  /**
   * @type {Place}
   */
  #place;

  /**
   * Creates an instance of HistoricalEntry.
   * @param {string} heading - A super condensed heading for the event.
   * @param {EventType} eventType - The type of the event.
   * @param {Time} time - The time of the event.
   * @param {Place} place - The location of the event.
   * @param {string} description - A textual description of the historical event.
   * @param {HistoricalFigure | null} [figure=null] - The historical figure involved. Can be null for natural events.
   */
  constructor(heading, eventType, time, place, description, figure = null) {
    TypeUtils.ensureString(heading, 'HistoricalEntry heading must be a string.');
    TypeUtils.ensureInstanceOf(eventType, EventType, 'HistoricalEntry eventType must be an instance of EventType.');
    TypeUtils.ensureInstanceOf(time, Time, 'HistoricalEntry time must be an instance of Time.');
    if (figure !== null) {
      TypeUtils.ensureInstanceOf(figure, HistoricalFigure, 'HistoricalEntry figure must be an instance of HistoricalFigure or null.');
    }
    TypeUtils.ensureInstanceOf(place, Place, 'HistoricalEntry place must be an instance of Place.');
    TypeUtils.ensureString(description, 'HistoricalEntry description must be a string.');

    this.#heading = heading;
    this.#eventType = eventType;
    this.#time = time;
    this.#figure = figure;
    this.#place = place;
    this.#description = description;
  }

  /**
   * Gets the time of the event.
   * @return {Time}
   */
  getTime() {
    return this.#time;
  }

  /**
   * Gets the historical figure involved in the event.
   * @returns {HistoricalFigure | null}
   */
  getFigure() {
    return this.#figure;
  }

  /**
   * Gets the location of the event.
   * @returns {Place}
   */ 
  getPlace() {
    return this.#place;
  }

  /**
   * Gets the description of the historical entry.
   * @returns {string}
   */
  getDescription() {
    return this.#description;
  }

  /**
   * Gets the heading of the historical entry.
   * @returns {string}
   */
  getHeading() {
    return this.#heading;
  }

  /**
   * Gets the event type of the historical entry.
   * @returns {EventType}
   */
  getEventType() {
    return this.#eventType;
  }

}