
/**
 * Represents a menu item in the menu.
 */
export class MenuItem {
  private text: string;
  private actionID: string;

  /**
   * Constructs a MenuItem with the given text and action ID.
   * @param text The text to display for the menu item.
   * @param actionID The action ID associated with the menu item.
   */
  constructor(text: string, actionID: string) {
    this.text = text;
    this.actionID = actionID;
  }

  /**
   * Gets the text of the menu item.
   * @returns The text of the menu item.
   */
  getText(): string {
    return this.text;
  }

  /**
   * Gets the action ID of the menu item.
   * @returns The action ID of the menu item.
   */
  getActionID(): string {
    return this.actionID;
  }
}
