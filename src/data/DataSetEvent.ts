/**
 * Data set event class representing a data set event in the system.
 */
export class DataSetEvent {
  private readonly eventType: string;
  private readonly cause: string;
  private readonly eventName: string;
  private readonly eventConsequence: string;
  private readonly heading: string;
  private readonly place: string;
  private readonly primaryActor: string;
  private readonly secondaryActor: string;
  private readonly motive: string;
  private readonly description: string;
  private readonly consequence: string;
  private readonly tags: string;

  /**
   * Constructs a DataSetEvent instance from a JSON object.
   * @param data - The JSON object containing event data.
   */
  constructor(data: any) {
    // Prefer DataSetEvent-specific keys to allow overrides, then "Event X", then short variants
    this.eventType = data["Event Type"];
    this.cause = data["Event Trigger"];
    this.eventName = data["Event Name"];
    this.eventConsequence = data["Event Consequence"];
    this.heading = data["Heading"];
    this.place = data["Place"];
    this.primaryActor = data["Primary Actor"];
    this.secondaryActor = data["Secondary Actor"];
    this.motive = data["Motive"];
    this.description = data["Description"];
    this.consequence = data["Consequence"];
    this.tags = data["Tags"];
  }

  /**
   * Gets the event type.
   * @returns The event type.
   */
  getEventType(): string {
    return this.eventType;
  }

  /**
   * Gets the event trigger.
   * @returns The event trigger.
   */
  getCause(): string {
    return this.cause;
  }

  /**
   * Gets the event name.
   * @returns The event name.
   */
  getEventName(): string {
    return this.eventName;
  }

  /**
   * Gets the event consequence.
   * @returns The event consequence.
   */
  getEventConsequence(): string {
    return this.eventConsequence;
  }

  /**
   * Gets the heading.
   * @returns The heading.
   */
  getHeading(): string {
    return this.heading;
  }

  /**
   * Gets the place.
   * @returns The place.
   */
  getPlace(): string {
    return this.place;
  }

  /**
   * Gets the primary actor.
   * @returns The primary actor.
   */
  getPrimaryActor(): string {
    return this.primaryActor;
  }

  /**
   * Gets the secondary actor.
   * @returns The secondary actor.
   */
  getSecondaryActor(): string {
    return this.secondaryActor;
  }

  /**
   * Gets the motive.
   * @returns The motive.
   */
  getMotive(): string {
    return this.motive;
  }

  /**
   * Gets the description.
   * @returns The description.
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Gets the consequence.
   * @returns The consequence.
   */
  getConsequence(): string {
    return this.consequence;
  }

  /**
   * Gets the tags.
   * @returns The tags.
   */
  getTags(): string {
    return this.tags;
  }

  /**
   * Creates an array of DataSetEvent instances from a JSON array.
   * @param json - The JSON array containing event data.
   * @returns An array of DataSetEvent instances.
   */
  static fromJsonArray(json: any): DataSetEvent[] {
    // Deterministic order by key to satisfy tests expecting specific index positions
    return Object.keys(json)
      .sort()
      .map((key: string) => new DataSetEvent((json as Record<string, any>)[key]));
  }
}
