/**
 * Utility class for runtime type and instance checks used across the codebase.
 *
 * Notes:
 * - Methods with "ensures" use TypeScript assertion signatures to narrow types after validation.
 * - On failure, methods log a helpful error and stack trace, then throw a TypeError.
 */
export class TypeUtils {
  /**
   * Ensures that a value is an instance of a given class.
   *
   * @typeParam T - The expected instance type.
   * @param value - The value to validate.
   * @param Class - The constructor function of the expected type.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not an instance of the provided constructor.
   * @example
   * TypeUtils.ensureInstanceOf(time, Time);
   * // time is now narrowed to Time
   */
  static ensureInstanceOf<T>(value: unknown, Class: new (...args: any[]) => T, message?: string): asserts value is T {
    if (!(value instanceof Class)) {
      const actualType = typeof value;
      const expectedType = Class.name;
      const errorMessage = message || `Expected instance of ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Instance check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
   * Logs whether a value is an instance of the given class constructor.
   *
   * @typeParam T - The expected instance type.
   * @param value - The value to test.
   * @param expectedType - The constructor to test against.
   * @returns {void}
   * @example
   * TypeUtils.logInstanceOf(world, World);
   */
  static logInstanceOf<T>(value: unknown, expectedType: new (...args: any[]) => T): void {
    if (!(value instanceof expectedType)) {
      const actualType = (value as any)?.constructor?.name ?? typeof value;
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
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not a string.
   */
  static ensureString(value: unknown, message?: string): asserts value is string {
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
   *
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not a string or is an empty string.
   */
  static ensureNonEmptyString(value: unknown, message?: string): asserts value is string {
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
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not a number.
   */
  static ensureNumber(value: unknown, message?: string): asserts value is number {
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
   * Ensures that a value is a whole number (integer).
   * If not, it throws an error with details about the type mismatch
   * and prints the stack trace.
   *
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not an integer.
   */
  static ensureInteger(value: unknown, message?: string): asserts value is number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      const actualType = typeof value === 'number' ? 'decimal number' : typeof value;
      const expectedType = 'integer';
      const errorMessage = message || `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Integer check failed");
      throw new TypeError(errorMessage);
    }
  }

  /**
   * Ensures that the provided value is a function.
   *
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not a function.
   */
  static ensureFunction(value: unknown, message?: string): asserts value is (...args: any[]) => unknown {
    if (typeof value !== 'function') {
      throw new TypeError(message || 'Expected a function');
    }
  }

  /**
   * Ensures that the provided value is an array.
   *
   * @typeParam T - The expected element type of the array.
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not an array.
   */
  static ensureArray<T = unknown>(value: unknown, message?: string): asserts value is T[] {
    if (!Array.isArray(value)) {
      throw new TypeError(message || 'Expected an array');
    }
  }

  /**
   * Ensures that the provided value is an object (not null or array).
   * If not, it throws an error with details about the type mismatch
   * and prints the stack trace.
   *
   * @param value - The value to validate.
   * @param message - Optional custom error message.
   * @throws {TypeError} If the value is not an object or is null/array.
   */
  static ensureObject(value: unknown, message?: string): asserts value is Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      const actualType = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
      const expectedType = 'object';
      const errorMessage = message || `Expected type ${expectedType}, but got ${actualType}`;
      console.error(errorMessage);
      console.trace("Object check failed");
      throw new TypeError(errorMessage);
    }
  }
}
