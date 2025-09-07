import { BuilderDirector } from '../../../src/ecs/builder/BuilderDirector.ts';
import { Simulation } from '../../../src/simulation/Simulation.ts';

describe('BuilderDirector', () => {
    let mockBuilder;
    let director;
    let simulationInstance;

    beforeEach(() => {
        simulationInstance = new Simulation();

        mockBuilder = {
            build: jest.fn().mockImplementation(function() { this.simulation = simulationInstance; }),
            buildData: jest.fn(),
            buildEntities: jest.fn(),
            buildSystems: jest.fn(),
            buildComponents: jest.fn(),
            getSimulation: jest.fn().mockReturnValue(simulationInstance),
            simulation: null
        };

        director = BuilderDirector.create(mockBuilder);
    });

    it('should call all builder methods in the correct order', () => {
        director.build();

        expect(mockBuilder.build).toHaveBeenCalledTimes(1);
        expect(mockBuilder.buildData).toHaveBeenCalledTimes(1);
        expect(mockBuilder.buildSystems).toHaveBeenCalledTimes(1);
        expect(mockBuilder.buildEntities).toHaveBeenCalledTimes(1);
        expect(mockBuilder.buildComponents).toHaveBeenCalledTimes(1);

        // Verify the order of calls
        expect(mockBuilder.build.mock.invocationCallOrder[0]).toBeLessThan(mockBuilder.buildData.mock.invocationCallOrder[0]);
        expect(mockBuilder.buildData.mock.invocationCallOrder[0]).toBeLessThan(mockBuilder.buildComponents.mock.invocationCallOrder[0]);
        expect(mockBuilder.buildComponents.mock.invocationCallOrder[0]).toBeLessThan(mockBuilder.buildSystems.mock.invocationCallOrder[0]);
        expect(mockBuilder.buildSystems.mock.invocationCallOrder[0]).toBeLessThan(mockBuilder.buildEntities.mock.invocationCallOrder[0]);
    });

    it('should return the simulation instance from the builder', () => {
        const result = director.build();
        expect(result).toBe(simulationInstance);
    });
});