import { Component } from '../../ecs/Component';

/**
 * Represents a component that holds a queue of actions to be processed.
 */
export class ActionQueueComponent extends Component {
  public queue: string[] = [];
  private static nullInstance: ActionQueueComponent | null = null;

  /**
   * Adds an action to the queue.
   * @param actionId The ID of the action to add.
   */
  public addAction(actionId: string): void {
    this.queue.push(actionId);
  }

  /**
   * Gets the list of actions in the queue.
   * @returns An array of action IDs.
   */
  public getActions(): string[] {
    return this.queue;
  }

  /**
   * Clears the action queue.
   */   
  public clear(): void {
    this.queue = [];
  }

  /**
   * Returns a null object instance of ActionQueueComponent.
   * This instance serves as a safe, neutral placeholder when an ActionQueueComponent is not available.
   * @returns A null ActionQueueComponent instance with empty queue.
   */
  static get Null(): ActionQueueComponent {
    if (!ActionQueueComponent.nullInstance) {
      const instance = Object.create(ActionQueueComponent.prototype);
      instance.queue = [];
      Object.freeze(instance);
      ActionQueueComponent.nullInstance = instance;
    }
    return ActionQueueComponent.nullInstance!;
  }
}
