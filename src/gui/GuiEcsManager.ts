import { Ecs } from '../ecs/Ecs';
import { EntityManager } from '../ecs/EntityManager';
import { SystemManager } from '../ecs/SystemManager';
import { ScreenRenderSystem } from './ScreenRenderSystem';
import { ScreenManager } from './ScreenManager';
import { Simulation } from '../simulation/Simulation';
import * as readline from 'readline';

/**
 * Manages a separate ECS instance specifically for GUI components and systems.
 * This allows the GUI to have its own update frequency independent of the simulation.
 */
export class GuiEcsManager {
    private readonly ecs: Ecs;
    private readonly screenRenderSystem: ScreenRenderSystem;
    private readonly screenManager: ScreenManager;
    private readonly readline: readline.Interface;
    private guiUpdateInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor(readline: readline.Interface) {
        this.readline = readline;
        
        // Create separate ECS instance for GUI
        this.ecs = Ecs.create();
        
        // Initialize GUI-specific systems
        this.screenRenderSystem = new ScreenRenderSystem(this.ecs.getEntityManager(), this.readline);
        this.screenManager = new ScreenManager(this.ecs.getEntityManager());
        
        // Register systems
        this.ecs.registerSystem(this.screenRenderSystem);
    }

    /**
     * Initializes the GUI ECS system.
     */
    initialize(): void {
        // Initialize all screens
        this.screenManager.initializeScreens(this.readline);
    }

    /**
     * Starts the GUI ECS update loop with its own frequency.
     * @param updateFrequencyMs - Update frequency in milliseconds (default: 100ms for responsive UI)
     */
    start(updateFrequencyMs: number = 100): void {
        this.isRunning = true;
        
        // Start the GUI update loop
        this.guiUpdateInterval = setInterval(() => {
            if (this.isRunning) {
                this.update();
            }
        }, updateFrequencyMs);
    }

    /**
     * Stops the GUI ECS system.
     */
    stop(): void {
        this.isRunning = false;
        if (this.guiUpdateInterval) {
            clearInterval(this.guiUpdateInterval);
            this.guiUpdateInterval = null;
        }
    }

    /**
     * Updates all GUI systems.
     */
    private update(): void {
        // Update the GUI ECS systems
        this.ecs.update();
    }

    /**
     * Renders the currently active screen.
     */
    async renderActiveScreen(simulation: Simulation): Promise<void> {
        await this.screenRenderSystem.renderActiveScreen(simulation);
    }

    /**
     * Handles input for the currently active screen.
     */
    async handleActiveScreenInput(command: string, simulation: Simulation): Promise<boolean> {
        return await this.screenRenderSystem.handleActiveScreenInput(command, simulation);
    }

    /**
     * Sets the active screen.
     */
    setActiveScreen(entityId: string): void {
        this.screenRenderSystem.setActiveScreen(entityId);
    }

    /**
     * Gets the entity ID for a screen by name.
     */
    getScreenEntityId(screenName: string): string | undefined {
        return this.screenManager.getScreenEntityId(screenName);
    }

    /**
     * Gets the GUI ECS instance.
     */
    getEcs(): Ecs {
        return this.ecs;
    }

    /**
     * Gets the GUI entity manager.
     */
    getEntityManager(): EntityManager {
        return this.ecs.getEntityManager();
    }

    /**
     * Gets the GUI system manager.
     */
    getSystemManager(): SystemManager {
        return this.ecs.getSystemManager();
    }

    /**
     * Gets the screen render system.
     */
    getScreenRenderSystem(): ScreenRenderSystem {
        return this.screenRenderSystem;
    }

    /**
     * Gets the screen manager.
     */
    getScreenManager(): ScreenManager {
        return this.screenManager;
    }
}
