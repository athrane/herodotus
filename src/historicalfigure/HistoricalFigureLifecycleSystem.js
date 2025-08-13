import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent.js';
import { TimeComponent } from '../time/TimeComponent.js';
import { EntityManager } from '../ecs/EntityManager';
import { TypeUtils } from '../util/TypeUtils.ts';

/**
 * @class HistoricalFigureLifecycleSystem
 * @augments System
 * @description Manages the birth and death of historical figures based on their lifespan.
 */
export class HistoricalFigureLifecycleSystem extends System {

    /**
     * @constant
     * @type {number}
     * @description The chance of a historical figure being born each year.
     * @default 0.05
     */
    static BIRTH_CHANCE_PER_YEAR = 0.05;

    /**
     * @constant
     * @type {number}
     * @description The mean lifespan of a historical figure in years.
     * @default 70
     */
    static NATURAL_LIFESPAN_MEAN = 70;

    /**
     * @constant
     * @type {number}
     * @description The standard deviation for the lifespan of a historical figure.
     * @default 15
     */
    static NATURAL_LIFESPAN_STD_DEV = 15;

    /**
     * @param {EntityManager} entityManager - The entity manager instance.
     */
    constructor(entityManager) {
        super(entityManager, [HistoricalFigureComponent, TimeComponent]);
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param {Entity} entity - The entity to process.
     * @param {number} currentYear - The current year in the simulation.
     */
    processEntity(entity, currentYear) {
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        // Get the HistoricalFigureComponent and TimeComponent from the entity
        const historicalFigure = entity.getComponent(HistoricalFigureComponent);
        if (!historicalFigure) return;

        const timeComponent = this.getEntityManager().getSingletonComponent(TimeComponent);
        if (!timeComponent) return;

        // Check for birth
        if (currentYear === historicalFigure.birthYear) {
            // Logic to 'introduce' the historical figure into the simulation
            // For now, we'll just log it. More complex logic can be added later.
            console.log(`Historical figure ${historicalFigure.name} (born ${historicalFigure.birthYear}) has entered the simulation.`);
        }

        // Check for death
        if (currentYear === historicalFigure.deathYear) {
            // Logic to 'remove' or 'deactivate' the historical figure

            // For now, we'll just log it and remove the HistoricalFigureComponent.
            console.log(`Historical figure ${historicalFigure.name} (died ${historicalFigure.deathYear}) has exited the simulation.`);
            entity.removeComponent(HistoricalFigureComponent);
        }
    }

    /**
     * Static factory method to create a HistoricalFigureLifecycleSystem.
     * @static
     * @param {EntityManager} entityManager - The entity manager instance.
     * @returns {HistoricalFigureLifecycleSystem} A new instance of HistoricalFigureLifecycleSystem.
     */
    static create(entityManager) {
        return new HistoricalFigureLifecycleSystem(entityManager);
    }

}
