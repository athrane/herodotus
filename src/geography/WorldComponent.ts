import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';
import { World } from './World';

/**
 * @class WorldComponent
 * @extends {Component}
 * @description Holds the world data.
 */
export class WorldComponent extends Component {
    /**
     * World instance.
     */
    private readonly world: World;

    /**
     * Creates a new WorldComponent.
     * @param world - The world instance.
     */
    constructor(world: World) {
        super();
        TypeUtils.ensureInstanceOf(world, World);
        this.world = world;
    }

    /**
     * Gets the world data.
     * @returns The world data.
     */
    get(): World {
        return this.world;
    }
}