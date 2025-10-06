import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents historical figure birth configuration data loaded from JSON.
 * This class provides runtime validation and type safety for historical figure birth parameters.
 */
export class HistoricalFigureBirthData {
  private readonly birthChancePerYear: number;
  private readonly naturalLifespanMean: number;
  private readonly naturalLifespanStdDev: number;

  private static instance: HistoricalFigureBirthData | null = null;

  /**
   * Creates a new HistoricalFigureBirthData instance from JSON data.
   * @param data - The JSON object containing historical figure birth configuration.
   */
  constructor(data: any) {
    TypeUtils.ensureNumber(data?.birthChancePerYear, 'HistoricalFigureBirthData birthChancePerYear must be a number.');
    TypeUtils.ensureNumber(data?.naturalLifespanMean, 'HistoricalFigureBirthData naturalLifespanMean must be a number.');
    TypeUtils.ensureNumber(data?.naturalLifespanStdDev, 'HistoricalFigureBirthData naturalLifespanStdDev must be a number.');

    this.birthChancePerYear = data.birthChancePerYear;
    this.naturalLifespanMean = data.naturalLifespanMean;
    this.naturalLifespanStdDev = data.naturalLifespanStdDev;
    Object.freeze(this); // Make instances immutable
  }

  /**
   * Static factory method to create a HistoricalFigureBirthData instance.
   * @param data - The JSON object containing historical figure birth configuration.
   * @returns A new HistoricalFigureBirthData instance.
   */
  static create(data: any): HistoricalFigureBirthData {
    return new HistoricalFigureBirthData(data);
  }

  /**
   * Creates a null instance of HistoricalFigureBirthData with default values.
   * Uses lazy initialization to create singleton null instance.
   * @returns A null HistoricalFigureBirthData instance.
   */
  static createNull(): HistoricalFigureBirthData {
    if (!HistoricalFigureBirthData.instance) {
      HistoricalFigureBirthData.instance = HistoricalFigureBirthData.create({
        birthChancePerYear: 0,
        naturalLifespanMean: 0,
        naturalLifespanStdDev: 0
      });
    }
    return HistoricalFigureBirthData.instance;
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
