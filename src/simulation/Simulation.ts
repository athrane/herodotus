import { Ecs } from '../ecs/Ecs';
import { EntityManager } from '../ecs/EntityManager';
import { SystemManager } from '../ecs/SystemManager';

/**
 * The `Simulation` class orchestrates an Entity-Component-System (ECS) based simulation.
 * It manages all entities and systems, and drives the main simulation loop.
 */
export class Simulation {
    private readonly ecs: Ecs;
    private isRunning: boolean;
    private lastTickTime: number;

    /**
     * Creates an instance of Simulation.
     * @param ecs Optional Ecs instance. If not provided, a new one will be created.
     */
    constructor(ecs?: Ecs) {
        this.ecs = ecs || Ecs.create();
        this.isRunning = false;
        this.lastTickTime = 0;
    }

    /**
     * Returns whether the simulation is currently running.
     * @returns True if the simulation is running, false otherwise.
     */
    getIsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Returns the EntityManager instance used by this simulation.
     * @returns The EntityManager.
     */
    getEntityManager(): EntityManager {
        return this.ecs.getEntityManager();
    }

    /**
     * Returns the SystemManager instance used by this simulation.
     * @returns The SystemManager.
     */
    getSystemManager(): SystemManager {
        return this.ecs.getSystemManager();
    }

    /**
     * Gets the Ecs instance used by this simulation.
     * @returns The Ecs instance.
     */
    getEcs(): Ecs {
        return this.ecs;
    }

    /**
     * Starts the simulation loop.
     * If the simulation is already running, this method does nothing.
     */
    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lastTickTime = performance.now();
        this.tick();
    }

    /**
     * Stops the simulation loop.
     * If the simulation is not running, this method does nothing.
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;        
    }

    /**
     * The main simulation loop. 
     * It is called repeatedly while the simulation is running.
     * It calculates the time since the last tick and updates all systems.
     */
    tick(): void {
        if (!this.isRunning) return;

        // Calculate the time in milliseconds since the last tick
        const currentTime = performance.now();
        //const deltaTime = (currentTime - this.lastTickTime) / 1000; // Convert to seconds
        this.lastTickTime = currentTime;

        // Update all systems
        // this.ecs.update(deltaTime);
        // Hack: Hard code deltaTime = 0.1 sec == 1 year
        this.ecs.update(0.1);
    }

    /**
     * Creates a new instance of Simulation.
     * This static factory method provides a standardized way to construct Simulation objects.
     * @returns A new Simulation instance.
     */ 
    static create(): Simulation {
        return new Simulation();
    }
}