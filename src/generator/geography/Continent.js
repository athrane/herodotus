import { TypeUtils } from '../../util/TypeUtils.js';
import { GeographicalFeature } from './GeographicalFeature.js';

/**
 * Represents a continent in the world.
 */
export class Continent {
  /**
   * @type {string}
   */
  #name;

  /**
   * @type {GeographicalFeature[]}
   */
  #features;

  /**
   * Creates an instance of Continent.
   * @param {string} name - The name of the continent.
   */
  constructor(name) {
    TypeUtils.ensureString(name, 'Continent name must be a string.');
    this.#name = name;
    this.#features = [];
  }

  /**
   * Gets the name of the continent.
   * @returns {string}
   */
  getName() {
    return this.#name;
  }

  /**
   * Adds a geographical feature to the continent.
   * @param {GeographicalFeature} feature - The feature to add.
   */
  addFeature(feature) {
    TypeUtils.ensureInstanceOf(feature, GeographicalFeature, 'Only GeographicalFeature instances can be added to a Continent.');
    this.#features.push(feature);
  }

  /**
   * Gets the list of geographical features on the continent.
   * @returns {GeographicalFeature[]}
   */
  getFeatures() {
    return this.#features;
  }
}