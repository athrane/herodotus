import { DilemmaResolutionSystem } from '../../src/behaviour/DilemmaResolutionSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { DilemmaComponent } from '../../src/behaviour/DilemmaComponent';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';

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
        it('should resolve dilemma by selecting first choice and updating DataSetEventComponent', () => {
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
            // Should update DataSetEventComponent with first choice
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(updatedDataSetEvent.getEventName()).toBe('Choice One');
            expect(updatedDataSetEvent.getEventTrigger()).toBe('CHOICE_1');
            expect(updatedDataSetEvent.getEventConsequence()).toBe('Result of choice one');

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

        it('should handle multiple choices correctly by selecting the first', () => {
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
            // Should select the first choice (index 0)
            const updatedDataSetEvent = dataSetEventComponent.getDataSetEvent();
            expect(updatedDataSetEvent.getEventName()).toBe('Choice 0');
            expect(updatedDataSetEvent.getEventTrigger()).toBe('CHOICE_0');
            expect(updatedDataSetEvent.getEventConsequence()).toBe('Result of choice 0');

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
});
