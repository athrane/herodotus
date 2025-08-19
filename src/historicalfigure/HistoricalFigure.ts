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
  private readonly birthYear: number;
  private readonly averageLifeSpan: number;
  private readonly culture: string;
  private readonly occupation: string;

  /**
   * Creates an instance of HistoricalFigure.
   * @param name - The name of the historical figure.
   * @param birthYear - The birth year of the historical figure.
   * @param averageLifeSpan - The expected lifespan in years for this historical figure.
   * @param culture - The culture of the historical figure.
   * @param occupation - The occupation of the historical figure.
   */
  constructor(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string) {
    TypeUtils.ensureString(name, 'HistoricalFigure name must be a string.');
    TypeUtils.ensureNumber(birthYear, 'HistoricalFigure birthYear must be a number.');
    TypeUtils.ensureNumber(averageLifeSpan, 'HistoricalFigure averageLifeSpan must be a number.');
    TypeUtils.ensureString(culture, 'HistoricalFigure culture must be a string.');
    TypeUtils.ensureString(occupation, 'HistoricalFigure occupation must be a string.');
    this.name = name;
    this.birthYear = birthYear;
    this.averageLifeSpan = averageLifeSpan;
    this.culture = culture;
    this.occupation = occupation;
  }

  /**
   * Gets the name of the historical figure.
   * @returns The name of the historical figure.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets the birth year of the historical figure.
   * @returns The birth year of the historical figure.
   */
  getBirthYear(): number {
    return this.birthYear;
  }

  /**
   * Gets the average lifespan of the historical figure.
   * @returns The average lifespan of the historical figure.
   */
  getAverageLifeSpan(): number {
    return this.averageLifeSpan;
  }

  /**
   * Gets the culture of the historical figure.
   * @returns The culture of the historical figure.
   */
  getCulture(): string {
    return this.culture;
  }

  /**
   * Gets the occupation of the historical figure.
   * @returns The occupation of the historical figure.
   */
  getOccupation(): string {
    return this.occupation;
  }

  /**
   * Creates a new HistoricalFigure instance.
   * @param name - The name of the historical figure.
   * @param birthYear - The birth year of the historical figure.
   * @param averageLifeSpan - The expected lifespan in years for this historical figure.
   * @param culture - The culture of the historical figure.
   * @param occupation - The occupation of the historical figure.
   * @returns A new HistoricalFigure instance.
   */
  static create(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string): HistoricalFigure {
    return new HistoricalFigure(name, birthYear, averageLifeSpan, culture, occupation);
  }

  /**
   * Generates a new historical figure with a random name.
   * @param culture - The culture to generate a name from.
   * @param nameGenerator - The name generator to use.
   * @param birthYear - The birth year of the historical figure.
   * @param averageLifeSpan - The expected lifespan in years for this historical figure.
   * @param occupation - The occupation of the historical figure.
   * @returns A new historical figure.
   */
  static generate(culture: string, nameGenerator: NameGenerator, birthYear: number, averageLifeSpan: number, occupation: string): HistoricalFigure {
    const name = nameGenerator.generateHistoricalFigureName(culture, 4, 8);
    return new HistoricalFigure(name, birthYear, averageLifeSpan, culture, occupation);
  }
}