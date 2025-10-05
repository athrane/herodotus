import { Component } from '../../ecs/Component';

/**
 * Component that indicates whether a GUI element should be visible and rendered.
 */
export class IsVisibleComponent extends Component {
    private visible: boolean;
    private readonly immutable: boolean;
    private static nullInstance: IsVisibleComponent | null = null;

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
     * Returns a null object instance of IsVisibleComponent.
     * This instance serves as a safe, neutral placeholder when an IsVisibleComponent is not available.
     * @returns A null IsVisibleComponent instance with invisible and immutable state.
     */
    static get Null(): IsVisibleComponent {
        if (!IsVisibleComponent.nullInstance) {
            const instance = Object.create(IsVisibleComponent.prototype);
            instance.visible = false;
            instance.immutable = true;
            Object.freeze(instance);
            IsVisibleComponent.nullInstance = instance;
        }
        return IsVisibleComponent.nullInstance!;
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

    /**
     * Creates a new instance of IsVisibleComponent.
     * @param visible Whether the element should be visible (default: true)
     * @param immutable If true, the visibility state cannot be changed (default: false)
     * @returns A new instance of IsVisibleComponent.
     */
    static create(visible: boolean = true, immutable: boolean = false): IsVisibleComponent {
        return new IsVisibleComponent(visible, immutable);
    }

    /**
     * Creates a new instance of IsVisibleComponent with immutable visibility.
     * @param visible Whether the element should be visible (default: true)
     * @returns A new instance of IsVisibleComponent with immutable visibility.
     */
    static createImmutable(visible: boolean = true): IsVisibleComponent {
        return new IsVisibleComponent(visible, true);
    }

}
