import { MenuItem } from '../../../src/gui/menu/MenuItem';

describe('MenuItem', () => {
  test('constructor sets text and actionID and getters return them', () => {
    const item = new MenuItem('Play', 'play_action');

    expect(item.getText()).toBe('Play');
    expect(item.getActionID()).toBe('play_action');
    expect(item.getHotkey()).toBe('p'); // Default to first letter
  });

  test('constructor with explicit hotkey', () => {
    const item = new MenuItem('Chronicle', 'chronicle_action', 'r');

    expect(item.getText()).toBe('Chronicle');
    expect(item.getActionID()).toBe('chronicle_action');
    expect(item.getHotkey()).toBe('r');
  });

  test('getDisplayText formats with brackets around hotkey', () => {
    const item1 = new MenuItem('Quit', 'quit_action');
    expect(item1.getDisplayText()).toBe('[Q]uit');

    const item2 = new MenuItem('Chronicle', 'chronicle_action', 'r');
    expect(item2.getDisplayText()).toBe('Ch[R]onicle');

    const item3 = new MenuItem('Help', 'help_action', 'h');
    expect(item3.getDisplayText()).toBe('[H]elp');
  });

  test('getDisplayText handles hotkey not in text', () => {
    const item = new MenuItem('Status', 'status_action', 'x');
    expect(item.getDisplayText()).toBe('[X] Status');
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
