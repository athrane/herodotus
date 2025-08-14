import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent.js';
import { EntityManager } from '../ecs/EntityManager';
import { Entity} from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';
import { World } from '../geography/World';
import { WorldComponent } from '../geography/WorldComponent';
import { ChronicleEventComponent } from '../chronicle/ChronicleEventComponent';
import { HistoricalFigure } from './HistoricalFigure';
import { NameGenerator } from '../naming/NameGenerator.js';
import { NameComponent } from '../ecs/NameComponent';
import { ChronicleEvent } from '../chronicle/ChronicleEvent';
import { EventCategory } from '../chronicle/EventCategory';
import { EventType } from '../chronicle/EventType';
import { Place } from '../generator/Place';

/**
 * Interface for objects representing geographical features.
 */
interface GeographicalFeature {
  getName(): string;
}

/**
 * Interface for objects representing continents.
 */
interface Continent {
  getRandomFeature(): GeographicalFeature | null;
}

/**
 * Interface for World objects that can provide continents.
 */
interface WorldInterface {
  getRandomContinent(): Continent | null;
}

/**
 * Manages the birth of historical figures.
 */
export class HistoricalFigureBirthSystem extends System {

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
     * Name generator for historical figures.
     */
    private readonly nameGenerator: NameGenerator;

    /**
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [TimeComponent, WorldComponent, ChronicleEventComponent]);
        this.nameGenerator = NameGenerator.create();
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param entity - The entity to process.
     * @param currentYear - The current year in the simulation.
     */
    processEntity(entity: Entity, currentYear: number): void {
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        // Get components from the entity
        const timeComponent = this.getEntityManager().getSingletonComponent(TimeComponent);
        if (!timeComponent) return;

        const worldComponent = this.getEntityManager().getSingletonComponent(WorldComponent);
        if (!worldComponent) return;

        const chronicleComponent = this.getEntityManager().getSingletonComponent(ChronicleEventComponent);
        if (!chronicleComponent) return;

        // exit if no historical figure is born
        if (!this.isBorn()) return;

        // get time
        const time = timeComponent.getTime();

        // Generate a random name for the historical figure
        const culture = 'GENERIC';
        const name = this.nameGenerator.generateHistoricalFigureName(culture, 4, 8);

        // define a lifespan for the historical figure
        const lifespan = this.calculateLifespan();

        // Get a random place for the historical figure
        const place = this.computePlace(worldComponent.get());

        // create historical figure
        const historicalFigure = HistoricalFigure.create(name);

        // Create a HistoricalFigureComponent with a random lifespan    
        const historicalFigureComponent = HistoricalFigureComponent.create(
            name,
            currentYear,
            currentYear + lifespan,
            'Not implemented yet',
            'Not implemented yet'
        );
    
        // Create a new entity for the historical figure
        this.getEntityManager().createEntity(
            NameComponent.create(name),
            historicalFigureComponent,
        );

        // Log the birth event
        const eventType = EventType.create(EventCategory.SOCIAL, 'Historical Figure Born');
        const event = ChronicleEvent.create(
            `Historical figure ${name} was born in ${currentYear}.`,
            eventType,
            time,
            place,
            `The historical figure named ${name} was born in the year ${currentYear}. They will live for approximately ${lifespan} years.`,
            historicalFigure);
        chronicleComponent.addEvent(event);
    }

    /**
     * Determine if a historical figure is born.
     * This method can be used to determine if a historical figure is born
     * based on the current year and the birth chance.
     * @returns True if the historical figure is born, false otherwise.
     */
    isBorn(): boolean {
        return Math.random() < HistoricalFigureBirthSystem.BIRTH_CHANCE_PER_YEAR;
    }

    /**
     * Calculate a random lifespan for the historical figure.
     * This method uses a normal distribution to calculate the lifespan.
     * @returns The calculated lifespan in years.
     */
    calculateLifespan(): number {
        const mean = HistoricalFigureBirthSystem.NATURAL_LIFESPAN_MEAN;
        const stdDev = HistoricalFigureBirthSystem.NATURAL_LIFESPAN_STD_DEV;
        return Math.max(1, Math.round(this.randomNormal(mean, stdDev)));
    }

    /**
     * Generate a normally distributed random number using the Box-Muller transform.
     * @param mean - The mean of the normal distribution.
     * @param stdDev - The standard deviation of the normal distribution.
     * @returns A normally distributed random number.
     */
    randomNormal(mean: number, stdDev: number): number {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    /**
     * Calculate a random place for the historical figure.
     * This method retrieves a random geographical feature from the world.
     * @param world - The world instance to get a random place from.
     * @returns A Place instance representing the location of the historical figure's birth.
     */
    computePlace(world: WorldInterface): Place {
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
     * Static factory method to create a HistoricalFigureBirthSystem.
     * @param entityManager - The entity manager instance.
     * @returns A new instance of HistoricalFigureBirthSystem.
     */
    static create(entityManager: EntityManager): HistoricalFigureBirthSystem {
        return new HistoricalFigureBirthSystem(entityManager);
    }
}