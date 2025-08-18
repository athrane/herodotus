import { Builder } from './Builder';
import { Simulation } from '../Simulation';
import { WorldGenerator } from '../../generator/world/WorldGenerator';
import { Time } from '../../time/Time';
import { TimeSystem } from '../../time/TimeSystem';
import { TimeComponent } from '../../time/TimeComponent';
import { NameComponent } from '../../ecs/NameComponent';
import { WorldComponent } from '../../geography/WorldComponent';
import { GeographicalFeaturesFactory } from '../../geography/GeographicalFeaturesFactory';
import { HistoricalFigureComponent } from '../../historicalfigure/HistoricalFigureComponent';
import { ChronicleComponent } from '../../chronicle/ChronicleComponent';
import { HistoricalFigureLifecycleSystem } from '../../historicalfigure/HistoricalFigureLifecycleSystem';
import { HistoricalFigureInfluenceSystem } from '../../historicalfigure/HistoricalFigureInfluenceSystem';
import { HistoricalFigureBirthSystem } from '../../historicalfigure/HistoricalFigureBirthSystem';
import { NameGenerator } from '../../naming/NameGenerator';
import { EntityManager } from '../../ecs/EntityManager';
import { SystemManager } from '../../ecs/SystemManager';
import { loadEvents } from '../../data/loadEvents';
import { DataSetComponent } from '../../data/DataSetComponent';
import { DataSetEvent } from '../../data/DataSetEvent';
import { DataSetEventComponent } from '../../data/DataSetEventComponent';
import { DilemmaSystem } from '../../data/DilemmaSystem';
import { DilemmaResolutionSystem } from '../../data/DilemmaResolutionSystem';
import { PlayerComponent } from '../../ecs/PlayerComponent';

/**
 * SimulationBuilder class is responsible for building an ECS-based simulation.
 * It extends the Builder to create a simulation with ECS components.
 * 
 * @class SimulationBuilder
 * @extends {Builder}
 */
export class SimulationBuilder extends Builder {

    /** 
     * The simulation instance that is built by this builder.
     * ! signifies that this property is not yet initialized.
     */
    private simulation!: Simulation;

    /**
     * The array of dataset events that are loaded into the simulation.
     * ! signifies that this property is not yet initialized.
     */
    private dataSetEvents!: DataSetEvent[];

    /** 
     * Creates a new instance of SimulationBuilder.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * @override
     */
    build(): void {
        this.simulation = new Simulation();
    }

    /**
     * @override
     */
    buildEntities(): void {
        const entityManager: EntityManager = this.simulation.getEntityManager();

        // create world
        const nameGenerator = NameGenerator.create();
        const worldGenerator = WorldGenerator.create(nameGenerator);
        const world = worldGenerator.generateWorld('Aethel');

        // create global entity to hold simulation-wide state, like the current time.
        entityManager.createEntity(
            new NameComponent("Global"),
            new TimeComponent(Time.create(0)),
            new WorldComponent(world),
            new ChronicleComponent(),
            DataSetComponent.create(this.dataSetEvents)
        );

        // Create the dedicated Player entity with DataSetEventComponent and HistoricalFigureComponent
        // Use a default created event as the initial game state context
        const initialEvent = new DataSetEvent({ 
            "Event Type": "Political",
            "Event Trigger": "PLAYER_START",
            "Event Name": "Rise to Power",
            "Event Consequence": "The player begins their reign as a new ruler",
            "Heading": "A New Dawn Rises",
            "Place": "Capital",
            "Primary Actor": "Player",
            "Secondary Actor": "The People",
            "Motive": "Ascension to power",
            "Description": "You have ascended to power and now rule over your domain. The people look to you for leadership as you begin your journey to shape history.",
            "Consequence": "The player gains control and must make decisions that will affect their realm",
            "Tags": "political, beginning, power, leadership"
        });

        entityManager.createEntity(
            new NameComponent("Player"),
            new HistoricalFigureComponent("Player Character", 0, 70, "Unknown", "Ruler"),
            DataSetEventComponent.create(initialEvent),
            PlayerComponent.create()
        );

        // Create a sample historical figure
        entityManager.createEntity(
            new NameComponent("Herodotus"),
            new HistoricalFigureComponent("Herodotus", -484, 59, "Greek", "Historian")
        );
    }

    /**
     * @override
     */
    buildSystems(): void {
        const entityManager: EntityManager = this.simulation.getEntityManager();
        const systemManager: SystemManager = this.simulation.getSystemManager();
        systemManager.register(new TimeSystem(entityManager));
        systemManager.register(new HistoricalFigureBirthSystem(entityManager));
        systemManager.register(new HistoricalFigureLifecycleSystem(entityManager));
        systemManager.register(new HistoricalFigureInfluenceSystem(entityManager));
        systemManager.register(new DilemmaSystem(entityManager));
        systemManager.register(new DilemmaResolutionSystem(entityManager));
    }

    /**
     * @override
     */
    buildData(): void {
        this.dataSetEvents = loadEvents();
    }

    /**
     * @override
     */
    buildGeographicalFeatures(): void {
        GeographicalFeaturesFactory.create();
    }

    /**
     * Returns the simulation instance built by this builder.
     * @returns The simulation instance.
     */
    getSimulation(): Simulation {
        return this.simulation;
    }

    /**
     * Static factory method to create a new instance of SimulationBuilder.
     * @returns A new SimulationBuilder instance.
     */
    static create(): SimulationBuilder {
        return new SimulationBuilder();
    }
}