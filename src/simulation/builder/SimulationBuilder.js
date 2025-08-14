import { Builder} from './Builder.js';
import { Simulation } from '../Simulation.js';
import { WorldGenerator } from '../../generator/world/WorldGenerator.ts';
import { Time } from '../../time/Time.ts';
import { TimeSystem } from '../../time/TimeSystem.ts';
import { TimeComponent } from '../../time/TimeComponent.ts';
import { NameComponent } from '../../ecs/NameComponent';
import { WorldComponent } from '../../geography/WorldComponent.js';
import { GeographicalFeaturesFactory } from '../../geography/GeographicalFeaturesFactory.js';
import { HistoricalFigureComponent } from '../../historicalfigure/HistoricalFigureComponent.js';
import { ChronicleEventComponent } from '../../chronicle/ChronicleEventComponent.ts';
import { HistoricalFigureLifecycleSystem } from '../../historicalfigure/HistoricalFigureLifecycleSystem.js';
import { HistoricalFigureInfluenceSystem } from '../../historicalfigure/HistoricalFigureInfluenceSystem.js';
import { HistoricalFigureBirthSystem } from '../../historicalfigure/HistoricalFigureBirthSystem.js';
import { NameGenerator } from '../../naming/NameGenerator.ts';

/**
 * SimulationBuilder class is responsible for building an ECS-based simulation.
 * It extends the Builder to create a simulation with ECS components.
 * 
 * @class SimulationBuilder
 * @extends {Builder}
 */
export class SimulationBuilder extends Builder {

    /** * 
     * The simulation instance that is built by this builder.
     * @type {Simulation}
     * @private
     */
    #simulation;

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
    build() {
        this.#simulation = new Simulation();
    }

    /**
     * @override
     */
    buildEntities() {
        const entityManager = this.#simulation.getEntityManager();

        // create world
        const nameGenerator = NameGenerator.create();
        const worldGenerator = WorldGenerator.create(nameGenerator); 
        const world = worldGenerator.generateWorld('Aethel');
        
        // create global entity to hold simulation-wide state, like the current time.
        entityManager.createEntity(
            new NameComponent("Global"),
            new TimeComponent(Time.create(0)),
            new WorldComponent(world),
            new ChronicleEventComponent(),
        );

        // Create a sample historical figure
        entityManager.createEntity(
            new NameComponent("Herodotus"),
            new HistoricalFigureComponent("Herodotus", -484, -425, "Greek", "Historian")
        );
    }

    /**
     * @override
     */
    buildSystems() {
        const entityManager = this.#simulation.getEntityManager();        
        const systemManager = this.#simulation.getSystemManager();
        systemManager.register(new TimeSystem(entityManager));
        systemManager.register(new HistoricalFigureBirthSystem(entityManager));
        systemManager.register(new HistoricalFigureLifecycleSystem(entityManager));
        systemManager.register(new HistoricalFigureInfluenceSystem(entityManager));        
    }

    /**
     * @override
     */
    buildGeographicalFeatures() {
        GeographicalFeaturesFactory.create();
    }

    /**
     * Returns the simulation instance built by this builder.
     * @returns {Simulation}
     */
    getSimulation() {
        return this.#simulation;
    }   

    /**
     * Static factory method to create a new instance of SimulationBuilder.
     * @returns {SimulationBuilder}
     */
    static create() {
        return new SimulationBuilder();
    }   
}
