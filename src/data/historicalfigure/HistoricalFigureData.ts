import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents historical figure configuration data loaded from JSON.
 * This class provides runtime validation and type safety for historical figure parameters.
 */
export class HistoricalFigureData {
  private readonly birthChancePerYear: number;
  private readonly naturalLifespanMean: number;
  private readonly naturalLifespanStdDev: number;

  private static instance: HistoricalFigureData | null = null;

  /**
   * Creates a new HistoricalFigureData instance from JSON data.
   * @param data - The JSON object containing historical figure configuration.
   */
  constructor(data: any) {
    TypeUtils.ensureNumber(data?.birthChancePerYear, 'HistoricalFigureData birthChancePerYear must be a number.');
    TypeUtils.ensureNumber(data?.naturalLifespanMean, 'HistoricalFigureData naturalLifespanMean must be a number.');
    TypeUtils.ensureNumber(data?.naturalLifespanStdDev, 'HistoricalFigureData naturalLifespanStdDev must be a number.');

    this.birthChancePerYear = data.birthChancePerYear;
    this.naturalLifespanMean = data.naturalLifespanMean;
    this.naturalLifespanStdDev = data.naturalLifespanStdDev;
    Object.freeze(this); // Make instances immutable
  }

  /**
   * Static factory method to create a HistoricalFigureData instance.
   * @param data - The JSON object containing historical figure configuration.
   * @returns A new HistoricalFigureData instance.
   */
  static create(data: any): HistoricalFigureData {
    return new HistoricalFigureData(data);
  }

  /**
   * Creates a null instance of HistoricalFigureData with default values.
   * Uses lazy initialization to create singleton null instance.
   * @returns A null HistoricalFigureData instance.
   */
  static createNull(): HistoricalFigureData {
    if (!HistoricalFigureData.instance) {
      HistoricalFigureData.instance = HistoricalFigureData.create({
        birthChancePerYear: 0,
        naturalLifespanMean: 0,
        naturalLifespanStdDev: 0
      });
    }
    return HistoricalFigureData.instance;
  }

  /**
   * Gets the chance of a historical figure being born each year.
   * @returns The birth chance per year.
   */
  getBirthChancePerYear(): number {
    return this.birthChancePerYear;
  }

  /**
   * Gets the mean lifespan of a historical figure in years.
   * @returns The natural lifespan mean.
   */
  getNaturalLifespanMean(): number {
    return this.naturalLifespanMean;
  }

  /**
   * Gets the standard deviation for the lifespan of a historical figure.
   * @returns The natural lifespan standard deviation.
   */
  getNaturalLifespanStdDev(): number {
    return this.naturalLifespanStdDev;
  }
}
