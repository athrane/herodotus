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
   * Logs an instance of a class to the console.
   * @param {any} value The value to log.
   * @param {Function} expectedType The expected class (constructor function).
   */
  static logInstanceOf(value, expectedType) {
    if (!(value instanceof expectedType)) {
      const actualType = value.constructor.name;
      const errorMessage = `Expected instance of ${expectedType.name}, but got ${actualType}`;
      console.log(errorMessage);
    } else {
      console.log(`Value is an instance of ${expectedType.name}`);
    }
  }


  /**
     * Ensures that a value is of type string.
     * If not, it throws an error with details about the type mismatch
     * and prints the stack trace.
     *
     * @param {any} value The value to check.
     * @param {string} [message] Optional error message to throw if the value is not a string.
     */
  static ensureString(value, message) {
    if (typeof value !== 'string') {
      const actualType = typeof value;
      const expectedType = 'string';
      const errorMessage = message || `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("String check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
     * Ensures that a value is a non-empty string.
     * If not, it throws an error with details about the type mismatch
     * and prints the stack trace.
     * @param {any} value The value to check.
     * @param {string} [message] Optional error message to throw if the value is not a non-empty string.
     */
  static ensureNonEmptyString(value, message) {
    if (typeof value !== 'string' || value.length === 0) {
      const actualType = typeof value;
      const expectedType = 'non-empty string';
      const errorMessage = message || `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Non-empty string check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
     * Ensures that a value is of type number.
     * If not, it throws an error with details about the type mismatch
     * and prints the stack trace.
     *
     * @param {any} value The value to check.
     * @param {string} [message] Optional error message to throw if the value is not a number.
     */
  static ensureNumber(value, message) {
    if (typeof value !== 'number') {
      const actualType = typeof value;
      const expectedType = 'number';
      const errorMessage = message || `Expected type ${expectedType}, but got ${actualType}`;
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