import { Simulation } from '../Simulation';

/**
 * Builder class is an abstract base class for building simulations.
 * It defines the methods that must be implemented by subclasses to build
 * entities, systems, and geographical features in a simulation.
 * @abstract
 * @class Builder
 */
export abstract class Builder {
    /**
     * Builds the core simulation instance.
     * @abstract
     */
    abstract build(): void;

    /**
     * Builds entities for the simulation.
     * @abstract
     */
    abstract buildEntities(): void;

    /**
     * Builds systems for the simulation.
     * @abstract
     */
    abstract buildSystems(): void;

    /**
     * Builds geographical features for the simulation.
     * @abstract
     */
    abstract buildGeographicalFeatures(): void;

    /**
     * Returns the built simulation instance.
     * @abstract
     * @returns The simulation instance.
     */
    abstract getSimulation(): Simulation;
}