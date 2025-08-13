
import { ChronicleEventComponent } from '../../src/chronicle/ChronicleEventComponent.ts';
import { TimeComponent } from '../../src/time/TimeComponent.js';
import { WorldComponent } from '../../src/geography/WorldComponent.js';
import { World } from '../../src/geography/World.js';
import { Entity } from '../../src/ecs/Entity';
import { EntityManager } from '../../src/ecs/EntityManager';
import { HistoricalFigureBirthSystem } from '../../src/historicalfigure/HistoricalFigureBirthSystem.js';
import { NameGenerator } from '../../src/naming/NameGenerator.js';
import { Time } from '../../src/time/Time.js';

describe('HistoricalFigureBirthSystem', () => {
    let entityManager;
    let system;
    let mockTimeComponent;
    let mockWorldComponent;
    let mockChronicleEventComponent;
    let mockNameGenerator;
    let entity;

    beforeEach(() => {
        entityManager = new EntityManager();
        entity = new Entity();

        // Mock dependencies
        const mockTime = Time.create(1970);
        const mockTimeComponent = TimeComponent.create(mockTime);
        const mockWorld = new World('TestWorld');
        jest.spyOn(mockWorld, 'getRandomContinent').mockReturnValue({
            getRandomFeature: () => ({
                getName: () => 'TestPlace'
            })
        });
        mockWorldComponent = {
            getWorld: () => mockWorld,
            get: () => mockWorld
        };
        mockChronicleEventComponent = { addEvent: jest.fn() };
        mockNameGenerator = { generateHistoricalFigureName: jest.fn(() => 'TestName') };

        jest.spyOn(NameGenerator, 'create').mockReturnValue(mockNameGenerator);

        jest.spyOn(entityManager, 'getSingletonComponent')
            .mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponent;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleEventComponent) return mockChronicleEventComponent;
                return null;
            });
        jest.spyOn(entityManager, 'createEntity')
            .mockImplementation((...components) => {
                const mockEntity = {
                    _components: new Map(),
                    addComponent: function(component) {
                        this._components.set(component.constructor, component);
                        return this;
                    },
                    getId: function() { return 'mockEntityId'; },
                    hasComponent: function(componentType) {
                        return this._components.has(componentType);
                    },
                    getComponent: function(componentType) {
                        return this._components.get(componentType);
                    }
                };
                components.forEach(c => mockEntity.addComponent(c));
                return mockEntity;
            });

        system = new HistoricalFigureBirthSystem(entityManager);
        HistoricalFigureBirthSystem.BIRTH_CHANCE_PER_YEAR = 0.05;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('constructor sets up the system', () => {
        expect(system).toBeInstanceOf(HistoricalFigureBirthSystem);
    });

    it('does nothing if TimeComponent is missing', () => {
        entityManager.getSingletonComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return null;
            if (componentType === WorldComponent) return mockWorldComponent;
            if (componentType === ChronicleEventComponent) return mockChronicleEventComponent;
            return null;
        });
        system.processEntity(entity, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if WorldComponent is missing', () => {
        entityManager.getSingletonComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return mockTimeComponent;
            if (componentType === WorldComponent) return null;
            if (componentType === ChronicleEventComponent) return mockChronicleEventComponent;
            return null;
        });
        system.processEntity(entity, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if ChronicleEventComponent is missing', () => {
        entityManager.getSingletonComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return mockTimeComponent;
            if (componentType === WorldComponent) return mockWorldComponent;
            if (componentType === ChronicleEventComponent) return null;
            return null;
        });
        system.processEntity(entity, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if isBorn returns false', () => {
        jest.spyOn(system, 'isBorn').mockReturnValue(false);
        system.processEntity(entity, 100);
        expect(mockNameGenerator.generateHistoricalFigureName).not.toHaveBeenCalled();
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('creates entity and logs event if isBorn returns true', () => {
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        jest.spyOn(system, 'calculateLifespan').mockReturnValue(70);

        system.processEntity(entity, 100);

        expect(mockNameGenerator.generateHistoricalFigureName).toHaveBeenCalledWith('GENERIC', 4, 8);
        expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
        expect(mockChronicleEventComponent.addEvent).toHaveBeenCalledTimes(1);
        const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
        expect(event.getHeading()).toContain('TestName was born in 100.');
    });

    it('isBorn returns true or false based on BIRTH_CHANCE_PER_YEAR', () => {
        HistoricalFigureBirthSystem.BIRTH_CHANCE_PER_YEAR = 1;
        expect(system.isBorn()).toBe(true);
        HistoricalFigureBirthSystem.BIRTH_CHANCE_PER_YEAR = 0;
        expect(system.isBorn()).toBe(false);
    });

    it('calculateLifespan returns a positive integer', () => {
        const lifespan = system.calculateLifespan();
        expect(Number.isInteger(lifespan)).toBe(true);
        expect(lifespan).toBeGreaterThan(0);
    });
});
