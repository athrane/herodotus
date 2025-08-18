import { loadEvents } from '../../src/data/loadEvents';
import { DataSetEvent } from '../../src/data/DataSetEvent';

jest.mock('../../data/events-flashp6-1.0.json', () => ({
  a: {
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
  },
  b: {
    "Event Type": "TypeB",
    "Event Trigger": "TriggerB",
    "Event Name": "NameB",
    "Event Consequence": "ConsequenceB",
    "Heading": "HeadingB",
    "Place": "PlaceB",
    "Primary Actor": "ActorC",
    "Secondary Actor": "ActorD",
    "Motive": "MotiveB",
    "Description": "DescriptionB",
    "Consequence": "ConsequenceB",
    "Tags": "TagB"
  }
}), { virtual: true });

describe('loadEvents', () => {
  it('should load and deserialize events from JSON', () => {
    const events = loadEvents();
    expect(events.length).toBe(2);
    expect(events[0]).toBeInstanceOf(DataSetEvent);
    expect(events[1].getEventType()).toBe('TypeB');
  });
});
