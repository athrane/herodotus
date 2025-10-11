import { Ecs } from '../Ecs';

/**
 * Builder class is an abstract base class for building ECS instances.
 * It defines the methods that must be implemented by subclasses to build
 * entities, systems, and components in an ECS instance.
 * @abstract
 * @class Builder
 */
export abstract class Builder {
    /**
     * Builds the core ECS instance.
     * @abstract
     */
    abstract build(): void;

    /**
     * Builds entities for the ECS instance.
     * @abstract
     */
    abstract buildEntities(): void;

    /**
     * Builds systems for the ECS instance.
     * @abstract
     */
    abstract buildSystems(): void;

    /**
     * Builds and loads data for the ECS instance.
     * @abstract
     */
    abstract buildData(): void | Promise<void>;

    /**
     * Builds additional components and resources for the ECS instance.
     * @abstract
     */
    abstract buildComponents(): void;

    /**
     * Returns the built ECS instance.
     * @abstract
     * @returns The ECS instance.
     */
    abstract getEcs(): Ecs;
}