import { FilteredSystem } from '../../ecs/FilteredSystem';
import { EntityManager } from '../../ecs/EntityManager';
import { NameComponent } from '../../ecs/NameComponent';
import { TextComponent } from '../rendering/TextComponent';
import { Entity } from '../../ecs/Entity';
import { EntityFilters } from '../../ecs/EntityFilters';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * System responsible for updating the footer text entity with current game status.
 */
export class FooterViewSystem extends FilteredSystem {
    private heartbeatPos: number = 0;

    /**
     * Name of the footer entity.
     */
    public static FOOTER_ENTITY_NAME = 'Footer';

    /**
     * Number of positions between [ and ]
     */
    private static HEARTBEAT_LENGTH = 5;

    /**
     * Constructor for the FooterViewSystem.
     * @param entityManager The entity manager to use for querying entities.
     */
    constructor(entityManager: EntityManager) {
        TypeUtils.ensureInstanceOf(entityManager, EntityManager);
        const filter = EntityFilters.byName(FooterViewSystem.FOOTER_ENTITY_NAME);
        super(entityManager, [NameComponent, TextComponent], filter);
    }

    processFilteredEntity(entity: Entity): void {
        // At this point the filter guarantees the entity is the footer entity and has the required components
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // Compute heartbeat string and update the text
        const heartbeat = this.renderHeartbeat();
        textComponent.setText(heartbeat);
    }

    /**
     * Renders the heartbeat string, animating a '+' between '[' and ']'.
     */
    private renderHeartbeat(): string {
        // Build a string like [....+....]
        let str = '[';
        for (let i = 0; i < FooterViewSystem.HEARTBEAT_LENGTH; i++) {
            str += (i === this.heartbeatPos) ? '+' : '.';
        }
        str += ']';
        // Update position for next frame
        this.heartbeatPos = (this.heartbeatPos + 1) % FooterViewSystem.HEARTBEAT_LENGTH;
        return str;
    }

    /**
     * Creates a new instance of the FooterViewSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @returns A new instance of the FooterViewSystem.
     */
    static create(entityManager: EntityManager): FooterViewSystem {
        return new FooterViewSystem(entityManager);
    }
}
