import { Component } from '../ecs/Component.js';
import { TypeUtils } from '../util/TypeUtils.js';
import { World } from './World.js';

/**
 * @class WorldComponent
 * @extends {Component}
 * @description Holds the world data.
 */
export class WorldComponent extends Component {

    /**
     * @type {World}
     * @private
     */
    #world;

    /**
     * @param {World} world
     */
    constructor(world) {
        super();
        TypeUtils.ensureInstanceOf(world, World, 'WorldComponent requires a World instance.');
        this.#world = world;
    }

    /**
     * Gets the world data.
     * @returns {World} The world data.
     */
    get() {
        return this.#world;
    }
}
