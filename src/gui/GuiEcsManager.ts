import { Ecs } from '../ecs/Ecs';
import { NameComponent } from '../ecs/NameComponent';
import { Simulation } from '../simulation/Simulation';
import { TypeUtils } from '../util/TypeUtils';
import { ScreenBufferRenderSystem } from './rendering/ScreenBufferRenderSystem';
import { ScreenBufferComponent } from './rendering/ScreenBufferComponent';
import { PositionComponent } from './rendering/PositionComponent';
import { IsVisibleComponent } from './rendering/IsVisibleComponent';
import { TextComponent } from './rendering/TextComponent';
import { DynamicTextComponent } from './rendering/DynamicTextComponent';
import { ScreenBufferTextUpdateSystem } from './rendering/ScreenBufferTextUpdateSystem';
import { HeaderUpdateSystem } from './rendering/HeaderUpdateSystem';
import { FooterUpdateSystem } from './rendering/FooterUpdateSystem';
import { DynamicTextUpdateSystem } from './rendering/DynamicTextUpdateSystem';
import { MenuComponent } from './menu/MenuComponent';
import { MenuItem } from './menu/MenuItem';
import { InputComponent } from './menu/InputComponent';
import { ActionSystem } from './menu/ActionSystem';
import { ActionQueueComponent } from './menu/ActionQueueComponent';
import { MenuInputSystem } from './menu/MenuInputSystem';
import { MenuTextUpdateSystem } from './menu/MenuTextUpdateSystem';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';
import { GuiHelper } from './GuiHelper';
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

    constructor(simulation: Simulation) {
        TypeUtils.ensureInstanceOf(simulation, Simulation, "Expected simulation to be an instance of Simulation");
        this.simulation = simulation;

        // Create separate ECS instance for GUI
        this.ecs = Ecs.create();
        const simulationEcs = this.simulation.getEcs();

        // Create and register ECS systems
        const entityManager = this.ecs.getEntityManager();

        // Register all systems
        // 1. Input processing first
        this.ecs.registerSystem(MenuInputSystem.create(entityManager));

        // 2. Action handling
        this.ecs.registerSystem(ActionSystem.create(entityManager, this));

        // 3. Content updates
        this.ecs.registerSystem(HeaderUpdateSystem.create(entityManager, simulationEcs));
        this.ecs.registerSystem(FooterUpdateSystem.create(entityManager));
        this.ecs.registerSystem(DynamicTextUpdateSystem.create(entityManager, simulationEcs));
        this.ecs.registerSystem(MenuTextUpdateSystem.create(entityManager));

        // 4. Buffer update
        this.ecs.registerSystem(ScreenBufferTextUpdateSystem.create(entityManager));

        // 5. Final rendering
        this.ecs.registerSystem(ScreenBufferRenderSystem.create(entityManager));
    }

    /**
     * Initializes the GUI ECS system.
     */
    initialize(): void {
        const entityManager = this.ecs.getEntityManager();

        // Create screen buffer entity
        const screenBufferEntity = entityManager.createEntity();
        screenBufferEntity.addComponent(new NameComponent('ScreenBuffer'));
        screenBufferEntity.addComponent(new ScreenBufferComponent());

        // create input entity
        const inputEntity = entityManager.createEntity();
        inputEntity.addComponent(new NameComponent('Input'));
        inputEntity.addComponent(new InputComponent());

        // create action queue entity
        const actionQueueEntity = entityManager.createEntity();
        actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
        actionQueueEntity.addComponent(new ActionQueueComponent());

        // Create global GUI Header entity, positioned at the top
        const headerEntity = entityManager.createEntity();
        headerEntity.addComponent(new NameComponent(HeaderUpdateSystem.HEADER_ENTITY_NAME));
        headerEntity.addComponent(new PositionComponent(0, 0));
        headerEntity.addComponent(new IsVisibleComponent(true, true)); // Immutable visibility
        headerEntity.addComponent(new TextComponent(''));

        // Create global GUI Footer entity, positioned at the bottom
        const footerEntity = entityManager.createEntity();
        footerEntity.addComponent(new NameComponent(FooterUpdateSystem.FOOTER_ENTITY_NAME));
        footerEntity.addComponent(new PositionComponent(73, 23));
        footerEntity.addComponent(new IsVisibleComponent(true, true)); // Immutable visibility
        footerEntity.addComponent(new TextComponent(''));

        // Create main menu entity
        const mainMenuItems = [
            new MenuItem('Status', 'NAV_STATUS', 's'),
            new MenuItem('Choices', 'NAV_CHOICES', 'c'),
            new MenuItem('Chronicle', 'NAV_CHRONICLE', 'r'),
            new MenuItem('Quit', 'NAV_QUIT', 'q')
        ];
        const mainMenuEntity = entityManager.createEntity();
        mainMenuEntity.addComponent(new NameComponent('MainMenu'));
        mainMenuEntity.addComponent(new MenuComponent(mainMenuItems));
        mainMenuEntity.addComponent(new TextComponent(''));
        mainMenuEntity.addComponent(new PositionComponent(0, 23));
        mainMenuEntity.addComponent(new IsVisibleComponent(true));

        // Create choices screen entity (dynamic text that shows current dilemma info)
        const choicesScreenEntity = entityManager.createEntity();
        choicesScreenEntity.addComponent(new NameComponent('ChoicesScreen'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        choicesScreenEntity.addComponent(new DynamicTextComponent((_guiEntityManager, _simulationEntityManager) => {

            // Get dilemma info from simulation
            const playerEntity = GuiHelper.getPlayerEntity(this.simulation);
            if (!playerEntity) return 'No player found';

            // Get the DilemmaComponent from the player entity
            const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
            if (!dilemmaComponent) return 'No dilemma found';

            if (dilemmaComponent.getChoiceCount() === 0) {
                return 'No pending dilemmas';
            }

            const header = "*** DECISION REQUIRED ***";
            const choices = dilemmaComponent.getChoices().map(choice => `- ${choice.getEventName()}`).join('\n');

            // This would need to be implemented based on your dilemma system
            return `${header}\n${choices}`;
        }));
        choicesScreenEntity.addComponent(new TextComponent(''));
        choicesScreenEntity.addComponent(new PositionComponent(0, 3));
        choicesScreenEntity.addComponent(new IsVisibleComponent(false));

        // Create status screen entity (dynamic text for status screen)
        const statusScreenEntity = entityManager.createEntity();
        statusScreenEntity.addComponent(new NameComponent('StatusScreen'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        statusScreenEntity.addComponent(new DynamicTextComponent((_guiEntityManager, _simulationEntityManager) => {
            // Simple status text - can be enhanced later
            return `Simulation is ${this.simulation.getIsRunning() ? 'running' : 'stopped'}`;
        }));
        statusScreenEntity.addComponent(new TextComponent(''));
        statusScreenEntity.addComponent(new PositionComponent(0, 3));
        statusScreenEntity.addComponent(new IsVisibleComponent(false));

        // Create chronicle screen entity (dynamic text for chronicle screen)
        const chronicleScreenEntity = entityManager.createEntity();
        chronicleScreenEntity.addComponent(new NameComponent('ChronicleScreen'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        chronicleScreenEntity.addComponent(new DynamicTextComponent((guiEntityManager, simulationEntityManager) => {
            // Simple chronicle text - can be enhanced later
            return `Hello Chronicle`;
        }));
        chronicleScreenEntity.addComponent(new TextComponent(''));
        chronicleScreenEntity.addComponent(new PositionComponent(0, 3));
        chronicleScreenEntity.addComponent(new IsVisibleComponent(false));

        // Map screen names to their primary interactive entities
        const screensComponent = ScreensComponent.create()
        screensComponent.addScreen('main', mainMenuEntity.getId());
        screensComponent.addScreen('status', statusScreenEntity.getId());
        screensComponent.addScreen('choices', choicesScreenEntity.getId());
        screensComponent.addScreen('chronicle', chronicleScreenEntity.getId());

        // Create Screens Entity
        const screensEntity = entityManager.createEntity();
        screensEntity.addComponent(new NameComponent('Screens'));
        screensEntity.addComponent(screensComponent);

        // Create UI debug entity
        const actionDebugEntity = GuiHelper.createDebugEntity(entityManager, 'GuiEcsManager.DEBUG_ENTITY_NAME', 0, 22);
        actionDebugEntity.addComponent(new DynamicTextComponent((guiEntityManager, simulationEntityManager) => {

            simulationEntityManager.count();

            // Get all entities with IsVisibleComponent
            const allVisibleGuiEntities = guiEntityManager.getEntitiesWithComponents(IsVisibleComponent);
            const visibleNames = allVisibleGuiEntities.map(entity => {
                const visibleComponent = entity.getComponent(IsVisibleComponent);
                if (!visibleComponent) return "";

                const isVisible = visibleComponent.isVisible();
                const isVisibleString = isVisible ? "+" : "-";

                const nameComponent = entity.getComponent(NameComponent);
                if (!nameComponent) return "";
                const name = nameComponent.getText();

                return `${isVisibleString}${name}`;
            }).join('|');

            return `[D/V:${visibleNames}]`;
        }));

        // Create passive Debug Entity for the action system
        let line = 10;
        GuiHelper.createDebugEntity(entityManager, 'K1', 0, line++);
        GuiHelper.createDebugEntity(entityManager, 'I1', 0, line++);
        GuiHelper.createDebugEntity(entityManager, 'I2', 0, line++);
        GuiHelper.createDebugEntity(entityManager, 'I3', 0, line++);
        GuiHelper.createDebugEntity(entityManager, 'A1', 0, line++);
        GuiHelper.createDebugEntity(entityManager, 'A2', 0, line++);
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
    getActionSystem(): ActionSystem | undefined {
        return this.ecs.getSystemManager().get('ActionSystem') as ActionSystem | undefined;
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
