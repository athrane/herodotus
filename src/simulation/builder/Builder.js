
/**
 * Builder class is an abstract base class for building simulations.
 * It defines the methods that must be implemented by subclasses to build
 * entities, systems, and geographical features in a simulation.
 * @abstract
 * @class Builder
 */
export class Builder {
    /**
     * @abstract
     */
    build() {
        throw new Error('Method not implemented!');
    }

    /**
     * @abstract
     */
    buildEntities() {
        throw new Error('Method not implemented!');
    }

    /**
     * @abstract
     */
    buildSystems() {
        throw new Error('Method not implemented!');
    }

    /**
     * @abstract
     */
    buildGeographicalFeatures() {
        throw new Error('Method not implemented!');
    }

    /**
     * @abstract
     */
    getSimulation() {
        throw new Error('Method not implemented!');
    } 
}
