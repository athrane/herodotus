import { ActionComponent } from '../../../src/gui/menu/ActionComponent';

describe('ActionComponent', () => {
  test('constructor assigns actionId and getter returns it', () => {
    const comp = new ActionComponent('do_something');

    expect(comp.getActionId()).toBe('do_something');
    // also verify direct property access
    expect(comp.actionId).toBe('do_something');
  });

  test('multiple instances maintain independent actionIds', () => {
    const a = new ActionComponent('one');
    const b = new ActionComponent('two');

    expect(a.getActionId()).toBe('one');
    expect(b.getActionId()).toBe('two');
    expect(a.actionId).toBe('one');
    expect(b.actionId).toBe('two');
  });

  test('constructor type-checks actionId and throws for non-strings', () => {
    // @ts-expect-error - testing runtime type check with null
    expect(() => new ActionComponent(null)).toThrow(TypeError);
    // @ts-expect-error - testing runtime type check with number
    expect(() => new ActionComponent(123)).toThrow(TypeError);
    // @ts-expect-error - testing runtime type check with object
    expect(() => new ActionComponent({})).toThrow(TypeError);
  });
});
