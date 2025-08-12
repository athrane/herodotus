import { TypeUtils } from '../util/TypeUtils.ts';
import { Time } from '../time/Time.js';
import { HistoricalFigure } from '../historicalfigure/HistoricalFigure.js';
import { Place } from '../generator/Place.js';
import { EventType } from './EventType.js';

/**
 * Represents a single, discrete entry in the chronicle, describing a historical event.
 */
export class ChronicleEvent {
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
   * Creates an instance of ChronicleEvent.
   * @param {string} heading - A super condensed heading for the event.
   * @param {EventType} eventType - The type of the event.
   * @param {Time} time - The time of the event.
   * @param {Place} place - The location of the event.
   * @param {string} description - A textual description of the historical event.
   * @param {HistoricalFigure | null} [figure=null] - The historical figure involved. Can be null for natural events.
   */
  constructor(heading, eventType, time, place, description, figure = null) {
    TypeUtils.ensureString(heading, 'ChronicleEvent heading must be a string.');
    TypeUtils.ensureInstanceOf(eventType, EventType, 'ChronicleEvent eventType must be an instance of EventType.');
    TypeUtils.ensureInstanceOf(time, Time, 'ChronicleEvent time must be an instance of Time.');
    if (figure !== null) {
      TypeUtils.ensureInstanceOf(figure, HistoricalFigure, 'ChronicleEvent figure must be an instance of HistoricalFigure or null.');
    }
    TypeUtils.ensureInstanceOf(place, Place, 'ChronicleEvent place must be an instance of Place.');
    TypeUtils.ensureString(description, 'ChronicleEvent description must be a string.');

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

  /**
   * Creates a new ChronicleEvent instance.
   * @param {string} heading - A super condensed heading for the event.
   * @param {EventType} eventType - The type of the event.
   * @param {Time} time - The time of the event.
   * @param {Place} place - The location of the event.
   * @param {string} description - A textual description of the historical event. 
   * @param {HistoricalFigure | null} [figure=null] - The historical figure involved. Can be null for natural events.
   * @returns {ChronicleEvent} A new ChronicleEvent instance.
   */
  static create(heading, eventType, time, place, description, figure = null) {
    return new ChronicleEvent(heading, eventType, time, place, description, figure);
  } 

}