import { Builder } from '../../ecs/builder/Builder';
import { Simulation } from '../Simulation';

/**
 * SimulationDirector class is responsible for directing the simulation building process.
 * It uses a builder to construct the simulation and its components.
 * 
 * @class SimulationDirector
 */
export class SimulationDirector {
    private readonly builder: Builder;

    /**
     * Creates a new instance of SimulationDirector.
     * @param builder The builder instance to use for constructing the simulation.
     */
    constructor(builder: Builder) {
        this.builder = builder;
    }

    /**
     * Builds the simulation by delegating tasks to the builder.
     * This method orchestrates the building of systems, entities, and geographical features.
     * @returns The built simulation instance.
     */
    build(): Simulation {
        this.builder.build();
        this.builder.buildData();
        this.builder.buildComponents();
        this.builder.buildSystems();
        this.builder.buildEntities();
        return this.builder.getSimulation();
    }

    /**
     * Static factory method to create a new instance of SimulationDirector.
     * @param builder The builder instance to use for constructing the simulation.
     * @returns A new SimulationDirector instance.
     */
    static create(builder: Builder): SimulationDirector {
        return new SimulationDirector(builder);
    }   
}