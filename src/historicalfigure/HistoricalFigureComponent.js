import { Component } from '../ecs/Component.js';
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * @class HistoricalFigureComponent
 * @augments Component
 * @description A marker component to identify an entity as a historical figure.
 * Components are simple data containers. They should not contain any logic.
 */
export class HistoricalFigureComponent extends Component {
    /**
     * @constructor
     * @param {string} name - The name of the historical figure.
     * @param {number} birthYear - The birth year of the historical figure.
     * @param {number} deathYear - The death year of the historical figure.
     * @param {string} culture - The culture of the historical figure.
     * @param {string} occupation - The occupation of the historical figure.
     */
    constructor(name, birthYear, deathYear, culture, occupation) {
        super();
        TypeUtils.ensureString(name, 'HistoricalFigureComponent name must be a string.');
        TypeUtils.ensureNumber(birthYear, 'HistoricalFigureComponent birthYear must be a number.');
        TypeUtils.ensureNumber(deathYear, 'HistoricalFigureComponent deathYear must be a number.');
        TypeUtils.ensureString(culture, 'HistoricalFigureComponent culture must be a string.');
        TypeUtils.ensureString(occupation, 'HistoricalFigureComponent occupation must be a string.');
        this.name = name;
        this.birthYear = birthYear;
        this.deathYear = deathYear;
        this.culture = culture;
        this.occupation = occupation;
    }

    /**
     * Static factory method to create a HistoricalFigureComponent.
     * @static
     * @param {string} name - The name of the historical figure.
     * @param {number} birthYear - The birth year of the historical figure.
     * @param {number} deathYear - The death year of the historical figure.
     * @param {string} culture - The culture of the historical figure.
     * @param {string} occupation - The occupation of the historical figure.
     * @returns {HistoricalFigureComponent} A new instance of HistoricalFigureComponent.
     */
    static create(name, birthYear, deathYear, culture, occupation) {
        return new HistoricalFigureComponent(name, birthYear, deathYear, culture, occupation);
    }
}
