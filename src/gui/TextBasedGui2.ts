import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { GuiEcsManager } from './GuiEcsManager';
import { TypeUtils } from '../util/TypeUtils';
import { InputComponent } from './view/InputComponent';
import { Ecs } from '../ecs/Ecs';

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
     * @param guiEcs pre-built GUI ECS instance.
     */
    constructor(simulation: Simulation, guiEcs: Ecs) {
        TypeUtils.ensureInstanceOf(simulation, Simulation, "Expected simulation to be an instance of Simulation");
        TypeUtils.ensureInstanceOf(guiEcs, Ecs, "Expected guiEcs to be an instance of Ecs");
        this.simulation = simulation;

        // Create readline interface for user input with raw mode for direct key capture
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Enable raw mode for direct key capture without Enter
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

    // Initialize the GUI ECS with provided GUI ECS
    this.guiEcsManager = new GuiEcsManager(this.simulation, guiEcs);
    }

    /**
     * Starts the ECS-based GUI with separate update frequencies for GUI and simulation.
     */
    async start(): Promise<void> {
        this.startGuiRunning();

        // Start the GUI ECS system (fast updates for responsive UI)
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

        // Ensure proper cleanup of readline and raw mode
        if (this.readline) {
            this.readline.removeAllListeners();
            this.readline.close();
        }

        // Restore normal terminal mode
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
    }

    /**
     * Starts the simulation tick loop that runs in the background.
     * This runs at a different frequency than the GUI updates.
     */
    private startSimulationLoop(): void {
        this.simulationTickInterval = setInterval(async () => {
            if (this.simulation.getIsRunning() ) {
                this.simulation.tick();
            }
        }, TextBasedGui2.SIMULATION_TICK_INTERVAL_MS);
    }

    /**
     * Main GUI interaction loop.
     */
    private async mainLoop(): Promise<void> {
        // Set up raw key listener for direct key input
        process.stdin.on('data', (data) => {
            if (!this.isWaitingForInput) return;
            
            const key = data.toString();
            this.handleDirectKeyInput(key);
        });

        while (this.isGuiRunning()) {
            // Set flag to indicate we're waiting for input
            this.isWaitingForInput = true;

            // Wait for direct key input (processed by the data event handler)
            await new Promise(resolve => {
                const checkInput = () => {
                    if (!this.isWaitingForInput || !this.isRunning) {
                        resolve(undefined);
                    } else {
                        setTimeout(checkInput, 50);
                    }
                };
                checkInput();
            });

            // Exit if GUI has been stopped
            if (!this.isRunning) break;
        }

        // Stop the GUI
        this.stop();
    }

    /**
     * Handles direct key input without requiring Enter.
     */
    private handleDirectKeyInput(key: string): void {
        // Reset waiting flag
        this.isWaitingForInput = false;

        // get the entity manager
        const entityManager = this.guiEcsManager.getEcs().getEntityManager();        

        // Get the input component for processing commands
        const inputComponent = entityManager.getSingletonComponent(InputComponent);
        if (!inputComponent) return;

        // Handle special keys
        if (key === '\u0003') { // Ctrl+C
            this.stop();
            return;
        }

        // Arrow keys and other ANSI escape sequences start with ESC ('\u001b').
        // Typical sequences: '\u001b[A' (up), '\u001b[B' (down), '\u001b[C' (right), '\u001b[D' (left)
        if (key.startsWith('\u001b[') && key.length >= 3) {
            const code = key[2];
            switch (code) {
                case 'A': // up
                    inputComponent.setLastInput('up');
                    return;
                case 'B': // down
                    inputComponent.setLastInput('down');
                    return;
                case 'C': // right
                    inputComponent.setLastInput('right');
                    return;
                case 'D': // left
                    inputComponent.setLastInput('left');
                    return;
                default:
                    // Unknown escape sequence - ignore and continue
                    break;
            }
        }

        if (key === '\u001b') { // plain Escape key
            this.stop();
            return;
        }

        // Convert key to command
        const normalizedCommand = key.toLowerCase().trim();

        switch (normalizedCommand) {
            case 'a':
                inputComponent.setLastInput('a');
                break;
            case 'd':
                inputComponent.setLastInput('d');
                break;
            case '\r': // Enter key
            case '\n': // Line feed
                inputComponent.setLastInput('enter');
                break;
            case 'q':
                this.stop();
                break;
            case 'h':
                inputComponent.setLastInput('h');
                break;
            case 'c':
                inputComponent.setLastInput('c');
                break;
            case 'r':
                inputComponent.setLastInput('r');
                break;
            case '1':
                inputComponent.setLastInput('1');
                break;
            case '2':
                inputComponent.setLastInput('2');
                break;
            case '3':
                inputComponent.setLastInput('3');
                break;
            case '4':
                inputComponent.setLastInput('4');
                break;
            case '5':
                inputComponent.setLastInput('5');
                break;
            default:
                // Handle any other single character input
                if (normalizedCommand.length === 1) {
                    inputComponent.setLastInput(normalizedCommand);
                }
                break;
        }
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
     * @param simulation The simulation instance to associate with the GUI.
     * @param guiEcs Optional pre-built GUI ECS instance.
     */
    static create(simulation: Simulation, guiEcs: Ecs): TextBasedGui2 {
        return new TextBasedGui2(simulation, guiEcs);
    }
}
