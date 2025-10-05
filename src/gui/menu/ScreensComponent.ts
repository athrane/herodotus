import { Component } from '../../ecs/Component';

/**
 * Component that holds a mapping from screen keys to entity IDs (string).
 * This keeps the component lightweight and serializable.
 */
export class ScreensComponent extends Component {
  private readonly screens: Map<string, string>;
  private static nullInstance: ScreensComponent | null = null;

  /**
   * Creates an empty instance of ScreensComponent.
   */
  constructor() {
    super();
    this.screens = new Map<string, string>();
  }

  /**
   * Returns a null object instance of ScreensComponent.
   * This instance serves as a safe, neutral placeholder when a ScreensComponent is not available.
   * @returns A null ScreensComponent instance with empty screens map.
   */
  static get Null(): ScreensComponent {
    if (!ScreensComponent.nullInstance) {
      const instance = Object.create(ScreensComponent.prototype);
      instance.screens = new Map<string, string>();
      Object.freeze(instance);
      ScreensComponent.nullInstance = instance;
    }
    return ScreensComponent.nullInstance!;
  }

  /**
   * Adds a screen to the component.
   * @param key The key to identify the screen.
   * @param entityId The entity ID of the screen.
   * @returns The ScreensComponent instance.
   */
  addScreen(key: string, entityId: string): this {
    this.screens.set(key, entityId);
    return this;
  }

  /**
   * Removes a screen from the component.
   * @param key The key identifying the screen to remove.
   * @returns True if the screen was removed, false if it was not found.
   */
  removeScreen(key: string): boolean {
    return this.screens.delete(key);
  }

  /**
   * Gets the entity ID of a screen.
   * @param key The key identifying the screen.
   * @returns The entity ID of the screen, or undefined if not found.
   */
  getScreen(key: string): string | undefined {
    return this.screens.get(key);
  }

  /**
   * Checks if a screen exists in the component.
   * @param key The key identifying the screen.
   * @returns True if the screen exists, false otherwise.
   */
  hasScreen(key: string): boolean {
    return this.screens.has(key);
  }

  /**
   * Gets all screens in the component.
   * @returns A map of all screen keys to their entity IDs.
   */
  getAllScreens(): Map<string, string> {
    return new Map(this.screens);
  }

  /**
   * Creates a new instance of ScreensComponent.
   * @returns A new ScreensComponent instance.
   */
  static create(): ScreensComponent {
    return new ScreensComponent();
  }

}
