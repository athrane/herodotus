export declare class TypeUtils {
  static ensureInstanceOf<T>(value: unknown, Class: new (...args: any[]) => T): asserts value is T;
  static logInstanceOf<T>(value: unknown, expectedType: new (...args: any[]) => T): void;
  static ensureString(value: unknown, message?: string): asserts value is string;
  static ensureNonEmptyString(value: unknown, message?: string): asserts value is string;
  static ensureNumber(value: unknown, message?: string): asserts value is number;
  static ensureFunction(value: unknown, message?: string): asserts value is (...args: any[]) => unknown;
  static ensureArray<T = unknown>(value: unknown, message?: string): asserts value is T[];
}
