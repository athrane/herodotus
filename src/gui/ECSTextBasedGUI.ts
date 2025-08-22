import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { GuiHelper } from './GuiHelper';
import { ScreenRenderSystem } from './ScreenRenderSystem';
import { ScreenManager } from './ScreenManager';

/**
 * A refactored text-based GUI using the ECS system for screen management.
 * Each screen is implemented as an entity with ScreenComponent and IsActiveComponent.
 */
export class ECSTextBasedGUI {
    private readonly simulation: Simulation;
    private readonly readline: readline.Interface;
    private screenRenderSystem: ScreenRenderSystem;
    private screenManager: ScreenManager;
    private isRunning: boolean = false;
    private tickInterval: NodeJS.Timeout | null = null;
    private isWaitingForInput: boolean = false;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const entityManager = this.simulation.getEntityManager();
        this.screenRenderSystem = new ScreenRenderSystem(entityManager, this.readline);
        this.screenManager = new ScreenManager(entityManager);
        
        // Register the screen render system
        this.simulation.getSystemManager().register(this.screenRenderSystem);
    }

    /**
     * Starts the ECS-based GUI.
     */
    async start(): Promise<void> {
        this.isRunning = true;
        this.simulation.start();

        // Initialize all screens
        this.screenManager.initializeScreens(this.readline);

        // Start the simulation tick loop
        this.startSimulationLoop();

        // Render the initial active screen
        await this.screenRenderSystem.renderActiveScreen(this.simulation);
        
        // Start the main GUI loop
        await this.mainLoop();
    }

    /**
     * Stops the GUI and cleans up resources.
     */
    stop(): void {
        this.isRunning = false;
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
        this.simulation.stop();
        this.readline.close();
    }

    /**
     * Starts the simulation tick loop that runs in the background.
     */
    private startSimulationLoop(): void {
        this.tickInterval = setInterval(async () => {
            if (this.simulation.getIsRunning()) {
                this.simulation.tick();
                // Refresh the active screen periodically
                if (!this.isWaitingForInput) {
                    await this.screenRenderSystem.renderActiveScreen(this.simulation);
                }
            }
        }, 2000); // Tick every 2 seconds
    }

    /**
     * Main GUI interaction loop.
     */
    private async mainLoop(): Promise<void> {
        while (this.isRunning) {
            this.isWaitingForInput = true;
            const command = await GuiHelper.askQuestion(this.readline, '\nCommand: ');
            this.isWaitingForInput = false;
            
            const normalizedCommand = command.toLowerCase().trim();
            
            // Handle quit command globally
            if (normalizedCommand === 'quit' || normalizedCommand === 'q') {
                console.log('Goodbye!');
                this.stop();
                break;
            }
            
            // Try to handle the command with the active screen first
            const handledByScreen = await this.screenRenderSystem.handleActiveScreenInput(normalizedCommand, this.simulation);
            
            if (!handledByScreen) {
                // Handle global navigation commands
                await this.handleGlobalCommands(normalizedCommand);
            }
            
            // Refresh the active screen after command processing
            if (this.isRunning) {
                await this.screenRenderSystem.renderActiveScreen(this.simulation);
            }
        }
    }

    /**
     * Handles global navigation commands that can switch between screens.
     */
    private async handleGlobalCommands(command: string): Promise<void> {
        switch (command) {
            case 'status':
            case 's':
                const statusScreenId = this.screenManager.getScreenEntityId('status');
                if (statusScreenId) {
                    this.screenRenderSystem.setActiveScreen(statusScreenId);
                }
                break;
            case 'choices':
            case 'c':
                const choicesScreenId = this.screenManager.getScreenEntityId('choices');
                if (choicesScreenId) {
                    this.screenRenderSystem.setActiveScreen(choicesScreenId);
                }
                break;
            case 'chronicle':
            case 'r':
                const chronicleScreenId = this.screenManager.getScreenEntityId('chronicle');
                if (chronicleScreenId) {
                    this.screenRenderSystem.setActiveScreen(chronicleScreenId);
                }
                break;
            case 'main':
            case 'm':
            case 'back':
            case 'b':
                const mainScreenId = this.screenManager.getScreenEntityId('main');
                if (mainScreenId) {
                    this.screenRenderSystem.setActiveScreen(mainScreenId);
                }
                break;
            default:
                console.log(`Unknown command: ${command}`);
                console.log('Type "help" or "h" for available commands.');
                break;
        }
    }

    /**
     * Creates a new instance of ECSTextBasedGUI.
     */
    static create(simulation: Simulation): ECSTextBasedGUI {
        return new ECSTextBasedGUI(simulation);
    }
}
