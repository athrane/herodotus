import { MenuItem } from '../../../src/gui/menu/MenuItem';

describe('MenuItem', () => {
  test('constructor sets text and actionID and getters return them', () => {
    const item = new MenuItem('Play', 'play_action');

    expect(item.getText()).toBe('Play');
    expect(item.getActionID()).toBe('play_action');
  });

  test('multiple instances are independent', () => {
    const a = new MenuItem('One', 'one');
    const b = new MenuItem('Two', 'two');

    expect(a.getText()).toBe('One');
    expect(a.getActionID()).toBe('one');
    expect(b.getText()).toBe('Two');
    expect(b.getActionID()).toBe('two');
  });
});
