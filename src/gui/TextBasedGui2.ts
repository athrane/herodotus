import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { GuiHelper } from './GuiHelper';
import { GuiEcsManager } from './GuiEcsManager';
import { TypeUtils } from '../util/TypeUtils';
import { InputComponent } from './menu/InputComponent';

/**
 * A text-based GUI using a separate ECS system for screen management.
 * Each screen is implemented as an entity with ScreenComponent and IsActiveComponent.
 * The GUI has its own ECS instance, decoupled from the simulation ECS.
 */

export class TextBasedGui2 {
    private readonly simulation: Simulation;
    private readonly readline: readline.Interface;
    private readonly guiEcsManager: GuiEcsManager;
    private isRunning: boolean = false;
    private simulationTickInterval: NodeJS.Timeout | null = null;
    private isWaitingForInput: boolean = false;

    /**
     * GUI update interval in milliseconds.
     */
    static readonly GUI_UPDATE_INTERVAL_MS = 1000;

    /**
     * Simulation tick interval in milliseconds.
     */
    static readonly SIMULATION_TICK_INTERVAL_MS = 2000;

    /**
     * Creates an instance of TextBasedGui2.
     * @param simulation The simulation instance to associate with the GUI.
     */
    constructor(simulation: Simulation) {
        TypeUtils.ensureInstanceOf(simulation, Simulation, "Expected simulation to be an instance of Simulation");
        this.simulation = simulation;

        // Create readline interface for user input
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Initialize the GUI ECS
        this.guiEcsManager = new GuiEcsManager(this.simulation);
    }

    /**
     * Starts the ECS-based GUI with separate update frequencies for GUI and simulation.
     */
    async start(): Promise<void> {
        this.startGuiRunning();

        // Initialize and start the GUI ECS system (fast updates for responsive UI)
        this.guiEcsManager.initialize();
        this.guiEcsManager.start(TextBasedGui2.GUI_UPDATE_INTERVAL_MS); 

        // Start the simulation
        this.simulation.start();

        // Start the simulation tick loop (slower updates for game logic)
        this.startSimulationLoop();

        // Start the main GUI loop
        await this.mainLoop();
    }

    /**
     * Stops the GUI and cleans up resources.
     */
    stop(): void {
        this.stopGuiRunning();

        // Stop the simulation tick loop
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
            if (this.simulation.getIsRunning() && !this.isWaitingForInput) {
                this.simulation.tick();
            }
        }, TextBasedGui2.SIMULATION_TICK_INTERVAL_MS);
    }

    /**
     * Main GUI interaction loop.
     */
    private async mainLoop(): Promise<void> {
        while (this.isGuiRunning()) {

            // Wait for user input and get the command
            this.isWaitingForInput = true;
            const command = await GuiHelper.askQuestion(this.readline, "> ");
            this.isWaitingForInput = false;

            // Exit if GUI has been stopped during input
            if (!this.isRunning) break;

            // Normalize the command
            const normalizedCommand = command.toLowerCase().trim();

            // Get the input component for processing commands
            const entityManager = this.guiEcsManager.getEcs().getEntityManager();
            const inputComponent = entityManager.getSingletonComponent(InputComponent);
            if (!inputComponent) continue;

            switch (normalizedCommand) {
                case 'w':
                case 'up':
                    inputComponent.setLastInput('w');
                    break;
                case 's':
                case 'down':
                    inputComponent.setLastInput('s');
                    break;
                case '':
                case 'enter':
                    inputComponent.setLastInput('enter');
                    break;
                case 'q':
                case 'quit':
                    this.stop();
                    break;
                default:
                    // Optional: provide feedback for unknown commands
                    break;
            }
        }

        // Stop the GUI
        this.stop();
    }

    /**
     * Sets the running state of the GUI to running.
     */
    startGuiRunning(): void {
        this.isRunning = true;
    }

    /**
     * Sets the running state of the GUI to not running.
     */
    stopGuiRunning(): void {
        this.isRunning = false;
    }

    /**
     * Returns true if the GUI is currently running.
     */
    isGuiRunning(): boolean {
        return this.isRunning;
    }

    /**
     * Creates a new instance of TextBasedGui2.
     */
    static create(simulation: Simulation): TextBasedGui2 {
        return new TextBasedGui2(simulation);
    }
}
