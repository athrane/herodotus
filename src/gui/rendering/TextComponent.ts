import { Component } from '../../ecs/Component';

/**
 * Component that stores text content for GUI elements.
 */
export class TextComponent extends Component {
    public readonly text: string;

    constructor(text: string = '') {
        super();
        this.text = text;
    }
}
