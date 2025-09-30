import { SelectChoiceSystem } from '../../src/behaviour/SelectChoiceSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { ChoiceComponent } from '../../src/behaviour/ChoiceComponent';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { ChronicleComponent } from '../../src/chronicle/ChronicleComponent';
import { TimeComponent } from '../../src/time/TimeComponent';
import { GalaxyMapComponent } from '../../src/geography/galaxy/GalaxyMapComponent';
import { Sector } from '../../src/geography/galaxy/Sector';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../src/geography/planet/PlanetComponent';
import { Continent } from '../../src/geography/planet/Continent';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry';
import { Time } from '../../src/time/Time';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';
import { PlayerComponent } from '../../src/ecs/PlayerComponent';

describe('SelectChoiceSystem', () => {
    let entityManager;
    let system;
    let entity;
    // globalEntity is used to register singleton components with the EntityManager
    // The variable itself doesn't need to be accessed after creation
    // eslint-disable-next-line no-unused-vars
    let globalEntity;
    let chronicleComponent;
    let timeComponent;
    let galaxyMapComponent;

    /**
     * Helper function to set up singleton components needed for full system operation
     */
    const setupSingletonComponents = () => {
        // Clear registry to ensure clean state
        GeographicalFeatureTypeRegistry.clear();
        
        // Create singleton components
        chronicleComponent = ChronicleComponent.create();
        timeComponent = TimeComponent.create(Time.create(1, 1, 1000));
        
        // Create galaxy map with planet, continent, and feature
        const featureType = GeographicalFeatureTypeRegistry.register('test_city', 'City');
        const feature = GeographicalFeature.create('Test City', featureType);
        const continent = Continent.create('Test Continent');
        continent.addFeature(feature);
        const planet = PlanetComponent.create(
            'test-planet-1',
            'Test Planet',
            'test-sector-1',
            'TestOwner',
            PlanetStatus.NORMAL,
            5,
            1,
            PlanetResourceSpecialization.AGRICULTURE,
            [continent]
        );
        galaxyMapComponent = GalaxyMapComponent.create();
        
        // Register the sector first (required before registering planet)
        const sector = Sector.create(planet.getSectorId(), 'Test Sector');
        galaxyMapComponent.addSector(sector);
        
        // Now register the planet
        galaxyMapComponent.registerPlanet(planet);

        // Create a Global entity with all singleton components
        globalEntity = entityManager.createEntity(chronicleComponent, timeComponent, galaxyMapComponent);
    };

    beforeEach(() => {
        entityManager = new EntityManager();
        system = new SelectChoiceSystem(entityManager);
        entity = entityManager.createEntity();
    });

    describe('constructor', () => {
        it('should create a system with correct required components', () => {
            expect(system.getRequiredComponents()).toEqual([ChoiceComponent, DataSetEventComponent]);
        });

        it('should throw error with invalid EntityManager', () => {
            expect(() => new SelectChoiceSystem(null)).toThrow('Expected instance of EntityManager');
        });
    });

    describe('processEntity', () => {
        it('should resolve dilemma by selecting a choice and updating DataSetEventComponent', () => {
            // Arrange
            const choice1 = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Choice One',
                'Event Consequence': 'Result of choice one'
            });

            const choice2 = new DataSetEvent({
                'Event Type': 'Economic',
                'Event Trigger': 'CHOICE_2',
                'Event Name': 'Choice Two',
                'Event Consequence': 'Result of choice two'
            });

            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const choiceComponent = ChoiceComponent.create([choice1, choice2]);
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should update DataSetEventComponent with one of the available choices
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            const validChoices = ['Choice One', 'Choice Two'];
            expect(validChoices).toContain(updatedDataSetEvent.getEventName());

            // Should clear ChoiceComponent choices but keep the component
            expect(entity.hasComponent(ChoiceComponent)).toBe(true);
            const resultChoiceComponent = entity.getComponent(ChoiceComponent);
            expect(resultChoiceComponent.getChoiceCount()).toBe(0);
            expect(entity.hasComponent(DataSetEventComponent)).toBe(true);
        });

        it('should skip entities without ChoiceComponent', () => {
            // Arrange
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);
            entity.addComponent(dataSetEventComponent);
            // No ChoiceComponent added

            // Act
            system.processEntity(entity);

            // Assert
            // DataSetEventComponent should remain unchanged
            const unchangedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(unchangedDataSetEvent.getEventName()).toBe('Initial Event');
            expect(unchangedDataSetEvent.getCause()).toBe('INITIAL_STATE');

            // No components should be removed
            expect(entity.hasComponent(DataSetEventComponent)).toBe(true);
        });

        it('should skip entities without DataSetEventComponent', () => {
            // Arrange
            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Choice One',
                'Event Consequence': 'Result of choice one'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            entity.addComponent(choiceComponent);
            // No DataSetEventComponent added

            // Act
            system.processEntity(entity);

            // Assert
            // ChoiceComponent should remain unchanged
            expect(entity.hasComponent(ChoiceComponent)).toBe(true);
            expect(choiceComponent.getChoices().length).toBe(1);
        });

        it('should remove ChoiceComponent when no choices are available', () => {
            // Arrange
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const choiceComponent = ChoiceComponent.create([]); // Empty choices
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should keep ChoiceComponent but it should still be empty
            expect(entity.hasComponent(ChoiceComponent)).toBe(true);
            const resultDilemmaComp = entity.getComponent(ChoiceComponent);
            expect(resultDilemmaComp.getChoiceCount()).toBe(0);
            
            // DataSetEventComponent should remain unchanged
            const unchangedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(unchangedDataSetEvent.getEventName()).toBe('Initial Event');
            expect(entity.hasComponent(DataSetEventComponent)).toBe(true);
        });

        it('should handle multiple choices correctly by selecting one of them', () => {
            // Arrange
            const choices = [];
            for (let i = 0; i < 5; i++) {
                choices.push(new DataSetEvent({
                    'Event Type': 'Political',
                    'Event Trigger': `CHOICE_${i}`,
                    'Event Name': `Choice ${i}`,
                    'Event Consequence': `Result of choice ${i}`
                }));
            }

            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const choiceComponent = ChoiceComponent.create(choices);
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should select one of the available choices
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            const validChoiceNames = ['Choice 0', 'Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'];
            expect(validChoiceNames).toContain(updatedDataSetEvent.getEventName());

            // Should clear ChoiceComponent choices but keep the component
            expect(entity.hasComponent(ChoiceComponent)).toBe(true);
            const finalChoiceComponent = entity.getComponent(ChoiceComponent);
            expect(finalChoiceComponent.getChoiceCount()).toBe(0);
        });

        it('should handle player entities differently - wait for GUI input', () => {
            // Arrange
            const choice1 = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Choice One',
                'Event Consequence': 'Result of choice one'
            });

            const choice2 = new DataSetEvent({
                'Event Type': 'Economic',
                'Event Trigger': 'CHOICE_2',
                'Event Name': 'Choice Two',
                'Event Consequence': 'Result of choice two'
            });

            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const choiceComponent = ChoiceComponent.create([choice1, choice2]);
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);
            const playerComponent = PlayerComponent.create();

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);
            entity.addComponent(playerComponent); // Make this a player entity

            // Act
            system.processEntity(entity);

            // Assert
            // Should NOT automatically select a choice - wait for GUI input
            const unchangedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(unchangedDataSetEvent.getEventName()).toBe('Initial Event');
            
            // Choices should remain available
            expect(choiceComponent.getChoiceCount()).toBe(2);
        });

        it('should process player choice when GUI has already made selection', () => {
            // Arrange
            const choice1 = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Choice One',
                'Event Consequence': 'Result of choice one'
            });

            const choice2 = new DataSetEvent({
                'Event Type': 'Economic',
                'Event Trigger': 'CHOICE_2',
                'Event Name': 'Choice Two',
                'Event Consequence': 'Result of choice two'
            });

            const choiceComponent = ChoiceComponent.create([choice1, choice2]);
            const dataSetEventComponent = DataSetEventComponent.create(choice1); // GUI has already selected choice1
            const playerComponent = PlayerComponent.create();

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);
            entity.addComponent(playerComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should clear choices since the choice has been made
            expect(choiceComponent.getChoiceCount()).toBe(0);
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Choice One');
        });

        it('should throw error for invalid entity', () => {
            expect(() => system.processEntity(null)).toThrow('Entity must be a valid Entity instance.');
            expect(() => system.processEntity({})).toThrow('Entity must be a valid Entity instance.');
        });
    });

    describe('update method', () => {
        it('should process all entities with required components', () => {
            // Arrange
            const entity1 = entityManager.createEntity();
            const entity2 = entityManager.createEntity();
            const entity3 = entityManager.createEntity(); // This one won't have required components

            const choice1 = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_A',
                'Event Name': 'Choice A',
                'Event Consequence': 'Result A'
            });

            const choice2 = new DataSetEvent({
                'Event Type': 'Economic',
                'Event Trigger': 'CHOICE_B',
                'Event Name': 'Choice B',
                'Event Consequence': 'Result B'
            });

            const initialEvent1 = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'STATE_1',
                'Event Name': 'State 1',
                'Event Consequence': 'Initial state 1'
            });

            const initialEvent2 = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'STATE_2',
                'Event Name': 'State 2',
                'Event Consequence': 'Initial state 2'
            });

            // Entity 1 with both required components
            entity1.addComponent(ChoiceComponent.create([choice1]));
            entity1.addComponent(DataSetEventComponent.create(initialEvent1));

            // Entity 2 with both required components
            entity2.addComponent(ChoiceComponent.create([choice2]));
            entity2.addComponent(DataSetEventComponent.create(initialEvent2));

            // Entity 3 with only one component (should be skipped)
            entity3.addComponent(DataSetEventComponent.create(initialEvent1));

            // Act
            system.update();

            // Assert
            // Entity 1 should be processed
            expect(entity1.hasComponent(ChoiceComponent)).toBe(true);
            const entity1ChoiceComponent = entity1.getComponent(ChoiceComponent);
            expect(entity1ChoiceComponent.getChoiceCount()).toBe(0);
            expect(entity1.getComponent(DataSetEventComponent).getDataSetEvent().getEventName()).toBe('Choice A');

            // Entity 2 should be processed
            expect(entity2.hasComponent(ChoiceComponent)).toBe(true);
            const entity2ChoiceComponent = entity2.getComponent(ChoiceComponent);
            expect(entity2ChoiceComponent.getChoiceCount()).toBe(0);
            expect(entity2.getComponent(DataSetEventComponent).getDataSetEvent().getEventName()).toBe('Choice B');

            // Entity 3 should not be processed (still has original state)
            expect(entity3.hasComponent(DataSetEventComponent)).toBe(true);
            expect(entity3.getComponent(DataSetEventComponent).getDataSetEvent().getEventName()).toBe('State 1');
        });
    });

    describe('makeChoice method', () => {
        it('should select from available choices randomly', () => {
            // Create multiple choices
            const choices = [];
            for (let i = 0; i < 10; i++) {
                choices.push(new DataSetEvent({
                    'Event Type': 'Political',
                    'Event Trigger': `CHOICE_${i}`,
                    'Event Name': `Choice ${i}`,
                    'Event Consequence': `Result ${i}`
                }));
            }

            const choiceComponent = ChoiceComponent.create(choices);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Run multiple times to verify randomness
            const selectedChoices = new Set();
            for (let i = 0; i < 50; i++) {
                // Reset the entity state
                choiceComponent.setChoices(choices);
                dataSetEventComponent.setDataSetEvent(initialEvent);
                
                system.processEntity(entity);
                
                const resultEvent = dataSetEventComponent.getDataSetEvent();
                selectedChoices.add(resultEvent.getEventName());
            }

            // Should have selected multiple different choices (very high probability)
            expect(selectedChoices.size).toBeGreaterThan(1);
        });

        it('should handle single choice deterministically', () => {
            // Create single choice
            const singleChoice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'ONLY_CHOICE',
                'Event Name': 'Only Choice',
                'Event Consequence': 'Only Result'
            });

            const choiceComponent = ChoiceComponent.create([singleChoice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Process multiple times
            for (let i = 0; i < 10; i++) {
                // Reset the entity state
                choiceComponent.setChoices([singleChoice]);
                dataSetEventComponent.setDataSetEvent(initialEvent);
                
                system.processEntity(entity);
                
                const resultEvent = dataSetEventComponent.getDataSetEvent();
                expect(resultEvent.getEventName()).toBe('Only Choice');
                expect(resultEvent.getCause()).toBe('ONLY_CHOICE');
                expect(resultEvent.getEventType()).toBe('Political');
            }
        });
    });

    describe('chronicle recording', () => {
        beforeEach(() => {
            setupSingletonComponents();
        });

        it('should record decision in chronicle when making a choice', () => {
            // Arrange
            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'POLITICAL_CHOICE',
                'Event Name': 'Form Alliance',
                'Event Consequence': 'Alliance formed',
                'Description': 'A political alliance has been established'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getHeading()).toBe('Decision made: Form Alliance');
            expect(recordedEvent.getEventType().getCategory()).toBe('Political');
            expect(recordedEvent.getEventType().getName()).toBe('Form Alliance');
            expect(recordedEvent.getDescription()).toBe('A political alliance has been established');
        });

        it('should record decision with historical figure when entity has HistoricalFigureComponent', () => {
            // Arrange
            const historicalFigureComponent = HistoricalFigureComponent.create('Julius Caesar', 50, 70, 'Roman', 'Emperor');
            
            const choice = new DataSetEvent({
                'Event Type': 'Military',
                'Event Trigger': 'MILITARY_CHOICE',
                'Event Name': 'Conquer Territory',
                'Event Consequence': 'Territory conquered',
                'Description': 'New lands have been claimed'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);
            entity.addComponent(historicalFigureComponent);

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getFigure()).toBe(historicalFigureComponent);
            expect(recordedEvent.getHeading()).toBe('Decision made: Conquer Territory');
            expect(recordedEvent.getEventType().getCategory()).toBe('Military');
        });

        it('should use unknown historical figure when entity has no HistoricalFigureComponent', () => {
            // Arrange
            const choice = new DataSetEvent({
                'Event Type': 'Economic',
                'Event Trigger': 'ECONOMIC_CHOICE',
                'Event Name': 'Trade Agreement',
                'Event Consequence': 'Trade established',
                'Description': 'A new trade route has been established'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);
            // Note: No HistoricalFigureComponent added

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getFigure()?.name).toBe('Unknown');
            expect(recordedEvent.getEventType().getCategory()).toBe('Economic');
        });

        it('should handle various event types correctly', () => {
            const eventTypes = [
                { type: 'Political', expectedCategory: 'Political' },
                { type: 'Military', expectedCategory: 'Military' },
                { type: 'Economic', expectedCategory: 'Economic' },
                { type: 'Social', expectedCategory: 'Social' },
                { type: 'Technological', expectedCategory: 'Technological' },
                { type: 'Cultural/Religious', expectedCategory: 'Cultural/Religious' },
                { type: 'Natural', expectedCategory: 'Natural' },
                { type: 'Mythical', expectedCategory: 'Mythical' },
                { type: 'InvalidType', expectedCategory: 'Social' } // Should fallback to Social
            ];

            eventTypes.forEach((testCase, index) => {
                // Create a new entity for each test case
                const testEntity = entityManager.createEntity();
                
                const choice = new DataSetEvent({
                    'Event Type': testCase.type,
                    'Event Trigger': `CHOICE_${index}`,
                    'Event Name': `Choice ${index}`,
                    'Event Consequence': `Result ${index}`,
                    'Description': `Description ${index}`
                });

                const choiceComponent = ChoiceComponent.create([choice]);
                const initialEvent = new DataSetEvent({
                    'Event Type': 'Social',
                    'Event Trigger': 'INITIAL',
                    'Event Name': 'Initial',
                    'Event Consequence': 'Initial state'
                });
                const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

                testEntity.addComponent(choiceComponent);
                testEntity.addComponent(dataSetEventComponent);

                // Act
                system.processEntity(testEntity);

                // Assert
                const recordedEvent = chronicleComponent.getEvents()[chronicleComponent.getEvents().length - 1];
                expect(recordedEvent.getEventType().getCategory()).toBe(testCase.expectedCategory);
            });
        });

        it('should not record chronicle events when required components are missing', () => {
            // Remove one of the singleton components
            const entitiesWithChronicle = entityManager.getEntitiesWithComponents(ChronicleComponent);
            if (entitiesWithChronicle.length > 0) {
                entitiesWithChronicle[0].removeComponent(ChronicleComponent);
            }

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'POLITICAL_CHOICE',
                'Event Name': 'Make Decision',
                'Event Consequence': 'Decision made'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act - should not throw error
            expect(() => system.processEntity(entity)).not.toThrow();

            // Assert - choice should still be processed but no chronicle event recorded
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Make Decision');
            expect(choiceComponent.getChoiceCount()).toBe(0);
        });

        it('should use correct place for decisions', () => {
            // Arrange
            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'POLITICAL_CHOICE',
                'Event Name': 'Important Decision',
                'Event Consequence': 'Decision consequence',
                'Description': 'A significant political decision'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getPlace()).toBeDefined();
            expect(recordedEvent.getPlace().getName()).toBeDefined();
            expect(typeof recordedEvent.getPlace().getName()).toBe('string');
        });
    });

    describe('error handling', () => {
        it('should handle entity with malformed DataSetEvent gracefully', () => {
            // Arrange
            const invalidDataSetEvent = new DataSetEvent({
                'Event Type': null, // Invalid type
                'Event Trigger': 'INVALID',
                'Event Name': 'Invalid Event',
                'Event Consequence': 'Invalid consequence'
            });

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'VALID_CHOICE',
                'Event Name': 'Valid Choice',
                'Event Consequence': 'Valid result'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const dataSetEventComponent = DataSetEventComponent.create(invalidDataSetEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act & Assert - should not throw
            expect(() => system.processEntity(entity)).not.toThrow();
            
            // Choice should still be processed
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Valid Choice');
        });
    });

    describe('Static Factory Method', () => {
        it('should create system instance via static factory method', () => {
            const createdSystem = SelectChoiceSystem.create(entityManager);
            expect(createdSystem).toBeInstanceOf(SelectChoiceSystem);
            expect(createdSystem.getEntityManager()).toBe(entityManager);
        });
    });

    describe('computeDecisionPlace with edge cases', () => {
        beforeEach(() => {
            setupSingletonComponents();
        });

        it('should fall back to default place when galaxy map is empty', () => {
            // Arrange - Create empty galaxy map
            galaxyMapComponent.reset();
            
            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence',
                'Description': 'Test description'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getPlace().getName()).toBe('The Council Chambers');
        });

        it('should fall back to default place when planet has no continents', () => {
            // Arrange - Create planet with no continents
            galaxyMapComponent.reset();
            const sector = Sector.create('test-sector', 'Test Sector');
            galaxyMapComponent.addSector(sector);
            
            const planetWithNoContinents = PlanetComponent.create(
                'empty-planet',
                'Empty Planet',
                'test-sector',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.MINING,
                [] // No continents
            );
            galaxyMapComponent.registerPlanet(planetWithNoContinents);

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence',
                'Description': 'Test description'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getPlace().getName()).toBe('The Council Chambers');
        });

        it('should fall back to planet name when continent has no features', () => {
            // Arrange - Create planet with continent but no features
            galaxyMapComponent.reset();
            const sector = Sector.create('test-sector', 'Test Sector');
            galaxyMapComponent.addSector(sector);
            
            const emptyContinent = Continent.create('Empty Continent');
            // Don't add any features to the continent
            
            const planetWithEmptyContinent = PlanetComponent.create(
                'sparse-planet',
                'Sparse Planet',
                'test-sector',
                'TestOwner',
                PlanetStatus.NORMAL,
                5,
                1,
                PlanetResourceSpecialization.TECHNOLOGY,
                [emptyContinent]
            );
            galaxyMapComponent.registerPlanet(planetWithEmptyContinent);

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence',
                'Description': 'Test description'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert - With the centralized implementation, it now uses planet name as fallback when no features are available
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getPlace().getName()).toBe('Sparse Planet');
        });

        it('should use feature location format when available', () => {
            // This test verifies the place format is "FeatureName, PlanetName"
            // Arrange is already done in setupSingletonComponents

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence',
                'Description': 'Test description'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            const recordedEvent = chronicleComponent.getEvents()[0];
            const placeName = recordedEvent.getPlace().getName();
            expect(placeName).toContain('Test City');
            expect(placeName).toContain('Test Planet');
            expect(placeName).toContain(', '); // Should follow format "Feature, Planet"
        });
    });

    describe('singleton component dependencies', () => {
        it('should handle missing TimeComponent gracefully', () => {
            // Arrange - Set up without TimeComponent
            chronicleComponent = ChronicleComponent.create();
            galaxyMapComponent = GalaxyMapComponent.create();
            const sector = Sector.create('test-sector', 'Test Sector');
            galaxyMapComponent.addSector(sector);
            
            globalEntity = entityManager.createEntity(chronicleComponent, galaxyMapComponent);
            // Note: No TimeComponent added

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act & Assert - should not throw, but choice should still be processed
            expect(() => system.processEntity(entity)).not.toThrow();
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Test Choice');
            expect(choiceComponent.getChoiceCount()).toBe(0);
            
            // No chronicle event should be recorded
            expect(chronicleComponent.getEvents().length).toBe(0);
        });

        it('should handle missing GalaxyMapComponent gracefully', () => {
            // Arrange - Set up without GalaxyMapComponent
            chronicleComponent = ChronicleComponent.create();
            timeComponent = TimeComponent.create(Time.create(1, 1, 1000));
            
            globalEntity = entityManager.createEntity(chronicleComponent, timeComponent);
            // Note: No GalaxyMapComponent added

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act & Assert - should not throw, but choice should still be processed
            expect(() => system.processEntity(entity)).not.toThrow();
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Test Choice');
            expect(choiceComponent.getChoiceCount()).toBe(0);
            
            // No chronicle event should be recorded
            expect(chronicleComponent.getEvents().length).toBe(0);
        });

        it('should work correctly when all singleton components are present', () => {
            // Arrange
            setupSingletonComponents();

            const choice = new DataSetEvent({
                'Event Type': 'Political',
                'Event Trigger': 'CHOICE_1',
                'Event Name': 'Test Choice',
                'Event Consequence': 'Test consequence',
                'Description': 'Test description'
            });

            const choiceComponent = ChoiceComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(choiceComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert - Everything should work
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Test Choice');
            expect(choiceComponent.getChoiceCount()).toBe(0);
            expect(chronicleComponent.getEvents().length).toBe(1);
            
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getHeading()).toBe('Decision made: Test Choice');
            expect(recordedEvent.getPlace()).toBeDefined();
            expect(recordedEvent.getTime()).toBeDefined();
        });
    });
});
