import { Component } from '../../ecs/Component';

/**
 * Component that marks an entity as the currently active screen.
 * Only one entity should have this component at a time.
 */
export class IsActiveScreenComponent extends Component {
    constructor() {
        super();
    }
}
