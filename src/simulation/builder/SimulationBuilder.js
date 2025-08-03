import { Builder} from './Builder.js';
import { Simulation } from '../Simulation.js';
import { WorldGenerator } from '../../generator/world/WorldGenerator.js';
import { Time } from '../../time/Time.js';
import { TimeSystem } from '../../time/TimeSystem.js';
import { TimeComponent } from '../../time/TimeComponent.js';
import { NameComponent } from '../../ecs/NameComponent.js';
import { WorldComponent } from '../../geography/WorldComponent.js';
import { GeographicalFeaturesFactory } from '../../geography/GeographicalFeaturesFactory.js';

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
        const worldGenerator = new WorldGenerator();
        const world = worldGenerator.generateWorld('Aethel');
        
        // create global entity to hold simulation-wide state, like the current time.
        entityManager.createEntity(
            new NameComponent("Global"),
            new TimeComponent(Time.create(0)),
            new WorldComponent(world)
        );
    }

    /**
     * @override
     */
    buildSystems() {
        const entityManager = this.#simulation.getEntityManager();        
        const systemManager = this.#simulation.getSystemManager();
        systemManager.register(new TimeSystem(entityManager));        
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
