import { Component } from '../ecs/Component';
import { Time } from './Time';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A component that associates a specific point in time with an entity.
 * This is useful for entities that represent historical events, scheduled tasks,
 * or any other time-sensitive data.
 */
export class TimeComponent extends Component {
  private time: Time;

  /**
   * Creates an instance of TimeComponent.
   * @param time - The Time object representing the point in time for this component.
   */
  constructor(time: Time) {
    super();
    TypeUtils.ensureInstanceOf(time, Time, 'time must be an instance of the Time class.');
    this.time = time;
  }

  /**
   * Gets the Time object associated with this component.
   * @returns The Time object.
   */
  getTime(): Time {
    return this.time;
  }

  /**
   * Sets the Time object for this component.
   * @param time - The new Time object.
   */
  setTime(time: Time): void {
    TypeUtils.ensureInstanceOf(time, Time, 'time must be an instance of the Time class.');
    this.time = time;
  }

  /**
   * Creates a new instance of TimeComponent.
   * This static factory method provides a standardized way to construct TimeComponent objects.
   * @param time - The Time object representing the point in time for this component.
   * @returns A new TimeComponent instance.
   */
  static create(time: Time): TimeComponent {
    return new TimeComponent(time);
  }
}