import { Component } from '../../ecs/Component';

export interface MenuItem {
  text: string;
  actionId: string;
}

/**
 * Represents a menu component that holds menu items and manages the selected item. 
 */
export class MenuComponent extends Component {
  public items: MenuItem[];
  public selectedIndex: number = 0;

  /**
   * Constructs a MenuComponent with the given menu items.
   * @param items The menu items to include in the menu.
   */
  constructor(items: MenuItem[]) {
    super();
    this.items = items;
  }

  /**
   * Gets the currently selected menu item.
   */
  getSelectedItem(): MenuItem {
    return this.items[this.selectedIndex];
  } 

  /**
   * Gets the index of the currently selected menu item.
   * @returns The index of the selected menu item.
   */
  getSelectedItemIndex(): number {
    return this.selectedIndex;
  }

}
