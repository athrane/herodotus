import { Component } from '../../ecs/Component';

/**
 * Represents an input component that holds the last user input.
 */
export class InputComponent extends Component {
  private lastInput: string | null = null;

  /**
   * Gets the last user input.
   * @returns The last user input or null if not set.
   */
  getLastInput(): string | null {
    return this.lastInput;
  }

  /**
   * Sets the last user input.
   * @param input The user input to set.
   */
  setLastInput(input: string | null): void {
    this.lastInput = input;
  }
}
