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

}
