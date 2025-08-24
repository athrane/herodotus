import { Component } from '../ecs/Component';

/**
 * Component that indicates whether a GUI element should be visible and rendered.
 */
export class IsVisibleComponent extends Component {
    public visible: boolean;

    constructor(visible: boolean = true) {
        super();
        this.visible = visible;
    }
}
