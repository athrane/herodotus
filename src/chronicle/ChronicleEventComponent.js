import { TypeUtils } from '../util/TypeUtils.js';
import { Component } from '../ecs/Component.js';
import { ChronicleEvent } from './ChronicleEvent.js';

/**
 * @class ChronicleEventComponent
 * @augments Component
 * @description A component to store a logbook of significant historical events.
 * This component is typically attached to the primary World entity.
 */
export class ChronicleEventComponent extends Component {
    /**
     * @constructor
     * @param {Array<Object>} events - An array of historical events.
     */
    constructor(events = []) {
        super();
        TypeUtils.ensureArray(events);
        for (const event of events) {
            this.addEvent(event);
        }
    }

    /**
     * Adds a new event to the chronicle.
     * @param {ChronicleEvent} event - The event to add.
     */
    addEvent(event) {
        TypeUtils.ensureInstanceOf(event, ChronicleEvent);
        this.events.push(event);
    }

    /**
     * Static factory method to create a ChronicleEventComponent.
     * @static
     * @param {Array<Object>} events - An array of historical events.
     * @returns {ChronicleEventComponent} A new instance of ChronicleEventComponent.
     */
    static create(events = []) {
        return new ChronicleEventComponent(events);
    }

    /**
     * Retrieves the list of events.
     * @returns {Array<ChronicleEvent>} The list of historical events.
     */
    getEvents() {
        return this.events;
    }   
}
