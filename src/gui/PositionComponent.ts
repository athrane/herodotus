import { Component } from '../ecs/Component';

/**
 * Component that stores position coordinates for GUI elements.
 */
export class PositionComponent extends Component {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number = 0, y: number = 0) {
        super();
        this.x = x;
        this.y = y;
    }
}
