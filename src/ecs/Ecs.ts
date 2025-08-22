import { EntityManager } from './EntityManager';
import { SystemManager } from './SystemManager';
import { System } from './System';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A convenience core ECS class that provides centralized initialization
 * and management of EntityManager and SystemManager instances.
 * This class acts as a unified facade for the ECS architecture.
 */
export class Ecs {
    private readonly entityManager: EntityManager;
    private readonly systemManager: SystemManager;

    /**
     * Creates an Ecs instance with initialized EntityManager and SystemManager.
     * @param entityManager Optional EntityManager instance. If not provided, a new one will be created.
     */
    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager || EntityManager.create();
        this.systemManager = SystemManager.create(this.entityManager);
    }

    /**
     * Registers a system with the system manager.
     * @param system The system instance to register.
     * @throws Error if system is null, undefined, or if a system of the same type is already registered.
     */
    registerSystem(system: System): void {
        TypeUtils.ensureInstanceOf(system, System);
        this.systemManager.register(system);
    }

    /**
     * Updates all registered systems by calling their update methods.
     * Systems are updated in the order they were registered.
     * @param deltaTime Optional delta time to pass to systems.
     */
    update(deltaTime?: number): void {
        this.systemManager.update(deltaTime);
    }

    /**
     * Retrieves a system of the specified type.
     * @param systemClassName The name of the system class to retrieve.
     * @returns The system instance if found, undefined otherwise.
     */
    getSystem<T extends System>(systemClassName: string): T | undefined {
        return this.systemManager.get(systemClassName) as T | undefined;
    }

    /**
     * Retrieves a system by its class constructor.
     * @param systemClass The class constructor of the system to retrieve.
     * @returns The system instance if found, undefined otherwise.
     */
    getSystemByClass<T extends System>(systemClass: new (...args: any[]) => T): T | undefined {
        return this.getSystem(systemClass.name) as T | undefined;
    }

    /**
     * Checks if a system of the specified type is registered.
     * @param systemClassName The name of the system class to check.
     * @returns True if the system is registered, false otherwise.
     */
    hasSystem(systemClassName: string): boolean {
        return this.getSystem(systemClassName) !== undefined;
    }

    /**
     * Checks if a system of the specified class type is registered.
     * @param systemClass The class constructor of the system to check.
     * @returns True if the system is registered, false otherwise.
     */
    hasSystemByClass<T extends System>(systemClass: new (...args: any[]) => T): boolean {
        return this.getSystemByClass(systemClass) !== undefined;
    }

    /**
     * Unregisters a system from the system manager.
     * @param systemClassName The name of the system class to unregister.
     * @throws Error if systemClassName is null, undefined, or empty.
     */
    unregisterSystem(systemClassName: string): void {
        TypeUtils.ensureNonEmptyString(systemClassName);
        this.systemManager.delete(systemClassName);
    }

    /**
     * Unregisters a system by its class constructor.
     * @param systemClass The class constructor of the system to unregister.
     * @throws Error if the system is not registered.
     */
    unregisterSystemByClass<T extends System>(systemClass: new (...args: any[]) => T): void {
        this.unregisterSystem(systemClass.name);
    }

    /**
     * Gets the EntityManager instance.
     * @returns The EntityManager instance used by this Ecs.
     */
    getEntityManager(): EntityManager {
        return this.entityManager;
    }

    /**
     * Gets the SystemManager instance.
     * @returns The SystemManager instance used by this Ecs.
     */
    getSystemManager(): SystemManager {
        return this.systemManager;
    }

    /**
     * Gets the number of entities in the entity manager.
     * @returns The count of entities.
     */
    getEntityCount(): number {
        return this.entityManager.count();
    }

    /**
     * Gets all entities from the entity manager.
     * @returns An array of all entities.
     */
    getAllEntities() {
        return this.entityManager.getEntitiesWithComponents();
    }

    /**
     * Clears all entities from the entity manager.
     */
    clearEntities(): void {
        const entities = this.getAllEntities();
        entities.forEach(entity => this.entityManager.destroyEntity(entity.getId()));
    }

    /**
     * Returns a string representation of the Ecs instance with summary information.
     * @returns A string describing the current state of the Ecs instance.
     */
    toString(): string {
        return `Ecs [Entities: ${this.getEntityCount()}, Systems: ${this.systemManager['systems'].size}]`;
    }

    /**
     * Static factory method for creating an Ecs instance.
     * @param entityManager Optional EntityManager instance. If not provided, a new one will be created.
     * @returns A new Ecs instance with initialized managers.
     */
    static create(entityManager?: EntityManager): Ecs {
        return new Ecs(entityManager);
    }    
}
