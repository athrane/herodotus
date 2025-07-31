import { SystemManager } from '../ecs/SystemManager.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { TimeComponent } from '../time/TimeComponent.js';
import { Time } from '../time/Time.js';
import { TimeSystem } from '../time/TimeSystem.js';
import { NameComponent } from '../ecs/NameComponent.js';

/**
 * The `Simulation` class orchestrates an Entity-Component-System (ECS) based simulation.
 * It manages all entities and systems, and drives the main simulation loop.
 */
export class Simulation {
    #entityManager;
    #systemManager;
    #isRunning;
    #lastTickTime;
    #globalEntityId;

    /**
     * Creates an instance of Simulation.
     */
    constructor() {
        this.#entityManager = EntityManager.create();
        this.#systemManager = SystemManager.create(this.#entityManager);
        this.#isRunning = false;
        this.#lastTickTime = 0;

        // Register systems
        this.#systemManager.register(new TimeSystem(this.#entityManager));

        // Create a global entity to hold simulation-wide state, like the current time.
        const time = Time.create(0); // Starting at year 0
        const timeComponent = TimeComponent.create(time);
        const nameComponent = NameComponent.create('Global Simulation Entity');
        const globalEntity = this.#entityManager.createEntity(timeComponent, nameComponent);
        this.#globalEntityId = globalEntity.getId();
    }

    /**
     * Returns whether the simulation is currently running.
     * @returns {boolean} True if the simulation is running, false otherwise.
     */
    isRunning() {
        return this.#isRunning;
    }

    /**
     * Returns the EntityManager instance used by this simulation.
     * @returns {EntityManager} The EntityManager.
     */
    getEntityManager() {
        return this.#entityManager;
    }

    /**
     * Returns the SystemManager instance used by this simulation.
     * @returns {SystemManager} The SystemManager.
     */
    getSystemManager() {
        return this.#systemManager;
    }

    /**
     * Gets the global entity that holds simulation-wide state.
     * @returns {Entity} The global entity.
     */
    getGlobalEntity() {
        return this.#entityManager.getEntity(this.#globalEntityId);
    }

    /**
     * Starts the simulation loop.
     * If the simulation is already running, this method does nothing.
     */
    start() {
        if (this.#isRunning) {
            return;
        }

        this.#isRunning = true;
        this.#lastTickTime = performance.now();
        this.#tick();
    }

    /**
     * Stops the simulation loop.
     * If the simulation is not running, this method does nothing.
     */
    stop() {
        if (!this.#isRunning) {
            return;
        }

        this.#isRunning = false;        
    }

    /**
     * The main simulation loop. This method is called repeatedly using requestAnimationFrame.
     * It calculates the time since the last tick and updates all systems.
     * @private
     */
    #tick() {
        if (!this.#isRunning) return;

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.#lastTickTime) / 1000; // Convert to seconds
        this.#lastTickTime = currentTime;

        // Update all systems
        this.#systemManager.update(deltaTime);
    }

    /**
     * Creates a new instance of Simulation.
     * This static factory method provides a standardized way to construct Simulation objects.
     * @returns {Simulation} A new Simulation instance.
     */ 
    static create() {
        return new Simulation();
    }
    
}
