import { Builder } from '../../ecs/builder/Builder';
import { WorldGenerator } from '../../generator/world/WorldGenerator';
import { Time } from '../../time/Time';
import { TimeSystem } from '../../time/TimeSystem';
import { TimeComponent } from '../../time/TimeComponent';
import { NameComponent } from '../../ecs/NameComponent';
import { GeographicalFeaturesFactory } from '../../geography/feature/GeographicalFeaturesFactory';
import { HistoricalFigureComponent } from '../../historicalfigure/HistoricalFigureComponent';
import { ChronicleComponent } from '../../chronicle/ChronicleComponent';
import { HistoricalFigureLifecycleSystem } from '../../historicalfigure/HistoricalFigureLifecycleSystem';
import { HistoricalFigureInfluenceSystem } from '../../historicalfigure/HistoricalFigureInfluenceSystem';
import { HistoricalFigureBirthSystem } from '../../historicalfigure/HistoricalFigureBirthSystem';
import { NameGenerator } from '../../naming/NameGenerator';
import { EntityManager } from '../../ecs/EntityManager';
import { loadEvents } from '../../data/loadEvents';
import { DataSetComponent } from '../../data/DataSetComponent';
import { DataSetEvent } from '../../data/DataSetEvent';
import { DataSetEventComponent } from '../../data/DataSetEventComponent';
import { ComputeChoicesSystem } from '../../behaviour/ComputeChoicesSystem';
import { SelectChoiceSystem } from '../../behaviour/SelectChoiceSystem';
import { ChoiceComponent } from '../../behaviour/ChoiceComponent';
import { PlayerComponent } from '../../ecs/PlayerComponent';
import { Ecs } from '../../ecs/Ecs';
import { loadWorldGenData } from '../../data/geography/worldgen/loadWorldGenData';
import { GeographicalUtils } from '../../geography/GeographicalUtils';
import { loadHistoricalFigureData } from '../../data/historicalfigure/loadHistoricalFigureData';
import { HistoricalFigureData } from 'data/historicalfigure/HistoricalFigureData';
import { loadEventCategories } from '../../data/chronicle/loadEventCategories';
import { RealmStateComponent } from '../../realm/RealmStateComponent';
import { FactionManagerComponent } from '../../realm/FactionManagerComponent';
import { loadRandomSeed } from '../../data/random/loadRandomSeed';
import { RandomSeedData } from '../../data/random/RandomSeedData';
import { RandomComponent } from '../../random/RandomComponent';

/**
 * SimulationBuilder class is responsible for building an ECS-based simulation.
 * It extends the Builder to create a simulation with ECS components.
 * 
 * @class SimulationBuilder
 * @extends {Builder}
 */
export class SimulationBuilder extends Builder {

    /** 
      * The ECS  instance that is built by this builder.
      * ! signifies that this property is not yet initialized.
      */
    private simEcs!: Ecs;

    /**
     * The array of dataset events that are loaded into the simulation.
     * ! signifies that this property is not yet initialized.
     */
    private dataSetEvents!: DataSetEvent[];

    /**
     * Configuration data for historical figures.
     * ! signifies that this property is not yet initialized.
     */
    private historicalFigureConfig!: HistoricalFigureData;

    /**
     * Event categories loaded from JSON configuration.
     * ! signifies that this property is not yet initialized.
     */
    private eventCategories!: Record<string, string>;

    /**
     * Random seed configuration loaded from JSON.
     * ! signifies that this property is not yet initialized.
     */
    private randomSeedConfig!: RandomSeedData;

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
        this.simEcs = Ecs.create();
    }

    /**
     * @override
     */
    buildEntities(): void {
        const entityManager: EntityManager = this.simEcs.getEntityManager();

        // Create RandomComponent first so it can be used by other components
        const randomComponent = RandomComponent.create(this.randomSeedConfig);

        // create galaxy map as the root game world object
        const nameGenerator = NameGenerator.create(randomComponent);
        const worldGenConfig = loadWorldGenData();
        const worldGenerator = WorldGenerator.create(nameGenerator, randomComponent, worldGenConfig);
        const galaxyMapComponent = worldGenerator.generateGalaxyMap();

        // create global entity to hold simulation-wide state, like the current time.
        entityManager.createEntity(
            new NameComponent("Global"),
            new TimeComponent(Time.create(0)),
            randomComponent,            
            galaxyMapComponent,
            new ChronicleComponent(),
            DataSetComponent.create(this.dataSetEvents)            
        );

        // Create the dedicated Player entity with DataSetEventComponent and HistoricalFigureComponent
        // Use a default created event as the initial game state context
        const initialEvent = new DataSetEvent({
            "Event Type": "Political",
            "Event Trigger": "PLAYER_START",
            "Event Name": "Rise to Power",
            "Event Consequence": "Coronation",
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
            HistoricalFigureComponent.create("Player Character", 0, 70, "Unknown", "Ruler"),
            DataSetEventComponent.create(initialEvent),
            ChoiceComponent.create([]), // Start with empty choices, will be populated by ComputeChoicesSystem
            PlayerComponent.create(),
            GeographicalUtils.computeRandomLocation(galaxyMapComponent, randomComponent)
        );

        // Create a sample historical figure
        entityManager.createEntity(
            new NameComponent("Herodotus"),
            HistoricalFigureComponent.create("Herodotus", -484, 59, "Greek", "Historian")
        );
    }

    /**
     * @override
     */
    buildSystems(): void {
        const ecs = this.simEcs;
        const entityManager: EntityManager = this.simEcs.getEntityManager();

        // Register systems using the Ecs facade
        ecs.registerSystem(new TimeSystem(entityManager));
        ecs.registerSystem(new HistoricalFigureBirthSystem(entityManager, this.historicalFigureConfig));
        ecs.registerSystem(new HistoricalFigureLifecycleSystem(entityManager));
        ecs.registerSystem(new HistoricalFigureInfluenceSystem(entityManager));
        ecs.registerSystem(ComputeChoicesSystem.create(entityManager));
        ecs.registerSystem(SelectChoiceSystem.create(entityManager));
    }

    /**
     * @override
     */
    buildData(): void {

        // Load dataset events from JSON data files
        this.dataSetEvents = loadEvents();

        // Initialize geographical features in the registry
        GeographicalFeaturesFactory.create();

        // Load historical figure configuration
        this.historicalFigureConfig = loadHistoricalFigureData();

        // Load event categories from JSON configuration
        this.eventCategories = loadEventCategories();

        // Load random seed configuration
        this.randomSeedConfig = loadRandomSeed();
    }

    /**
     * @override
     */
    buildComponents(): void {
        const entityManager: EntityManager = this.simEcs.getEntityManager();
        
        // Create the RealmState singleton entity
        entityManager.createEntity(
            new NameComponent("RealmState"),
            RealmStateComponent.create()
        );

        // Create the FactionManager singleton entity
        entityManager.createEntity(
            new NameComponent("FactionManager"),
            FactionManagerComponent.create()
        );
    }

    /**
         * @override
         */
    getEcs(): Ecs {
        return this.simEcs;
    }

    /**
     * Static factory method to create a new instance of SimulationBuilder.
     * @returns A new SimulationBuilder instance.
     */
    static create(): SimulationBuilder {
        return new SimulationBuilder();
    }
}