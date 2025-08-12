/**
 * Event class representing an event in the system.
 */
export class Event {
  EventType: string;
  EventTrigger: string;
  EventName: string;
  EventConsequence: string;
  Heading: string;
  Place: string;
  PrimaryActor: string;
  SecondaryActor: string;
  Motive: string;
  Description: string;
  Consequence: string;
  Tags: string;

    /**
     * Constructs an Event instance from a JSON object.
     * @param data - The JSON object containing event data.
     */
  constructor(data: any) {
    this.EventType = data["Event Type"];
    this.EventTrigger = data["Event Trigger"];
    this.EventName = data["Event Name"];
    this.EventConsequence = data["Event Consequence"];
    this.Heading = data["Heading"];
    this.Place = data["Place"];
    this.PrimaryActor = data["Primary Actor"];
    this.SecondaryActor = data["Secondary Actor"];
    this.Motive = data["Motive"];
    this.Description = data["Description"];
    this.Consequence = data["Consequence"];
    this.Tags = data["Tags"];
  }

    /**
     * Creates an array of Event instances from a JSON array.
     * @param json - The JSON array containing event data.
     * @returns An array of Event instances.
     */
  static fromJsonArray(json: any): Event[] {
    return Object.values(json).map((e: any) => new Event(e));
  }
}
