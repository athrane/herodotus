import { DataSetEventComponent } from '../../src/data/DataSetEventComponent';
import { DataSetEvent } from '../../src/data/DataSetEvent';
import { Component } from '../../src/ecs/Component';

describe('DataSetEventComponent', () => {
  let sampleEventData;
  let dataSetEvent;

  beforeEach(() => {
    sampleEventData = {
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
    dataSetEvent = new DataSetEvent(sampleEventData);
  });

  describe('constructor', () => {
    it('should create a DataSetEventComponent instance', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      expect(component).toBeInstanceOf(DataSetEventComponent);
      expect(component).toBeInstanceOf(Component);
    });

    it('should throw error if dataSetEvent is null', () => {
      expect(() => new DataSetEventComponent(null)).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });

    it('should throw error if dataSetEvent is undefined', () => {
      expect(() => new DataSetEventComponent(undefined)).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });

    it('should throw error if dataSetEvent is not a DataSetEvent instance', () => {
      expect(() => new DataSetEventComponent({})).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });
  });

  describe('getDataSetEvent', () => {
    it('should return the DataSetEvent object', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      const result = component.getDataSetEvent();
      expect(result).toBe(dataSetEvent);
      expect(result).toBeInstanceOf(DataSetEvent);
    });
  });

  describe('setDataSetEvent', () => {
    it('should update the DataSetEvent reference', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      const newEventData = {
        "Event Type": "Military",
        "Event Trigger": "Battle",
        "Event Name": "Great Battle",
        "Event Consequence": "Territory gained",
        "Heading": "Victory Achieved",
        "Place": "Battlefield",
        "Primary Actor": "General Marcus",
        "Secondary Actor": "Enemy Force",
        "Motive": "Conquest",
        "Description": "A decisive battle was won",
        "Consequence": "Empire expanded",
        "Tags": "military,battle,victory"
      };
      const newDataSetEvent = new DataSetEvent(newEventData);
      
      component.setDataSetEvent(newDataSetEvent);
      const result = component.getDataSetEvent();
      
      expect(result).toBe(newDataSetEvent);
      expect(result).not.toBe(dataSetEvent);
      expect(result.EventType).toBe("Military");
      expect(result.Place).toBe("Battlefield");
    });

    it('should throw error if dataSetEvent is null', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      expect(() => component.setDataSetEvent(null)).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });

    it('should throw error if dataSetEvent is undefined', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      expect(() => component.setDataSetEvent(undefined)).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });

    it('should throw error if dataSetEvent is not a DataSetEvent instance', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      expect(() => component.setDataSetEvent({})).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });
  });

  describe('static create method', () => {
    it('should create a new DataSetEventComponent instance', () => {
      const component = DataSetEventComponent.create(dataSetEvent);
      expect(component).toBeInstanceOf(DataSetEventComponent);
      expect(component.getDataSetEvent()).toBe(dataSetEvent);
    });

    it('should throw error for invalid input', () => {
      expect(() => DataSetEventComponent.create(null)).toThrow('DataSetEvent must be a valid DataSetEvent instance.');
    });
  });

  describe('reference management', () => {
    it('should provide direct access to the DataSetEvent reference', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      const retrievedEvent = component.getDataSetEvent();
      
      // The component should return the same reference
      expect(retrievedEvent).toBe(dataSetEvent);
      
      // Verify it's the same DataSetEvent with expected properties
      expect(retrievedEvent.EventType).toBe("Political");
      expect(retrievedEvent.Place).toBe("Capital City");
    });

    it('should allow updating the reference during simulation', () => {
      const component = new DataSetEventComponent(dataSetEvent);
      const originalEvent = component.getDataSetEvent();
      
      const updatedEventData = {
        "Event Type": "Economic",
        "Event Trigger": "Trade",
        "Event Name": "Market Expansion",
        "Event Consequence": "Increased wealth",
        "Heading": "Prosperity Grows",
        "Place": "Trade Center",
        "Primary Actor": "Merchant Guild",
        "Secondary Actor": "Foreign Traders",
        "Motive": "Profit",
        "Description": "New trade routes established",
        "Consequence": "Economic boom",
        "Tags": "economic,trade,prosperity"
      };
      const updatedEvent = new DataSetEvent(updatedEventData);
      
      component.setDataSetEvent(updatedEvent);
      const newEvent = component.getDataSetEvent();
      
      expect(newEvent).toBe(updatedEvent);
      expect(newEvent).not.toBe(originalEvent);
      expect(newEvent.EventType).toBe("Economic");
    });
  });
});
