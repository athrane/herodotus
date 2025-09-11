import { TypeUtils } from '../../util/TypeUtils';
import { Component } from '../../ecs/Component';
import { MenuItem } from './MenuItem';
import { ScrollStrategy } from './ScrollStrategy';

/**
 * Represents a menu component that holds menu items and manages the selected item.
 * Supports configurable scroll strategies for navigation control.
 */
export class MenuComponent extends Component {
  private items: MenuItem[];
  private selectedIndex: number = 0;
  private scrollStrategy: ScrollStrategy;

  /**
   * Constructs a MenuComponent with the given menu items and scroll strategy.
   * @param items The menu items to include in the menu.
   * @param scrollStrategy The scroll strategy for navigation.
   */
  constructor(items: MenuItem[], scrollStrategy: ScrollStrategy) {
    super();
    TypeUtils.ensureArray(items, "items must be an array");
    TypeUtils.ensureString(scrollStrategy, "scrollStrategy must be a valid ScrollStrategy enum value");
    if (!Object.values(ScrollStrategy).includes(scrollStrategy)) {
      throw new TypeError(`scrollStrategy must be one of: ${Object.values(ScrollStrategy).join(', ')}`);
    }
    this.items = items;
    this.scrollStrategy = scrollStrategy;
  }

  /**
   * Creates a new MenuComponent instance.
   * @param items The menu items to include in the menu.
   * @param scrollStrategy The scroll strategy for navigation.
   * @returns A new MenuComponent instance.
   */
  static create(items: MenuItem[], scrollStrategy: ScrollStrategy): MenuComponent {
    return new MenuComponent(items, scrollStrategy);
  }

  /**
   * Gets the menu items.
   * @returns The menu items.
   */
  getItems(): MenuItem[] {
    return this.items;
  } 

  /**
   * Gets the index of the currently selected menu item.
   * @returns The index of the selected menu item.
   */
  getSelectedItemIndex(): number {
    return this.selectedIndex;
  }

  /**
   * Gets the currently selected menu item.
   */
  getSelectedItem(): MenuItem | undefined {
    if (!this.items || this.items.length === 0) return undefined;
    return this.items[this.selectedIndex];
  }

  /**
   * Sets the selected index, wrapping around the items array.
   * @param index The new selected index.
   */
  setSelectedItemIndex(index: number): void {
    if (!this.items || this.items.length === 0) {
      this.selectedIndex = 0;
      return;
    }
    const len = this.items.length;
    // Normalize index with wrap-around
    this.selectedIndex = ((index % len) + len) % len;
  }

  /**
   * Select the next item (wraps around).
   */
  selectNext(): void {
    this.setSelectedItemIndex(this.selectedIndex + 1);
  }

  /**
   * Select the previous item (wraps around).
   */
  selectPrevious(): void {
    this.setSelectedItemIndex(this.selectedIndex - 1);
  }

  /**
   * Gets the current scroll strategy.
   * @returns The current scroll strategy.
   */
  getScrollStrategy(): ScrollStrategy {
    return this.scrollStrategy;
  }

  /**
   * Sets the scroll strategy for menu navigation.
   * @param strategy The scroll strategy to set.
   */
  setScrollStrategy(strategy: ScrollStrategy): void {
    TypeUtils.ensureString(strategy, "scrollStrategy must be a valid ScrollStrategy enum value");
    if (!Object.values(ScrollStrategy).includes(strategy)) {
      throw new TypeError(`scrollStrategy must be one of: ${Object.values(ScrollStrategy).join(', ')}`);
    }
    this.scrollStrategy = strategy;
  }

}
