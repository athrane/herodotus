/**
 * A base class for all components in the Entity-Component-System (ECS) architecture.
 * Components are simple data containers. They should not contain any logic.
 * This class serves as a marker to identify objects as components.
 */
export class Component {
  private static _nullInstance: Component | null = null;

  /**
   * Returns a null object instance of Component.
   * This instance serves as a safe, neutral placeholder when a Component is not available.
   * @returns A null Component instance.
   */
  static get Null(): Component {
    if (!Component._nullInstance) {
      Component._nullInstance = new Component();
      Object.freeze(Component._nullInstance);
    }
    return Component._nullInstance!;
  }
}