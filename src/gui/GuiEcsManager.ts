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
import { MenuInputSystem } from './menu/MenuInputSystem';
import { MenuTextUpdateSystem } from './menu/MenuTextUpdateSystem';
import { DilemmaComponent } from '../behaviour/DilemmaComponent';
import { GuiHelper } from './GuiHelper';

/**
 * Manages a separate ECS instance specifically for GUI components and systems.
 * This allows the GUI to have its own update frequency independent of the simulation.
 */
export class GuiEcsManager {
    private readonly ecs: Ecs;
    private readonly actionSystem: ActionSystem;
    private readonly screens: Map<string, string> = new Map(); // screen name -> entity ID
    private readonly simulation: Simulation;
    private guiUpdateInterval: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;

    constructor( simulation: Simulation) { 
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
        this.ecs.registerSystem(MenuInputSystem.create(entityManager, this.actionSystem));
        
        // 2. Action handling
        this.ecs.registerSystem(this.actionSystem);
        
        // 3. Content updates
        this.ecs.registerSystem(HeaderUpdateSystem.create(entityManager, this.simulation));
        this.ecs.registerSystem(FooterUpdateSystem.create(entityManager));
        this.ecs.registerSystem(DynamicTextUpdateSystem.create(entityManager, this.simulation));
        this.ecs.registerSystem(MenuTextUpdateSystem.create(entityManager));
        
        // 4. Buffer update
        this.ecs.registerSystem(ScreenBufferTextUpdateSystem.create(entityManager));
        
        // 5. Final rendering
        this.ecs.registerSystem(ScreenBufferRenderSystem.create(entityManager));

        /**
        this.ecs.registerSystem(HeaderUpdateSystem.create(entityManager, this.simulation));
        this.ecs.registerSystem(FooterUpdateSystem.create(entityManager));
        this.ecs.registerSystem(ScreenBufferTextUpdateSystem.create(entityManager));
        this.ecs.registerSystem(DynamicTextUpdateSystem.create(entityManager, this.simulation));
        this.ecs.registerSystem(MenuInputSystem.create(entityManager, this.actionSystem));
        this.ecs.registerSystem(MenuTextUpdateSystem.create(entityManager));
        this.ecs.registerSystem(this.actionSystem);
        this.ecs.registerSystem(ScreenBufferRenderSystem.create(entityManager));
        **/
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
        dilemmaTextEntity.addComponent(new DynamicTextComponent((sim) => {
            // Get dilemma info from simulation
            const playerEntity = GuiHelper.getPlayerEntity(sim);
            if (!playerEntity) return 'No player found';

            // Get the DilemmaComponent from the player entity
            const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
            if (!dilemmaComponent) return 'No dilemma found';

            if(dilemmaComponent.getChoiceCount() === 0) {
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
        statusTextEntity.addComponent(new DynamicTextComponent((sim) => {
            // Simple status text - can be enhanced later
            return `Simulation is ${sim.getIsRunning() ? 'running' : 'stopped'}`;
        }));
        statusTextEntity.addComponent(new TextComponent(''));
        statusTextEntity.addComponent(new PositionComponent(2, 5));
        statusTextEntity.addComponent(new IsVisibleComponent(false));

        // Map screen names to their primary interactive entities
        this.screens.set('main', mainMenuEntity.getId());
        this.screens.set('status', statusTextEntity.getId());
        this.screens.set('choices', dilemmaTextEntity.getId());
        this.screens.set('chronicle', dilemmaTextEntity.getId()); // Reuse for now
    }

    /**
     * Starts the GUI ECS update loop with its own frequency.
     * @param updateFrequencyMs - Update frequency in milliseconds
     */
    start(updateFrequencyMs: number): void {
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
     * Sets the active screen by name.
     * Hides all other UI elements except header and footer.
     * Shows the UI elements associated with the target screen.
     * @param screenName The name of the screen to activate.
     */
    setActiveScreen(screenName: string): void {
        const entityManager = this.ecs.getEntityManager();
        
        // Get all entities with IsVisibleComponent
        const allVisibleEntities = entityManager.getEntitiesWithComponents(IsVisibleComponent);

        // Hide all visible UI elements
        allVisibleEntities.forEach(entity => {
            const visibleComponent = entity.getComponent(IsVisibleComponent);
            if (visibleComponent) {
                visibleComponent.setVisibility(false);
            }
        });

        // set Header visible
        const headerEntity = entityManager.getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === HeaderUpdateSystem.HEADER_ENTITY_NAME);
        if (headerEntity) {
            const headerVisibleComponent = headerEntity.getComponent(IsVisibleComponent);
            if (headerVisibleComponent) {
                headerVisibleComponent.setVisibility(true);
            }
        }

        // Set footer visible
        const footerEntity = entityManager.getEntitiesWithComponents(NameComponent).find(e => e.getComponent(NameComponent)?.getText() === FooterUpdateSystem.FOOTER_ENTITY_NAME);
        if (footerEntity) {
            const footerVisibleComponent = footerEntity.getComponent(IsVisibleComponent);
            if (footerVisibleComponent) {
                footerVisibleComponent.setVisibility(true);
            }
        }
        
        // Show the entities associated with the target screen
        const targetEntityId = this.screens.get(screenName);
        if (targetEntityId) {
            const targetEntity = entityManager.getEntity(targetEntityId);
            if (targetEntity) {
                const visibleComponent = targetEntity.getComponent(IsVisibleComponent);
                if (visibleComponent) {
                    visibleComponent.setVisibility(true);
                }
            }
        }
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

}
