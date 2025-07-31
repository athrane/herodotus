import { TypeUtils } from '../util/TypeUtils.js';
import { System } from './System.js';
import { EntityManager } from './EntityManager.js';

/**
 * Manages the registration, lifecycle, and execution of all systems in the ECS.
 * This class orchestrates the logic updates for the simulation.
 */
export class SystemManager {
    #entityManager;
    #systems;

    /**
     * @param {EntityManager} entityManager The entity manager instance.
     */
    constructor(entityManager) {
        TypeUtils.ensureInstanceOf(entityManager, EntityManager, 'entityManager must be an instance of EntityManager.');
        this.#entityManager = entityManager;
        this.#systems = new Map();
    }

    /**
     * Registers a system instance. A system can only be registered once.
     * @param {System} system The system instance to register.
     * @throws {Error} If a system of the same class is already registered.
     */
    register(system) {
        TypeUtils.ensureInstanceOf(system, System, 'system must be an instance of System.');
        const systemClassName = system.constructor.name;
        if (this.#systems.has(systemClassName)) {
            throw new Error(`System '${systemClassName}' is already registered.`);
        }
        this.#systems.set(systemClassName, system);
    }

    /**
     * Unregisters a system by its class name. This allows for dynamic removal of systems.
     * @param {string} systemClassName The class name of the system to unregister. 
     * @throws {Error} If the system is not registered.
     */
    delete(systemClassName) {
        TypeUtils.ensureString(systemClassName, 'systemClassName must be a string.');
        if (!this.#systems.has(systemClassName)) {
            throw new Error(`System '${systemClassName}' is not registered.`);
        }
        this.#systems.delete(systemClassName);
    }

    /** 
     * Retrieves a system by its class name.
     * @param {string} systemClassName The class name of the system to retrieve.   
     * @return {System} The system instance if found, otherwise undefined.
     * */
    get(systemClassName) {
        TypeUtils.ensureString(systemClassName, 'systemClassName must be a string.');
        return this.#systems.get(systemClassName);
    }

    /**
     * Executes the update loop for all registered systems in the order they were registered.
     * @param {...any} args Additional arguments to pass to each system's update method (e.g., deltaTime).
     */
    update(...args) {
        for (const system of this.#systems.values()) {
            system.update(...args);
        }
    }

    /**
     * Creates a new instance of SystemManager.
     * This static factory method provides a standardized way to construct SystemManager objects.
     * @param {EntityManager} entityManager The entity manager instance.
     * @returns {SystemManager} A new instance of SystemManager.
     */
    static create(entityManager) {
        return new SystemManager(entityManager);
    }

}