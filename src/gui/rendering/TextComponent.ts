import { Component } from '../../ecs/Component';

/**
 * Component that stores text content for GUI elements.
 */
export class TextComponent extends Component {
    public readonly text: string;

    /**
     * Constructor for the TextComponent.
     * @param text The text content.
     */
    constructor(text: string = '') {
        super();
        this.text = text;
    }

    /**
     * Gets the text content of the component.
     * @returns The text content.
     */
    getText(): string {
        return this.text;
    }
}
