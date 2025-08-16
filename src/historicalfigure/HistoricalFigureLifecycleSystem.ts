import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent';
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
            this.handleHistoricalFigureDeath(entity, historicalFigure);
        }
    }

    /**
     * Handles the death of a historical figure.
     * @param entity - The entity representing the historical figure.
     * @param historicalFigure - The historical figure component.
     */
    private handleHistoricalFigureDeath(entity: Entity, historicalFigure: HistoricalFigureComponent): void {
        console.log(`Historical figure ${historicalFigure.name} (died ${historicalFigure.deathYear}) has died and exited the simulation.`);
        
        // Record death event for potential chronicle/historical record
        this.recordDeathEvent(historicalFigure);
        
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
     */
    private recordDeathEvent(historicalFigure: HistoricalFigureComponent): void {
        // This could be expanded to create chronicle events, update statistics, etc.
        // For now, we'll just log additional information
        const lifespan = historicalFigure.deathYear - historicalFigure.birthYear;
        console.log(`  - ${historicalFigure.name} lived for ${lifespan} years (${historicalFigure.birthYear}-${historicalFigure.deathYear})`);
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