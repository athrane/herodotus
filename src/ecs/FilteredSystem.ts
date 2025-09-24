import { System } from './System';
import { Entity } from './Entity';
import { EntityManager } from './EntityManager';
import { Component } from './Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Type definition for entity filter functions.
 * Filter functions take an entity and return true if the entity should be processed.
 */
export type EntityFilter = (entity: Entity) => boolean;

/**
 * A System that applies an additional filter function to entities before processing.
 * This allows for flexible entity filtering without boilerplate code in subclasses.
 * 
 * Subclasses should override processFilteredEntity() instead of processEntity().
 */
export class FilteredSystem extends System {
    private readonly entityFilter: EntityFilter;

    /**
     * Creates a new FilteredSystem.
     * @param entityManager The entity manager instance.
     * @param requiredComponents Array of component classes required for processing.
     * @param entityFilter Filter function to apply to entities before processing.
     */
    constructor(
        entityManager: EntityManager,
        requiredComponents: Array<new (...args: any[]) => Component>,
        entityFilter: EntityFilter
    ) {
        super(entityManager, requiredComponents);
        TypeUtils.ensureFunction(entityFilter, 'entityFilter');
        this.entityFilter = entityFilter;
    }

    /**
     * Processes an entity only if it passes the filter function.
     * This method applies the filter and calls processFilteredEntity for entities that pass.
     * @param entity The entity to process.
     * @param args Additional arguments passed from the update method.
     */
    processEntity(entity: Entity, ...args: any[]): void {
        // Apply filter - only process if entity passes
        if (!this.entityFilter(entity)) return;

        // Call the filtered processing method
        this.processFilteredEntity(entity, ...args);
    }

    /**
     * Processes an entity that has already passed the filter.
     * This method should be overridden by subclasses instead of processEntity.
     * @param entity The entity to process.
     * @param args Additional arguments passed from the update method.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    processFilteredEntity(entity: Entity, ...args: any[]): void {
        throw new Error('FilteredSystem.processFilteredEntity() must be implemented by a subclass.');
    }

    /**
     * Gets the filter function used by this system.
     * @returns The entity filter function.
     */
    getEntityFilter(): EntityFilter {
        return this.entityFilter;
    }

    /**
     * Creates a new FilteredSystem.
     * @param entityManager The entity manager instance.
     * @param requiredComponents Array of component classes required for processing.
     * @param entityFilter Filter function to apply to entities before processing.
     * @returns A new FilteredSystem instance.
     */
    static create(
        entityManager: EntityManager,
        requiredComponents: Array<new (...args: any[]) => Component>,
        entityFilter: EntityFilter
    ): FilteredSystem {
        return new FilteredSystem(entityManager, requiredComponents, entityFilter);
    }
}