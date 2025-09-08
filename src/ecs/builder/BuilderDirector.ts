import { Builder } from './Builder';
import { Ecs } from '../Ecs';

/**
 * BuilderDirector class is responsible for directing the building process.
 * It uses a builder to construct ECS instances and their components.
 *
 * @class BuilderDirector
 */
export class BuilderDirector {
    private readonly builder: Builder;

    /**
     * Creates a new instance of BuilderDirector.
     * @param builder The builder instance to use for constructing.
     */
    constructor(builder: Builder) {
        this.builder = builder;
    }

    /**
     * Builds by delegating tasks to the builder.
     * This method orchestrates the building of systems, entities, and components.
     * @returns The built ECS instance.
     */
    build(): Ecs {
        this.builder.build();
        this.builder.buildData();
        this.builder.buildComponents();
        this.builder.buildSystems();
        this.builder.buildEntities();
        return this.builder.getEcs();
    }

    /**
     * Static factory method to create a new instance of BuilderDirector.
     * @param builder The builder instance to use for constructing.
     * @returns A new BuilderDirector instance.
     */
    static create(builder: Builder): BuilderDirector {
        return new BuilderDirector(builder);
    }   
}