import { Component } from './Component';

/**
 * A marker component to identify an entity as the player.
 * This component serves as a flag to distinguish the player entity from other entities in the system.
 * Components are simple data containers. They should not contain any logic.
 */
export class PlayerComponent extends Component {
    
    /**
     * Creates an instance of PlayerComponent.
     * This is a marker component with no additional properties.
     */
    constructor() {
        super();
    }

    /**
     * Creates a new instance of PlayerComponent.
     * This static factory method provides a standardized way to construct PlayerComponent objects.
     * @returns A new instance of PlayerComponent.
     */
    static create(): PlayerComponent {
        return new PlayerComponent();
    }
}
