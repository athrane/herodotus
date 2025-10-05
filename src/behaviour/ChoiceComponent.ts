import { Component } from '../ecs/Component';
import { DataSetEvent } from '../data/DataSetEvent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A component that holds the current set of available choices for an entity.
 * This component is attached to an entity when choices are generated,
 * and represents all valid DataSetEvent options that can be selected for the current turn.
 */
export class ChoiceComponent extends Component {
    /**
     * Array of DataSetEvent choices available for the current choice selection.
     */
    private choices: DataSetEvent[];
    private static nullInstance: ChoiceComponent | null = null;

    /**
     * Creates an instance of ChoiceComponent.
     * @param choices - The array of DataSetEvent choices available for the current choice selection.
     */
    constructor(choices: DataSetEvent[]) {
        super();
        TypeUtils.ensureArray(choices, 'choices must be an array.');
        
        // Validate each choice is a DataSetEvent instance
        for (const choice of choices) {
            TypeUtils.ensureInstanceOf(choice, DataSetEvent, 'All choices must be DataSetEvent instances.');
        }

        this.choices = [...choices];
    }

    /**
     * Returns a null object instance of ChoiceComponent.
     * This instance serves as a safe, neutral placeholder when a ChoiceComponent is not available.
     * @returns A null ChoiceComponent instance with empty choices array.
     */
    static get Null(): ChoiceComponent {
        if (!ChoiceComponent.nullInstance) {
            const instance = Object.create(ChoiceComponent.prototype);
            instance.choices = [];
            Object.freeze(instance);
            ChoiceComponent.nullInstance = instance;
        }
        return ChoiceComponent.nullInstance!;
    }

    /**
     * Gets the array of available choices.
     * @returns A readonly array of DataSetEvent choices.
     */
    getChoices(): ReadonlyArray<DataSetEvent> {
        return [...this.choices];
    }

    /**
     * Sets new choices for the choice selection, replacing any existing choices.
     * @param newChoices - The new array of DataSetEvent choices.
     */
    setChoices(newChoices: DataSetEvent[]): void {
        TypeUtils.ensureArray(newChoices, 'newChoices must be an array.');
        
        // Validate each choice is a DataSetEvent instance
        for (const choice of newChoices) {
            TypeUtils.ensureInstanceOf(choice, DataSetEvent, 'All choices must be DataSetEvent instances.');
        }

        this.choices = [...newChoices];
    }

    /**
     * Clears all choices from the choice selection.
     */
    clearChoices(): void {
        this.choices = [];
    }

    /**
     * Gets the number of available choices.
     * @returns The number of choices available.
     */
    getChoiceCount(): number {
        return this.choices.length;
    }

    /**
     * Gets a specific choice by index.
     * @param index - The index of the choice to retrieve.
     * @returns The DataSetEvent at the specified index, or undefined if index is out of bounds.
     */
    getChoice(index: number): DataSetEvent | undefined {
        TypeUtils.ensureNumber(index, 'index must be a number.');
        if (index < 0 || index >= this.choices.length) {
            return undefined;
        }
        return this.choices[index];
    }

    /**
     * Creates a new instance of ChoiceComponent.
     * This static factory method provides a standardized way to construct ChoiceComponent objects.
     * @param choices - The array of DataSetEvent choices available for the current choice selection.
     * @returns A new instance of ChoiceComponent.
     */
    static create(choices: DataSetEvent[]): ChoiceComponent {
        return new ChoiceComponent(choices);
    }
}