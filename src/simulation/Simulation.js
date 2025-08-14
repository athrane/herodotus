import { SystemManager } from '../ecs/SystemManager';
import { EntityManager } from '../ecs/EntityManager';
import { TimeComponent } from '../time/TimeComponent.ts';
import { Time } from '../time/Time.ts';
import { TimeSystem } from '../time/TimeSystem.ts';
import { NameComponent } from '../ecs/NameComponent';

/**
 * The `Simulation` class orchestrates an Entity-Component-System (ECS) based simulation.
 * It manages all entities and systems, and drives the main simulation loop.
 */
export class Simulation {
    #entityManager;
    #systemManager;
    #isRunning;
    #lastTickTime;

    /**
     * Creates an instance of Simulation.
     */
    constructor() {
        this.#entityManager = EntityManager.create();
        this.#systemManager = SystemManager.create(this.#entityManager);
        this.#isRunning = false;
        this.#lastTickTime = 0;

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
     * Starts the simulation loop.
     * If the simulation is already running, this method does nothing.
     */
    start() {
        if (this.#isRunning) {
            return;
        }

        this.#isRunning = true;
        this.#lastTickTime = performance.now();
        this.tick();
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
     * The main simulation loop. 
     * It is called repeatedly while the simulation is running.
     * It calculates the time since the last tick and updates all systems.
     */
    tick() {
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
