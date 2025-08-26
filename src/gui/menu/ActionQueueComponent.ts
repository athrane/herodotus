import { Component } from '../../ecs/Component';

/**
 * Represents a component that holds a queue of actions to be processed.
 */
export class ActionQueueComponent extends Component {
  public queue: string[] = [];

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
}
