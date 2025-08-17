
import { ChronicleComponent } from '../../src/chronicle/ChronicleComponent';
import { TimeComponent } from '../../src/time/TimeComponent';
import { WorldComponent } from '../../src/geography/WorldComponent';
import { World } from '../../src/geography/World';
import { Entity } from '../../src/ecs/Entity';
import { EntityManager } from '../../src/ecs/EntityManager';
import { HistoricalFigureBirthSystem } from '../../src/historicalfigure/HistoricalFigureBirthSystem';
import { NameGenerator } from '../../src/naming/NameGenerator';
import { Time } from '../../src/time/Time';
// eslint-disable-next-line no-unused-vars
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';

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
        mockTimeComponent = TimeComponent.create(mockTime);
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
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

        // Mock entity.getComponent to return the same components as getSingletonComponent
        jest.spyOn(entity, 'getComponent')
            .mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponent;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
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
            if (componentType === ChronicleComponent) return mockChronicleEventComponent;
            return null;
        });
        entity.getComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return null;
            if (componentType === WorldComponent) return mockWorldComponent;
            if (componentType === ChronicleComponent) return mockChronicleEventComponent;
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
            if (componentType === ChronicleComponent) return mockChronicleEventComponent;
            return null;
        });
        entity.getComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return mockTimeComponent;
            if (componentType === WorldComponent) return null;
            if (componentType === ChronicleComponent) return mockChronicleEventComponent;
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
            if (componentType === ChronicleComponent) return null;
            return null;
        });
        entity.getComponent.mockImplementation((componentType) => {
            if (componentType === TimeComponent) return mockTimeComponent;
            if (componentType === WorldComponent) return mockWorldComponent;
            if (componentType === ChronicleComponent) return null;
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
        expect(event.getHeading()).toContain('Historical figure TestName was born in 1970.');
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

    describe('Time Component Integration Tests', () => {
        it('uses year from TimeComponent for historical figure birth year', () => {
            const testYear = 1500;
            const mockTime = Time.create(testYear);
            const mockTimeComponentWithCustomYear = TimeComponent.create(mockTime);
            
            entityManager.getSingletonComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            entity.getComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(50);

            system.processEntity(entity, 100); // Note: currentYear parameter should be ignored

            expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const historicalFigureComponent = createEntityCall.find(component => 
                component.constructor.name === 'HistoricalFigureComponent'
            );
            expect(historicalFigureComponent.birthYear).toBe(testYear);
            expect(historicalFigureComponent.averageLifeSpan).toBe(testYear + 50); // This field stores death year
        });

        it('uses year from TimeComponent in chronicle event message', () => {
            const testYear = 2000;
            const mockTime = Time.create(testYear);
            const mockTimeComponentWithCustomYear = TimeComponent.create(mockTime);
            
            entityManager.getSingletonComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            entity.getComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(75);

            system.processEntity(entity, 999); // currentYear parameter should be ignored

            expect(mockChronicleEventComponent.addEvent).toHaveBeenCalledTimes(1);
            const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
            expect(event.getHeading()).toContain(`Historical figure TestName was born in ${testYear}.`);
            expect(event.getDescription()).toContain(`was born in the year ${testYear}`);
        });

        it('ignores currentYear parameter and uses TimeComponent year instead', () => {
            const timeComponentYear = 1776;
            const ignoredCurrentYear = 1234;
            const mockTime = Time.create(timeComponentYear);
            const mockTimeComponentWithCustomYear = TimeComponent.create(mockTime);
            
            entityManager.getSingletonComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            entity.getComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(60);

            system.processEntity(entity, ignoredCurrentYear);

            // Verify the TimeComponent year is used, not the currentYear parameter
            expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const historicalFigureComponent = createEntityCall.find(component => 
                component.constructor.name === 'HistoricalFigureComponent'
            );
            expect(historicalFigureComponent.birthYear).toBe(timeComponentYear);
            expect(historicalFigureComponent.birthYear).not.toBe(ignoredCurrentYear);

            // Verify chronicle event also uses TimeComponent year
            const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
            expect(event.getHeading()).toContain(`Historical figure TestName was born in ${timeComponentYear}.`);
            expect(event.getHeading()).not.toContain(`Historical figure TestName was born in ${ignoredCurrentYear}.`);
        });

        it('uses TimeComponent time instance for chronicle event', () => {
            const testYear = 1066;
            const mockTime = Time.create(testYear);
            const mockTimeComponentWithCustomYear = TimeComponent.create(mockTime);
            
            entityManager.getSingletonComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            entity.getComponent.mockImplementation((componentType) => {
                if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                if (componentType === WorldComponent) return mockWorldComponent;
                if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                return null;
            });

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(45);

            system.processEntity(entity, 500);

            expect(mockChronicleEventComponent.addEvent).toHaveBeenCalledTimes(1);
            const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
            
            // Verify the time instance passed to the chronicle event is the same one from TimeComponent
            expect(event.getTime()).toBe(mockTime);
        });

        it('handles different years correctly from TimeComponent', () => {
            const testCases = [1, 500, 1000, 1500, 2000, 2500];
            
            testCases.forEach(testYear => {
                // Reset mocks for each test case
                jest.clearAllMocks();
                
                const mockTime = Time.create(testYear);
                const mockTimeComponentWithCustomYear = TimeComponent.create(mockTime);
                
                entityManager.getSingletonComponent.mockImplementation((componentType) => {
                    if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                    if (componentType === WorldComponent) return mockWorldComponent;
                    if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                    return null;
                });

                entity.getComponent.mockImplementation((componentType) => {
                    if (componentType === TimeComponent) return mockTimeComponentWithCustomYear;
                    if (componentType === WorldComponent) return mockWorldComponent;
                    if (componentType === ChronicleComponent) return mockChronicleEventComponent;
                    return null;
                });

                jest.spyOn(system, 'isBorn').mockReturnValue(true);
                jest.spyOn(system, 'calculateLifespan').mockReturnValue(70);

                system.processEntity(entity, 9999); // Should be ignored

                expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
                const createEntityCall = entityManager.createEntity.mock.calls[0];
                const historicalFigureComponent = createEntityCall.find(component => 
                    component.constructor.name === 'HistoricalFigureComponent'
                );
                expect(historicalFigureComponent.birthYear).toBe(testYear);

                const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
                expect(event.getHeading()).toContain(`Historical figure TestName was born in ${testYear}.`);
            });
        });
    });

    describe('DataSetEventComponent Integration', () => {
        beforeEach(() => {
            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(50);
        });

        it('should attach DataSetEventComponent to newly created historical figures', () => {
            system.processEntity(entity, 1000);

            expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            expect(createEntityCall).toHaveLength(3); // NameComponent, HistoricalFigureComponent, DataSetEventComponent
            
            // Verify DataSetEventComponent is included
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            expect(dataSetEventComponent).toBeDefined();
        });

        it('should create DataSetEvent with correct Social event type', () => {
            system.processEntity(entity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            expect(birthEvent.EventType).toBe('Social');
        });

        it('should create DataSetEvent with unique trigger ID', () => {
            // Process two births to verify unique triggers
            system.processEntity(entity, 1000);
            system.processEntity(entity, 1000);
            
            expect(entityManager.createEntity).toHaveBeenCalledTimes(2);
            
            const firstCall = entityManager.createEntity.mock.calls[0];
            const secondCall = entityManager.createEntity.mock.calls[1];
            
            const firstDataSetEventComponent = firstCall.find(c => c.constructor.name === 'DataSetEventComponent');
            const secondDataSetEventComponent = secondCall.find(c => c.constructor.name === 'DataSetEventComponent');
            
            const firstEvent = firstDataSetEventComponent.getDataSetEvent();
            const secondEvent = secondDataSetEventComponent.getDataSetEvent();
            
            expect(firstEvent.EventTrigger).toMatch(/NPC_BIRTH_1970_\d+/);
            expect(secondEvent.EventTrigger).toMatch(/NPC_BIRTH_1970_\d+/);
            expect(firstEvent.EventTrigger).not.toBe(secondEvent.EventTrigger);
        });

        it('should create DataSetEvent with correct birth event data', () => {
            system.processEntity(entity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            
            expect(birthEvent.EventName).toBe('Birth of TestName');
            expect(birthEvent.EventConsequence).toBe('A new historical figure has emerged');
            expect(birthEvent.Heading).toBe('A New Figure Emerges');
            expect(birthEvent.Place).toBe('TestPlace');
            expect(birthEvent.PrimaryActor).toBe('TestName');
            expect(birthEvent.SecondaryActor).toBe('The Community');
            expect(birthEvent.Motive).toBe('Natural birth and emergence into society');
            expect(birthEvent.Tags).toBe('birth, historical-figure, social, emergence');
        });

        it('should create DataSetEvent with detailed description including lifespan', () => {
            system.processEntity(entity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            
            expect(birthEvent.Description).toContain('TestName was born in TestPlace during the year 1970');
            expect(birthEvent.Description).toContain('expected lifespan of 50 years');
            expect(birthEvent.Consequence).toContain('The world gains a new historical figure');
        });

        it('should create DataSetEvent with place information from world', () => {
            // Test with different place
            const mockWorldWithDifferentPlace = new World('TestWorld');
            jest.spyOn(mockWorldWithDifferentPlace, 'getRandomContinent').mockReturnValue({
                getRandomFeature: () => ({
                    getName: () => 'Mountain Peaks'
                })
            });
            
            mockWorldComponent.get = () => mockWorldWithDifferentPlace;
            
            system.processEntity(entity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            expect(birthEvent.Place).toBe('Mountain Peaks');
            expect(birthEvent.Description).toContain('Mountain Peaks');
        });

        it('should handle unknown location gracefully', () => {
            // Mock world to return no continent
            const mockWorldWithNoLocation = new World('TestWorld');
            jest.spyOn(mockWorldWithNoLocation, 'getRandomContinent').mockReturnValue(null);
            mockWorldComponent.get = () => mockWorldWithNoLocation;
            
            system.processEntity(entity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            expect(birthEvent.Place).toBe('Unknown Location');
        });

        it('should not create DataSetEventComponent if birth does not occur', () => {
            jest.spyOn(system, 'isBorn').mockReturnValue(false);
            
            system.processEntity(entity, 1000);
            
            expect(entityManager.createEntity).not.toHaveBeenCalled();
        });
    });
});
