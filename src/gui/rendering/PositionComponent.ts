import { Component } from '../../ecs/Component';

/**
 * Component that stores position coordinates for GUI elements.
 */
export class PositionComponent extends Component {
    public readonly x: number;
    public readonly y: number;
    private static nullInstance: PositionComponent | null = null;

    /**
     * Constructor for the PositionComponent.
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     */
    constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    /**
     * Returns a null object instance of PositionComponent.
     * This instance serves as a safe, neutral placeholder when a PositionComponent is not available.
     * @returns A null PositionComponent instance with (0, 0) position.
     */
    static get Null(): PositionComponent {
        if (!PositionComponent.nullInstance) {
            const instance = Object.create(PositionComponent.prototype);
            instance.x = 0;
            instance.y = 0;
            Object.freeze(instance);
            PositionComponent.nullInstance = instance;
        }
        return PositionComponent.nullInstance!;
    }

    /**
     * Gets the x-coordinate of the component.
     * @returns The x-coordinate.
     */
    getX(): number {
        return this.x;
    }

    /**
     * Gets the y-coordinate of the component.
     * @returns The y-coordinate.
     */
    getY(): number {
        return this.y;
    }   
}
