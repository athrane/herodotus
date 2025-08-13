import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.js';
import { Simulation} from '../../../src/simulation/Simulation.js';
import { WorldGenerator } from '../../../src/generator/world/WorldGenerator.ts';
import { TimeSystem } from '../../../src/time/TimeSystem.js';
import { HistoricalFigureLifecycleSystem } from '../../../src/historicalfigure/HistoricalFigureLifecycleSystem.js';
import { HistoricalFigureInfluenceSystem } from '../../../src/historicalfigure/HistoricalFigureInfluenceSystem.js';

// Mock the WorldGenerator to control its output
jest.mock('../../../src/generator/world/WorldGenerator.ts', () => {
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

        expect(systemManager.register).toHaveBeenCalledTimes(4);
        expect(systemManager.register).toHaveBeenCalledWith(expect.any(TimeSystem));
        expect(systemManager.register).toHaveBeenCalledWith(expect.any(HistoricalFigureLifecycleSystem));
        expect(systemManager.register).toHaveBeenCalledWith(expect.any(HistoricalFigureInfluenceSystem));
    });

    it('should have an empty buildGeographicalFeatures method', () => {
        expect(builder.buildGeographicalFeatures()).toBeUndefined();
    });
});
