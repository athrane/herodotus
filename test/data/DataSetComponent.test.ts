import { DataSetComponent } from '../../src/data/DataSetComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';

// Helper to build raw event JSON
function raw(idx: number, trigger?: string) {
  return {
    'Event Type': 'Type' + idx,
    'Event Trigger': trigger ?? 'Trigger' + idx,
    'Event Name': 'Name' + idx,
    'Event Consequence': 'Consequence' + idx,
    'Heading': 'Heading' + idx,
    'Place': 'Place' + idx,
    'Primary Actor': 'Primary' + idx,
    'Secondary Actor': 'Secondary' + idx,
    'Motive': 'Motive' + idx,
    'Description': 'Description' + idx,
    'Consequence': 'Consequence' + idx,
    'Tags': 'Tags' + idx
  };
}

describe('DataSetComponent', () => {
  let events: DataSetEvent[];

  beforeEach(() => {
    events = [new DataSetEvent(raw(1)), new DataSetEvent(raw(2)), new DataSetEvent(raw(3))];
  });

  it('creates component with events accessible via getEvents()', () => {
    const comp = DataSetComponent.create(events);
    const list = comp.getEvents();
    expect(list.length).toBe(3);
    expect(list[0].EventName).toBe('Name1');
  });

  it('stores multiple events with the same EventTrigger', () => {
    const dup = new DataSetEvent(raw(99, 'Trigger2')); // duplicate trigger of events[1]
    const comp = DataSetComponent.create([...events, dup]);
    expect(comp.getEvents().length).toBe(4); // all events kept including duplicate
    const byTrigger = comp.getByTrigger('Trigger2');
    expect(byTrigger.length).toBe(2); // both events with Trigger2
    expect(byTrigger[0]?.EventName).toBe('Name2'); // original first
    expect(byTrigger[1]?.EventName).toBe('Name99'); // duplicate second
  });

  it('getByTrigger returns empty array for missing key', () => {
    const comp = DataSetComponent.create(events);
    expect(comp.getByTrigger('Nope')).toEqual([]);
  });

  it('find filters events by predicate', () => {
    const comp = DataSetComponent.create(events);
    const filtered = comp.find(e => e.EventTrigger === 'Trigger2');
    expect(filtered.length).toBe(1);
    expect(filtered[0].EventName).toBe('Name2');
  });

  it('getEvents returns an immutable snapshot', () => {
    const comp = DataSetComponent.create(events);
    const list = comp.getEvents() as DataSetEvent[]; // runtime array
    expect(() => { (list as any).push(new DataSetEvent(raw(10))); }).toThrow();
    // even if mutation were forced, original component size remains stable
    expect(comp.getEvents().length).toBe(3);
  });

  it('throws when constructed with non-array', () => {
    expect(() => (DataSetComponent as any).create(null)).toThrow('events must be an array');
  });

  it('throws when event missing non-empty trigger', () => {
    const bad = new DataSetEvent({ ...raw(5), 'Event Trigger': '' });
    expect(() => DataSetComponent.create([bad])).toThrow('Each DataSetEvent must have a non-empty EventTrigger string');
  });

  it('throws when element not a DataSetEvent instance', () => {
    expect(() => DataSetComponent.create([{} as DataSetEvent])).toThrow('All items must be DataSetEvent instances');
  });
});
