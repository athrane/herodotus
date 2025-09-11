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
    expect(event.getEventType()).toBe('TypeA');
  expect(event.getCause()).toBe('TriggerA');
    expect(event.getEventName()).toBe('NameA');
    expect(event.getEventConsequence()).toBe('ConsequenceA');
    expect(event.getHeading()).toBe('HeadingA');
    expect(event.getPlace()).toBe('PlaceA');
    expect(event.getPrimaryActor()).toBe('ActorA');
    expect(event.getSecondaryActor()).toBe('ActorB');
    expect(event.getMotive()).toBe('MotiveA');
    expect(event.getDescription()).toBe('DescriptionA');
    expect(event.getConsequence()).toBe('ConsequenceA');
    expect(event.getTags()).toBe('TagA');
  });

  it('should create an array of Events from JSON', () => {
    const json = { a: sample, b: { ...sample, "Event Name": "NameB" } };
    const events = DataSetEvent.fromJsonArray(json);
    expect(events.length).toBe(2);
    expect(events[0]).toBeInstanceOf(DataSetEvent);
    expect(events[1].getEventName()).toBe('NameB');
  });
});
