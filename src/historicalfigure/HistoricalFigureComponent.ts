import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';
import { HistoricalFigure } from './HistoricalFigure';

/**
 * A marker component to identify an entity as a historical figure.
 * Components are simple data containers. They should not contain any logic.
 */
export class HistoricalFigureComponent extends Component {
    private readonly historicalFigure: HistoricalFigure;

    /**
     * @param historicalFigure - The historical figure instance.
     */
    constructor(historicalFigure: HistoricalFigure) {
        super();
        TypeUtils.ensureInstanceOf(historicalFigure, HistoricalFigure, 'HistoricalFigureComponent historicalFigure must be a HistoricalFigure instance.');
        this.historicalFigure = historicalFigure;
    }

    /**
     * Gets the historical figure instance.
     * @returns The historical figure instance.
     */
    getHistoricalFigure(): HistoricalFigure {
        return this.historicalFigure;
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
        const historicalFigure = HistoricalFigure.create(name, birthYear, averageLifeSpan, culture, occupation);
        return new HistoricalFigureComponent(historicalFigure);
    }

    /**
     * Static factory method to create a HistoricalFigureComponent from an existing HistoricalFigure.
     * @param historicalFigure - The historical figure instance.
     * @returns A new instance of HistoricalFigureComponent.
     */
    static fromHistoricalFigure(historicalFigure: HistoricalFigure): HistoricalFigureComponent {
        return new HistoricalFigureComponent(historicalFigure);
    }
}