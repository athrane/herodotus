import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { NameComponent } from '../../ecs/NameComponent';
import { TextComponent } from './TextComponent';
import { Entity } from '../../ecs/Entity';

/**
 * System responsible for updating the footer text entity with current game status.
 */
export class FooterUpdateSystem extends System {
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
     * Constructor for the FooterUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [NameComponent, TextComponent]);
    }

    processEntity(entity: Entity): void {
        // Get the name component
        const nameComponent = entity.getComponent(NameComponent);
        if (!nameComponent || nameComponent.getText() !== FooterUpdateSystem.FOOTER_ENTITY_NAME) return;

        // Get the text component
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // Compute heartbeat string
        const heartbeat = this.renderHeartbeat();

        // Compute footer string (heartbeat only, as per request)
        textComponent.setText(heartbeat);
    }

    /**
     * Renders the heartbeat string, animating a '+' between '[' and ']'.
     */
    private renderHeartbeat(): string {
        // Build a string like [....+....]
        let str = '[';
        for (let i = 0; i < FooterUpdateSystem.HEARTBEAT_LENGTH; i++) {
            str += (i === this.heartbeatPos) ? '+' : '.';
        }
        str += ']';
        // Update position for next frame
        this.heartbeatPos = (this.heartbeatPos + 1) % FooterUpdateSystem.HEARTBEAT_LENGTH;
        return str;
    }

    /**
     * Creates a new instance of the FooterUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @returns A new instance of the FooterUpdateSystem.
     */
    static create(entityManager: EntityManager): FooterUpdateSystem {
        return new FooterUpdateSystem(entityManager);
    }
}
