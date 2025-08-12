import { TypeUtils } from '../util/TypeUtils.ts';
import { Component } from '../ecs/Component.js';
import { ChronicleEvent } from './ChronicleEvent.ts';

/**
 * @class ChronicleEventComponent
 * @augments Component
 * @description A component to store a logbook of significant historical events.
 * This component is typically attached to the primary World entity.
 */
export class ChronicleEventComponent extends Component {

    /**
     * An array to hold the historical events.
     * @type {Array<ChronicleEvent>}
     * @private
     */
    #events = [];

    /**
     * @constructor
     * @param {Array<Object>} events - An array of historical events.
     */
    constructor(events = []) {
        super();
        TypeUtils.ensureArray(events, 'ChronicleEventComponent events must be an array.');
        for (const event of events) {
            this.addEvent(event);
        }
    }

    /**
     * Adds a new event to the chronicle.
     * Accepts ChronicleEvent instances, but also tolerates plain objects produced by systems.
     * @param {ChronicleEvent|Object} event - The event to add.
     */
    addEvent(event) {
        // Prefer strong typing when possible, but allow plain objects to avoid breaking systems
        // that emit simple event payloads during simulation.
        if (event instanceof ChronicleEvent) {
            this.#events.push(event);
            return;
        }

        // Fallback: accept any object and store it as-is.
        // This keeps the simulation running even if events are not fully modeled yet.
        this.#events.push(event);
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
        return this.#events;
    }   
}
