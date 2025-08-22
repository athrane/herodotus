import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { GuiHelper } from './GuiHelper';
import { GuiEcsManager } from './GuiEcsManager';

/**
 * A text-based GUI using a separate ECS system for screen management.
 * Each screen is implemented as an entity with ScreenComponent and IsActiveComponent.
 * The GUI has its own ECS instance, decoupled from the simulation ECS.
 */
export class TextBasedGUI {
    private readonly simulation: Simulation;
    private readonly readline: readline.Interface;
    private readonly guiEcsManager: GuiEcsManager;
    private isRunning: boolean = false;
    private simulationTickInterval: NodeJS.Timeout | null = null;
    private isWaitingForInput: boolean = false;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Initialize the separate GUI ECS manager
        this.guiEcsManager = new GuiEcsManager(this.readline);
    }

    /**
     * Starts the ECS-based GUI with separate update frequencies for GUI and simulation.
     */
    async start(): Promise<void> {
        this.isRunning = true;
        
        // Initialize and start the GUI ECS system (fast updates for responsive UI)
        this.guiEcsManager.initialize();
        this.guiEcsManager.start(100); // GUI updates every 100ms
        
        // Start the simulation
        this.simulation.start();

        // Start the simulation tick loop (slower updates for game logic)
        this.startSimulationLoop();

        // Render the initial active screen
        await this.guiEcsManager.renderActiveScreen(this.simulation);
        
        // Start the main GUI loop
        await this.mainLoop();
    }

    /**
     * Stops the GUI and cleans up resources.
     */
    stop(): void {
        this.isRunning = false;
        if (this.simulationTickInterval) {
            clearInterval(this.simulationTickInterval);
            this.simulationTickInterval = null;
        }
        this.guiEcsManager.stop();
        this.simulation.stop();
        this.readline.close();
    }

    /**
     * Starts the simulation tick loop that runs in the background.
     * This runs at a different frequency than the GUI updates.
     */
    private startSimulationLoop(): void {
        this.simulationTickInterval = setInterval(async () => {
            if (this.simulation.getIsRunning()) {
                this.simulation.tick();
                // Refresh the active screen after simulation updates (only when not waiting for input)
                if (!this.isWaitingForInput) {
                    await this.guiEcsManager.renderActiveScreen(this.simulation);
                }
            }
        }, 2000); // Simulation ticks every 2 seconds
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
            const handledByScreen = await this.guiEcsManager.handleActiveScreenInput(normalizedCommand, this.simulation);
            
            if (!handledByScreen) {
                // Handle global navigation commands
                await this.handleGlobalCommands(normalizedCommand);
            }
            
            // Refresh the active screen after command processing
            if (this.isRunning) {
                await this.guiEcsManager.renderActiveScreen(this.simulation);
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
                const statusScreenId = this.guiEcsManager.getScreenEntityId('status');
                if (statusScreenId) {
                    this.guiEcsManager.setActiveScreen(statusScreenId);
                }
                break;
            case 'choices':
            case 'c':
                const choicesScreenId = this.guiEcsManager.getScreenEntityId('choices');
                if (choicesScreenId) {
                    this.guiEcsManager.setActiveScreen(choicesScreenId);
                }
                break;
            case 'chronicle':
            case 'r':
                const chronicleScreenId = this.guiEcsManager.getScreenEntityId('chronicle');
                if (chronicleScreenId) {
                    this.guiEcsManager.setActiveScreen(chronicleScreenId);
                }
                break;
            case 'main':
            case 'm':
            case 'back':
            case 'b':
                const mainScreenId = this.guiEcsManager.getScreenEntityId('main');
                if (mainScreenId) {
                    this.guiEcsManager.setActiveScreen(mainScreenId);
                }
                break;
            default:
                console.log(`Unknown command: ${command}`);
                console.log('Type "help" or "h" for available commands.');
                break;
        }
    }

    /**
     * Creates a new instance of TextBasedGUI.
     */
    static create(simulation: Simulation): TextBasedGUI {
        return new TextBasedGUI(simulation);
    }
}
