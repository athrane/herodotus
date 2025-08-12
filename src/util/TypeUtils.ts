/**
 * Utility class for generic checks.
 */
export class TypeUtils {
  /**
   * Ensures that a value is an instance of a given class. If not, it throws a TypeError.
   */
  static ensureInstanceOf<T>(value: unknown, Class: new (...args: any[]) => T): asserts value is T {
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
   * Ensures that the provided value is a function.
   */
  static ensureFunction(value: unknown, message?: string): asserts value is (...args: any[]) => unknown {
    if (typeof value !== 'function') {
      throw new TypeError(message || 'Expected a function');
    }
  }

  /**
   * Ensures that the provided value is an array.
   */
  static ensureArray<T = unknown>(value: unknown, message?: string): asserts value is T[] {
    if (!Array.isArray(value)) {
      throw new TypeError(message || 'Expected an array');
    }
  }
}
