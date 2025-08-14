import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
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

describe('DataSetEventComponent', () => {
  let events: DataSetEvent[];

  beforeEach(() => {
    events = [new DataSetEvent(raw(1)), new DataSetEvent(raw(2)), new DataSetEvent(raw(3))];
  });

  it('creates component with events accessible via getEvents()', () => {
    const comp = DataSetEventComponent.create(events);
    const list = comp.getEvents();
    expect(list.length).toBe(3);
    expect(list[0].EventName).toBe('Name1');
  });

  it('stores events keyed by EventTrigger (unique, first wins)', () => {
    const dup = new DataSetEvent(raw(99, 'Trigger2')); // duplicate trigger of events[1]
    const comp = DataSetEventComponent.create([...events, dup]);
    expect(comp.getEvents().length).toBe(3); // duplicate ignored
    const byTrigger = comp.getByTrigger('Trigger2');
    expect(byTrigger?.EventName).toBe('Name2'); // original retained
  });

  it('getByTrigger returns undefined for missing key', () => {
    const comp = DataSetEventComponent.create(events);
    expect(comp.getByTrigger('Nope')).toBeUndefined();
  });

  it('find filters events by predicate', () => {
    const comp = DataSetEventComponent.create(events);
    const filtered = comp.find(e => e.EventTrigger === 'Trigger2');
    expect(filtered.length).toBe(1);
    expect(filtered[0].EventName).toBe('Name2');
  });

  it('getEvents returns an immutable snapshot', () => {
    const comp = DataSetEventComponent.create(events);
    const list = comp.getEvents() as DataSetEvent[]; // runtime array
    expect(() => { (list as any).push(new DataSetEvent(raw(10))); }).toThrow();
    // even if mutation were forced, original component size remains stable
    expect(comp.getEvents().length).toBe(3);
  });

  it('throws when constructed with non-array', () => {
    expect(() => (DataSetEventComponent as any).create(null)).toThrow('events must be an array');
  });

  it('throws when event missing non-empty trigger', () => {
    const bad = new DataSetEvent({ ...raw(5), 'Event Trigger': '' });
    expect(() => DataSetEventComponent.create([bad])).toThrow('Each DataSetEvent must have a non-empty EventTrigger string');
  });

  it('throws when element not a DataSetEvent instance', () => {
    expect(() => DataSetEventComponent.create([{} as DataSetEvent])).toThrow('All items must be DataSetEvent instances');
  });
});
