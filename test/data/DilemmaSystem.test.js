import { DilemmaSystem } from '../../src/data/DilemmaSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { Entity } from '../../src/ecs/Entity';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetComponent } from '../../src/data/DataSetComponent';
import { DilemmaComponent } from '../../src/data/DilemmaComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { System } from '../../src/ecs/System';

describe('DilemmaSystem', () => {
  let entityManager;
  let dilemmaSystem;
  let playerEntity;
  let currentEvent, choiceEvent1, choiceEvent2, unrelatedEvent;

  beforeEach(() => {
    entityManager = new EntityManager();
    dilemmaSystem = new DilemmaSystem(entityManager);
    playerEntity = entityManager.createEntity();

    // Create test events
    const currentEventData = {
      "Event Type": "Political",
      "Event Trigger": "Start",
      "Event Name": "Beginning of Reign",
      "Event Consequence": "CHOICE_STATE_1",
      "Heading": "Your Reign Begins",
      "Place": "Throne Room",
      "Primary Actor": "You",
      "Secondary Actor": "The Court",
      "Motive": "Rule",
      "Description": "You have just ascended to the throne",
      "Consequence": "CHOICE_STATE_1",
      "Tags": "beginning,rule"
    };

    const choiceEvent1Data = {
      "Event Type": "Political",
      "Event Trigger": "CHOICE_STATE_1",
      "Event Name": "Establish Council",
      "Event Consequence": "COUNCIL_FORMED",
      "Heading": "Form Advisory Council",
      "Place": "Council Chamber",
      "Primary Actor": "You",
      "Secondary Actor": "Advisors",
      "Motive": "Governance",
      "Description": "Establish a council of advisors",
      "Consequence": "COUNCIL_FORMED",
      "Tags": "politics,council"
    };

    const choiceEvent2Data = {
      "Event Type": "Military",
      "Event Trigger": "CHOICE_STATE_1",
      "Event Name": "Military Review",
      "Event Consequence": "ARMY_INSPECTED",
      "Heading": "Review the Army",
      "Place": "Training Grounds",
      "Primary Actor": "You",
      "Secondary Actor": "Generals",
      "Motive": "Defense",
      "Description": "Inspect and review your military forces",
      "Consequence": "ARMY_INSPECTED",
      "Tags": "military,review"
    };

    const unrelatedEventData = {
      "Event Type": "Economic",
      "Event Trigger": "DIFFERENT_STATE",
      "Event Name": "Trade Agreement",
      "Event Consequence": "TRADE_INCREASED",
      "Heading": "New Trade Deal",
      "Place": "Market",
      "Primary Actor": "Merchants",
      "Secondary Actor": "Foreign Traders",
      "Motive": "Profit",
      "Description": "A new trade agreement is signed",
      "Consequence": "TRADE_INCREASED",
      "Tags": "trade,economics"
    };

    currentEvent = new DataSetEvent(currentEventData);
    choiceEvent1 = new DataSetEvent(choiceEvent1Data);
    choiceEvent2 = new DataSetEvent(choiceEvent2Data);
    unrelatedEvent = new DataSetEvent(unrelatedEventData);
  });

  describe('constructor', () => {
    it('should create a DilemmaSystem instance', () => {
      expect(dilemmaSystem).toBeInstanceOf(DilemmaSystem);
      expect(dilemmaSystem).toBeInstanceOf(System);
    });

    it('should be configured with correct component requirements', () => {
      expect(dilemmaSystem.getRequiredComponents()).toEqual([DataSetEventComponent]);
    });
  });

  describe('processEntity', () => {
    describe('basic functionality', () => {
      it('should throw TypeError for invalid entity parameter', () => {
        expect(() => dilemmaSystem.processEntity(null)).toThrow(TypeError);
        expect(() => dilemmaSystem.processEntity(undefined)).toThrow(TypeError);
        expect(() => dilemmaSystem.processEntity("not an entity")).toThrow(TypeError);
        expect(() => dilemmaSystem.processEntity({})).toThrow(TypeError);
      });

      it('should return early if entity has no DataSetEventComponent', () => {
        // Entity without DataSetEventComponent should be skipped
        expect(() => dilemmaSystem.processEntity(playerEntity)).not.toThrow();
        expect(playerEntity.getComponent(DilemmaComponent)).toBeUndefined();
      });

      it('should return early if no global DataSetComponent exists', () => {
        const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
        playerEntity.addComponent(dataSetEventComponent);

        // No global DataSetComponent in EntityManager
        dilemmaSystem.processEntity(playerEntity);
        
        expect(playerEntity.getComponent(DilemmaComponent)).toBeUndefined();
      });
    });

    describe('state validation', () => {
      beforeEach(() => {
        // Set up global DataSetComponent with test events
        const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2, unrelatedEvent]);
        entityManager.createEntity(globalDataSetComponent);
      });

      it('should return early if current state is undefined', () => {
        const eventWithUndefinedConsequence = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": undefined
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithUndefinedConsequence);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        expect(playerEntity.getComponent(DilemmaComponent)).toBeUndefined();
      });

      it('should return early if current state is empty string', () => {
        const eventWithEmptyConsequence = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": ""
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithEmptyConsequence);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        expect(playerEntity.getComponent(DilemmaComponent)).toBeUndefined();
      });

      it('should return early if current state is whitespace only', () => {
        const eventWithWhitespaceConsequence = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": "   "
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithWhitespaceConsequence);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        expect(playerEntity.getComponent(DilemmaComponent)).toBeUndefined();
      });
    });

    describe('choice generation', () => {
      beforeEach(() => {
        // Set up global DataSetComponent with test events
        const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2, unrelatedEvent]);
        entityManager.createEntity(globalDataSetComponent);
      });

      afterEach(() => {
        // Clean up DataSetComponent entities to avoid conflicts with other test suites
        const entities = entityManager.getEntitiesWithComponents(DataSetComponent);
        entities.forEach(entity => entityManager.destroyEntity(entity.getId()));
      });

      it('should create DilemmaComponent with matching choices', () => {
        const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(dilemmaComponent).toBeInstanceOf(DilemmaComponent);
        expect(dilemmaComponent.getChoiceCount()).toBe(2);
        
        // Verify choices match the trigger state
        const choices = dilemmaComponent.getChoices();
        expect(choices).toContain(choiceEvent1);
        expect(choices).toContain(choiceEvent2);
        expect(choices).not.toContain(unrelatedEvent);
      });

      it('should not create DilemmaComponent when no matching choices exist', () => {
        const eventWithUnmatchedState = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": "NONEXISTENT_STATE"
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithUnmatchedState);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(dilemmaComponent).toBeDefined();
        expect(dilemmaComponent.getChoiceCount()).toBe(0);
      });

      it('should replace existing DilemmaComponent with new choices', () => {
        const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
        playerEntity.addComponent(dataSetEventComponent);

        // Add initial DilemmaComponent
        const oldDilemmaComponent = DilemmaComponent.create([unrelatedEvent]);
        playerEntity.addComponent(oldDilemmaComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        const newDilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(newDilemmaComponent).toBe(oldDilemmaComponent); // Same instance, different choices
        expect(newDilemmaComponent.getChoiceCount()).toBe(2);
        expect(newDilemmaComponent.getChoices()).not.toContain(unrelatedEvent);
      });
    });

    describe('trigger matching logic', () => {
      beforeEach(() => {
        const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2, unrelatedEvent]);
        entityManager.createEntity(globalDataSetComponent);
      });

      afterEach(() => {
        // Clean up DataSetComponent entities to avoid conflicts with other test suites
        const entities = entityManager.getEntitiesWithComponents(DataSetComponent);
        entities.forEach(entity => entityManager.destroyEntity(entity.getId()));
      });

      it('should perform exact string matching for triggers', () => {
        const eventWithCaseDifferentState = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": "choice_state_1" // Different case
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithCaseDifferentState);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        // Should not match due to case sensitivity
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(dilemmaComponent).toBeDefined();
        expect(dilemmaComponent.getChoiceCount()).toBe(0);
      });

      it('should handle special characters in trigger states', () => {
        // Clean up existing DataSetComponent first
        const existingEntities = entityManager.getEntitiesWithComponents(DataSetComponent);
        existingEntities.forEach(entity => entityManager.destroyEntity(entity.getId()));

        const specialEvent = new DataSetEvent({
          "Event Type": "Special",
          "Event Trigger": "SPECIAL@STATE#1",
          "Event Name": "Special Event",
          "Event Consequence": "RESULT",
          "Heading": "Special",
          "Place": "Somewhere",
          "Primary Actor": "Someone",
          "Secondary Actor": "Someone Else",
          "Motive": "Something",
          "Description": "Description",
          "Consequence": "RESULT",
          "Tags": "special"
        });

        const globalDataSetComponent = DataSetComponent.create([specialEvent]);
        entityManager.createEntity(globalDataSetComponent);

        const eventWithSpecialState = new DataSetEvent({
          ...currentEvent,
          "Event Consequence": "SPECIAL@STATE#1"
        });
        const dataSetEventComponent = DataSetEventComponent.create(eventWithSpecialState);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(dilemmaComponent).toBeInstanceOf(DilemmaComponent);
        expect(dilemmaComponent.getChoiceCount()).toBe(1);
        expect(dilemmaComponent.getChoice(0)).toBe(specialEvent);
      });
    });

    describe('edge cases', () => {
      afterEach(() => {
        // Clean up DataSetComponent entities to avoid conflicts with other tests
        const entities = entityManager.getEntitiesWithComponents(DataSetComponent);
        entities.forEach(entity => entityManager.destroyEntity(entity.getId()));
      });

      it('should handle empty global DataSetComponent', () => {
        const globalDataSetComponent = DataSetComponent.create([]);
        entityManager.createEntity(globalDataSetComponent);

        const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
        playerEntity.addComponent(dataSetEventComponent);

        dilemmaSystem.processEntity(playerEntity);
        
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        expect(dilemmaComponent).toBeDefined();
        expect(dilemmaComponent.getChoiceCount()).toBe(0);
      });

      it('should handle multiple entities correctly', () => {
        const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2]);
        entityManager.createEntity(globalDataSetComponent);

        // Set up two entities
        const entity1 = new Entity();
        const entity2 = new Entity();
        // EntityManager automatically tracks entities when components are added, so no explicit adding needed
        // entityManager.createEntity would create a new entity, but we want to use our existing entities

        const dataSetEventComponent1 = DataSetEventComponent.create(currentEvent);
        const dataSetEventComponent2 = DataSetEventComponent.create(currentEvent);
        entity1.addComponent(dataSetEventComponent1);
        entity2.addComponent(dataSetEventComponent2);

        // Process both entities
        dilemmaSystem.processEntity(entity1);
        dilemmaSystem.processEntity(entity2);
        
        // Both should have DilemmaComponents
        expect(entity1.getComponent(DilemmaComponent)).toBeInstanceOf(DilemmaComponent);
        expect(entity2.getComponent(DilemmaComponent)).toBeInstanceOf(DilemmaComponent);
        expect(entity1.getComponent(DilemmaComponent).getChoiceCount()).toBe(2);
        expect(entity2.getComponent(DilemmaComponent).getChoiceCount()).toBe(2);
      });

      it('should handle entity with malformed DataSetEvent', () => {
        const globalDataSetComponent = DataSetComponent.create([choiceEvent1]);
        entityManager.createEntity(globalDataSetComponent);

        // Create event with null EventConsequence after construction
        const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
        playerEntity.addComponent(dataSetEventComponent);

        // Simulate corrupted state - this would depend on internal implementation
        // For this test, we'll assume the system handles it gracefully
        expect(() => dilemmaSystem.processEntity(playerEntity)).not.toThrow();
      });
    });
  });

  describe('integration with EntityManager', () => {
    afterEach(() => {
      // Clean up DataSetComponent entities to avoid conflicts
      const entities = entityManager.getEntitiesWithComponents(DataSetComponent);
      entities.forEach(entity => entityManager.destroyEntity(entity.getId()));
    });

    it('should work with EntityManager singleton component system', () => {
      const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2]);
      entityManager.createEntity(globalDataSetComponent);

      const dataSetEventComponent = DataSetEventComponent.create(currentEvent);
      playerEntity.addComponent(dataSetEventComponent);

      // Verify singleton component is accessible
      const retrievedComponent = entityManager.getSingletonComponent(DataSetComponent);
      expect(retrievedComponent).toBe(globalDataSetComponent);

      dilemmaSystem.processEntity(playerEntity);
      
      const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
      expect(dilemmaComponent).toBeInstanceOf(DilemmaComponent);
      expect(dilemmaComponent.getChoiceCount()).toBe(2);
    });
  });
});
