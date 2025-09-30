import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Contract describing an object that can generate historical figure names.
 */
export interface HistoricalFigureNameGenerator {
    generateHistoricalFigureName(culture: string, minLength: number, maxLength: number): string;
}

/**
 * A component that stores historical figure metadata directly on an entity.
 */
export class HistoricalFigureComponent extends Component {
    private readonly name: string;
    private readonly birthYear: number;
    private readonly averageLifeSpan: number;
    private readonly culture: string;
    private readonly occupation: string;

    /**
     * @param name - The name of the historical figure.
     * @param birthYear - The birth year of the historical figure.
     * @param averageLifeSpan - The expected lifespan in years for this historical figure.
     * @param culture - The culture of the historical figure.
     * @param occupation - The occupation of the historical figure.
     */
    constructor(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string) {
        super();
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
     * @return The culture of the historical figure.
     */
    getCulture(): string {
        return this.culture;
    }

    /**
     * Gets the occupation of the historical figure.
     * @return The occupation of the historical figure.
     */
    getOccupation(): string {
        return this.occupation;
    }

    /**
     * Static factory method to create a HistoricalFigureComponent.
     * @param name - The name of the historical figure.
     * @param birthYear - The birth year of the historical figure.
     * @param averageLifeSpan - The expected lifespan in years for this historical figure.
     * @param culture - The culture of the historical figure.
     * @param occupation - The occupation of the historical figure.
     * @return A new instance of HistoricalFigureComponent.
     */
    static create(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string): HistoricalFigureComponent {
        return new HistoricalFigureComponent(name, birthYear, averageLifeSpan, culture, occupation);
    }

    /**
     * Generates a new HistoricalFigureComponent using a name generator.
     * @param culture - The culture to generate a name from.
     * @param nameGenerator - The generator to produce the historical figure name.
     * @param birthYear - The birth year of the historical figure.
     * @param averageLifeSpan - The expected lifespan in years for this historical figure.
     * @param occupation - The occupation of the historical figure.
     * @return A new instance of HistoricalFigureComponent.
     */
    static generate(
        culture: string,
        nameGenerator: HistoricalFigureNameGenerator,
        birthYear: number,
        averageLifeSpan: number,
        occupation: string
    ): HistoricalFigureComponent {
        TypeUtils.ensureString(culture, 'HistoricalFigure culture must be a string.');
        TypeUtils.ensureFunction(nameGenerator, 'HistoricalFigure nameGenerator must be an object with a generateHistoricalFigureName function.');
        TypeUtils.ensureNumber(birthYear, 'HistoricalFigure birthYear must be a number.');
        TypeUtils.ensureNumber(averageLifeSpan, 'HistoricalFigure averageLifeSpan must be a number.');
        TypeUtils.ensureString(occupation, 'HistoricalFigure occupation must be a string.');

        const name = nameGenerator.generateHistoricalFigureName(culture, 4, 8);
        TypeUtils.ensureString(name, 'Generated historical figure name must be a string.');
        TypeUtils.ensureNonEmptyString(name, 'Generated historical figure name must not be empty.');

        return HistoricalFigureComponent.create(name, birthYear, averageLifeSpan, culture, occupation);
    }
}