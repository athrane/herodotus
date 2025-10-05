import { Component } from '../../ecs/Component';

/**
 * Component that marks an entity as the currently active screen.
 * Only one entity should have this component at a time.
 */
export class IsActiveScreenComponent extends Component {
    private static nullInstance: IsActiveScreenComponent | null = null;

    constructor() {
        super();
    }

    /**
     * Returns a null object instance of IsActiveScreenComponent.
     * This instance serves as a safe, neutral placeholder when an IsActiveScreenComponent is not available.
     * @returns A null IsActiveScreenComponent instance.
     */
    static get Null(): IsActiveScreenComponent {
        if (!IsActiveScreenComponent.nullInstance) {
            const instance = Object.create(IsActiveScreenComponent.prototype);
            Object.freeze(instance);
            IsActiveScreenComponent.nullInstance = instance;
        }
        return IsActiveScreenComponent.nullInstance!;
    }
}
