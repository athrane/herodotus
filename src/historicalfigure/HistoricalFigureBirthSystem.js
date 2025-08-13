import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent.js';
import { TimeComponent } from '../time/TimeComponent.js';
import { EntityManager } from '../ecs/EntityManager';
import { TypeUtils } from '../util/TypeUtils.ts';
import { World } from '../geography/World.js';
import { WorldComponent } from '../geography/WorldComponent.js';
import { ChronicleEventComponent } from '../chronicle/ChronicleEventComponent.ts';
import { HistoricalFigure } from './HistoricalFigure.js';
import { NameGenerator } from '../naming/NameGenerator.js';
import { NameComponent } from '../ecs/NameComponent';
import { ChronicleEvent } from '../chronicle/ChronicleEvent.ts';
import { EventCategory } from '../chronicle/EventCategory.ts';
import { EventType } from '../chronicle/EventType.ts';
import { Place } from '../generator/Place.js';

/**
 * @class HistoricalFigureBirthSystem
 * @augments System
 * @description Manages the birth of historical figures.
 */
export class HistoricalFigureBirthSystem extends System {

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
     * Name generator for historical figures.
     * @private
     * @type {NameGenerator}
     */
    #nameGenerator;

    /**
     * @param {EntityManager} entityManager - The entity manager instance.
     */
    constructor(entityManager) {
        super(entityManager, [TimeComponent, WorldComponent, ChronicleEventComponent]);
        this.#nameGenerator = NameGenerator.create();
    }

    /**
     * Processes a single entity to manage its lifecycle.
     * @param {Entity} entity - The entity to process.
     * @param {number} currentYear - The current year in the simulation.
     */
    processEntity(entity, currentYear) {
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
        const name = this.#nameGenerator.generateHistoricalFigureName(culture, 4, 8);

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
     * @returns {boolean} True if the historical figure is born, false otherwise.
     */
    isBorn() {
        return Math.random() < HistoricalFigureBirthSystem.BIRTH_CHANCE_PER_YEAR;
    }

    /**
     * Calculate a random lifespan for the historical figure.
     * This method uses a normal distribution to calculate the lifespan.
     * @returns {number} The calculated lifespan in years.
     */
    calculateLifespan() {
        const mean = HistoricalFigureBirthSystem.NATURAL_LIFESPAN_MEAN;
        const stdDev = HistoricalFigureBirthSystem.NATURAL_LIFESPAN_STD_DEV;
        return Math.max(1, Math.round(this.randomNormal(mean, stdDev)));
    }

    /**
     * Generate a normally distributed random number using the Box-Muller transform.
     * @param {number} mean - The mean of the normal distribution.
     * @param {number} stdDev - The standard deviation of the normal distribution.
     * @returns {number} A normally distributed random number.
     */
    randomNormal(mean, stdDev) {
        let u1 = Math.random();
        let u2 = Math.random();
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    /**
     * Calculate a random place for the historical figure.
     * This method retrieves a random geographical feature from the world.
     * @param {World} world - The world instance to get a random place from.
     * @returns {Place} A Place instance representing the location of the historical figure's birth.
     */
    computePlace(world) {
        TypeUtils.ensureInstanceOf(world, World, 'World must be an instance of World.');
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
     * @static
     * @param {EntityManager} entityManager - The entity manager instance.
     * @returns {HistoricalFigureBirthSystem} A new instance of HistoricalFigureBirthSystem.
     */
    static create(entityManager) {
        return new HistoricalFigureBirthSystem(entityManager);
    }

}
