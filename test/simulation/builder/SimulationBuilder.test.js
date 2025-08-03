import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.js';
import { Simulation} from '../../../src/simulation/Simulation.js';
import { WorldGenerator } from '../../../src/generator/world/WorldGenerator.js';
import { TimeSystem } from '../../../src/time/TimeSystem.js';
import { TimeComponent } from '../../../src/time/TimeComponent.js';
import { NameComponent } from '../../../src/ecs/NameComponent.js';
import { WorldComponent } from '../../../src/geography/WorldComponent.js';

// Mock the WorldGenerator to control its output
jest.mock('../../../src/generator/world/WorldGenerator.js', () => {
    return {
        WorldGenerator: jest.fn().mockImplementation(() => {
            return {
                generateWorld: jest.fn(() => ({
                    getName: () => 'MockWorld',
                    getContinents: () => []
                }))
            };
        })
    };
});

describe('SimulationBuilder', () => {
    let builder;
    let simulation;
    let entityManager;
    let systemManager;

    beforeEach(() => {
        builder = SimulationBuilder.create();
        builder.build(); // build the simulation instance
        simulation = builder.getSimulation();
        entityManager = simulation.getEntityManager();
        systemManager = simulation.getSystemManager();

        // Clear mocks before each test
        WorldGenerator.mockClear();
        WorldGenerator.mockImplementation(() => {
            return {
                generateWorld: jest.fn(() => ({
                    getName: () => 'MockWorld',
                    getContinents: () => []
                }))
            };
        });

        jest.spyOn(entityManager, 'createEntity');
        jest.spyOn(systemManager, 'register');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize simulation instance on build()', () => {
        expect(builder.getSimulation()).toBeInstanceOf(Simulation);
    });

    it('should build systems correctly', () => {
        builder.buildSystems();

        expect(systemManager.register).toHaveBeenCalledTimes(1);
        expect(systemManager.register).toHaveBeenCalledWith(expect.any(TimeSystem));
    });

    it('should have an empty buildGeographicalFeatures method', () => {
        expect(builder.buildGeographicalFeatures()).toBeUndefined();
    });
});
