import { DilemmaComponent } from '../../src/behaviour/DilemmaComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { Component } from '../../src/ecs/Component';

describe('DilemmaComponent', () => {
  let sampleEventData1, sampleEventData2, sampleEventData3;
  let dataSetEvent1, dataSetEvent2, dataSetEvent3;
  let choices;

  beforeEach(() => {
    // Create sample event data for testing
    sampleEventData1 = {
      "Event Type": "Political",
      "Event Trigger": "Election",
      "Event Name": "Royal Election",
      "Event Consequence": "New ruler appointed",
      "Heading": "A New Era Begins",
      "Place": "Capital City",
      "Primary Actor": "Prince Alexander",
      "Secondary Actor": "The Council",
      "Motive": "Succession",
      "Description": "The prince was elected as the new ruler",
      "Consequence": "Political stability restored",
      "Tags": "politics,succession,election"
    };

    sampleEventData2 = {
      "Event Type": "Military",
      "Event Trigger": "War",
      "Event Name": "Border Conflict",
      "Event Consequence": "Territory gained",
      "Heading": "Victory at the Border",
      "Place": "Northern Border",
      "Primary Actor": "General Marcus",
      "Secondary Actor": "Enemy Forces",
      "Motive": "Expansion",
      "Description": "A decisive victory secured new territory",
      "Consequence": "Military strength increased",
      "Tags": "military,war,expansion"
    };

    sampleEventData3 = {
      "Event Type": "Economic",
      "Event Trigger": "Trade",
      "Event Name": "Merchant Alliance",
      "Event Consequence": "Wealth increased",
      "Heading": "Prosperous Trade Deal",
      "Place": "Market Square",
      "Primary Actor": "Merchant Guild",
      "Secondary Actor": "Foreign Traders",
      "Motive": "Profit",
      "Description": "A lucrative trade agreement was signed",
      "Consequence": "Economic prosperity",
      "Tags": "trade,economics,wealth"
    };

    dataSetEvent1 = new DataSetEvent(sampleEventData1);
    dataSetEvent2 = new DataSetEvent(sampleEventData2);
    dataSetEvent3 = new DataSetEvent(sampleEventData3);
    choices = [dataSetEvent1, dataSetEvent2, dataSetEvent3];
  });

  describe('constructor', () => {
    it('should create a DilemmaComponent instance with valid choices', () => {
      const component = new DilemmaComponent(choices);
      
      expect(component).toBeInstanceOf(DilemmaComponent);
      expect(component).toBeInstanceOf(Component);
      expect(component.getChoiceCount()).toBe(3);
    });

    it('should create a DilemmaComponent with empty choices array', () => {
      const component = new DilemmaComponent([]);
      
      expect(component).toBeInstanceOf(DilemmaComponent);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should protect internal state from external modification', () => {
      const component = new DilemmaComponent(choices);
      const retrievedChoices = component.getChoices();
      
      // Modifying the returned array should not affect the component's internal state
      retrievedChoices.push(dataSetEvent1);
      
      // Component should still have original number of choices
      expect(component.getChoiceCount()).toBe(3);
      expect(component.getChoices().length).toBe(3);
    });

    it('should create a copy of the input array to prevent external modifications', () => {
      const originalChoices = [...choices];
      const component = new DilemmaComponent(choices);
      
      // Modify the original array
      choices.push(dataSetEvent1);
      
      // Component should be unaffected
      expect(component.getChoiceCount()).toBe(3);
      expect(component.getChoices()).toEqual(originalChoices);
    });

    it('should throw TypeError when choices is not an array', () => {
      expect(() => new DilemmaComponent(null)).toThrow(TypeError);
      expect(() => new DilemmaComponent(undefined)).toThrow(TypeError);
      expect(() => new DilemmaComponent("not an array")).toThrow(TypeError);
      expect(() => new DilemmaComponent(123)).toThrow(TypeError);
      expect(() => new DilemmaComponent({})).toThrow(TypeError);
    });

    it('should throw TypeError when array contains non-DataSetEvent items', () => {
      expect(() => new DilemmaComponent([dataSetEvent1, null])).toThrow(TypeError);
      expect(() => new DilemmaComponent([dataSetEvent1, "invalid"])).toThrow(TypeError);
      expect(() => new DilemmaComponent([dataSetEvent1, {}])).toThrow(TypeError);
      expect(() => new DilemmaComponent([dataSetEvent1, 123])).toThrow(TypeError);
    });
  });

  describe('getChoices', () => {
    it('should return all choices as a readonly array', () => {
      const component = new DilemmaComponent(choices);
      const retrievedChoices = component.getChoices();
      
      expect(retrievedChoices).toHaveLength(3);
      expect(retrievedChoices[0]).toBe(dataSetEvent1);
      expect(retrievedChoices[1]).toBe(dataSetEvent2);
      expect(retrievedChoices[2]).toBe(dataSetEvent3);
    });

    it('should return empty array when no choices available', () => {
      const component = new DilemmaComponent([]);
      const retrievedChoices = component.getChoices();
      
      expect(retrievedChoices).toHaveLength(0);
      expect(Array.isArray(retrievedChoices)).toBe(true);
    });

    it('should return a new array on each call to prevent external modifications', () => {
      const component = new DilemmaComponent(choices);
      const choices1 = component.getChoices();
      const choices2 = component.getChoices();
      
      // Should return different references (defensive copies)
      expect(choices1).not.toBe(choices2);
      // But with the same content
      expect(choices1).toEqual(choices2);
    });
  });

  describe('getChoiceCount', () => {
    it('should return correct count for multiple choices', () => {
      const component = new DilemmaComponent(choices);
      expect(component.getChoiceCount()).toBe(3);
    });

    it('should return 0 for empty choices', () => {
      const component = new DilemmaComponent([]);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should return 1 for single choice', () => {
      const component = new DilemmaComponent([dataSetEvent1]);
      expect(component.getChoiceCount()).toBe(1);
    });
  });

  describe('getChoice', () => {
    it('should return correct choice by valid index', () => {
      const component = new DilemmaComponent(choices);
      
      expect(component.getChoice(0)).toBe(dataSetEvent1);
      expect(component.getChoice(1)).toBe(dataSetEvent2);
      expect(component.getChoice(2)).toBe(dataSetEvent3);
    });

    it('should return undefined for out-of-bounds indices', () => {
      const component = new DilemmaComponent(choices);
      
      expect(component.getChoice(-1)).toBeUndefined();
      expect(component.getChoice(3)).toBeUndefined();
      expect(component.getChoice(100)).toBeUndefined();
    });

    it('should return undefined for empty choices array', () => {
      const component = new DilemmaComponent([]);
      
      expect(component.getChoice(0)).toBeUndefined();
      expect(component.getChoice(1)).toBeUndefined();
    });

    it('should throw TypeError when index is not a number', () => {
      const component = new DilemmaComponent(choices);
      
      expect(() => component.getChoice("0")).toThrow(TypeError);
      expect(() => component.getChoice(null)).toThrow(TypeError);
      expect(() => component.getChoice(undefined)).toThrow(TypeError);
      expect(() => component.getChoice({})).toThrow(TypeError);
      expect(() => component.getChoice([])).toThrow(TypeError);
    });
  });

  describe('static create method', () => {
    it('should create DilemmaComponent instance via factory method', () => {
      const component = DilemmaComponent.create(choices);
      
      expect(component).toBeInstanceOf(DilemmaComponent);
      expect(component.getChoiceCount()).toBe(3);
      expect(component.getChoice(0)).toBe(dataSetEvent1);
    });

    it('should create empty DilemmaComponent via factory method', () => {
      const component = DilemmaComponent.create([]);
      
      expect(component).toBeInstanceOf(DilemmaComponent);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should throw TypeError for invalid input via factory method', () => {
      expect(() => DilemmaComponent.create(null)).toThrow(TypeError);
      expect(() => DilemmaComponent.create([dataSetEvent1, "invalid"])).toThrow(TypeError);
    });
  });

  describe('integration with DataSetEvent properties', () => {
    it('should preserve all DataSetEvent properties in choices', () => {
      const component = new DilemmaComponent([dataSetEvent1]);
      const retrievedChoice = component.getChoice(0);
      
      expect(retrievedChoice.getEventType()).toBe("Political");
  expect(retrievedChoice.getCause()).toBe("Election");
      expect(retrievedChoice.getEventName()).toBe("Royal Election");
      expect(retrievedChoice.getEventConsequence()).toBe("New ruler appointed");
      expect(retrievedChoice.getHeading()).toBe("A New Era Begins");
      expect(retrievedChoice.getPlace()).toBe("Capital City");
      expect(retrievedChoice.getPrimaryActor()).toBe("Prince Alexander");
      expect(retrievedChoice.getSecondaryActor()).toBe("The Council");
      expect(retrievedChoice.getMotive()).toBe("Succession");
      expect(retrievedChoice.getDescription()).toBe("The prince was elected as the new ruler");
      expect(retrievedChoice.getTags()).toBe("politics,succession,election");
    });

    it('should handle different event types correctly', () => {
      const component = new DilemmaComponent(choices);
      
      expect(component.getChoice(0).getEventType()).toBe("Political");
      expect(component.getChoice(1).getEventType()).toBe("Military");
      expect(component.getChoice(2).getEventType()).toBe("Economic");
    });
  });

  describe('setChoices', () => {
    it('should replace existing choices with new ones', () => {
      const component = new DilemmaComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      const newChoices = [dataSetEvent3];
      component.setChoices(newChoices);

      expect(component.getChoiceCount()).toBe(1);
      expect(component.getChoice(0).getEventType()).toBe("Economic");
    });

    it('should validate that new choices are DataSetEvent instances', () => {
      const component = new DilemmaComponent(choices);
      
      expect(() => {
        component.setChoices([{}]);
      }).toThrow('All choices must be DataSetEvent instances.');
    });

    it('should validate that input is an array', () => {
      const component = new DilemmaComponent(choices);
      
      expect(() => {
        component.setChoices(null);
      }).toThrow('newChoices must be an array.');
    });

    it('should allow setting empty choices array', () => {
      const component = new DilemmaComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      component.setChoices([]);
      expect(component.getChoiceCount()).toBe(0);
    });
  });

  describe('clearChoices', () => {
    it('should clear all choices', () => {
      const component = new DilemmaComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      component.clearChoices();
      expect(component.getChoiceCount()).toBe(0);
      expect(component.getChoices()).toEqual([]);
    });

    it('should work correctly when already empty', () => {
      const component = new DilemmaComponent([]);
      expect(component.getChoiceCount()).toBe(0);

      component.clearChoices();
      expect(component.getChoiceCount()).toBe(0);
    });
  });
});
