import { Entity } from './Entity';
import { NameComponent } from './NameComponent';
import { Component } from './Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Type definition for entity filter functions.
 * Filter functions take an entity and return true if the entity should be processed.
 */
export type EntityFilter = (entity: Entity) => boolean;

/**
 * Utility class providing common entity filter functions.
 * These can be used with FilteredSystem to automatically filter entities before processing.
 */
export class EntityFilters {
    /**
     * Creates a filter that matches entities with a specific name.
     * @param targetName The name to match against.
     * @returns A filter function that returns true for entities with the target name.
     */
    static byName(targetName: string): EntityFilter {
        TypeUtils.ensureString(targetName, 'targetName');
        return (entity: Entity) => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent?.getText() === targetName;
        };
    }

    /**
     * Creates a filter that matches entities with a specific component.
     * @param componentClass The component class to check for.
     * @returns A filter function that returns true for entities with the component.
     */
    static hasComponent<T extends Component>(componentClass: new (...args: any[]) => T): EntityFilter {
        return (entity: Entity) => entity.hasComponent(componentClass);
    }

    /**
     * Creates a filter that matches entities without a specific component.
     * @param componentClass The component class to check against.
     * @returns A filter function that returns true for entities without the component.
     */
    static lacksComponent<T extends Component>(componentClass: new (...args: any[]) => T): EntityFilter {
        return (entity: Entity) => !entity.hasComponent(componentClass);
    }

    /**
     * Combines multiple filters with AND logic.
     * @param filters Array of filter functions to combine.
     * @returns A filter function that returns true only if all filters pass.
     */
    static and(...filters: EntityFilter[]): EntityFilter {
        return (entity: Entity) => filters.every(filter => filter(entity));
    }

    /**
     * Combines multiple filters with OR logic.
     * @param filters Array of filter functions to combine.
     * @returns A filter function that returns true if any filter passes.
     */
    static or(...filters: EntityFilter[]): EntityFilter {
        return (entity: Entity) => filters.some(filter => filter(entity));
    }

    /**
     * Negates a filter function.
     * @param filter The filter function to negate.
     * @returns A filter function that returns the opposite of the input filter.
     */
    static not(filter: EntityFilter): EntityFilter {
        TypeUtils.ensureFunction(filter, 'filter');
        return (entity: Entity) => !filter(entity);
    }

    /**
     * A filter that always returns true (passes all entities).
     * @returns A filter function that always returns true.
     */
    static all(): EntityFilter {
        return () => true;
    }

    /**
     * A filter that always returns false (rejects all entities).
     * @returns A filter function that always returns false.
     */
    static none(): EntityFilter {
        return () => false;
    }

    /**
     * Creates a new EntityFilters instance.
     * This class only contains static methods, so this is mainly for consistency with project patterns.
     * @returns A new EntityFilters instance.
     */
    static create(): EntityFilters {
        return new EntityFilters();
    }
}