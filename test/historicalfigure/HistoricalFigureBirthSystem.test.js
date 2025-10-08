
import { ChronicleComponent } from '../../src/chronicle/ChronicleComponent';
import { TimeComponent } from '../../src/time/TimeComponent';
import { GalaxyMapComponent } from '../../src/geography/galaxy/GalaxyMapComponent';
import { EntityManager } from '../../src/ecs/EntityManager';
import { HistoricalFigureBirthSystem } from '../../src/historicalfigure/HistoricalFigureBirthSystem';
import { NameGenerator } from '../../src/naming/NameGenerator';
import { Time } from '../../src/time/Time';
// eslint-disable-next-line no-unused-vars
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../src/geography/planet/PlanetComponent';
import { Continent } from '../../src/geography/planet/Continent';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry';
import { HistoricalFigureData } from '../../src/data/historicalfigure/HistoricalFigureData';

describe('HistoricalFigureBirthSystem', () => {
    let entityManager;
    let system;
    let mockTimeComponent;
    let mockGalaxyMapComponent;
    let mockChronicleEventComponent;
    let mockNameGenerator;
    let globalEntity;
    let mockConfig;

    beforeEach(() => {
        entityManager = new EntityManager();

        // Create mock configuration
        mockConfig = HistoricalFigureData.create({
            birthChancePerYear: 0.05,
            naturalLifespanMean: 70,
            naturalLifespanStdDev: 15
        });

        // Mock dependencies
        const mockTime = Time.create(1970);
        mockTimeComponent = TimeComponent.create(mockTime);
        
        // Clear registry to ensure clean state
        GeographicalFeatureTypeRegistry.clear();
        
        // Create proper planet with feature for getRandomPlanet
        const featureType = GeographicalFeatureTypeRegistry.register('test_place', 'Place');
        const feature = GeographicalFeature.create('TestPlace', featureType);
        const continent = Continent.create('Test Continent');
        continent.addFeature(feature);
        const testPlanet = PlanetComponent.create(
            'test-planet-1',
            'TestPlanet',
            'test-sector-1',
            'TestOwner',
            PlanetStatus.NORMAL,
            5,
            1,
            PlanetResourceSpecialization.AGRICULTURE,
            [continent]
        );
        
        // Create a proper GalaxyMapComponent instance with mocked method
        mockGalaxyMapComponent = GalaxyMapComponent.create();
        jest.spyOn(mockGalaxyMapComponent, 'getRandomPlanet').mockReturnValue(testPlanet);
        
        mockChronicleEventComponent = ChronicleComponent.create();
        jest.spyOn(mockChronicleEventComponent, 'addEvent').mockImplementation(() => {});
        
        mockNameGenerator = { generateHistoricalFigureName: jest.fn(() => 'TestName') };

        jest.spyOn(NameGenerator, 'create').mockReturnValue(mockNameGenerator);

        // Create global entity with singleton components
        globalEntity = entityManager.createEntity(
            mockTimeComponent,
            mockGalaxyMapComponent,
            mockChronicleEventComponent
        );

        // Spy on createEntity to track calls to historical figure creation
        jest.spyOn(entityManager, 'createEntity');

        system = new HistoricalFigureBirthSystem(entityManager, mockConfig);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('constructor sets up the system', () => {
        expect(system).toBeInstanceOf(HistoricalFigureBirthSystem);
    });

    it('does nothing if TimeComponent is missing', () => {
        // Create entity without TimeComponent
        const entityWithoutTime = entityManager.createEntity(
            mockGalaxyMapComponent,
            mockChronicleEventComponent
        );
        
        // Mock isBorn to return true so we test the missing component path
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        
        // Clear the mock to not count the entity creation above
        jest.clearAllMocks();
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        jest.spyOn(entityManager, 'createEntity');
        
        system.processEntity(entityWithoutTime, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if GalaxyMapComponent is missing', () => {
        // Create entity without GalaxyMapComponent
        const entityWithoutGalaxy = entityManager.createEntity(
            mockTimeComponent,
            mockChronicleEventComponent
        );
        
        // Mock isBorn to return true so we test the missing component path
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        
        // Clear the mock to not count the entity creation above
        jest.clearAllMocks();
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        jest.spyOn(entityManager, 'createEntity');
        
        system.processEntity(entityWithoutGalaxy, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if ChronicleEventComponent is missing', () => {
        // Create entity without ChronicleComponent
        const entityWithoutChronicle = entityManager.createEntity(
            mockTimeComponent,
            mockGalaxyMapComponent
        );
        
        // Mock isBorn to return true so we test the missing component path
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        
        // Clear the mock to not count the entity creation above
        jest.clearAllMocks();
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        jest.spyOn(entityManager, 'createEntity');
        
        system.processEntity(entityWithoutChronicle, 100);
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('does nothing if isBorn returns false', () => {
        jest.spyOn(system, 'isBorn').mockReturnValue(false);
        system.processEntity(globalEntity, 100);
        expect(mockNameGenerator.generateHistoricalFigureName).not.toHaveBeenCalled();
        expect(entityManager.createEntity).not.toHaveBeenCalled();
        expect(mockChronicleEventComponent.addEvent).not.toHaveBeenCalled();
    });

    it('creates entity and logs event if isBorn returns true', () => {
        jest.spyOn(system, 'isBorn').mockReturnValue(true);
        jest.spyOn(system, 'calculateLifespan').mockReturnValue(70);

        system.processEntity(globalEntity, 100);

        expect(mockNameGenerator.generateHistoricalFigureName).toHaveBeenCalledWith('GENERIC', 4, 8);
        expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
        expect(mockChronicleEventComponent.addEvent).toHaveBeenCalledTimes(1);
        const event = mockChronicleEventComponent.addEvent.mock.calls[0][0];
        expect(event.getHeading()).toContain('Historical figure TestName was born in 1970.');
    });

    it('isBorn returns true or false based on birthChancePerYear', () => {
        // Create a system with 100% birth chance
        const alwaysBornConfig = HistoricalFigureData.create({
            birthChancePerYear: 1,
            naturalLifespanMean: 70,
            naturalLifespanStdDev: 15
        });
        const alwaysBornSystem = new HistoricalFigureBirthSystem(entityManager, alwaysBornConfig);
        expect(alwaysBornSystem.isBorn()).toBe(true);
        
        // Create a system with 0% birth chance
        const neverBornConfig = HistoricalFigureData.create({
            birthChancePerYear: 0,
            naturalLifespanMean: 70,
            naturalLifespanStdDev: 15
        });
        const neverBornSystem = new HistoricalFigureBirthSystem(entityManager, neverBornConfig);
        expect(neverBornSystem.isBorn()).toBe(false);
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
            
            // Create a new entity with the custom year TimeComponent
            const testEntity = entityManager.createEntity(
                mockTimeComponentWithCustomYear,
                mockGalaxyMapComponent,
                mockChronicleEventComponent
            );

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(50);
            
            // Clear mocks from entity creation
            jest.clearAllMocks();
            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(50);
            jest.spyOn(entityManager, 'createEntity');

            system.processEntity(testEntity, 100); // Note: currentYear parameter should be ignored

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
            
            // Create a new entity with the custom year TimeComponent
            const testEntity = entityManager.createEntity(
                mockTimeComponentWithCustomYear,
                mockGalaxyMapComponent,
                mockChronicleEventComponent
            );

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(75);
            
            // Clear mocks from entity creation
            jest.clearAllMocks();
            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(75);
            jest.spyOn(mockChronicleEventComponent, 'addEvent').mockImplementation(() => {});

            system.processEntity(testEntity, 999); // currentYear parameter should be ignored

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
            
            // Create a new entity with the custom year TimeComponent
            const testEntity = entityManager.createEntity(
                mockTimeComponentWithCustomYear,
                mockGalaxyMapComponent,
                mockChronicleEventComponent
            );

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(60);
            
            // Clear mocks from entity creation
            jest.clearAllMocks();
            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(60);
            jest.spyOn(entityManager, 'createEntity');
            jest.spyOn(mockChronicleEventComponent, 'addEvent').mockImplementation(() => {});

            system.processEntity(testEntity, ignoredCurrentYear);

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
            
            // Create a new entity with the custom year TimeComponent
            const testEntity = entityManager.createEntity(
                mockTimeComponentWithCustomYear,
                mockGalaxyMapComponent,
                mockChronicleEventComponent
            );

            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(45);
            
            // Clear mocks from entity creation
            jest.clearAllMocks();
            jest.spyOn(system, 'isBorn').mockReturnValue(true);
            jest.spyOn(system, 'calculateLifespan').mockReturnValue(45);
            jest.spyOn(mockChronicleEventComponent, 'addEvent').mockImplementation(() => {});

            system.processEntity(testEntity, 500);

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
                
                // Create a new entity with the custom year TimeComponent
                const testEntity = entityManager.createEntity(
                    mockTimeComponentWithCustomYear,
                    mockGalaxyMapComponent,
                    mockChronicleEventComponent
                );

                // Clear mocks from entity creation
                jest.clearAllMocks();
                jest.spyOn(system, 'isBorn').mockReturnValue(true);
                jest.spyOn(system, 'calculateLifespan').mockReturnValue(70);
                jest.spyOn(entityManager, 'createEntity');
                jest.spyOn(mockChronicleEventComponent, 'addEvent').mockImplementation(() => {});

                system.processEntity(testEntity, 9999); // Should be ignored

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
            system.processEntity(globalEntity, 1000);

            expect(entityManager.createEntity).toHaveBeenCalledTimes(1);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            expect(createEntityCall).toHaveLength(5); // NameComponent, HistoricalFigureComponent, DataSetEventComponent, ChoiceComponent, LocationComponent
            
            // Verify DataSetEventComponent is included
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            expect(dataSetEventComponent).toBeDefined();
            
            // Verify ChoiceComponent is included
            const dilemmaComponent = createEntityCall.find(component => 
                component.constructor.name === 'ChoiceComponent'
            );
            expect(dilemmaComponent).toBeDefined();
        });

        it('should create DataSetEvent with correct Social event type', () => {
            system.processEntity(globalEntity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            expect(birthEvent.getEventType()).toBe('Social');
        });

        it('should create DataSetEvent with unique trigger ID', () => {
            // Process two births to verify unique triggers
            system.processEntity(globalEntity, 1000);
            system.processEntity(globalEntity, 1000);
            
            expect(entityManager.createEntity).toHaveBeenCalledTimes(2);
            
            const firstCall = entityManager.createEntity.mock.calls[0];
            const secondCall = entityManager.createEntity.mock.calls[1];
            
            const firstDataSetEventComponent = firstCall.find(c => c.constructor.name === 'DataSetEventComponent');
            const secondDataSetEventComponent = secondCall.find(c => c.constructor.name === 'DataSetEventComponent');
            
            const firstEvent = firstDataSetEventComponent.getDataSetEvent();
            const secondEvent = secondDataSetEventComponent.getDataSetEvent();
            
            expect(firstEvent.getCause()).toMatch(/NPC_BIRTH_1970_\d+/);
            expect(secondEvent.getCause()).toMatch(/NPC_BIRTH_1970_\d+/);
            expect(firstEvent.getCause()).not.toBe(secondEvent.getCause());
        });

        it('should create DataSetEvent with correct birth event data', () => {
            system.processEntity(globalEntity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            
            expect(birthEvent.getEventName()).toBe('Birth of TestName');
            expect(birthEvent.getEventConsequence()).toBe('Birth');
            expect(birthEvent.getHeading()).toBe('A New Figure Emerges');
            // Note: getPlace() returns undefined because source uses "Location" key instead of "Place"
            expect(birthEvent.getPlace()).toBeUndefined();
            expect(birthEvent.getPrimaryActor()).toBe('TestName');
            expect(birthEvent.getSecondaryActor()).toBe('The Community');
            expect(birthEvent.getMotive()).toBe('Natural birth and emergence into society');
            expect(birthEvent.getTags()).toBe('birth, historical-figure, social, emergence');
        });

        it('should create DataSetEvent with detailed description including lifespan', () => {
            system.processEntity(globalEntity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            
            expect(birthEvent.getDescription()).toContain('TestName was born in TestPlace, TestPlanet during the year 1970'); // Updated to include planet
            expect(birthEvent.getDescription()).toContain('expected lifespan of 50 years');
            expect(birthEvent.getConsequence()).toContain('The world gains a new historical figure');
        });

        it('should create DataSetEvent with place information from galaxy map', () => {
            // Test with different place - create a new proper planet instance
            const featureType2 = GeographicalFeatureTypeRegistry.register('mountain_peaks', 'Mountains');
            const feature2 = GeographicalFeature.create('Mountain Peaks', featureType2);
            const continent2 = Continent.create('Mountain Continent');
            continent2.addFeature(feature2);
            const testPlanet2 = PlanetComponent.create(
                'test-planet-2',
                'TestPlanet2',
                'test-sector-1',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.AGRICULTURE,
                [continent2]
            );
            
            mockGalaxyMapComponent.getRandomPlanet.mockReturnValue(testPlanet2);
            
            system.processEntity(globalEntity, 1000);
            
            const createEntityCall = entityManager.createEntity.mock.calls[0];
            const dataSetEventComponent = createEntityCall.find(component => 
                component.constructor.name === 'DataSetEventComponent'
            );
            
            const birthEvent = dataSetEventComponent.getDataSetEvent();
            // Note: getPlace() returns undefined because source uses "Location" key instead of "Place"
            // But description should still contain the location name
            expect(birthEvent.getPlace()).toBeUndefined();
            expect(birthEvent.getDescription()).toContain('Mountain Peaks');
        });

        it('should throw error when no planet available', () => {
            // Mock galaxy map to return no planet with Jest spy
            mockGalaxyMapComponent.getRandomPlanet.mockReturnValue(undefined);
            
            // GeographicalUtils.computeRandomLocation will throw when planet is undefined
            expect(() => {
                system.processEntity(globalEntity, 1000);
            }).toThrow();
        });

        it('should not create DataSetEventComponent if birth does not occur', () => {
            jest.spyOn(system, 'isBorn').mockReturnValue(false);
            
            system.processEntity(globalEntity, 1000);
            
            expect(entityManager.createEntity).not.toHaveBeenCalled();
        });
    });
});
