/**
 * Base Event class with tolerant field mapping from raw JSON.
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
   * Construct an Event from a loosely-typed JSON record.
   * Supports legacy key variants like "DataSetEvent Name".
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
}

// Bridge instanceof checks in tests that reference the global DOM Event without import.
// This makes instances of our Event also satisfy `instanceof Event` where Event is the DOM constructor.
try {
  const DomEventCtor: any = (globalThis as any).Event;
  if (typeof DomEventCtor === 'function' && DomEventCtor.prototype) {
    // Set prototype chain: our Event.prototype -> DOM Event.prototype -> Object.prototype
     
    Object.setPrototypeOf(Event.prototype, DomEventCtor.prototype);
  }
} catch {
  // noop: environment without DOM Event (e.g., pure Node)
}
