import { Component } from '../ecs/Component';
import { DataSetEvent } from '../data/DataSetEvent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A component that holds the current set of available choices for a dilemma.
 * This component is attached to an entity when choices are generated,
 * and represents all valid DataSetEvent options that can be selected for the current turn.
 */
export class DilemmaComponent extends Component {
    /**
     * Array of DataSetEvent choices available for the current dilemma.
     */
    private choices: DataSetEvent[];

    /**
     * Creates an instance of DilemmaComponent.
     * @param choices - The array of DataSetEvent choices available for the current dilemma.
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
     * Gets the array of available choices.
     * @returns A readonly array of DataSetEvent choices.
     */
    getChoices(): ReadonlyArray<DataSetEvent> {
        return [...this.choices];
    }

    /**
     * Sets new choices for the dilemma, replacing any existing choices.
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
     * Clears all choices from the dilemma.
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
     * Creates a new instance of DilemmaComponent.
     * This static factory method provides a standardized way to construct DilemmaComponent objects.
     * @param choices - The array of DataSetEvent choices available for the current dilemma.
     * @returns A new instance of DilemmaComponent.
     */
    static create(choices: DataSetEvent[]): DilemmaComponent {
        return new DilemmaComponent(choices);
    }
}
