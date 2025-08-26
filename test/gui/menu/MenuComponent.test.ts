import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';

describe('MenuComponent (menu folder)', () => {
  test('constructor assigns items and defaults selectedIndex to 0 (via getters)', () => {
    const items: MenuItem[] = [
      new MenuItem('Start', 'start'),
      new MenuItem('Load', 'load')
    ];

    const menu = new MenuComponent(items);

    // The implementation exposes getters instead of public fields
    expect(menu.getSelectedItemIndex()).toBe(0);
    const selected = menu.getSelectedItem();
    expect(selected).toBeDefined();
    expect(selected!.getText()).toBe('Start');
    expect(selected!.getActionID()).toBe('start');
  });

  test('empty items returns undefined for selected item', () => {
    const items: MenuItem[] = [];
    const menu = new MenuComponent(items);

    expect(menu.getSelectedItemIndex()).toBe(0);
    expect(menu.getSelectedItem()).toBeUndefined();
  });

  test('constructor throws when items is not an array', () => {
    // @ts-expect-error - intentionally passing wrong types
    expect(() => new MenuComponent(null)).toThrow(TypeError);
    // @ts-expect-error - testing with number
    expect(() => new MenuComponent(123)).toThrow(TypeError);
    // @ts-expect-error - testing with object
    expect(() => new MenuComponent({})).toThrow(TypeError);
  });
});
