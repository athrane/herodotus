import { TypeUtils } from '../util/TypeUtils.js';
import { Time } from './time/Time.js';
import { HistoricalFigure } from './HistoricalFigure.js';
import { Place } from './Place.js';

/**
 * Represents a single, discrete entry in the chronicle, describing a historical event.
 */
export class HistoricalEntry {
  /**
   * @type {string}
   */
  #heading;

  /**
   * @type {string}
   */
  #description;

  /**
   * @type {Time}
   */
  #time;

  /**
   * @type {HistoricalFigure}
   */
  #figure;

  /**
   * @type {Place}
   */
  #place;

  /**
   * Creates an instance of HistoricalEntry.
   * @param {string} heading - A super condensed heading for the event.
   * @param {Time} time - The time of the event.
   * @param {HistoricalFigure} figure - The historical figure involved.
   * @param {Place} place - The location of the event.
   * @param {string} description - A textual description of the historical event.
   */
  constructor(heading, time, figure, place, description) {
    TypeUtils.ensureString(heading, 'HistoricalEntry heading must be a string.');
    TypeUtils.ensureInstanceOf(time, Time, 'HistoricalEntry time must be an instance of Time.');
    TypeUtils.ensureInstanceOf(figure, HistoricalFigure, 'HistoricalEntry figure must be an instance of HistoricalFigure.');
    TypeUtils.ensureInstanceOf(place, Place, 'HistoricalEntry place must be an instance of Place.');
    TypeUtils.ensureString(description, 'HistoricalEntry description must be a string.');

    this.#time = time;
    this.#figure = figure;
    this.#heading = heading;
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
   * @returns {HistoricalFigure}
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

}