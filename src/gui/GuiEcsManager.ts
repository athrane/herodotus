import { Ecs } from '../ecs/Ecs';
import { EntityManager } from '../ecs/EntityManager';
import { SystemManager } from '../ecs/SystemManager';
import { ScreenRenderSystem } from './ScreenRenderSystem';
import { ScreenComponent } from './ScreenComponent';
import { IsActiveComponent } from './IsActiveComponent';
import { NameComponent } from '../ecs/NameComponent';
import { renderMainInterface, handleMainInterfaceInput } from './screens/MainInterfaceScreen';
import { renderStatusScreen, handleStatusScreenInput } from './screens/StatusScreen';
import { renderChoicesScreen, handleChoicesScreenInput } from './screens/ChoicesScreen';
import { renderChronicleScreen, handleChronicleScreenInput } from './screens/ChronicleScreen';
import { Simulation } from '../simulation/Simulation';
import * as readline from 'readline';

/**
 * Manages a separate ECS instance specifically for GUI components and systems.
 * This allows the GUI to have its own update frequency independent of the simulation.
 */
export class GuiEcsManager {
    private readonly ecs: Ecs;
    private readonly screenRenderSystem: ScreenRenderSystem;
    private readonly screens: Map<string, string> = new Map(); // screen name -> entity ID
    private readonly readline: readline.Interface;
    private guiUpdateInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor(readline: readline.Interface) {
        this.readline = readline;
        
        // Create separate ECS instance for GUI
        this.ecs = Ecs.create();
        
        // Initialize GUI-specific systems
        this.screenRenderSystem = new ScreenRenderSystem(this.ecs.getEntityManager(), this.readline);
        
        // Register systems
        this.ecs.registerSystem(this.screenRenderSystem);
    }

    /**
     * Initializes the GUI ECS system.
     */
    initialize(): void {
        // Initialize all screens as entities in the ECS system
        
        // Create main interface screen
        const mainScreen = this.ecs.getEntityManager().createEntity();
        mainScreen.addComponent(new NameComponent('MainInterface'));
        mainScreen.addComponent(new ScreenComponent(renderMainInterface, handleMainInterfaceInput));
        mainScreen.addComponent(new IsActiveComponent()); // Start with main screen active
        this.screens.set('main', mainScreen.getId());

        // Create status screen
        const statusScreen = this.ecs.getEntityManager().createEntity();
        statusScreen.addComponent(new NameComponent('Status'));
        statusScreen.addComponent(new ScreenComponent(renderStatusScreen, handleStatusScreenInput));
        this.screens.set('status', statusScreen.getId());

        // Create choices screen
        const choicesScreen = this.ecs.getEntityManager().createEntity();
        choicesScreen.addComponent(new NameComponent('Choices'));
        choicesScreen.addComponent(new ScreenComponent(renderChoicesScreen, handleChoicesScreenInput));
        this.screens.set('choices', choicesScreen.getId());

        // Create chronicle screen
        const chronicleScreen = this.ecs.getEntityManager().createEntity();
        chronicleScreen.addComponent(new NameComponent('Chronicle'));
        chronicleScreen.addComponent(new ScreenComponent(renderChronicleScreen, handleChronicleScreenInput));
        this.screens.set('chronicle', chronicleScreen.getId());
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
        return this.screens.get(screenName);
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
}
