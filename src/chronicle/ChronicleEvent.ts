import { TypeUtils } from '../util/TypeUtils';
import { Time } from '../time/Time';
import { HistoricalFigureComponent } from '../historicalfigure/HistoricalFigureComponent';
import { LocationComponent } from '../geography/LocationComponent';
import { EventType } from './EventType';

/**
 * Represents a single, discrete entry in the chronicle, describing a historical event.
 */
export class ChronicleEvent {
  private readonly heading: string;
  private readonly eventType: EventType;
  private readonly description: string;
  private readonly time: Time;
  private readonly figure: HistoricalFigureComponent | null;
  private readonly location: LocationComponent;

  /**
   * Creates a new chronicle event.
   *
   * @param heading - Short, human-readable title for the event.
   * @param eventType - The typed category of the event.
   * @param time - The time at which the event occurs.
   * @param location - The place/location where the event occurs.
   * @param description - A longer human-readable description of the event.
   * @param figure - The historical figure involved in the event, if any. Defaults to null.
   * @throws {TypeError} If any argument fails runtime validation (type/instance checks).
   */
  constructor(
    heading: string,
    eventType: EventType,
    time: Time,
    location: LocationComponent,
    description: string,
    figure: HistoricalFigureComponent | null = null
  ) {
    TypeUtils.ensureString(heading, 'ChronicleEvent heading must be a string.');
    TypeUtils.ensureInstanceOf(eventType, EventType);
    TypeUtils.ensureInstanceOf(time, Time);
    if (figure !== null) {
      TypeUtils.ensureInstanceOf(figure, HistoricalFigureComponent);
    }
    TypeUtils.ensureInstanceOf(location, LocationComponent);
    TypeUtils.ensureString(description, 'ChronicleEvent description must be a string.');

    this.heading = heading;
    this.eventType = eventType;
    this.time = time;
    this.figure = figure;
    // Deep copy the location to ensure immutability
    this.location = location.clone();
    this.description = description;
  }

  /**
   * Returns the time at which the event occurs.
   * @returns {Time}
   */
  getTime(): Time {
    return this.time;
  }

  /**
   * Returns the historical figure involved in the event, if any.
   * @returns {HistoricalFigureComponent | null}
   */
  getFigure(): HistoricalFigureComponent | null {
    return this.figure;
  }

  /**
   * Returns the location where the event occurs.
   * @returns {LocationComponent}
   */
  getLocation(): LocationComponent {
    return this.location;
  }

  /**
   * Returns the longer description of the event.
   * @returns {string}
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Returns the short, human-readable title of the event.
   * @returns {string}
   */
  getHeading(): string {
    return this.heading;
  }

  /**
   * Returns the typed category of the event.
   * @returns {EventType}
   */
  getEventType(): EventType {
    return this.eventType;
  }

  /**
   * Convenience factory for creating a ChronicleEvent with validation.
   *
   * @param heading - Short, human-readable title for the event.
   * @param eventType - The typed category of the event.
   * @param time - The time at which the event occurs.
   * @param location - The location where the event occurs.
   * @param description - A longer human-readable description of the event.
   * @param figure - The historical figure involved in the event, if any. Defaults to null.
   * @returns {ChronicleEvent}
   */
  static create(
    heading: string,
    eventType: EventType,
    time: Time,
    location: LocationComponent,
    description: string,
    figure: HistoricalFigureComponent | null = null
  ): ChronicleEvent {
    return new ChronicleEvent(heading, eventType, time, location, description, figure);
  }
}
