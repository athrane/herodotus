import { Component } from '../../ecs/Component';

/**
 * Represents an input component that holds the last user input.
 */
export class InputComponent extends Component {
  private lastInput: string | null = null;
  private static nullInstance: InputComponent | null = null;

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

  /**
   * Clears the last user input.
   */
  clear(): void {
    this.lastInput = null;
  }

  /**
   * Checks if the last user input is defined.
   * @returns True if last input is defined, false otherwise.
   */
  isDefined(): boolean {
    return this.lastInput !== null;
  }

  /**
   * Returns a null object instance of InputComponent.
   * This instance serves as a safe, neutral placeholder when an InputComponent is not available.
   * @returns A null InputComponent instance with no input.
   */
  static get Null(): InputComponent {
    if (!InputComponent.nullInstance) {
      const instance = Object.create(InputComponent.prototype);
      instance.lastInput = null;
      Object.freeze(instance);
      InputComponent.nullInstance = instance;
    }
    return InputComponent.nullInstance!;
  }

}
