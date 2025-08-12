import { Component } from '../ecs/Component.js';
import { Time } from '../time/Time.js';
import { TypeUtils } from '../util/TypeUtils.ts';

/**
 * A component that associates a specific point in time with an entity.
 * This is useful for entities that represent historical events, scheduled tasks,
 * or any other time-sensitive data.
 */
export class TimeComponent extends Component {
  /**
   * @type {Time}
   */
  #time;

  /**
   * Creates an instance of TimeComponent.
   * @param {Time} time - The Time object representing the point in time for this component.
   */
  constructor(time) {
    super();
    TypeUtils.ensureInstanceOf(time, Time, 'time must be an instance of the Time class.');
    this.#time = time;
  }

  /**
   * Gets the Time object associated with this component.
   * @returns {Time} The Time object.
   */
  getTime() {
    return this.#time;
  }

  /**
   * Sets the Time object for this component.
   * @param {Time} time - The new Time object.
   */
  setTime(time) {
    TypeUtils.ensureInstanceOf(time, Time, 'time must be an instance of the Time class.');
    this.#time = time;
  }

    /**
     * Creates a new instance of TimeComponent.
     * This static factory method provides a standardized way to construct TimeComponent objects.
     * @param {Time} time - The Time object representing the point in time for this component.
     * @returns {TimeComponent} A new TimeComponent instance.
     */
    static create(time) {
        return new TimeComponent(time);
    }   
}