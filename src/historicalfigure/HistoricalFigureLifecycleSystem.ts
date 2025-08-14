import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent.js';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Manages the birth and death of historical figures based on their lifespan.
 */
export class HistoricalFigureLifecycleSystem extends System {

    /**
     * The chance of a historical figure being born each year.
     */
    static readonly BIRTH_CHANCE_PER_YEAR: number = 0.05;

    /**
     * The mean lifespan of a historical figure in years.
     */
    static readonly NATURAL_LIFESPAN_MEAN: number = 70;

    /**
     * The standard deviation for the lifespan of a historical figure.
     */
    static readonly NATURAL_LIFESPAN_STD_DEV: number = 15;

    /**
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [HistoricalFigureComponent, TimeComponent]);
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param entity - The entity to process.
     * @param currentYear - The current year in the simulation.
     */
    processEntity(entity: Entity, currentYear: number): void {
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
     * @param entityManager - The entity manager instance.
     * @returns A new instance of HistoricalFigureLifecycleSystem.
     */
    static create(entityManager: EntityManager): HistoricalFigureLifecycleSystem {
        return new HistoricalFigureLifecycleSystem(entityManager);
    }
}