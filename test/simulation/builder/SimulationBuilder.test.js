import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.ts';
import { Simulation } from '../../../src/simulation/Simulation.ts';
import { WorldGenerator } from '../../../src/generator/world/WorldGenerator';
import { TimeSystem } from '../../../src/time/TimeSystem';
import { HistoricalFigureLifecycleSystem } from '../../../src/historicalfigure/HistoricalFigureLifecycleSystem';
import { HistoricalFigureInfluenceSystem } from '../../../src/historicalfigure/HistoricalFigureInfluenceSystem';
import { DataSetComponent } from '../../../src/data/DataSetComponent.ts';

// Mock the WorldGenerator to control its output
jest.mock('../../../src/generator/world/WorldGenerator', () => {
    const { World } = jest.requireActual('../../../src/geography/World.ts');
    return {
        WorldGenerator: {
            create: jest.fn(() => ({
                generateWorld: jest.fn(() => World.create('MockWorld'))
            }))
        }
    };
});

// Mock data loader to return a small, valid set of DataSetEvent instances
jest.mock('../../../src/data/loadEvents', () => {
    const { DataSetEvent } = jest.requireActual('../../../src/data/DataSetEvent.ts');
    return {
        loadEvents: jest.fn(() => [
            new DataSetEvent({ 'Event Trigger': 'EVT_1', 'Event Name': 'Test One', 'Event Type': 'TypeA' }),
            new DataSetEvent({ 'Event Trigger': 'EVT_2', 'Event Name': 'Test Two', 'Event Type': 'TypeB' })
        ])
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

        // Clear mocks before each test for WorldGenerator.create
        WorldGenerator.create.mockClear();

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

    it('should load data in buildData and attach DataSetComponent in buildEntities', () => {
        // Mock entityManager.createEntity to avoid Entity instantiation issues in tests
        entityManager.createEntity.mockImplementation((...components) => {
            // Return a mock entity that has the components
            return { components };
        });

        // Act: load data, then build entities which should attach a DataSetComponent
        builder.buildData();
        builder.buildEntities();

        // Assert: createEntity was called twice (Global entity + historical figure)
        expect(entityManager.createEntity).toHaveBeenCalledTimes(2);
        
        // Check that the first call (Global entity) includes a DataSetComponent
        const firstCall = entityManager.createEntity.mock.calls[0];
        const dsComp = firstCall.find(arg => arg instanceof DataSetComponent);
        expect(dsComp).toBeInstanceOf(DataSetComponent);
        expect(dsComp.getEvents()).toHaveLength(2);
        expect(dsComp.getByTrigger('EVT_1')).toBeDefined();
        expect(dsComp.getByTrigger('EVT_2')).toBeDefined();
    });
});