import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { ChronicleEvent } from '../chronicle/ChronicleEvent';
import { EventType } from '../chronicle/EventType';
import { EventCategory } from '../chronicle/EventCategory';
import { Time } from '../time/Time';
import { Place } from '../generator/Place';
import { WorldComponent } from '../geography/WorldComponent';
import { HistoricalFigure } from './HistoricalFigure';
import { World } from '../geography/World';

/**
 * Manages the death and other life cycle events of historical figures based on their lifespan.
 */
export class HistoricalFigureLifecycleSystem extends System {

    /**
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [HistoricalFigureComponent]);
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param entity - The entity to process.
     * @param currentYear - The current year in the simulation.
     */
    processEntity(entity: Entity, currentYear: number): void {
        TypeUtils.ensureInstanceOf(entity, Entity);
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        // Get the historical figure component from the entity
        const historicalFigure = entity.getComponent(HistoricalFigureComponent);
        if (!historicalFigure) return;

        // Get the TimeComponent from the entity manager
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
     * Calculate a random place for the historical figure's death.
     * This method retrieves a random geographical feature from the world.
     * @param world - The world instance to get a random place from.
     * @returns A Place instance representing the location of the historical figure's death.
     */
    private computePlace(world: World): Place {
        TypeUtils.ensureInstanceOf(world, World);
        const continent = world.getRandomContinent();
        if (continent) {
            const randomFeature = continent.getRandomFeature();
            if (randomFeature) {
                return Place.create(randomFeature.getName());
            }
        }
        return Place.create('Unknown Location');
    }

    /**
     * Records the death event for historical tracking.
     * @param historicalFigure - The historical figure component.
     * @param deathYear - The calculated death year.
     */
    private recordDeathEvent(historicalFigure: HistoricalFigureComponent, deathYear: number): void {
        // Calculate lifespan for the description
        const lifespan = deathYear - historicalFigure.birthYear;
        
        // Always log the basic information (for backwards compatibility with tests)
        console.log(`Historical figure ${historicalFigure.name} (died ${deathYear}) has died and exited the simulation.`);
        console.log(`  - ${historicalFigure.name} lived for ${lifespan} years (${historicalFigure.birthYear}-${deathYear})`);
        console.log(`  - Occupation: ${historicalFigure.occupation}, Culture: ${historicalFigure.culture}`);

        // Try to create a chronicle event if the required components are available
        const chronicleComponent = this.getEntityManager().getSingletonComponent(ChronicleComponent);
        const worldComponent = this.getEntityManager().getSingletonComponent(WorldComponent);
        
        if (chronicleComponent && worldComponent) {
            // Create the time and place for the death event
            const time = Time.create(deathYear);
            const place = this.computePlace(worldComponent.get());
            
            // Create the historical figure instance for the chronicle event
            const historicalFigureInstance = HistoricalFigure.create(historicalFigure.name);
            
            // Create the event type for death
            const eventType = EventType.create(EventCategory.SOCIAL, 'Historical Figure Death');
            
            // Create the chronicle event
            const event = ChronicleEvent.create(
                `${historicalFigure.name} has died in ${deathYear}.`,
                eventType,
                time,
                place,
                `The historical figure ${historicalFigure.name} has died in the year ${deathYear} at ${place.getName()}. ` +
                `They lived for ${lifespan} years (${historicalFigure.birthYear}-${deathYear}). ` +
                `Their occupation was ${historicalFigure.occupation} and they belonged to the ${historicalFigure.culture} culture.`,
                historicalFigureInstance
            );
            
            // Add the event to the chronicle
            chronicleComponent.addEvent(event);
            
            // Log additional information for chronicle recording
            console.log(`  - Death recorded in chronicle at ${place.getName()}`);
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