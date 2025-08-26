import { TypeUtils } from '../../util/TypeUtils';
import { Component } from '../../ecs/Component';

/**
 * Represents an action component that holds an action ID.
 */
export class ActionComponent extends Component {
  public actionId: string;

  /**
   * Constructs an ActionComponent with the given action ID.
   * @param actionId The action ID associated with the component.
   */
  constructor(actionId: string) {
    super();
    TypeUtils.ensureString(actionId, "actionId must be a string");
    this.actionId = actionId;
  }

  /**
   * Gets the action ID associated with the component.
   * @returns The action ID of the component.
   */
  getActionId(): string {
    return this.actionId;
  }
  
}
