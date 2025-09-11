import { ComputeChoicesSystem } from '../../src/behaviour/ComputeChoicesSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetComponent } from '../../src/data/DataSetComponent';
import { ChoiceComponent } from '../../src/behaviour/ChoiceComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { System } from '../../src/ecs/System';

describe('ComputeChoicesSystem', () => {
  let entityManager;
  let computeChoicesSystem;
  let playerEntity;
  let currentEvent, choiceEvent1, choiceEvent2, unrelatedEvent;

  beforeEach(() => {
    entityManager = new EntityManager();
  computeChoicesSystem = ComputeChoicesSystem.create(entityManager);
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
      "Event Name": "Build Army",
      "Event Consequence": "ARMY_BUILT",
      "Heading": "Raise an Army",
      "Place": "Training Grounds",
      "Primary Actor": "You",
      "Secondary Actor": "Soldiers",
      "Motive": "Defense",
      "Description": "Build a strong military force",
      "Consequence": "ARMY_BUILT",
      "Tags": "military,strength"
    };

    const unrelatedEventData = {
      "Event Type": "Economic",
      "Event Trigger": "DIFFERENT_STATE",
      "Event Name": "Trade Agreement",
      "Event Consequence": "TRADE_FORMED",
      "Heading": "Sign Trade Deal",
      "Place": "Market Square",
      "Primary Actor": "You",
      "Secondary Actor": "Merchants",
      "Motive": "Prosperity",
      "Description": "Establish trade relations",
      "Consequence": "TRADE_FORMED",
      "Tags": "trade,economy"
    };

    // Create DataSetEvent instances
    currentEvent = new DataSetEvent(currentEventData);
    choiceEvent1 = new DataSetEvent(choiceEvent1Data);
    choiceEvent2 = new DataSetEvent(choiceEvent2Data);
    unrelatedEvent = new DataSetEvent(unrelatedEventData);

    // Set up the player entity with current event
    playerEntity.addComponent(DataSetEventComponent.create(currentEvent));

    // Create global DataSetComponent with choice events
    const globalDataSetEntity = entityManager.createEntity();
    const globalDataSetComponent = DataSetComponent.create([choiceEvent1, choiceEvent2, unrelatedEvent]);
    globalDataSetEntity.addComponent(globalDataSetComponent);
  });

  describe('Basic Functionality', () => {
    it('should create a ComputeChoicesSystem instance', () => {
      expect(computeChoicesSystem).toBeInstanceOf(ComputeChoicesSystem);
      expect(computeChoicesSystem).toBeInstanceOf(System);
    });

    it('should have correct required components', () => {
      expect(computeChoicesSystem.getRequiredComponents()).toEqual([DataSetEventComponent]);
    });

    it('should throw error for invalid entity parameter', () => {
      expect.assertions(4);
      expect(() => computeChoicesSystem.processEntity(null)).toThrow(TypeError);
      expect(() => computeChoicesSystem.processEntity(undefined)).toThrow(TypeError);
      expect(() => computeChoicesSystem.processEntity("not an entity")).toThrow(TypeError);
      expect(() => computeChoicesSystem.processEntity({})).toThrow(TypeError);
    });
  });

  describe('Choice Generation', () => {
    it('should generate choices when valid state exists', () => {
      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      // Check that ChoiceComponent was created with correct choices
      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeDefined();

      const choices = dilemmaComponent.getChoices();
      expect(choices).toHaveLength(2);
      expect(choices).toContain(choiceEvent1);
      expect(choices).toContain(choiceEvent2);
      expect(choices).not.toContain(unrelatedEvent);
    });

    it('should update existing ChoiceComponent with new choices', () => {
      // Add existing ChoiceComponent with some choices
      const existingChoiceComponent = ChoiceComponent.create([unrelatedEvent]);
      playerEntity.addComponent(existingChoiceComponent);

      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      // Check that the same ChoiceComponent was updated
      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBe(existingChoiceComponent);

      const choices = dilemmaComponent.getChoices();
      expect(choices).toHaveLength(2);
      expect(choices).toContain(choiceEvent1);
      expect(choices).toContain(choiceEvent2);
      expect(choices).not.toContain(unrelatedEvent);
    });

    it('should set empty choices when no valid choices exist', () => {
      // Change player state to something with no matching triggers
      const noChoiceEvent = new DataSetEvent({
        "Event Type": "Test",
        "Event Trigger": "Start",
        "Event Name": "No Choices Available",
        "Event Consequence": "NO_MATCHING_STATE",
        "Heading": "Dead End",
        "Place": "Nowhere",
        "Primary Actor": "Nobody",
        "Secondary Actor": "Nobody",
        "Motive": "Nothing",
        "Description": "This state has no choices",
        "Consequence": "NO_MATCHING_STATE",
        "Tags": "test"
      });

      playerEntity.removeComponent(DataSetEventComponent);
      playerEntity.addComponent(DataSetEventComponent.create(noChoiceEvent));

      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      // Check that ChoiceComponent was created with empty choices
      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeDefined();

      const choices = dilemmaComponent.getChoices();
      expect(choices).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle entity without DataSetEventComponent', () => {
      const entityWithoutComponent = entityManager.createEntity();

      // Should not throw error
      expect(() => {
        computeChoicesSystem.processEntity(entityWithoutComponent);
      }).not.toThrow();

      // Should not create ChoiceComponent
      const dilemmaComponent = entityWithoutComponent.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeUndefined();
    });

    it('should handle missing global DataSetComponent', () => {
      // Remove all entities to clear global DataSetComponent
      entityManager.clear();
      playerEntity = entityManager.createEntity();
      playerEntity.addComponent(DataSetEventComponent.create(currentEvent));

      // Should not throw error
      expect(() => {
        computeChoicesSystem.processEntity(playerEntity);
      }).not.toThrow();

      // Should not create ChoiceComponent
      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeUndefined();
    });

    it('should handle empty current state', () => {
      const emptyStateEvent = new DataSetEvent({
        "Event Type": "Test",
        "Event Trigger": "Start",
        "Event Name": "Empty State",
        "Event Consequence": "",
        "Heading": "Empty",
        "Place": "Nowhere",
        "Primary Actor": "Nobody",
        "Secondary Actor": "Nobody",
        "Motive": "Nothing",
        "Description": "This event has empty consequence",
        "Consequence": "",
        "Tags": "test"
      });

      playerEntity.removeComponent(DataSetEventComponent);
      playerEntity.addComponent(DataSetEventComponent.create(emptyStateEvent));

      // Should not throw error and should not create ChoiceComponent
      expect(() => {
        computeChoicesSystem.processEntity(playerEntity);
      }).not.toThrow();

      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeUndefined();
    });

    it('should handle whitespace-only current state', () => {
      const whitespaceStateEvent = new DataSetEvent({
        "Event Type": "Test",
        "Event Trigger": "Start",
        "Event Name": "Whitespace State",
        "Event Consequence": "   ",
        "Heading": "Whitespace",
        "Place": "Nowhere",
        "Primary Actor": "Nobody",
        "Secondary Actor": "Nobody",
        "Motive": "Nothing",
        "Description": "This event has whitespace-only consequence",
        "Consequence": "   ",
        "Tags": "test"
      });

      playerEntity.removeComponent(DataSetEventComponent);
      playerEntity.addComponent(DataSetEventComponent.create(whitespaceStateEvent));

      // Should not throw error and should not create ChoiceComponent
      expect(() => {
        computeChoicesSystem.processEntity(playerEntity);
      }).not.toThrow();

      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeUndefined();
    });
  });

  describe('Static Factory Method', () => {
    it('should create system instance via static factory method', () => {
      const createdSystem = ComputeChoicesSystem.create(entityManager);
      expect(createdSystem).toBeInstanceOf(ComputeChoicesSystem);
      expect(createdSystem.getEntityManager()).toBe(entityManager);
    });
  });

  describe('State Filtering Logic', () => {
    it('should match exact event trigger to current state', () => {
      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      const choices = dilemmaComponent.getChoices();

      // Verify that only events with matching triggers are included
      choices.forEach(choice => {
  expect(choice.getCause()).toBe(currentEvent.getEventConsequence());
      });
    });

    it('should handle case-sensitive state matching', () => {
      // Create event with different case in consequence
      const mixedCaseEvent = new DataSetEvent({
        "Event Type": "Test",
        "Event Trigger": "Start",
        "Event Name": "Mixed Case",
        "Event Consequence": "choice_state_1", // lowercase instead of CHOICE_STATE_1
        "Heading": "Mixed Case",
        "Place": "Nowhere",
        "Primary Actor": "Nobody",
        "Secondary Actor": "Nobody",
        "Motive": "Nothing",
        "Description": "This event has mixed case consequence",
        "Consequence": "choice_state_1",
        "Tags": "test"
      });

      playerEntity.removeComponent(DataSetEventComponent);
      playerEntity.addComponent(DataSetEventComponent.create(mixedCaseEvent));

      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      // Should not find matches due to case sensitivity
      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      expect(dilemmaComponent).toBeDefined();

      const choices = dilemmaComponent.getChoices();
      expect(choices).toHaveLength(0);
    });
  });

  describe('Multiple Choice Events', () => {
    it('should handle many choice events for same state', () => {
      // Create additional choice events for the same state
      const additionalChoices = [];
      for (let i = 0; i < 5; i++) {
        const eventData = {
          "Event Type": `Type${i}`,
          "Event Trigger": "CHOICE_STATE_1",
          "Event Name": `Choice ${i}`,
          "Event Consequence": `RESULT_${i}`,
          "Heading": `Option ${i}`,
          "Place": `Place ${i}`,
          "Primary Actor": "You",
          "Secondary Actor": `Actor ${i}`,
          "Motive": `Motive ${i}`,
          "Description": `Description for choice ${i}`,
          "Consequence": `RESULT_${i}`,
          "Tags": `tag${i}`
        };
        additionalChoices.push(new DataSetEvent(eventData));
      }

      // Update global DataSetComponent with additional choices
      const allEvents = [choiceEvent1, choiceEvent2, unrelatedEvent, ...additionalChoices];
  const globalDataSetEntity = entityManager.getEntitiesWithComponents(DataSetComponent)[0];
      globalDataSetEntity.removeComponent(DataSetComponent);
      globalDataSetEntity.addComponent(DataSetComponent.create(allEvents));

      // Process the player entity
      computeChoicesSystem.processEntity(playerEntity);

      const dilemmaComponent = playerEntity.getComponent(ChoiceComponent);
      const choices = dilemmaComponent.getChoices();

      // Should include original 2 choices plus 5 additional = 7 total
      expect(choices).toHaveLength(7);
      expect(choices).toContain(choiceEvent1);
      expect(choices).toContain(choiceEvent2);
      additionalChoices.forEach(choice => {
        expect(choices).toContain(choice);
      });
      expect(choices).not.toContain(unrelatedEvent);
    });
  });
});
