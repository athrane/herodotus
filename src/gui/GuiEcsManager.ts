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
    private readonly actionSystem: ActionSystem;
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

        // Create and register ECS systems
        // Create the ActionSystem first since MenuInputSystem depends on it
        const entityManager = this.ecs.getEntityManager();
        this.actionSystem = ActionSystem.create(entityManager, this);

        // Register all systems
        // 1. Input processing first
        this.ecs.registerSystem(MenuInputSystem.create(entityManager));

        // 2. Action handling
        this.ecs.registerSystem(this.actionSystem);

        // 3. Content updates
        this.ecs.registerSystem(HeaderUpdateSystem.create(entityManager, this.simulation.getEcs()));
        this.ecs.registerSystem(FooterUpdateSystem.create(entityManager));
        this.ecs.registerSystem(DynamicTextUpdateSystem.create(entityManager, this.simulation.getEcs()));
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
        headerEntity.addComponent(new IsVisibleComponent(true));
        headerEntity.addComponent(new TextComponent(''));

        // Create global GUI Footer entity, positioned at the bottom
        const footerEntity = entityManager.createEntity();
        footerEntity.addComponent(new NameComponent(FooterUpdateSystem.FOOTER_ENTITY_NAME));
        footerEntity.addComponent(new PositionComponent(0, 23));
        footerEntity.addComponent(new IsVisibleComponent(true));
        footerEntity.addComponent(new TextComponent(''));

        // Create main menu entity
        const mainMenuItems = [
            new MenuItem('Status', 'NAV_STATUS'),
            new MenuItem('Choices', 'NAV_CHOICES'),
            new MenuItem('Chronicle', 'NAV_CHRONICLE'),
            new MenuItem('Quit', 'QUIT')
        ];
        const mainMenuEntity = entityManager.createEntity();
        mainMenuEntity.addComponent(new NameComponent('MainMenu'));
        mainMenuEntity.addComponent(new MenuComponent(mainMenuItems));
        mainMenuEntity.addComponent(new TextComponent(''));
        mainMenuEntity.addComponent(new PositionComponent(0, 22));
        mainMenuEntity.addComponent(new IsVisibleComponent(true));

        // Create dilemma text entity (dynamic text that shows current dilemma info)
        const dilemmaTextEntity = entityManager.createEntity();
        dilemmaTextEntity.addComponent(new NameComponent('DilemmaText'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        dilemmaTextEntity.addComponent(new DynamicTextComponent((_guiEntityManager, _simulationEntityManager) => {
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
        dilemmaTextEntity.addComponent(new TextComponent(''));
        dilemmaTextEntity.addComponent(new PositionComponent(2, 15));
        dilemmaTextEntity.addComponent(new IsVisibleComponent(false));

        // Create status text entity (dynamic text for status screen)
        const statusTextEntity = entityManager.createEntity();
        statusTextEntity.addComponent(new NameComponent('StatusText'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        statusTextEntity.addComponent(new DynamicTextComponent((_guiEntityManager, _simulationEntityManager) => {
            // Simple status text - can be enhanced later
            return `Simulation is ${this.simulation.getIsRunning() ? 'running' : 'stopped'}`;
        }));
        statusTextEntity.addComponent(new TextComponent(''));
        statusTextEntity.addComponent(new PositionComponent(2, 5));
        statusTextEntity.addComponent(new IsVisibleComponent(false));

        // Map screen names to their primary interactive entities
        const screensComponent = ScreensComponent.create()
        screensComponent.addScreen('main', mainMenuEntity.getId());
        screensComponent.addScreen('status', statusTextEntity.getId());
        screensComponent.addScreen('choices', dilemmaTextEntity.getId());
        screensComponent.addScreen('chronicle', dilemmaTextEntity.getId()); // Reuse for now

        // Create Screens Entity
        const screensEntity = entityManager.createEntity();
        screensEntity.addComponent(new NameComponent('Screens'));
        screensEntity.addComponent(screensComponent);

        // Create UI debug entity
        const debugEntity = entityManager.createEntity();
        debugEntity.addComponent(new NameComponent(GuiEcsManager.DEBUG_ENTITY_NAME));
        debugEntity.addComponent(new IsVisibleComponent(true));
        debugEntity.addComponent(new PositionComponent(0, 21));
        debugEntity.addComponent(new TextComponent(''));
        debugEntity.addComponent(new DynamicTextComponent((_guiEntityManager, simulationEntityManager) => {

            // Get all entities with IsVisibleComponent
            const allVisibleEntities = simulationEntityManager.getEntitiesWithComponents(IsVisibleComponent);

            const l = allVisibleEntities.length;
            return `DEBUG: [Visible:${l}]`;

            /** 
            const visibleNames = allVisibleEntities.map(entity => {
                const visibleComponent = entity.getComponent(IsVisibleComponent);
                if (!visibleComponent) return "";

                const nameComponent = entity.getComponent(NameComponent);
                if (!nameComponent) return "";
                return nameComponent.getText();
            }).join('|');            
            return `DEBUG: [Visible:${visibleNames}]`;
            **/

            /** 
            // Get ActionQueueComponent
            const actionQueueComponent = sim.getEntityManager().getSingletonComponent(ActionQueueComponent);

            // Create string representation of visibleaction queue
            const actionQueue = actionQueueComponent?.getActions() ?? [];
            const actionQueueString = actionQueue.map(action => `- ${action}`).join(',');
            return `DEBUG: [AQ:${actionQueueString}]`;
            **/

        }));


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
     * Gets the screen buffer render system.
     */
    getScreenRenderSystem(): ScreenBufferRenderSystem | undefined {
        return this.ecs.getSystemManager().get('ScreenBufferRenderSystem') as ScreenBufferRenderSystem | undefined;
    }

    /**
     * Convenience method used by TESTS and to set the active screen.
     * Delegates to the internal ActionSystem implementation.
     */
    setActiveScreen(screenName: string): void {
        this.actionSystem.setActiveScreen(screenName);
    }

    /**
     * Convenience method used by TESTS and to gets the entity ID for a screen by name.
     * Retrieves the screen entity ID from the ScreensComponent entity.
     * @param screenName The name of the screen to get the entity ID for
     * @returns The entity ID if found, undefined otherwise
     */
    getScreenEntityId(screenName: string): string | undefined {
        const screensComponent = this.ecs.getEntityManager().getSingletonComponent(ScreensComponent);
        return screensComponent?.getScreen(screenName);
    }

}
