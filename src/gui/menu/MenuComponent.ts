import { TypeUtils } from '../../util/TypeUtils';
import { Component } from '../../ecs/Component';
import { MenuItem } from './MenuItem';

/**
 * Represents a menu item in the menu.
 */
/**
 * Represents a menu component that holds menu items and manages the selected item. 
 */
export class MenuComponent extends Component {
  private items: MenuItem[];
  private selectedIndex: number = 0;

  /**
   * Constructs a MenuComponent with the given menu items.
   * @param items The menu items to include in the menu.
   */
  constructor(items: MenuItem[]) {
    super();
    TypeUtils.ensureArray(items, "items must be an array");
    this.items = items;
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

}
