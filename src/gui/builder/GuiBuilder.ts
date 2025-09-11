import { Builder } from '../../ecs/builder/Builder';
import { Ecs } from '../../ecs/Ecs';
import { TypeUtils } from '../../util/TypeUtils';
import { NameComponent } from '../../ecs/NameComponent';
import { ScreenBufferRenderSystem } from '../rendering/ScreenBufferRenderSystem';
import { ScreenBufferComponent } from '../rendering/ScreenBufferComponent';
import { ScreenBufferClearSystem } from '../rendering/ScreenBufferClearSystem';
import { PositionComponent } from '../rendering/PositionComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { TextComponent } from '../rendering/TextComponent';
import { DynamicTextComponent } from '../rendering/DynamicTextComponent';
import { ScreenBufferTextUpdateSystem } from '../rendering/ScreenBufferTextUpdateSystem';
import { HeaderViewSystem } from '../view/HeaderViewSystem';
import { FooterViewSystem } from '../view/FooterViewSystem';
import { DynamicTextUpdateSystem } from '../rendering/DynamicTextUpdateSystem';
import { MenuComponent } from '../menu/MenuComponent';
import { MenuItem } from '../menu/MenuItem';
import { ScrollStrategy } from '../menu/ScrollStrategy';
import { InputComponent } from '../view/InputComponent';
import { MainControllerSystem } from '../controller/MainControllerSystem';
import { ActionQueueComponent } from '../controller/ActionQueueComponent';
import { InputSystem } from '../view/InputSystem';
import { MenuTextUpdateSystem } from '../menu/MenuTextUpdateSystem';
import { ScrollableMenuTextUpdateSystem } from '../menu/ScrollableMenuTextUpdateSystem';
import { ChoiceMenuViewSystem } from '../view/ChoiceMenuViewSystem';
import { ScrollableMenuComponent } from '../menu/ScrollableMenuComponent';
import { GuiHelper } from '../GuiHelper';
import { ScreensComponent } from '../menu/ScreensComponent';

/**
 * GuiBuilder class is responsible for building a GUI ECS system.
 * It extends the Builder to create a GUI with ECS components.
 * 
 * @class GuiBuilder
 * @extends {Builder}
 */
export class GuiBuilder extends Builder {

   /** 
     * The simulation ECS instance.
     * ! signifies that this property is not yet initialized.
     */    
    private simEcs!: Ecs;

   /** 
     * The ECS instance that is built by this builder.
     * ! signifies that this property is not yet initialized.
     */    
    private guiEcs!: Ecs;

    /**
     * Creates a new instance of GuiBuilder.
     * @param simulationEcs The simulation ECS instance.
     * @constructor
     */
    constructor(simulationEcs: Ecs) {
        super();
        TypeUtils.ensureInstanceOf(simulationEcs, Ecs, "Expected simulationEcs to be an instance of Ecs");
        this.simEcs = simulationEcs;
    }

    /**
     * @override
     */
    build(): void {
        this.guiEcs = Ecs.create();
    }

    /**
     * @override
     */
    buildSystems(): void {
        const entityManager = this.guiEcs.getEntityManager();

        // Register all systems
        // 1. Input processing 
        this.guiEcs.registerSystem(InputSystem.create(entityManager));

        // 2. GUI Controller 
        this.guiEcs.registerSystem(MainControllerSystem.create(entityManager, this.simEcs));

        // 3. GUI Views (dynamic content updates)
        this.guiEcs.registerSystem(HeaderViewSystem.create(entityManager, this.simEcs));
        this.guiEcs.registerSystem(FooterViewSystem.create(entityManager));
        this.guiEcs.registerSystem(ChoiceMenuViewSystem.create(entityManager, this.simEcs));

        // 4. Dynamic text and menu text updates
        this.guiEcs.registerSystem(DynamicTextUpdateSystem.create(entityManager, this.simEcs));
        this.guiEcs.registerSystem(MenuTextUpdateSystem.create(entityManager));
        this.guiEcs.registerSystem(ScrollableMenuTextUpdateSystem.create(entityManager));

        // 5. GUI rendering (order is important: clear first, then update text, then render)
        this.guiEcs.registerSystem(ScreenBufferClearSystem.create(entityManager));
        this.guiEcs.registerSystem(ScreenBufferTextUpdateSystem.create(entityManager));
        this.guiEcs.registerSystem(ScreenBufferRenderSystem.create(entityManager));
    }

    /**
     * @override
     */
    buildEntities(): void {
        const entityManager = this.guiEcs.getEntityManager();

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
        headerEntity.addComponent(new NameComponent(HeaderViewSystem.HEADER_ENTITY_NAME));
        headerEntity.addComponent(new PositionComponent(0, 0));
        headerEntity.addComponent(IsVisibleComponent.createImmutable(true)); // Immutable visibility
        headerEntity.addComponent(new TextComponent(''));

        // Create global GUI Footer entity, positioned at the bottom
        const footerEntity = entityManager.createEntity();
        footerEntity.addComponent(new NameComponent(FooterViewSystem.FOOTER_ENTITY_NAME));
        footerEntity.addComponent(new PositionComponent(73, 23));
        footerEntity.addComponent(IsVisibleComponent.createImmutable(true)); // Immutable visibility
        footerEntity.addComponent(new TextComponent(''));

        // Create main menu entity
        const mainMenuItems = [
            new MenuItem('Status', 'NAV_STATUS', 't'),
            new MenuItem('Choices', 'NAV_CHOICES', 'c'),
            new MenuItem('Chronicle', 'NAV_CHRONICLE', 'r'),
            new MenuItem('Quit', 'NAV_QUIT', 'q')
        ];
        const mainMenuEntity = entityManager.createEntity();
        mainMenuEntity.addComponent(new NameComponent('MainMenu'));
        mainMenuEntity.addComponent(MenuComponent.create(mainMenuItems, ScrollStrategy.HORIZONTAL));
        mainMenuEntity.addComponent(new TextComponent(''));
        mainMenuEntity.addComponent(new PositionComponent(0, 23));
        mainMenuEntity.addComponent(IsVisibleComponent.create(true));

        // Create choices screen entity (scrollable menu for dilemma choices)
        const VISIBLE_ITEMS_COUNT = 5;
        const choicesScreenEntity = entityManager.createEntity();
        choicesScreenEntity.addComponent(new NameComponent('ChoicesScreen'));
        // Initialize with empty menu items - ChoiceMenuSystem will populate them
        choicesScreenEntity.addComponent(ScrollableMenuComponent.createWithItemCount([], VISIBLE_ITEMS_COUNT));
        choicesScreenEntity.addComponent(new TextComponent(''));
        choicesScreenEntity.addComponent(new PositionComponent(0, 2));
        choicesScreenEntity.addComponent(IsVisibleComponent.create(false));

        // Create status screen entity (dynamic text for status screen)
        const statusScreenEntity = entityManager.createEntity();
        statusScreenEntity.addComponent(new NameComponent('StatusScreen'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        statusScreenEntity.addComponent(new DynamicTextComponent((_guiEntityManager, _simulationEntityManager) => {
            // Simple status text - can be enhanced later
            //return `Simulation is ${this.simulation.getIsRunning() ? 'running' : 'stopped'}`;
            return `Simulation is RUNNING'}`;

        }));
        statusScreenEntity.addComponent(new TextComponent(''));
        statusScreenEntity.addComponent(new PositionComponent(0, 2));
        statusScreenEntity.addComponent(IsVisibleComponent.create(false));

        // Create chronicle screen entity (dynamic text for chronicle screen)
        const chronicleScreenEntity = entityManager.createEntity();
        chronicleScreenEntity.addComponent(new NameComponent('ChronicleScreen'));
         
        /** 
        chronicleScreenEntity.addComponent(new DynamicTextComponent((entityManager, this.simEcs.getEntityManager()) => {
            // Simple chronicle text - can be enhanced later
            return `Hello Chronicle`;
        }));
        **/
        chronicleScreenEntity.addComponent(new DynamicTextComponent(() => {
            // Simple chronicle text - can be enhanced later
            return `Hello Chronicle`;
        }));       
        chronicleScreenEntity.addComponent(new TextComponent(''));
        chronicleScreenEntity.addComponent(new PositionComponent(0, 2));
        chronicleScreenEntity.addComponent(IsVisibleComponent.create(false));

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

            return `[V:${visibleNames}]`;
        }));

        // Create passive Debug Entity for the action system
        let line = 20;
        GuiHelper.createDebugEntity(entityManager, 'D1', 0, line++);
    }

    /**
     * @override
     */
    buildData(): void {
        // No data loading needed for GUI
    }

    /**
     * @override
     */
    buildComponents(): void {
        // No additional components needed for GUI
    }

    /**
     * @override
     */
    getEcs(): Ecs {
        return this.guiEcs;
    }

    /**
     * Static factory method to create a new instance of GuiBuilder.
     * @param simulationEcs The simulation ECS instance.
     * @returns A new GuiBuilder instance.
     */
    static create(simulationEcs: Ecs): GuiBuilder {
        return new GuiBuilder(simulationEcs);
    }
}