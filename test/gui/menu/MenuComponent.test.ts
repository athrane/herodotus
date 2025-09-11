import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { ScrollStrategy } from '../../../src/gui/menu/ScrollStrategy';

describe('MenuComponent (menu folder)', () => {
  test('constructor assigns items and defaults selectedIndex to 0 (via getters)', () => {
    const items: MenuItem[] = [
      new MenuItem('Start', 'start'),
      new MenuItem('Load', 'load')
    ];

  const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);

  // The implementation exposes getters instead of public fields
  expect(menu.getSelectedItemIndex()).toBe(0);
  const itemsOut = menu.getItems();
  expect(itemsOut.length).toBe(2);
  const selected = itemsOut[menu.getSelectedItemIndex()];
  expect(selected).toBeDefined();
  expect(selected!.getText()).toBe('Start');
  expect(selected!.getActionID()).toBe('start');
  });

  test('empty items returns undefined for selected item', () => {
    const items: MenuItem[] = [];
  const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);

  expect(menu.getSelectedItemIndex()).toBe(0);
  const itemsOut = menu.getItems();
  expect(itemsOut.length).toBe(0);
  expect(itemsOut[menu.getSelectedItemIndex()]).toBeUndefined();
  });

  test('constructor throws when items is not an array', () => {
  // @ts-expect-error - intentionally passing wrong types
  expect(() => new MenuComponent(null, ScrollStrategy.HORIZONTAL)).toThrow(TypeError);
    // @ts-expect-error - testing with number
  expect(() => new MenuComponent(123, ScrollStrategy.HORIZONTAL)).toThrow(TypeError);
    // @ts-expect-error - testing with object
  expect(() => new MenuComponent({}, ScrollStrategy.HORIZONTAL)).toThrow(TypeError);
  });
});

describe('MenuComponent scroll strategy support', () => {
  test('defaults to HORIZONTAL scroll strategy', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
      const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.HORIZONTAL);
  });

  test('accepts VERTICAL scroll strategy in constructor', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
    const menu = new MenuComponent(items, ScrollStrategy.VERTICAL);
    
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.VERTICAL);
  });

  test('accepts HORIZONTAL scroll strategy in constructor', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
    const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.HORIZONTAL);
  });

  test('constructor works without scroll strategy parameter (backward compatibility)', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
      const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.HORIZONTAL);
    expect(menu.getItems()).toEqual(items);
    expect(menu.getSelectedItemIndex()).toBe(0);
  });

  test('setScrollStrategy updates the strategy', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
  const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    menu.setScrollStrategy(ScrollStrategy.VERTICAL);
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.VERTICAL);
    
    menu.setScrollStrategy(ScrollStrategy.HORIZONTAL);
    expect(menu.getScrollStrategy()).toBe(ScrollStrategy.HORIZONTAL);
  });

  test('constructor throws when scroll strategy is invalid string', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
    
    // @ts-expect-error - testing invalid scroll strategy
    expect(() => new MenuComponent(items, 'invalid')).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy
    expect(() => new MenuComponent(items, 'diagonal')).toThrow(TypeError);
  });

  test('constructor throws when scroll strategy is not string', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
    
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => new MenuComponent(items, 123)).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => new MenuComponent(items, {})).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => new MenuComponent(items, null)).toThrow(TypeError);
  });

  test('setScrollStrategy throws when strategy is invalid string', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
  const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    // @ts-expect-error - testing invalid scroll strategy
    expect(() => menu.setScrollStrategy('invalid')).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy
    expect(() => menu.setScrollStrategy('diagonal')).toThrow(TypeError);
  });

  test('setScrollStrategy throws when strategy is not string', () => {
    const items: MenuItem[] = [new MenuItem('Start', 'start')];
    const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => menu.setScrollStrategy(123)).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => menu.setScrollStrategy({})).toThrow(TypeError);
    // @ts-expect-error - testing invalid scroll strategy type
    expect(() => menu.setScrollStrategy(null)).toThrow(TypeError);
  });
});
