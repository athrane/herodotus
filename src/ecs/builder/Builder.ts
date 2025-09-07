import { Simulation } from '../../simulation/Simulation';

/**
 * Builder class is an abstract base class for building simulations.
 * It defines the methods that must be implemented by subclasses to build
 * entities, systems, and components in a simulation.
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
     * Builds and loads data for the simulation.
     * @abstract
     */
    abstract buildData(): void;

    /**
     * Builds additional components and resources for the simulation.
     * @abstract
     */
    abstract buildComponents(): void;

    /**
     * Returns the built simulation instance.
     * @abstract
     * @returns The simulation instance.
     */
    abstract getSimulation(): Simulation;
}