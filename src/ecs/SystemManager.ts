import { TypeUtils } from '../util/TypeUtils';
import { System } from './System';
import { EntityManager } from './EntityManager';

/**
 * Manages the registration, lifecycle, and execution of all systems in the ECS.
 * This class orchestrates the logic updates for the simulation.
 */
export class SystemManager {
    readonly #entityManager: EntityManager;
    readonly #systems: Map<string, System>;

    /**
     * @param entityManager The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        TypeUtils.ensureInstanceOf(entityManager, EntityManager);
        this.#entityManager = entityManager;
        this.#systems = new Map();
    }

    /**
     * Registers a system instance. A system can only be registered once.
     * @param system The system instance to register.
     * @throws If a system of the same class is already registered.
     */
    register(system: System): void {
        TypeUtils.ensureInstanceOf(system, System);
        const systemClassName = system.constructor.name;
        if (this.#systems.has(systemClassName)) {
            throw new Error(`System '${systemClassName}' is already registered.`);
        }
        this.#systems.set(systemClassName, system);
    }

    /**
     * Unregisters a system by its class name. This allows for dynamic removal of systems.
     * @param systemClassName The class name of the system to unregister. 
     * @throws If the system is not registered.
     */
    delete(systemClassName: string): void {
        TypeUtils.ensureString(systemClassName, 'systemClassName must be a string.');
        if (!this.#systems.has(systemClassName)) {
            throw new Error(`System '${systemClassName}' is not registered.`);
        }
        this.#systems.delete(systemClassName);
    }

    /** 
     * Retrieves a system by its class name.
     * @param systemClassName The class name of the system to retrieve.   
     * @returns The system instance if found, otherwise undefined.
     * */
    get(systemClassName: string): System | undefined {
        TypeUtils.ensureString(systemClassName, 'systemClassName must be a string.');
        return this.#systems.get(systemClassName);
    }

    /**
     * Executes the update loop for all registered systems in the order they were registered.
     * @param args Additional arguments to pass to each system's update method (e.g., deltaTime).
     */
    update(...args: any[]): void {
        for (const system of this.#systems.values()) {
            system.update(...args);
        }
    }

    /**
     * Creates a new instance of SystemManager.
     * This static factory method provides a standardized way to construct SystemManager objects.
     * @param entityManager The entity manager instance.
     * @returns A new instance of SystemManager.
     */
    static create(entityManager: EntityManager): SystemManager {
        return new SystemManager(entityManager);
    }

}