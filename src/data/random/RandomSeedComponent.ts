import { Component } from '../../ecs/Component.js';
import { TypeUtils } from '../../util/TypeUtils.js';
import { RandomSeed } from './RandomSeed.js';

/**
 * Component holding loaded random seed configuration data.
 * Singleton component attached to DataSet entity.
 */
export class RandomSeedComponent extends Component {
    private randomSeed: RandomSeed;

    constructor(randomSeed: RandomSeed) {
        super();
        TypeUtils.ensureNonEmptyString(randomSeed.version, 'randomSeed.version');
        TypeUtils.ensureNonEmptyString(randomSeed.seed, 'randomSeed.seed');
        
        if (randomSeed.description !== undefined) {
            TypeUtils.ensureString(randomSeed.description, 'randomSeed.description');
        }

        this.randomSeed = randomSeed;
    }

    /**
     * Get the loaded random seed configuration.
     * 
     * @returns RandomSeed configuration object
     */
    getRandomSeed(): RandomSeed {
        return this.randomSeed;
    }

    /**
     * Factory method to create RandomSeedComponent instance.
     * 
     * @param randomSeed - Random seed configuration
     * @returns New RandomSeedComponent instance
     */
    static create(randomSeed: RandomSeed): RandomSeedComponent {
        return new RandomSeedComponent(randomSeed);
    }

    /**
     * Create null object instance (singleton pattern).
     * Returns a deterministic "null" random seed component for testing.
     * 
     * @returns Singleton null RandomSeedComponent instance
     */
    private static nullInstance: RandomSeedComponent | null = null;

    static createNull(): RandomSeedComponent {
        if (!RandomSeedComponent.nullInstance) {
            RandomSeedComponent.nullInstance = RandomSeedComponent.create({
                version: '1.0',
                seed: 'null-seed',
                description: 'Null object for testing'
            });
        }
        return RandomSeedComponent.nullInstance;
    }
}
