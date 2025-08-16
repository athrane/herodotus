import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Manages the death and other life cycle events of historical figures based on their lifespan.
 */
export class HistoricalFigureLifecycleSystem extends System {

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

        // Check for death
        const calculatedDeathYear = this.calculateDeathYear(historicalFigure);
        if (currentYear === calculatedDeathYear) {
            this.handleHistoricalFigureDeath(entity, historicalFigure, calculatedDeathYear);
        }
    }

    /**
     * Calculates the death year based on birth year and average lifespan.
     * Can be overridden by subclasses to implement more complex logic (e.g., randomization).
     * @param historicalFigure - The historical figure component.
     * @returns The calculated death year.
     */
    protected calculateDeathYear(historicalFigure: HistoricalFigureComponent): number {
        return historicalFigure.birthYear + historicalFigure.averageLifeSpan;
    }

    /**
     * Handles the death of a historical figure.
     * @param entity - The entity representing the historical figure.
     * @param historicalFigure - The historical figure component.
     * @param deathYear - The calculated death year.
     */
    private handleHistoricalFigureDeath(entity: Entity, historicalFigure: HistoricalFigureComponent, deathYear: number): void {
        console.log(`Historical figure ${historicalFigure.name} (died ${deathYear}) has died and exited the simulation.`);
        
        // Record death event for potential chronicle/historical record
        this.recordDeathEvent(historicalFigure, deathYear);
        
        // Clean up the entity by removing the HistoricalFigureComponent
        entity.removeComponent(HistoricalFigureComponent);
        
        // Check if we should destroy the entity completely
        this.cleanupDeadEntity(entity);
    }

    /**
     * Cleans up an entity after historical figure death.
     * Can be overridden by subclasses to implement custom cleanup logic.
     * @param entity - The entity to potentially clean up.
     */
    protected cleanupDeadEntity(entity: Entity): void {
        // Default behavior: keep the entity but without the HistoricalFigureComponent
        // This allows other systems to potentially track "deceased" entities if needed
        
        // If needed, entity could be destroyed with:
        // this.getEntityManager().destroyEntity(entity.getId());
        
        // Or marked with a "deceased" component for historical tracking
        
        // Parameter is intentionally unused in base implementation but available for subclasses
        void entity; // Explicitly mark as intentionally unused
    }

    /**
     * Records the death event for historical tracking.
     * @param historicalFigure - The historical figure component.
     * @param deathYear - The calculated death year.
     */
    private recordDeathEvent(historicalFigure: HistoricalFigureComponent, deathYear: number): void {
        // This could be expanded to create chronicle events, update statistics, etc.
        // For now, we'll just log additional information
        const lifespan = deathYear - historicalFigure.birthYear;
        console.log(`  - ${historicalFigure.name} lived for ${lifespan} years (${historicalFigure.birthYear}-${deathYear})`);
        console.log(`  - Occupation: ${historicalFigure.occupation}, Culture: ${historicalFigure.culture}`);
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