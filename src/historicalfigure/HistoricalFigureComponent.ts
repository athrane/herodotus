import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A marker component to identify an entity as a historical figure.
 * Components are simple data containers. They should not contain any logic.
 */
export class HistoricalFigureComponent extends Component {
    public readonly name: string;
    public readonly birthYear: number;
    public readonly averageLifeSpan: number;
    public readonly culture: string;
    public readonly occupation: string;

    /**
     * @param name - The name of the historical figure.
     * @param birthYear - The birth year of the historical figure.
     * @param averageLifeSpan - The expected lifespan in years for this historical figure.
     * @param culture - The culture of the historical figure.
     * @param occupation - The occupation of the historical figure.
     */
    constructor(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string) {
        super();
        TypeUtils.ensureString(name, 'HistoricalFigureComponent name must be a string.');
        TypeUtils.ensureNumber(birthYear, 'HistoricalFigureComponent birthYear must be a number.');
        TypeUtils.ensureNumber(averageLifeSpan, 'HistoricalFigureComponent averageLifeSpan must be a number.');
        TypeUtils.ensureString(culture, 'HistoricalFigureComponent culture must be a string.');
        TypeUtils.ensureString(occupation, 'HistoricalFigureComponent occupation must be a string.');
        this.name = name;
        this.birthYear = birthYear;
        this.averageLifeSpan = averageLifeSpan;
        this.culture = culture;
        this.occupation = occupation;
    }

    /**
     * Static factory method to create a HistoricalFigureComponent.
     * @param name - The name of the historical figure.
     * @param birthYear - The birth year of the historical figure.
     * @param averageLifeSpan - The expected lifespan in years for this historical figure.
     * @param culture - The culture of the historical figure.
     * @param occupation - The occupation of the historical figure.
     * @returns A new instance of HistoricalFigureComponent.
     */
    static create(name: string, birthYear: number, averageLifeSpan: number, culture: string, occupation: string): HistoricalFigureComponent {
        return new HistoricalFigureComponent(name, birthYear, averageLifeSpan, culture, occupation);
    }
}