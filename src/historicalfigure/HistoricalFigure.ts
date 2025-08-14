import { TypeUtils } from '../util/TypeUtils';

/**
 * Interface for objects that can generate names for historical figures.
 */
interface NameGenerator {
  generateHistoricalFigureName(culture: string, minLength: number, maxLength: number): string;
}

/**
 * Represents a historical figure involved in an event.
 */
export class HistoricalFigure {
  private readonly name: string;

  /**
   * Creates an instance of HistoricalFigure.
   * @param name - The name of the historical figure.
   */
  constructor(name: string) {
    TypeUtils.ensureString(name, 'HistoricalFigure name must be a string.');
    this.name = name;
  }

  /**
   * Gets the name of the historical figure.
   * @returns The name of the historical figure.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Creates a new HistoricalFigure instance.
   * @param name - The name of the historical figure.
   * @returns A new HistoricalFigure instance.
   */
  static create(name: string): HistoricalFigure {
    return new HistoricalFigure(name);
  }

  /**
   * Generates a new historical figure with a random name.
   * @param culture - The culture to generate a name from.
   * @param nameGenerator - The name generator to use.
   * @returns A new historical figure.
   */
  static generate(culture: string, nameGenerator: NameGenerator): HistoricalFigure {
    const name = nameGenerator.generateHistoricalFigureName(culture, 4, 8);
    return new HistoricalFigure(name);
  }
}