
/**
 * Represents a menu item in the menu.
 */
export class MenuItem {
  private text: string;
  private actionID: string;
  private hotkey: string;

  /**
   * Constructs a MenuItem with the given text and action ID.
   * @param text The text to display for the menu item.
   * @param actionID The action ID associated with the menu item.
   * @param hotkey The single character hotkey for this menu item (optional, defaults to first letter).
   */
  constructor(text: string, actionID: string, hotkey?: string) {
    this.text = text;
    this.actionID = actionID;
    this.hotkey = hotkey || text.charAt(0).toLowerCase();
  }

  /**
   * Gets the text of the menu item.
   * @returns The text of the menu item.
   */
  getText(): string {
    return this.text;
  }

  /**
   * Gets the formatted display text with bracket notation around the hotkey.
   * Example: "Quit" becomes "[Q]uit"
   * @returns The formatted display text.
   */
  getDisplayText(): string {
    const hotkeyUpper = this.hotkey.toUpperCase();
    const textLower = this.text.toLowerCase();
    const hotkeyIndex = textLower.indexOf(this.hotkey.toLowerCase());
    
    if (hotkeyIndex === -1) {
      // If hotkey not found in text, prepend it
      return `[${hotkeyUpper}] ${this.text}`;
    }
    
    // Insert brackets around the hotkey in the original text
    const before = this.text.substring(0, hotkeyIndex);
    const hotKeyChar = this.text.substring(hotkeyIndex, hotkeyIndex + 1);
    const after = this.text.substring(hotkeyIndex + 1);
    
    return `${before}[${hotKeyChar.toUpperCase()}]${after}`;
  }

  /**
   * Gets the action ID of the menu item.
   * @returns The action ID of the menu item.
   */
  getActionID(): string {
    return this.actionID;
  }

  /**
   * Gets the hotkey for this menu item.
   * @returns The hotkey character.
   */
  getHotkey(): string {
    return this.hotkey;
  }
}
