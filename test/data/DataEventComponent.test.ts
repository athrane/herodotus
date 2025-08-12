import { DataEventComponent } from '../../src/data/DataEventComponent';
import { Event } from '../../src/data/Event';

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

describe('DataEventComponent', () => {
  let events: Event[];

  beforeEach(() => {
    events = [new Event(raw(1)), new Event(raw(2)), new Event(raw(3))];
  });

  it('creates component with events accessible via getEvents()', () => {
    const comp = DataEventComponent.create(events);
    const list = comp.getEvents();
    expect(list.length).toBe(3);
    expect(list[0].EventName).toBe('Name1');
  });

  it('stores events keyed by EventTrigger (unique, first wins)', () => {
    const dup = new Event(raw(99, 'Trigger2')); // duplicate trigger of events[1]
    const comp = DataEventComponent.create([...events, dup]);
    expect(comp.getEvents().length).toBe(3); // duplicate ignored
    const byTrigger = comp.getByTrigger('Trigger2');
    expect(byTrigger?.EventName).toBe('Name2'); // original retained
  });

  it('getByTrigger returns undefined for missing key', () => {
    const comp = DataEventComponent.create(events);
    expect(comp.getByTrigger('Nope')).toBeUndefined();
  });

  it('find filters events by predicate', () => {
    const comp = DataEventComponent.create(events);
    const filtered = comp.find(e => e.EventTrigger === 'Trigger2');
    expect(filtered.length).toBe(1);
    expect(filtered[0].EventName).toBe('Name2');
  });

  it('getEvents returns an immutable snapshot', () => {
    const comp = DataEventComponent.create(events);
    const list = comp.getEvents() as Event[]; // runtime array
    expect(() => { (list as any).push(new Event(raw(10))); }).toThrow();
    // even if mutation were forced, original component size remains stable
    expect(comp.getEvents().length).toBe(3);
  });

  it('throws when constructed with non-array', () => {
    expect(() => (DataEventComponent as any).create(null)).toThrow('events must be an array');
  });

  it('throws when event missing non-empty trigger', () => {
    const bad = new Event({ ...raw(5), 'Event Trigger': '' });
    expect(() => DataEventComponent.create([bad])).toThrow('Each Event must have a non-empty EventTrigger string');
  });

  it('throws when element not an Event instance', () => {
    expect(() => DataEventComponent.create([{} as Event])).toThrow('All items must be Event instances');
  });
});
