import { ChoiceComponent } from '../../src/behaviour/ChoiceComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { Component } from '../../src/ecs/Component';

describe('ChoiceComponent', () => {
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
    it('should create a ChoiceComponent instance with valid choices', () => {
      const component = new ChoiceComponent(choices);
      
      expect(component).toBeInstanceOf(ChoiceComponent);
      expect(component).toBeInstanceOf(Component);
      expect(component.getChoiceCount()).toBe(3);
    });

    it('should create a ChoiceComponent with empty choices array', () => {
      const component = new ChoiceComponent([]);
      
      expect(component).toBeInstanceOf(ChoiceComponent);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should protect internal state from external modification', () => {
      const component = new ChoiceComponent(choices);
      const retrievedChoices = component.getChoices();
      
      // Modify the retrieved array
      retrievedChoices.push(dataSetEvent1);
      
      // Verify original component is unchanged
      expect(component.getChoiceCount()).toBe(3);
      expect(component.getChoice(0)).toBe(dataSetEvent1);
    });

    it('should throw TypeError for invalid choices', () => {
      expect(() => new ChoiceComponent(null)).toThrow(TypeError);
      expect(() => new ChoiceComponent(undefined)).toThrow(TypeError);
      expect(() => new ChoiceComponent({})).toThrow(TypeError);
      expect(() => new ChoiceComponent([dataSetEvent1, null])).toThrow(TypeError);
      expect(() => new ChoiceComponent([dataSetEvent1, "invalid"])).toThrow(TypeError);
      expect(() => new ChoiceComponent([dataSetEvent1, {}])).toThrow(TypeError);
      expect(() => new ChoiceComponent([dataSetEvent1, 123])).toThrow(TypeError);
    });
  });

  describe('getChoices', () => {
    it('should return all choices as a readonly array', () => {
      const component = new ChoiceComponent(choices);
      const retrievedChoices = component.getChoices();
      
      expect(retrievedChoices).toHaveLength(3);
      expect(retrievedChoices[0]).toBe(dataSetEvent1);
      expect(retrievedChoices[1]).toBe(dataSetEvent2);
      expect(retrievedChoices[2]).toBe(dataSetEvent3);
    });

    it('should return empty array for component with no choices', () => {
      const component = new ChoiceComponent([]);
      const retrievedChoices = component.getChoices();
      
      expect(retrievedChoices).toHaveLength(0);
      expect(Array.isArray(retrievedChoices)).toBe(true);
    });

    it('should return a new array instance each time', () => {
      const component = new ChoiceComponent([dataSetEvent1]);
      const choices1 = component.getChoices();
      const choices2 = component.getChoices();
      
      expect(choices1).not.toBe(choices2);
      expect(choices1[0]).toBe(choices2[0]);
    });
  });

  describe('setChoices', () => {
    it('should replace existing choices with new ones', () => {
      const component = new ChoiceComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      const newChoices = [dataSetEvent3];
      component.setChoices(newChoices);

      expect(component.getChoiceCount()).toBe(1);
      expect(component.getChoice(0).getEventType()).toBe("Economic");
    });

    it('should validate that new choices are DataSetEvent instances', () => {
      const component = new ChoiceComponent(choices);
      
      expect(() => {
        component.setChoices([{}]);
      }).toThrow('All choices must be DataSetEvent instances.');
    });

    it('should validate that input is an array', () => {
      const component = new ChoiceComponent(choices);
      
      expect(() => {
        component.setChoices(null);
      }).toThrow('newChoices must be an array.');
    });

    it('should allow setting empty choices array', () => {
      const component = new ChoiceComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      component.setChoices([]);
      expect(component.getChoiceCount()).toBe(0);
    });
  });

  describe('clearChoices', () => {
    it('should remove all choices', () => {
      const component = new ChoiceComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      component.clearChoices();
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should work with already empty component', () => {
      const component = new ChoiceComponent([]);
      expect(component.getChoiceCount()).toBe(0);

      component.clearChoices();
      expect(component.getChoiceCount()).toBe(0);
    });
  });

  describe('getChoiceCount', () => {
    it('should return correct count for non-empty choices', () => {
      const component = new ChoiceComponent(choices);
      expect(component.getChoiceCount()).toBe(3);
    });

    it('should return 0 for empty choices', () => {
      const component = new ChoiceComponent([]);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should update count when choices are modified', () => {
      const component = new ChoiceComponent(choices);
      expect(component.getChoiceCount()).toBe(3);

      component.setChoices([dataSetEvent1]);
      expect(component.getChoiceCount()).toBe(1);

      component.clearChoices();
      expect(component.getChoiceCount()).toBe(0);
    });
  });

  describe('getChoice', () => {
    it('should return choice at valid index', () => {
      const component = new ChoiceComponent(choices);
      
      expect(component.getChoice(0)).toBe(dataSetEvent1);
      expect(component.getChoice(1)).toBe(dataSetEvent2);
      expect(component.getChoice(2)).toBe(dataSetEvent3);
    });

    it('should return undefined for out-of-bounds index', () => {
      const component = new ChoiceComponent(choices);
      
      expect(component.getChoice(-1)).toBeUndefined();
      expect(component.getChoice(3)).toBeUndefined();
      expect(component.getChoice(100)).toBeUndefined();
    });

    it('should return undefined for empty component', () => {
      const component = new ChoiceComponent([]);
      
      expect(component.getChoice(0)).toBeUndefined();
    });

    it('should validate index parameter', () => {
      const component = new ChoiceComponent(choices);
      
      expect(() => component.getChoice(null)).toThrow(TypeError);
      expect(() => component.getChoice("invalid")).toThrow(TypeError);
      expect(() => component.getChoice({})).toThrow(TypeError);
    });
  });

  describe('static create method', () => {
    it('should create ChoiceComponent instance via factory method', () => {
      const component = ChoiceComponent.create(choices);
      
      expect(component).toBeInstanceOf(ChoiceComponent);
      expect(component.getChoiceCount()).toBe(3);
      expect(component.getChoice(0)).toBe(dataSetEvent1);
    });

    it('should create empty ChoiceComponent via factory method', () => {
      const component = ChoiceComponent.create([]);
      
      expect(component).toBeInstanceOf(ChoiceComponent);
      expect(component.getChoiceCount()).toBe(0);
    });

    it('should throw TypeError for invalid input via factory method', () => {
      expect(() => ChoiceComponent.create(null)).toThrow(TypeError);
      expect(() => ChoiceComponent.create([dataSetEvent1, "invalid"])).toThrow(TypeError);
    });
  });

  describe('integration with DataSetEvent properties', () => {
    it('should preserve all DataSetEvent properties in choices', () => {
      const component = new ChoiceComponent([dataSetEvent1]);
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
      expect(retrievedChoice.getConsequence()).toBe("Political stability restored");
      expect(retrievedChoice.getTags()).toBe("politics,succession,election");
    });

    it('should work with different event types', () => {
      const component = new ChoiceComponent(choices);
      
      const politicalEvent = component.getChoice(0);
      const militaryEvent = component.getChoice(1);
      const economicEvent = component.getChoice(2);
      
      expect(politicalEvent.getEventType()).toBe("Political");
      expect(militaryEvent.getEventType()).toBe("Military");
      expect(economicEvent.getEventType()).toBe("Economic");
    });

    it('should maintain choice order and integrity', () => {
      const component = new ChoiceComponent(choices);
      const retrievedChoices = component.getChoices();
      
      expect(retrievedChoices[0].getEventName()).toBe("Royal Election");
      expect(retrievedChoices[1].getEventName()).toBe("Border Conflict");
      expect(retrievedChoices[2].getEventName()).toBe("Merchant Alliance");
    });
  });
});