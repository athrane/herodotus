import { Builder } from '../../ecs/builder/Builder';
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
import { loadEvents } from '../../data/loadEvents';
import { DataSetComponent } from '../../data/DataSetComponent';
import { DataSetEvent } from '../../data/DataSetEvent';
import { DataSetEventComponent } from '../../data/DataSetEventComponent';
import { DilemmaSystem } from '../../behaviour/DilemmaSystem';
import { DilemmaResolutionSystem } from '../../behaviour/DilemmaResolutionSystem';
import { DilemmaComponent } from '../../behaviour/DilemmaComponent';
import { PlayerComponent } from '../../ecs/PlayerComponent';
import { Ecs } from 'ecs/Ecs';

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
            DilemmaComponent.create([]), // Start with empty choices, will be populated by DilemmaSystem
            PlayerComponent.create()
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
        ecs.registerSystem(new HistoricalFigureBirthSystem(entityManager));
        ecs.registerSystem(new HistoricalFigureLifecycleSystem(entityManager));
        ecs.registerSystem(new HistoricalFigureInfluenceSystem(entityManager));
        ecs.registerSystem(new DilemmaSystem(entityManager));
        ecs.registerSystem(new DilemmaResolutionSystem(entityManager));
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
    buildComponents(): void {
        GeographicalFeaturesFactory.create();
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