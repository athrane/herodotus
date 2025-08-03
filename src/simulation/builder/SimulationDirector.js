import { Builder } from './Builder.js';
import { Simulation } from '../Simulation.js';

/**
 * SimulationDirector class is responsible for directing the simulation building process.
 * It uses a builder to construct the simulation and its components.
 * 
 * @class SimulationDirector
 */
export class SimulationDirector {

    /**
     * @param {Builder} builder
     */
    constructor(builder) {
        this.builder = builder;
    }

    /**
     * Builds the simulation by delegating tasks to the builder.
     * This method orchestrates the building of systems, entities, and geographical features.
     * @returns {Simulation}
     */
    build() {
        this.builder.build();
        this.builder.buildGeographicalFeatures()
        this.builder.buildSystems();
        this.builder.buildEntities();
        return this.builder.getSimulation();
    }

    /**
     * Static factory method to create a new instance of SimulationDirector.
     * @param {Builder} builder
     * @returns {SimulationDirector}
     */
    static create(builder) {
        return new SimulationDirector(builder);
    }   
}
