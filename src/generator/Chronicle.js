import { TypeUtils } from '../util/TypeUtils.js';
import { HistoricalEntry } from './HistoricalEntry.js';

/**
 * Represents the entire historical document, composed of discrete historical entries.
 */
export class Chronicle {
  /**
   * @type {HistoricalEntry[]}
   */
  #entries;

  /**
   * Creates an instance of Chronicle.
   */
  constructor() {
    this.#entries = [];
  }

  /**
   * Adds a historical entry to the chronicle.
   * @param {HistoricalEntry} entry - The historical entry to add.
   */
  addEntry(entry) {
    TypeUtils.ensureInstanceOf(entry, HistoricalEntry, 'Only HistoricalEntry instances can be added to the Chronicle.');
    this.#entries.push(entry);
  }

  /**
   * Gets the list of historical entries.
   * @returns {HistoricalEntry[]}
   */
  get entries() {
    return this.#entries;
  }
}