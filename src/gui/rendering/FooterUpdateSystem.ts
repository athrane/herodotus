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
    private readonly heartbeatLength: number = 5; // Number of positions between [ and ]

    /**
     * Name of the footer entity.
     */
    public static FOOTER_ENTITY_NAME = 'Footer';

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

        // pad the heartbeat string to the right 
        const paddedHeartbeat = heartbeat.padStart(80, '.');

        // Compute footer string (heartbeat only, as per request)
        textComponent.setText(paddedHeartbeat);
    }

    /**
     * Renders the heartbeat string, animating a '+' between '[' and ']'.
     */
    private renderHeartbeat(): string {
        // Build a string like [....+....]
        let str = '[';
        for (let i = 0; i < this.heartbeatLength; i++) {
            str += (i === this.heartbeatPos) ? '+' : '.';
        }
        str += ']';
        // Update position for next frame
        this.heartbeatPos = (this.heartbeatPos + 1) % this.heartbeatLength;
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
