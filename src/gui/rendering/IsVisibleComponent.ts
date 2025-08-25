import { Component } from '../../ecs/Component';

/**
 * Component that indicates whether a GUI element should be visible and rendered.
 */
export class IsVisibleComponent extends Component {
    public visible: boolean;

    /**
     * Constructor for the IsVisibleComponent.
     * @param visible Whether the element is visible (default: true)
     */
    constructor(visible: boolean = true) {
        super();
        this.visible = visible;
    }

    /**
     * Checks if the element is visible.
     * @returns True if the element is visible, false otherwise.
     */
    isVisible(): boolean {
        return this.visible;
    }   
}
