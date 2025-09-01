import { Component } from '../../ecs/Component';

/**
 * Component that indicates whether a GUI element should be visible and rendered.
 */
export class IsVisibleComponent extends Component {
    private visible: boolean;
    private readonly immutable: boolean;

    /**
     * Constructor for the IsVisibleComponent.
     * @param visible Whether the element is visible (default: true)
     * @param immutable If true, the visibility state cannot be changed via setVisibility (default: false)
     */
    constructor(visible: boolean = true, immutable: boolean = false) {
        super();
        this.visible = visible;
        this.immutable = immutable;
    }

    /**
     * Checks if the element is visible.
     * @returns True if the element is visible, false otherwise.
     */
    isVisible(): boolean {
        return this.visible;
    }   

    /**
     * Checks if the element is immutable.
     * @returns True if the element is immutable, false otherwise.
     */
    isImmutable(): boolean {
        return this.immutable;
    }

    /**
     * Sets the visibility of the element.
     * @param visible Whether the element should be visible.
     */
    setVisibility(visible: boolean): void {
        if (this.immutable) return;
        this.visible = visible;
    }

}
