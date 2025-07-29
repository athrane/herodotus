/**
 * Utility class for generic checks.
 */
export class TypeUtils {
  /**
   * Ensures that a value is an instance of a given class. If not, it throws a TypeError.
   *
   * @param {any} value The value to check.
   * @param {Function} Class The expected class (constructor function).
   */
  static ensureInstanceOf(value, Class) {
    if (!(value instanceof Class)) {
      const actualType = typeof value;
      const expectedType = Class.name;
      const errorMessage = `Expected instance of ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Instance check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
     * Ensures that a value is of type string.
     * If not, it throws an error with details about the type mismatch
     * and prints the stack trace.
     *
     * @param {any} value The value to check.
     */
  static ensureString(value) {
    if (typeof value !== 'string') {
      const actualType = typeof value;
      const expectedType = 'string';
      const errorMessage = `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("String check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
     * Ensures that a value is of type number.
     * If not, it throws an error with details about the type mismatch
     * and prints the stack trace.
     *
     * @param {any} value The value to check.
     */
  static ensureNumber(value) {
    if (typeof value !== 'number') {
      const actualType = typeof value;
      const expectedType = 'number';
      const errorMessage = `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Number check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
   * Ensures that the provided value is a function.
   * @param {any} value The value to check.
   * @param {string} [message] Optional error message to throw if the value is not a function.
   * @throws {Error} If the value is not a function.
   */
  static ensureFunction(value, message) {
    if (typeof value !== 'function') {
      throw new TypeError(message || 'Expected a function');
    }
  }

  /**
       * Ensures that the provided value is an array.
       * @param {any} value The value to check.
       * @param {string} [message] Optional error message to throw if the value is not an array.
       * @throws {Error} If the value is not an array.
  */
  static ensureArray(value, message) {
    if (!Array.isArray(value)) {
      throw new TypeError(message || 'Expected an array');
    }
  }

}