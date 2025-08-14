/**
 * Data set event class representing an event in the system.
 */
export class DataSetEvent {
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
     * Constructs a DataSetEvent instance from a JSON object.
     * @param data - The JSON object containing event data.
     */
  constructor(data: any) {
// Prefer DataSetEvent-specific keys to allow overrides, then "Event X", then short variants
    this.EventType = data["DataSetEvent Type"] ?? data["Event Type"] ?? data["Type"];
    this.EventTrigger = data["DataSetEvent Trigger"] ?? data["Event Trigger"] ?? data["Trigger"];
    this.EventName = data["DataSetEvent Name"] ?? data["Event Name"] ?? data["Name"];
    this.EventConsequence = data["DataSetEvent Consequence"] ?? data["Event Consequence"] ?? data["Consequence"];
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
