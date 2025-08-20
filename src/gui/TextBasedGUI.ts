import * as readline from 'readline';
import { Simulation } from '../simulation/Simulation';
import { PlayerComponent } from '../ecs/PlayerComponent';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';
import { NameComponent } from '../ecs/NameComponent';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { TimeComponent } from '../time/TimeComponent';
import { HistoricalFigureComponent } from '../historicalfigure/HistoricalFigureComponent';

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

    constructor(simulation: Simulation) {
        this.simulation = simulation;
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Clears the terminal screen.
     */
    private clearScreen(): void {
        // ANSI escape codes to clear screen and move cursor to top-left
        process.stdout.write('\x1b[2J\x1b[0f');
    }

    /**
     * Displays the main interface screen.
     */
    private displayMainInterface(): void {
        this.clearScreen();
        
        // Get current year, simulation state, player info, and status for header
        const entityManager = this.simulation.getEntityManager();
        const timeComponent = entityManager.getSingletonComponent(TimeComponent);
        const currentYear = timeComponent ? timeComponent.getTime().getYear().toString().padStart(4, '0') : '0000';
        const simulationState = this.simulation.getIsRunning() ? 'Running' : 'Stopped';
        
        const playerEntity = this.getPlayerEntity();
        let playerName = 'Unknown';
        let statusText = 'No pending decisions';
        
        if (playerEntity) {
            const historicalFigureComponent = playerEntity.getComponent(HistoricalFigureComponent);
            if (historicalFigureComponent) {
                const figure = historicalFigureComponent.getHistoricalFigure();
                playerName = figure.getName();
            }

            // Get status for header
            const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
            if (dilemmaComponent && dilemmaComponent.getChoices().length > 0) {
                statusText = `${dilemmaComponent.getChoices().length} pending decision(s)`;
            }
        }
        
        console.log('='.repeat(60));
        console.log(`Year: ${currentYear} | Simulation: ${simulationState} | Player: ${playerName} | Status: ${statusText} | Herodotus 1.0.0`);
        console.log('='.repeat(60));
        
        console.log('='.repeat(60));
        
        // Check for and display any pending dilemmas
        this.displayPendingDilemmasInline();
        
        console.log('='.repeat(60));
        console.log('Commands: [H]elp [S]tatus [C]hoices Ch[r]onicle [Q]uit');
        console.log('='.repeat(60));
    }

    /**
     * Displays pending dilemmas inline.
     */
    private displayPendingDilemmasInline(): void {
        const playerEntity = this.getPlayerEntity();
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (!dilemmaComponent) return;

        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) {
            console.log('No current dilemmas.');
            return;
        }

        console.log('*** DECISION REQUIRED ***');
        choices.forEach((choice, index) => {
            console.log(`[${index + 1}] ${choice.getEventName()}`);
            console.log(`    ${choice.getDescription()}`);
            if (choice.getConsequence && choice.getConsequence()) {
                console.log(`    → ${choice.getConsequence()}`);
            }
            console.log('');
        });
    }

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
                this.displayMainInterface();
            }
        }, 2000); // Tick every 2 seconds (slower for better readability)
    }

    /**
     * Main GUI interaction loop.
     */
    private async mainLoop(): Promise<void> {
        while (this.isRunning) {
            const command = await this.askQuestion('\nCommand: ');
            await this.processCommand(command.toLowerCase().trim());
            
            // Refresh the interface after each command
            if (this.isRunning) {
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
                this.showHelp();
                await this.askQuestion('Press Enter to continue...');
                break;
            case 'status':
            case 's':
                this.displayDetailedStatus();
                await this.askQuestion('Press Enter to continue...');
                break;
            case 'choices':
            case 'c':
                await this.displayAndHandleChoices();
                break;
            case 'chronicle':
            case 'r':
                this.displayChronicle();
                await this.askQuestion('Press Enter to continue...');
                break;
            case 'quit':
            case 'q':
                this.isRunning = false;
                this.clearScreen();
                console.log('Thank you for playing Herodotus!');
                break;
            default:
                console.log('Unknown command. Type "h" for help.');
                await this.askQuestion('Press Enter to continue...');
        }
    }

    /**
     * Shows help information.
     */
    private showHelp(): void {
        this.clearScreen();
        console.log('='.repeat(60));
        console.log('                       HELP');
        console.log('='.repeat(60));
        console.log('[H]elp        - Show this help message');
        console.log('[S]tatus      - Display detailed simulation status');
        console.log('[C]hoices     - Show and handle current dilemma choices');
        console.log('Ch[r]onicle   - Display recent historical events');
        console.log('[Q]uit        - Exit the simulation');
        console.log('');
        console.log('You can type the full command or just press the bracketed letter.');
        console.log('The main screen shows current status and any pending decisions.');
        console.log('='.repeat(60));
    }

    /**
     * Displays detailed simulation status (full screen).
     */
    private displayDetailedStatus(): void {
        this.clearScreen();
        console.log('='.repeat(60));
        console.log('                   DETAILED STATUS');
        console.log('='.repeat(60));
        
        const entityManager = this.simulation.getEntityManager();
        const playerEntity = this.getPlayerEntity();
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
        console.log('='.repeat(60));
    }

    /**
     * Displays current dilemma choices and handles player selection.
     */
    private async displayAndHandleChoices(): Promise<void> {
        const playerEntity = this.getPlayerEntity();
        if (!playerEntity) {
            console.log('Player entity not found!');
            await this.askQuestion('Press Enter to continue...');
            return;
        }

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (!dilemmaComponent) {
            console.log('No dilemma component found on player entity.');
            await this.askQuestion('Press Enter to continue...');
            return;
        }

        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) {
            console.log('No pending decisions at this time.');
            await this.askQuestion('Press Enter to continue...');
            return;
        }

        this.clearScreen();
        console.log('='.repeat(60));
        console.log('                    DECISION REQUIRED');
        console.log('='.repeat(60));
        
        choices.forEach((choice, index) => {
            console.log(`[${index + 1}] ${choice.getEventName()}`);
            console.log(`    Type: ${choice.getEventType()}`);
            console.log(`    Description: ${choice.getDescription()}`);
            if (choice.getConsequence && choice.getConsequence()) {
                console.log(`    Consequence: ${choice.getConsequence()}`);
            }
            console.log('');
        });

        console.log('='.repeat(60));
        
        const selection = await this.askQuestion(`Choose your decision (1-${choices.length}), or 'back': `);
        
        if (selection.toLowerCase() === 'back') {
            return;
        }

        const choiceIndex = parseInt(selection) - 1;
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
            await this.makePlayerChoice(choiceIndex);
        } else {
            console.log('Invalid choice. Please try again.');
            await this.askQuestion('Press Enter to continue...');
        }
    }

    /**
     * Makes a player choice for the current dilemma.
     */
    private async makePlayerChoice(choiceIndex: number): Promise<void> {
        const playerEntity = this.getPlayerEntity();
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        const dataSetEventComponent = playerEntity.getComponent(DataSetEventComponent);
        
        if (!dilemmaComponent || !dataSetEventComponent) return;

        const choices = dilemmaComponent.getChoices();
        if (choiceIndex < 0 || choiceIndex >= choices.length) return;

        const chosenEvent = choices[choiceIndex];
        
        console.log(`\nYou chose: ${chosenEvent.getEventName()}`);
        console.log(`This decision will shape your reign...`);

        // Update the entity's DataSetEventComponent with the choice
        dataSetEventComponent.setDataSetEvent(chosenEvent);

        // Clear the choices in DilemmaComponent
        dilemmaComponent.clearChoices();

        // Reset the notification flag so we get notified of future dilemmas
        this.hasNotifiedOfDilemma = false;

        await this.askQuestion('Press Enter to continue...');

        // The DilemmaResolutionSystem will handle recording this in the chronicle
        // when it processes the entity during the next tick
    }

    /**
     * Displays recent chronicle events.
     */
    private displayChronicle(): void {
        const entityManager = this.simulation.getEntityManager();
        const chronicleComponent = entityManager.getSingletonComponent(ChronicleComponent);
        
        this.clearScreen();
        console.log('='.repeat(60));
        console.log('                    RECENT HISTORY');
        console.log('='.repeat(60));
        
        if (!chronicleComponent) {
            console.log('No chronicle component found.');
            return;
        }

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
        console.log('='.repeat(60));
    }

    /**
     * Displays current dilemma choices and prompts for input.
     */
    private async displayChoicesOnly(): Promise<void> {
        const playerEntity = this.getPlayerEntity();
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
        
        const selection = await this.askQuestion(`\nChoose your decision (1-${choices.length}): `);
        
        const choiceIndex = parseInt(selection) - 1;
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
            await this.makePlayerChoice(choiceIndex);
        } else {
            console.log('Invalid choice. Please try again when prompted.');
        }
    }

    /**
     * Checks for new dilemmas and notifies the player.
     */
    private async checkForDilemmas(): Promise<void> {
        const playerEntity = this.getPlayerEntity();
        if (!playerEntity) return;

        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        const hasPendingChoices = dilemmaComponent && dilemmaComponent.getChoices().length > 0;
        
        if (hasPendingChoices && !this.hasNotifiedOfDilemma) {
            // Just set the flag - the main interface will show the pending dilemmas
            this.hasNotifiedOfDilemma = true;
        } else if (!hasPendingChoices && this.hasNotifiedOfDilemma) {
            // Reset the flag when there are no more pending choices
            this.hasNotifiedOfDilemma = false;
        }
    }

    /**
     * Gets the player entity from the simulation.
     */
    private getPlayerEntity() {
        const entityManager = this.simulation.getEntityManager();
        const playerEntities = entityManager.getEntitiesWithComponents(PlayerComponent);
        return playerEntities.length > 0 ? playerEntities[0] : null;
    }

    /**
     * Prompts the user for input.
     */
    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.readline.question(question, resolve);
        });
    }

    /**
     * Creates a new TextBasedGUI instance.
     */
    static create(simulation: Simulation): TextBasedGUI {
        return new TextBasedGUI(simulation);
    }
}
