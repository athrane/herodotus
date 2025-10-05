import { Component } from '../../ecs/Component';

/**
 * Component that stores text content for GUI elements.
 */
export class TextComponent extends Component {
    public lines: string[];
    private static nullInstance: TextComponent | null = null;

    /**
     * Constructor for the TextComponent.
     * If the text is empty, it initializes with a empty string.
     * @param text The text content. If the string contains newlines, they are split into separate lines.
     */
    constructor(text: string = '') {
        super();
        this.lines = text.split('\n');
        if (this.lines.length === 0) {
            this.lines.push('');
        }
    }

    /**
     * Returns a null object instance of TextComponent.
     * This instance serves as a safe, neutral placeholder when a TextComponent is not available.
     * @returns A null TextComponent instance with empty text.
     */
    static get Null(): TextComponent {
        if (!TextComponent.nullInstance) {
            const instance = Object.create(TextComponent.prototype);
            instance.lines = [''];
            Object.freeze(instance);
            TextComponent.nullInstance = instance;
        }
        return TextComponent.nullInstance!;
    }

    /**
     * Gets the number of lines in the text content.
     * @returns The number of lines.
     */
    getLineCount(): number {
        return this.lines.length;
    }

    /**
     * Gets the text content of the component as an array of strings.
     * @returns The text content.
     */
    getTexts(): string[] {
        return this.lines;
    }

    /**
     * Gets the text content of the component as a single string.
     * @returns The text content.
     */
    getText(): string {
        return this.lines.join('\n');
    }   

    /**
     * Sets the text content of the component from an array of strings.
     * @param lines The new text content.
     */
    setTexts(lines: string[]): void {
        this.lines = lines;
    }

    /**
     * Sets the text content of the component.
     * @param text The new text content.
     */
    setText(text: string): void {
        this.lines = text.split('\n');
    }
}
