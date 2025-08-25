import { Component } from '../../ecs/Component';

/**
 * Component that stores position coordinates for GUI elements.
 */
export class PositionComponent extends Component {
    public readonly x: number;
    public readonly y: number;

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
