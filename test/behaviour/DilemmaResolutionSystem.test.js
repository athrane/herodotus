import { DilemmaResolutionSystem } from '../../src/behaviour/DilemmaResolutionSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { DilemmaComponent } from '../../src/behaviour/DilemmaComponent';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { ChronicleComponent } from '../../src/chronicle/ChronicleComponent';
import { TimeComponent } from '../../src/time/TimeComponent';
import { WorldComponent } from '../../src/geography/WorldComponent';
import { Time } from '../../src/time/Time';
import { World } from '../../src/geography/World';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';
import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure';

describe('DilemmaResolutionSystem', () => {
    let entityManager;
    let system;
    let entity;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = new DilemmaResolutionSystem(entityManager);
        entity = entityManager.createEntity();
    });

    describe('constructor', () => {
        it('should create a system with correct required components', () => {
            expect(system.getRequiredComponents()).toEqual([DilemmaComponent, DataSetEventComponent]);
        });

        it('should throw error with invalid EntityManager', () => {
            expect(() => new DilemmaResolutionSystem(null)).toThrow('Expected instance of EntityManager');
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

            const dilemmaComponent = DilemmaComponent.create([choice1, choice2]);
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should update DataSetEventComponent with one of the available choices
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            const validChoices = ['Choice One', 'Choice Two'];
            expect(validChoices).toContain(updatedDataSetEvent.getEventName());

            // Should clear DilemmaComponent choices but keep the component
            expect(entity.hasComponent(DilemmaComponent)).toBe(true);
            const resultDilemmaComponent = entity.getComponent(DilemmaComponent);
            expect(resultDilemmaComponent.getChoiceCount()).toBe(0);
            expect(entity.hasComponent(DataSetEventComponent)).toBe(true);
        });

        it('should skip entities without DilemmaComponent', () => {
            // Arrange
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);
            entity.addComponent(dataSetEventComponent);
            // No DilemmaComponent added

            // Act
            system.processEntity(entity);

            // Assert
            // DataSetEventComponent should remain unchanged
            const unchangedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(unchangedDataSetEvent.getEventName()).toBe('Initial Event');
            expect(unchangedDataSetEvent.getEventTrigger()).toBe('INITIAL_STATE');

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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            entity.addComponent(dilemmaComponent);
            // No DataSetEventComponent added

            // Act
            system.processEntity(entity);

            // Assert
            // DilemmaComponent should remain unchanged
            expect(entity.hasComponent(DilemmaComponent)).toBe(true);
            expect(dilemmaComponent.getChoices().length).toBe(1);
        });

        it('should remove DilemmaComponent when no choices are available', () => {
            // Arrange
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL_STATE',
                'Event Name': 'Initial Event',
                'Event Consequence': 'Starting state'
            });

            const dilemmaComponent = DilemmaComponent.create([]); // Empty choices
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should keep DilemmaComponent but it should still be empty
            expect(entity.hasComponent(DilemmaComponent)).toBe(true);
            const resultDilemmaComp = entity.getComponent(DilemmaComponent);
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

            const dilemmaComponent = DilemmaComponent.create(choices);
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Act
            system.processEntity(entity);

            // Assert
            // Should select one of the available choices
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            const validChoiceNames = ['Choice 0', 'Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'];
            expect(validChoiceNames).toContain(updatedDataSetEvent.getEventName());

            // Should clear DilemmaComponent choices but keep the component
            expect(entity.hasComponent(DilemmaComponent)).toBe(true);
            const finalDilemmaComponent = entity.getComponent(DilemmaComponent);
            expect(finalDilemmaComponent.getChoiceCount()).toBe(0);
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
            entity1.addComponent(DilemmaComponent.create([choice1]));
            entity1.addComponent(DataSetEventComponent.create(initialEvent1));

            // Entity 2 with both required components
            entity2.addComponent(DilemmaComponent.create([choice2]));
            entity2.addComponent(DataSetEventComponent.create(initialEvent2));

            // Entity 3 with only one component (should be skipped)
            entity3.addComponent(DataSetEventComponent.create(initialEvent1));

            // Act
            system.update();

            // Assert
            // Entity 1 should be processed
            expect(entity1.hasComponent(DilemmaComponent)).toBe(true);
            const entity1DilemmaComponent = entity1.getComponent(DilemmaComponent);
            expect(entity1DilemmaComponent.getChoiceCount()).toBe(0);
            expect(entity1.getComponent(DataSetEventComponent).getDataSetEvent().getEventName()).toBe('Choice A');

            // Entity 2 should be processed
            expect(entity2.hasComponent(DilemmaComponent)).toBe(true);
            const entity2DilemmaComponent = entity2.getComponent(DilemmaComponent);
            expect(entity2DilemmaComponent.getChoiceCount()).toBe(0);
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

            const dilemmaComponent = DilemmaComponent.create(choices);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Run multiple times to verify randomness
            const selectedChoices = new Set();
            for (let i = 0; i < 50; i++) {
                // Reset the entity state
                dilemmaComponent.setChoices(choices);
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

            const dilemmaComponent = DilemmaComponent.create([singleChoice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Process multiple times
            for (let i = 0; i < 10; i++) {
                // Reset the entity state
                dilemmaComponent.setChoices([singleChoice]);
                dataSetEventComponent.setDataSetEvent(initialEvent);
                
                system.processEntity(entity);
                
                const resultEvent = dataSetEventComponent.getDataSetEvent();
                expect(resultEvent.getEventName()).toBe('Only Choice');
                expect(resultEvent.getEventTrigger()).toBe('ONLY_CHOICE');
                expect(resultEvent.getEventType()).toBe('Political');
            }
        });
    });

    describe('chronicle recording', () => {
        let chronicleComponent;
        let timeComponent;
        let worldComponent;

        beforeEach(() => {
            // Create and add singleton components for chronicle recording
            chronicleComponent = ChronicleComponent.create();
            timeComponent = TimeComponent.create(Time.create(1, 1, 1000));
            worldComponent = new WorldComponent(World.create('Test World'));

            // Create entities with singleton components
            entityManager.createEntity(chronicleComponent);
            entityManager.createEntity(timeComponent);
            entityManager.createEntity(worldComponent);
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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
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
            const historicalFigure = HistoricalFigure.create('Julius Caesar', 50, 70, 'Roman', 'Emperor');
            const historicalFigureComponent = HistoricalFigureComponent.fromHistoricalFigure(historicalFigure);
            
            const choice = new DataSetEvent({
                'Event Type': 'Military',
                'Event Trigger': 'MILITARY_CHOICE',
                'Event Name': 'Conquer Territory',
                'Event Consequence': 'Territory conquered',
                'Description': 'New lands have been claimed'
            });

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);
            entity.addComponent(historicalFigureComponent);

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getFigure()).toBe(historicalFigure);
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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);
            // Note: No HistoricalFigureComponent added

            // Act
            system.processEntity(entity);

            // Assert
            expect(chronicleComponent.getEvents().length).toBe(1);
            const recordedEvent = chronicleComponent.getEvents()[0];
            expect(recordedEvent.getFigure().getName()).toBe('Unknown');
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

                const dilemmaComponent = DilemmaComponent.create([choice]);
                const initialEvent = new DataSetEvent({
                    'Event Type': 'Social',
                    'Event Trigger': 'INITIAL',
                    'Event Name': 'Initial',
                    'Event Consequence': 'Initial state'
                });
                const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

                testEntity.addComponent(dilemmaComponent);
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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Act - should not throw error
            expect(() => system.processEntity(entity)).not.toThrow();

            // Assert - choice should still be processed but no chronicle event recorded
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Make Decision');
            expect(dilemmaComponent.getChoiceCount()).toBe(0);
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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const initialEvent = new DataSetEvent({
                'Event Type': 'Social',
                'Event Trigger': 'INITIAL',
                'Event Name': 'Initial',
                'Event Consequence': 'Initial state'
            });
            const dataSetEventComponent = DataSetEventComponent.create(initialEvent);

            entity.addComponent(dilemmaComponent);
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

            const dilemmaComponent = DilemmaComponent.create([choice]);
            const dataSetEventComponent = DataSetEventComponent.create(invalidDataSetEvent);

            entity.addComponent(dilemmaComponent);
            entity.addComponent(dataSetEventComponent);

            // Act & Assert - should not throw
            expect(() => system.processEntity(entity)).not.toThrow();
            
            // Choice should still be processed
            expect(dataSetEventComponent.getDataSetEvent().getEventName()).toBe('Valid Choice');
        });
    });
});
