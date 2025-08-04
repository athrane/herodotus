import { System } from '../ecs/System.js';
import { HistoricalFigureComponent } from './HistoricalFigureComponent.js';
import { TimeComponent } from '../time/TimeComponent.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * @class HistoricalFigureLifecycleSystem
 * @augments System
 * @description Manages the birth and death of historical figures based on their lifespan.
 */
export class HistoricalFigureLifecycleSystem extends System {
    /**
     * @param {EntityManager} entityManager - The entity manager instance.
     */
    constructor(entityManager) {
        super(entityManager, [HistoricalFigureComponent, TimeComponent]);
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

    /**
     * Processes a single entity to manage its lifecycle.
     * @param {Entity} entity - The entity to process.
     * @param {number} currentYear - The current year in the simulation.
     */
    processEntity(entity, currentYear) {
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        const historicalFigure = entity.getComponent(HistoricalFigureComponent);
        const timeComponent = this.entityManager.getSingletonComponent(TimeComponent);

        if (!historicalFigure || !timeComponent) {
            return;
        }

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
}
