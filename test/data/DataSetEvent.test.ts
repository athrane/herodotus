import { DataSetEvent } from '../../src/data/DataSetEvent';

describe('Event', () => {
  const sample = {
    "Event Type": "TypeA",
    "Event Trigger": "TriggerA",
    "Event Name": "NameA",
    "Event Consequence": "ConsequenceA",
    "Heading": "HeadingA",
    "Place": "PlaceA",
    "Primary Actor": "ActorA",
    "Secondary Actor": "ActorB",
    "Motive": "MotiveA",
    "Description": "DescriptionA",
    "Consequence": "ConsequenceA",
    "Tags": "TagA"
  };

  it('should construct an DataSetEvent from raw data', () => {
    const event = new DataSetEvent(sample);
    expect(event.EventType).toBe('TypeA');
    expect(event.EventTrigger).toBe('TriggerA');
    expect(event.EventName).toBe('NameA');
    expect(event.EventConsequence).toBe('ConsequenceA');
    expect(event.Heading).toBe('HeadingA');
    expect(event.Place).toBe('PlaceA');
    expect(event.PrimaryActor).toBe('ActorA');
    expect(event.SecondaryActor).toBe('ActorB');
    expect(event.Motive).toBe('MotiveA');
    expect(event.Description).toBe('DescriptionA');
    expect(event.Consequence).toBe('ConsequenceA');
    expect(event.Tags).toBe('TagA');
  });

  it('should create an array of Events from JSON', () => {
    const json = { a: sample, b: { ...sample, "Event Name": "NameB" } };
    const events = DataSetEvent.fromJsonArray(json);
    expect(events.length).toBe(2);
    expect(events[0]).toBeInstanceOf(DataSetEvent);
    expect(events[1].EventName).toBe('NameB');
  });
});
