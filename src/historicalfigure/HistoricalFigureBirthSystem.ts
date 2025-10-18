import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { TimeComponent } from '../time/TimeComponent';
import { EntityManager } from '../ecs/EntityManager';
import { Entity} from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';
import { GalaxyMapComponent } from '../geography/galaxy/GalaxyMapComponent';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { NameGenerator } from '../naming/NameGenerator';
import { NameComponent } from '../ecs/NameComponent';
import { ChronicleEvent } from '../chronicle/ChronicleEvent';
import { EventCategory } from '../chronicle/EventCategory';
import { EventType } from '../chronicle/EventType';
import { DataSetEvent } from '../data/DataSetEvent';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { ChoiceComponent } from '../behaviour/ChoiceComponent';
import { GeographicalUtils } from '../geography/GeographicalUtils';
import { HistoricalFigureData } from '../data/historicalfigure/HistoricalFigureData';
import { RandomComponent } from '../random/RandomComponent';

/**
 * Manages the birth of historical figures.
 */
export class HistoricalFigureBirthSystem extends System {

    /**
     * Configuration data for historical figures.
     */
    private readonly config: HistoricalFigureData;

    /**
     * @param entityManager - The entity manager instance.
     * @param config - The historical figure configuration.
     */
    constructor(entityManager: EntityManager, config: HistoricalFigureData) {
        super(entityManager, [TimeComponent, GalaxyMapComponent, ChronicleComponent]);
        TypeUtils.ensureInstanceOf(config, HistoricalFigureData);
        this.config = config;
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param entity - The entity to process.
     * @param currentYear - The current year in the simulation.
     */
    processEntity(entity: Entity, currentYear: number): void {
        TypeUtils.ensureInstanceOf(entity, Entity);
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        // Get time component from the global entity
        const timeComponent = entity.getComponent(TimeComponent);
        if (!timeComponent) return;

        // Get chronicle component from the global entity
        const chronicleComponent = entity.getComponent(ChronicleComponent);
        if (!chronicleComponent) return;

        // Get GalaxyMapComponent from the global entity
        const galaxyMapComponent = entity.getComponent(GalaxyMapComponent);
        if (!galaxyMapComponent) return;

        // Get random component from the global entity
        const randomComponent = this.getEntityManager().getSingletonComponent(RandomComponent);
        if (!randomComponent) return;

        // exit if no historical figure is born
        if (!this.isBorn(randomComponent)) return;

        // get time
        const time = timeComponent.getTime();

        // get year
        const year = time.getYear();

        // Generate a random name for the historical figure
        const culture = 'GENERIC';
        const nameGenerator = NameGenerator.create(randomComponent);
        const name = nameGenerator.generateHistoricalFigureName(culture, 4, 8);

        // define a lifespan in years for the historical figure
        const lifespanYears = this.calculateLifespan(randomComponent);

        // Get a random location for the historical figure
        const locationComponent = GeographicalUtils.computeRandomLocation(galaxyMapComponent, randomComponent);
        const historicalFigureComponent = HistoricalFigureComponent.create(
            name,
            year,
            year + lifespanYears,
            'Not implemented yet',
            'Not implemented yet'
        );

        // Create a DataSetEvent for the historical figure's birth
        const birthEvent = new DataSetEvent({
            "Event Type": "Social",
            "Event Trigger": `NPC_BIRTH_${year}_${randomComponent.nextInt(0, 9999)}`,
            "Event Name": `Birth of ${name}`,
            "Event Consequence": `Birth`,
            "Heading": "A New Figure Emerges",
            "Location": locationComponent.getName(),
            "Primary Actor": name,
            "Secondary Actor": "The Community",
            "Motive": "Natural birth and emergence into society",
            "Description": `${name} was born in ${locationComponent.getName()} during the year ${year}. This individual is destined to become a notable figure in history, with an expected lifespan of ${lifespanYears} years.`,
            "Consequence": `The world gains a new historical figure who may influence future events`,
            "Tags": "birth, historical-figure, social, emergence"
        });
    
        // Create a new entity for the historical figure with components
        this.getEntityManager().createEntity(
            NameComponent.create(name),
            historicalFigureComponent,
            DataSetEventComponent.create(birthEvent),
            ChoiceComponent.create([]), // Start with empty choices, will be populated by ComputeChoicesSystem
            locationComponent // Attach the LocationComponent to give the figure a persistent location
        );

        // Log the birth event
        const eventType = EventType.create(EventCategory.SOCIAL, 'Historical Figure Born');
        const event = ChronicleEvent.create(
            `Historical figure ${name} was born in ${year}.`,
            eventType,
            time,
            locationComponent,
            `The historical figure named ${name} was born in the year ${year}. They will live for approximately ${lifespanYears} years.`,
            historicalFigureComponent);
        chronicleComponent.addEvent(event);
    }

    /**
     * Determine if a historical figure is born.
     * This method can be used to determine if a historical figure is born
     * based on the current year and the birth chance.
     * @param randomComponent - The RandomComponent to use for random number generation.
     * @returns True if the historical figure is born, false otherwise.
     */
    isBorn(randomComponent: RandomComponent): boolean {
        TypeUtils.ensureInstanceOf(randomComponent, RandomComponent);
        return randomComponent.next() < this.config.getBirthChancePerYear();
    }

    /**
     * Calculate a random lifespan for the historical figure.
     * This method uses a normal distribution to calculate the lifespan.
     * @param randomComponent - The RandomComponent to use for random number generation.
     * @returns The calculated lifespan in years.
     */
    calculateLifespan(randomComponent: RandomComponent): number {
        TypeUtils.ensureInstanceOf(randomComponent, RandomComponent);
        const mean = this.config.getNaturalLifespanMean();
        const stdDev = this.config.getNaturalLifespanStdDev();
        return Math.max(1, Math.round(this.randomNormal(mean, stdDev, randomComponent)));
    }

    /**
     * Generate a normally distributed random number using the Box-Muller transform.
     * @param mean - The mean of the normal distribution.
     * @param stdDev - The standard deviation of the normal distribution.
     * @param randomComponent - The RandomComponent to use for random number generation.
     * @returns A normally distributed random number.
     */
    randomNormal(mean: number, stdDev: number, randomComponent: RandomComponent): number {
        TypeUtils.ensureInstanceOf(randomComponent, RandomComponent);
        const u1 = randomComponent.next();
        const u2 = randomComponent.next();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    /**
     * Static factory method to create a HistoricalFigureBirthSystem.
     * @param entityManager - The entity manager instance.
     * @param config - The historical figure configuration.
     * @returns A new instance of HistoricalFigureBirthSystem.
     */
    static create(entityManager: EntityManager, config: HistoricalFigureData): HistoricalFigureBirthSystem {
        return new HistoricalFigureBirthSystem(entityManager, config);
    }
}