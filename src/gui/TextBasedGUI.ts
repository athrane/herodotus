import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';
import { NameComponent } from '../ecs/NameComponent';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { TimeComponent } from '../time/TimeComponent';
import { HistoricalFigureComponent } from '../historicalfigure/HistoricalFigureComponent';
import { GuiHelper } from './GuiHelper';

/**
 * A simple text-based GUI for interacting with the Herodotus simulation.
 * Allows the player to make choices for dilemmas and control the simulation flow.
 */
export class TextBasedGUI {
    private readonly simulation: Simulation;
    private readonly readline: readline.Interface;
    private isRunning: boolean = false;
    private tickInterval: NodeJS.Timeout | null = null;
    private hasNotifiedOfDilemma: boolean = false;
    private isInDetailScreen: boolean = false;
    private shouldAutoNavigateToChoices: boolean = false;
    private isWaitingForInput: boolean = false;

    constructor(simulation: Simulation) {
        this.simulation = simulation;
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Displays the main interface screen.
     */
    private displayMainInterface(): void {
        GuiHelper.clearScreen();
        
        GuiHelper.displayHeader(this.simulation);
        
        console.log('='.repeat(60));
        
        // Check for and display any pending dilemmas
        GuiHelper.displayPendingDilemmasInline(this.simulation);
        
        console.log('='.repeat(60));
        console.log('Commands: [H]elp [S]tatus [C]hoices Ch[r]onicle [Q]uit');
        console.log('='.repeat(60));
    }

    /**
     * Displays the header with current game status.
     */
    /**
     * Starts the text-based GUI.
     */
    async start(): Promise<void> {
        this.isRunning = true;
        this.simulation.start();

        // Start the simulation tick loop
        this.startSimulationLoop();

        // Display initial interface
        this.displayMainInterface();
        
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
                await this.checkForDilemmas();
                // Refresh the interface every tick
                if (!this.isWaitingForInput && !this.shouldAutoNavigateToChoices) {
                    this.displayMainInterface();
                }
            }
        }, 2000); // Tick every 2 seconds (slower for better readability)
    }

    /**
     * Main GUI interaction loop.
     */
    private async mainLoop(): Promise<void> {
        while (this.isRunning) {
            // Check if we should auto-navigate to choices screen
            if (this.shouldAutoNavigateToChoices) {
                this.shouldAutoNavigateToChoices = false;
                GuiHelper.clearScreen();
                console.log('Decision required! Navigating to choices...');
                await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
                await this.displayAndHandleChoices();
                continue; // Skip the normal command input for this iteration
            }
            
            this.isWaitingForInput = true;
            const command = await GuiHelper.askQuestion(this.readline, '\nCommand: ');
            this.isWaitingForInput = false;
            
            // If command is empty and we should auto-navigate, do it now
            if (!command.trim() && this.shouldAutoNavigateToChoices) {
                continue; // Go back to start of loop to handle auto-navigation
            }
            
            await this.processCommand(command.toLowerCase().trim());
            
            // Refresh the interface after each command
            if (this.isRunning && !this.shouldAutoNavigateToChoices) {
                this.displayMainInterface();
            }
        }
    }

    /**
     * Processes user commands.
     */
    private async processCommand(command: string): Promise<void> {
        switch (command) {
            case 'help':
            case 'h':
                await this.showHelp();
                break;
            case 'status':
            case 's':
                await this.displayDetailedStatus();
                break;
            case 'choices':
            case 'c':
                await this.displayAndHandleChoices();
                break;
            case 'chronicle':
            case 'r':
                await this.displayChronicle();
                break;
            case 'quit':
            case 'q':
                this.isRunning = false;
                GuiHelper.clearScreen();
                console.log('Thank you for playing Herodotus!');
                break;
            default:
                console.log('Unknown command. Type "h" for help.');
                await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
        }
    }

    /**
     * Shows help information and pauses both simulation and interface updates.
     */
    private async showHelp(): Promise<void> {
        // Mark that we're in a detail screen to prevent interruptions
        this.isInDetailScreen = true;
        
        // Remember the simulation state and pause both simulation and interface updates
        const wasSimulationRunning = this.simulation.getIsRunning();
        
        if (wasSimulationRunning) {
            this.simulation.stop(); // Pause the actual simulation
        }
        
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        GuiHelper.clearScreen();
        
        // Display the header at the top
        GuiHelper.displayHeader(this.simulation);
        
        console.log('='.repeat(80));
        console.log('                       HELP');
        console.log('='.repeat(80));
        console.log('[H]elp        - Show this help message');
        console.log('[S]tatus      - Display detailed simulation status');
        console.log('[C]hoices     - Show and handle current dilemma choices');
        console.log('Ch[r]onicle   - Display recent historical events');
        console.log('[Q]uit        - Exit the simulation');
        console.log('');
        console.log('You can type the full command or just press the bracketed letter.');
        console.log('The main screen shows current status and any pending decisions.');
        console.log('');
        console.log('NOTE: The simulation is paused while viewing help.');
        console.log('='.repeat(60));
        
        await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
        
        // Resume both simulation and interface updates if they were running before
        if (wasSimulationRunning) {
            this.simulation.start(); // Resume the actual simulation
        }
        this.startSimulationLoop();
        
        // Mark that we're no longer in a detail screen
        this.isInDetailScreen = false;
    }

    /**
     * Displays detailed simulation status (full screen) and pauses both simulation and interface updates.
     */
    private async displayDetailedStatus(): Promise<void> {
        // Mark that we're in a detail screen to prevent interruptions
        this.isInDetailScreen = true;
        
        // Remember the simulation state and pause both simulation and interface updates
        const wasSimulationRunning = this.simulation.getIsRunning();
        
        if (wasSimulationRunning) {
            this.simulation.stop(); // Pause the actual simulation
        }
        
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        GuiHelper.clearScreen();
        
        // Display the header at the top
        GuiHelper.displayHeader(this.simulation);
        
        console.log('='.repeat(80));
        console.log('                   DETAILED STATUS');
        console.log('='.repeat(80));
        
        const entityManager = this.simulation.getEntityManager();
        const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
        const timeComponent = entityManager.getSingletonComponent(TimeComponent);

        if (timeComponent) {
            console.log(`Current Year: ${timeComponent.getTime().getYear()}`);
        }

        if (playerEntity) {
            const nameComponent = playerEntity.getComponent(NameComponent);
            const historicalFigureComponent = playerEntity.getComponent(HistoricalFigureComponent);
            
            if (nameComponent) {
                console.log(`Player: ${nameComponent.getText()}`);
            }
            
            if (historicalFigureComponent) {
                const figure = historicalFigureComponent.getHistoricalFigure();
                console.log(`Character: ${figure.getName()}`);
                console.log(`Occupation: ${figure.getOccupation()}`);
                console.log(`Birth Year: ${figure.getBirthYear()}`);
            }

            // Show if there are pending dilemmas
            const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
            if (dilemmaComponent && dilemmaComponent.getChoices().length > 0) {
                console.log(`Pending Decisions: ${dilemmaComponent.getChoices().length}`);
            } else {
                console.log('Pending Decisions: None');
            }
        }

        console.log(`Simulation Running: ${this.simulation.getIsRunning()}`);
        console.log('');
        console.log('NOTE: The simulation is paused while viewing status.');
        console.log('='.repeat(80));
        
        await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
        
        // Resume both simulation and interface updates if they were running before
        if (wasSimulationRunning) {
            this.simulation.start(); // Resume the actual simulation
        }
        this.startSimulationLoop();
        
        // Mark that we're no longer in a detail screen
        this.isInDetailScreen = false;
    }

    /**
     * Displays current dilemma choices and handles player selection, pausing both simulation and interface updates.
     */
    private async displayAndHandleChoices(): Promise<void> {
        // Mark that we're in a detail screen to prevent interruptions
        this.isInDetailScreen = true;
        
        // Remember the simulation state and pause both simulation and interface updates
        const wasSimulationRunning = this.simulation.getIsRunning();
        
        if (wasSimulationRunning) {
            this.simulation.stop(); // Pause the actual simulation
        }
        
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
        if (!playerEntity) {
            console.log('Player entity not found!');
            await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
            
            // Resume simulation and interface if they were running before
            if (wasSimulationRunning) {
                this.simulation.start();
            }
            this.startSimulationLoop();
            this.isInDetailScreen = false;
            this.shouldAutoNavigateToChoices = false;
            return;
        }

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (!dilemmaComponent) {
            console.log('No dilemma component found on player entity.');
            await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
            
            // Resume simulation and interface if they were running before
            if (wasSimulationRunning) {
                this.simulation.start();
            }
            this.startSimulationLoop();
            this.isInDetailScreen = false;
            this.shouldAutoNavigateToChoices = false;
            return;
        }

        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) {
            console.log('No pending decisions at this time.');
            await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
            
            // Resume simulation and interface if they were running before
            if (wasSimulationRunning) {
                this.simulation.start();
            }
            this.startSimulationLoop();
            this.isInDetailScreen = false;
            this.shouldAutoNavigateToChoices = false;
            return;
        }

        GuiHelper.clearScreen();
        
        // Display the header at the top
        GuiHelper.displayHeader(this.simulation);
        
        console.log('='.repeat(80));
        console.log('                    DECISION REQUIRED');
        console.log('='.repeat(80));
        
        choices.forEach((choice, index) => {
            console.log(`[${index + 1}] ${choice.getEventName()}`);
            console.log(`    Type: ${choice.getEventType()}`);
            console.log(`    Description: ${choice.getDescription()}`);
            console.log(`    Consequence: ${choice.getConsequence()}`);
            console.log('');
        });

        console.log('-'.repeat(80));        
        const selection = await GuiHelper.askQuestion(this.readline, `Available choices: 1-${choices.length} (select decision) | [b]ack (return to main): `);
        
        if (selection.toLowerCase() === 'b') {
            // Resume simulation and interface if they were running before
            if (wasSimulationRunning) {
                this.simulation.start();
            }
            this.startSimulationLoop();
            this.isInDetailScreen = false;
            this.shouldAutoNavigateToChoices = false;
            return;
        }

        const choiceIndex = parseInt(selection) - 1;
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
            await this.makePlayerChoice(choiceIndex);
        } else {
            console.log('Invalid choice. Please try again.');
            await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
        }
        
        // Resume simulation and interface if they were running before
        if (wasSimulationRunning) {
            this.simulation.start();
        }
        this.startSimulationLoop();
        this.isInDetailScreen = false;
        this.shouldAutoNavigateToChoices = false;
    }

    /**
     * Makes a player choice for the current dilemma.
     */
    private async makePlayerChoice(choiceIndex: number): Promise<void> {
        const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        const dataSetEventComponent = playerEntity.getComponent(DataSetEventComponent);
        
        if (!dilemmaComponent || !dataSetEventComponent) return;

        const choices = dilemmaComponent.getChoices();
        if (choiceIndex < 0 || choiceIndex >= choices.length) return;

        const chosenEvent = choices[choiceIndex];
        
        // Update the entity's DataSetEventComponent with the choice
        dataSetEventComponent.setDataSetEvent(chosenEvent);

        // Clear the choices in DilemmaComponent
        dilemmaComponent.clearChoices();

        // Reset the notification flag so we get notified of future dilemmas
        this.hasNotifiedOfDilemma = false;

        // The DilemmaResolutionSystem will handle recording this in the chronicle
        // when it processes the entity during the next tick
    }

    /**
     * Displays recent chronicle events and pauses both simulation and interface updates.
     */
    private async displayChronicle(): Promise<void> {
        // Mark that we're in a detail screen to prevent interruptions
        this.isInDetailScreen = true;
        
        // Remember the simulation state and pause both simulation and interface updates
        const wasSimulationRunning = this.simulation.getIsRunning();
        
        if (wasSimulationRunning) {
            this.simulation.stop(); // Pause the actual simulation
        }
        
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        const entityManager = this.simulation.getEntityManager();
        const chronicleComponent = entityManager.getSingletonComponent(ChronicleComponent);
        
        GuiHelper.clearScreen();
        
        // Display the header at the top
        GuiHelper.displayHeader(this.simulation);
        
        console.log('='.repeat(60));
        console.log('                    RECENT HISTORY');
        console.log('='.repeat(60));
        
        if (!chronicleComponent) {
            console.log('No chronicle component found.');
        } else {
            const events = chronicleComponent.getEvents();
            const recentEvents = events.slice(-10); // Show last 10 events

            if (recentEvents.length === 0) {
                console.log('No historical events recorded yet.');
            } else {
                recentEvents.forEach((event, index) => {
                    console.log(`${index + 1}. [Year ${event.getTime().getYear()}] ${event.getHeading()}`);
                    console.log(`   Location: ${event.getPlace().getName()}`);
                    console.log(`   ${event.getDescription()}`);
                    console.log('');
                });
            }
        }
        console.log('');
        console.log('NOTE: The simulation is paused while viewing chronicle.');
        console.log('='.repeat(60));
        
        await GuiHelper.askQuestion(this.readline, 'Press Enter to continue...');
        
        // Resume both simulation and interface updates if they were running before
        if (wasSimulationRunning) {
            this.simulation.start(); // Resume the actual simulation
        }
        this.startSimulationLoop();
        
        // Mark that we're no longer in a detail screen
        this.isInDetailScreen = false;
    }

    /**
     * Displays current dilemma choices and prompts for input.
     */
    private async displayChoicesOnly(): Promise<void> {
        const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (!dilemmaComponent) return;

        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) return;

        console.log('\n=== CURRENT DILEMMA ===');
        choices.forEach((choice, index) => {
            console.log(`\n[${index + 1}] ${choice.getEventName()}`);
            console.log(`    Type: ${choice.getEventType()}`);
            console.log(`    Description: ${choice.getDescription()}`);
            if (choice.getConsequence && choice.getConsequence()) {
                console.log(`    Consequence: ${choice.getConsequence()}`);
            }
        });
        console.log('\n=======================');
        
        const selection = await GuiHelper.askQuestion(this.readline, `\nChoose your decision (1-${choices.length}): `);
        
        const choiceIndex = parseInt(selection) - 1;
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
            await this.makePlayerChoice(choiceIndex);
        } else {
            console.log('Invalid choice. Please try again when prompted.');
        }
    }

    /**
     * Checks for new dilemmas and sets flag for automatic navigation.
     */
    private async checkForDilemmas(): Promise<void> {
        const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        const hasPendingChoices = dilemmaComponent && dilemmaComponent.getChoices().length > 0;
        
        if (hasPendingChoices && !this.hasNotifiedOfDilemma && !this.isInDetailScreen) {
            // Set the flag to prevent repeated notifications
            this.hasNotifiedOfDilemma = true;
            
            // Set flag to auto-navigate to choices screen
            this.shouldAutoNavigateToChoices = true;
            
            // If we're waiting for input, interrupt it by sending a newline
            if (this.isWaitingForInput) {
                process.stdin.emit('keypress', '\n', { name: 'return' });
            }
        } else if (!hasPendingChoices && this.hasNotifiedOfDilemma) {
            // Reset the flag when there are no more pending choices
            this.hasNotifiedOfDilemma = false;
            this.shouldAutoNavigateToChoices = false;
        }
    }

    /**
     * Creates a new TextBasedGUI instance.
     */
    static create(simulation: Simulation): TextBasedGUI {
        return new TextBasedGUI(simulation);
    }
}
