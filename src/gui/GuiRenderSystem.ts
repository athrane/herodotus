import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { PositionComponent } from './PositionComponent';
import { TextComponent } from './TextComponent';
import { IsVisibleComponent } from './IsVisibleComponent';
import { GuiHelper } from './GuiHelper';
import { Simulation } from '../simulation/Simulation';

/**
 * System responsible for rendering GUI elements that have position, text, and visibility components.
 * This system works in parallel with ScreenRenderSystem to handle different types of GUI rendering.
 */
export class GuiRenderSystem extends System {
    constructor(entityManager: EntityManager) {
        super(entityManager);
    }

    /**
     * Updates the GUI render system by finding all entities with the required components
     * and rendering their text content to the console.
     * @param simulation The simulation instance (currently unused but maintained for consistency)
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(simulation: Simulation): void {
        // Clear the console at the beginning to prevent duplicate UIs
        GuiHelper.clearScreen();

        // Query for all entities that have PositionComponent, TextComponent, and IsVisibleComponent
        const renderableEntities = this.getEntityManager().getEntitiesWithComponents(
            PositionComponent,
            TextComponent,
            IsVisibleComponent
        );

        // Render each entity that meets the criteria
        for (const entity of renderableEntities) {
            const textComponent = entity.getComponent(TextComponent);
            const visibilityComponent = entity.getComponent(IsVisibleComponent);

            // Only render if the entity is visible
            if (visibilityComponent && visibilityComponent.visible) {
                // For now, ignore the actual x/y coordinates and just print the text
                // Future enhancement could use position for actual screen positioning
                if (textComponent) {
                    console.log(textComponent.text);
                }
            }
        }
    }
}
