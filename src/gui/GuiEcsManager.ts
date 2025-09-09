import { Ecs } from '../ecs/Ecs';
import { Simulation } from '../simulation/Simulation';
import { TypeUtils } from '../util/TypeUtils';
import { MainControllerSystem } from './controller/MainControllerSystem';
import { ScreensComponent } from './menu/ScreensComponent';

/**
 * Manages a separate ECS instance specifically for GUI components and systems.
 * This allows the GUI to have its own update frequency independent of the simulation.
 */
export class GuiEcsManager {
    private readonly ecs: Ecs;
    private readonly simulation: Simulation;
    private guiUpdateInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    /**
     * Name of the Debug entity.
     */
    public static DEBUG_ENTITY_NAME = 'Debug';

    constructor(simulation: Simulation, guiEcs: Ecs) {
        TypeUtils.ensureInstanceOf(simulation, Simulation, "Expected simulation to be an instance of Simulation");
        TypeUtils.ensureInstanceOf(guiEcs, Ecs, "Expected guiEcs to be an instance of Ecs");
        this.simulation = simulation;
        this.ecs = guiEcs;
    }

    /**
     * Starts the GUI ECS update loop with its own frequency.
     * @param updateFrequencyMs - Update frequency in milliseconds
     */
    start(updateFrequencyMs: number): void {
        // Stop any existing interval before starting a new one
        if (this.guiUpdateInterval) {
            clearInterval(this.guiUpdateInterval);
            this.guiUpdateInterval = null;
        }

        this.isRunning = true;

        // Start the GUI update loop
        this.guiUpdateInterval = setInterval(() => {
            if (this.isRunning) {
                this.ecs.update();
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
     * Gets the GUI ECS instance.
     */
    getEcs(): Ecs {
        return this.ecs;
    }

    /**
     * Gets the action system.
     */
    getActionSystem(): MainControllerSystem | undefined {
        return this.ecs.getSystemManager().get('MainControllerSystem') as MainControllerSystem | undefined;
    }

    /**
     * Convenience method used by TESTS to set the active screen by delegating to the ActionSystem.
     * @param screenName The name of the screen to activate
     */
    setActiveScreen(screenName: string): void {
        const actionSystem = this.getActionSystem();
        if (actionSystem) {
            actionSystem.setActiveScreen(screenName);
        }
    }

    /**
     * Convenience method used by TESTS to gets the entity ID for a screen by name.
     * Retrieves the screen entity ID from the ScreensComponent entity.
     * @param screenName The name of the screen to get the entity ID for
     * @returns The entity ID if found, undefined otherwise
     */
    getScreenEntityId(screenName: string): string | undefined {
        const screensComponent = this.ecs.getEntityManager().getSingletonComponent(ScreensComponent);
        return screensComponent?.getScreen(screenName);
    }

}
