import { MenuComponent, MenuItem } from '../../../src/gui/menu/MenuComponent';

describe('MenuComponent (menu folder)', () => {
  test('constructor assigns items and defaults selectedIndex to 0', () => {
    const items: MenuItem[] = [
      { text: 'Start', actionId: 'start' },
      { text: 'Load', actionId: 'load' }
    ];

    const menu = new MenuComponent(items);

    expect(menu.items).toBe(items);
    expect(menu.items).toHaveLength(2);
    expect(menu.selectedIndex).toBe(0);
    expect(menu.getSelectedItem()).toBe(items[0]);
    expect(menu.getSelectedItemIndex()).toBe(0);
  });

  test('changing selectedIndex updates selected item getters', () => {
    const items: MenuItem[] = [
      { text: 'One', actionId: 'one' },
      { text: 'Two', actionId: 'two' },
      { text: 'Three', actionId: 'three' }
    ];

    const menu = new MenuComponent(items);

    menu.selectedIndex = 2;

    expect(menu.getSelectedItemIndex()).toBe(2);
    expect(menu.getSelectedItem()).toBe(items[2]);
  });
});
