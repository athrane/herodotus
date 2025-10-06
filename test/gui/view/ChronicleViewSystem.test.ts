import { ChronicleViewSystem } from '../../../src/gui/view/ChronicleViewSystem';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { Ecs } from '../../../src/ecs/Ecs';
import { Entity } from '../../../src/ecs/Entity';
import { NameComponent } from '../../../src/ecs/NameComponent';
import { ScrollableMenuComponent } from '../../../src/gui/menu/ScrollableMenuComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { IsActiveScreenComponent } from '../../../src/gui/rendering/IsActiveScreenComponent';
import { ChronicleComponent } from '../../../src/chronicle/ChronicleComponent';
import { ChronicleEvent } from '../../../src/chronicle/ChronicleEvent';
import { EventType } from '../../../src/chronicle/EventType';
import { EventCategory } from '../../../src/chronicle/EventCategory';
import { Time } from '../../../src/time/Time';
import { Location } from '../../../src/geography/Location';
import { GeographicalFeature } from '../../../src/geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/feature/GeographicalFeatureTypeRegistry';
import { PlanetComponent } from '../../../src/geography/planet/PlanetComponent';
import { PlanetStatus } from '../../../src/geography/planet/PlanetComponent';
import { PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { Continent } from '../../../src/geography/planet/Continent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { ScrollStrategy } from '../../../src/gui/menu/ScrollStrategy';

/**
 * Helper function to create a test location with mock feature and planet.
 */
function createTestLocation(locationName: string): Location {
  // Register feature type if not already registered
  if (!GeographicalFeatureTypeRegistry.has('TEST_CITY')) {
    GeographicalFeatureTypeRegistry.register('TEST_CITY', 'City');
  }
  const featureType = GeographicalFeatureTypeRegistry.get('TEST_CITY')!;
  const feature = GeographicalFeature.create(locationName, featureType);
  
  const continent = Continent.create('Test Continent');
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
  
  return Location.create(feature, planet);
}

describe('ChronicleViewSystem', () => {
  let guiEntityManager: EntityManager;
  let simulationEcs: Ecs;
  let simulationEntityManager: EntityManager;
  let system: ChronicleViewSystem;
  let testEntity: Entity;

  beforeEach(() => {
    // Set up GUI ECS
    guiEntityManager = new EntityManager();
    
    // Set up simulation ECS
    simulationEcs = Ecs.create();
    simulationEntityManager = simulationEcs.getEntityManager();
    
    // Create the system
    system = ChronicleViewSystem.create(guiEntityManager, simulationEcs);
    
    // Create a test GUI entity with required components
    testEntity = guiEntityManager.createEntity();
    testEntity.addComponent(NameComponent.create('ChronicleScreen')); // Required for EntityFilters.byName('ChronicleScreen')
    testEntity.addComponent(ScrollableMenuComponent.createWithItemCount([], 5, ScrollStrategy.VERTICAL));
    testEntity.addComponent(IsVisibleComponent.create(true));
    testEntity.addComponent(new IsActiveScreenComponent());
  });

  describe('constructor', () => {
    it('should create system with valid parameters', () => {
      const system = new ChronicleViewSystem(guiEntityManager, simulationEcs, 100);
      expect(system).toBeInstanceOf(ChronicleViewSystem);
      expect(system.getRequiredComponents()).toContain(ScrollableMenuComponent);
      expect(system.getRequiredComponents()).toContain(IsVisibleComponent);
      expect(system.getRequiredComponents()).toContain(IsActiveScreenComponent);
    });

    it('should throw error for invalid entityManager', () => {
      expect(() => {
        new ChronicleViewSystem(null as any, simulationEcs);
      }).toThrow();
    });

    it('should throw error for invalid simulationEcs', () => {
      expect(() => {
        new ChronicleViewSystem(guiEntityManager, null as any);
      }).toThrow();
    });

    it('should throw error for invalid maxEvents', () => {
      expect(() => {
        new ChronicleViewSystem(guiEntityManager, simulationEcs, 'invalid' as any);
      }).toThrow();
    });
  });

  describe('static create', () => {
    it('should create system using static factory method', () => {
      const system = ChronicleViewSystem.create(guiEntityManager, simulationEcs);
      expect(system).toBeInstanceOf(ChronicleViewSystem);
    });

    it('should create system with custom maxEvents', () => {
      const system = ChronicleViewSystem.create(guiEntityManager, simulationEcs, 50);
      expect(system).toBeInstanceOf(ChronicleViewSystem);
    });
  });

  describe('processEntity', () => {
    it('should update scrollable menu with chronicle events', () => {
      // Create test chronicle events
      const eventType = new EventType(EventCategory.POLITICAL, 'Birth');
      const time = new Time(484);
      const place = createTestLocation('Halicarnassus');
      
      const event1 = ChronicleEvent.create(
        'Birth of Herodotus',
        eventType,
        time,
        place,
        'The Father of History is born'
      );
      
      const event2 = ChronicleEvent.create(
        'Writing begins',
        eventType,
        new Time(450),
        place,
        'Herodotus begins writing his histories'
      );

      // Add chronicle to simulation as singleton
      const chronicleEntity = simulationEntityManager.createEntity();
      const chronicleComponent = ChronicleComponent.create([event1, event2]);
      chronicleEntity.addComponent(chronicleComponent);

      // Process the GUI entity
      system.processEntity(testEntity);

      // Verify menu was updated
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      expect(scrollableComponent).toBeDefined();
      
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(2);
      expect(items[0]).toBeInstanceOf(MenuItem);
      expect(items[0].getText()).toBe('Birth of Herodotus');
      expect(items[0].getActionID()).toBe('CHRONICLE_SELECT_0');
      expect(items[1].getText()).toBe('Writing begins');
      expect(items[1].getActionID()).toBe('CHRONICLE_SELECT_1');
    });

    it('should handle empty chronicle gracefully', () => {
      // No chronicle in simulation
      
      // Process the GUI entity
      system.processEntity(testEntity);

      // Verify menu is empty
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      expect(scrollableComponent).toBeDefined();
      
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(0);
    });

    it('should ensure vertical scroll strategy', () => {
      // Process the GUI entity
      system.processEntity(testEntity);

      // Verify scroll strategy is vertical
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      expect(scrollableComponent).toBeDefined();
      expect(scrollableComponent!.getScrollStrategy()).toBe(ScrollStrategy.VERTICAL);
    });

    it('should limit to maxEvents number of events', () => {
      // Create system with low maxEvents limit
      const limitedSystem = ChronicleViewSystem.create(guiEntityManager, simulationEcs, 2);
      
      // Create 5 test chronicle events
      const eventType = new EventType(EventCategory.POLITICAL, 'Event');
      const time = new Time(100);
      const place = createTestLocation('TestPlace');
      
      const events = [];
      for (let i = 0; i < 5; i++) {
        events.push(ChronicleEvent.create(
          `Event ${i}`,
          eventType,
          new Time(100 + i),
          place,
          `Description ${i}`
        ));
      }

      // Add chronicle to simulation
      const chronicleEntity = simulationEntityManager.createEntity();
      const chronicleComponent = ChronicleComponent.create(events);
      chronicleEntity.addComponent(chronicleComponent);

      // Process the GUI entity
      limitedSystem.processEntity(testEntity);

      // Verify only last 2 events are shown
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(2);
      expect(items[0].getText()).toBe('Event 3'); // Last 2 events
      expect(items[1].getText()).toBe('Event 4');
    });

    it('should handle entity without ScrollableMenuComponent', () => {
      // Create entity without ScrollableMenuComponent
      const entityWithoutScrollable = guiEntityManager.createEntity();
      entityWithoutScrollable.addComponent(IsVisibleComponent.create(true));
      entityWithoutScrollable.addComponent(new IsActiveScreenComponent());

      // Should not throw error
      expect(() => {
        system.processEntity(entityWithoutScrollable);
      }).not.toThrow();
    });

    it('should handle chronicle events with different text access methods', () => {
      // Create a mock event that only has getDescription (no getHeading)
      const mockEvent = {
        getDescription: () => 'Description only event',
        toString: () => 'toString fallback'
      };

      // Create chronicle component with mock event
      const chronicleEntity = simulationEntityManager.createEntity();
      const chronicleComponent = ChronicleComponent.create([]);
      // Add mock event directly to bypass type checking for this test
      (chronicleComponent as any).events = [mockEvent];
      chronicleEntity.addComponent(chronicleComponent);

      // Process the GUI entity
      system.processEntity(testEntity);

      // Verify fallback text access works
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].getText()).toBe('Description only event');
    });

    it('should handle multiple chronicle entities by using first one', () => {
      // Create multiple chronicle entities
      const eventType = new EventType(EventCategory.POLITICAL, 'Event');
      const time = new Time(100);
      const place = createTestLocation('TestPlace');
      
      const event1 = ChronicleEvent.create('First Chronicle Event', eventType, time, place, 'First');
      const event2 = ChronicleEvent.create('Second Chronicle Event', eventType, time, place, 'Second');

      const chronicleEntity1 = simulationEntityManager.createEntity();
      chronicleEntity1.addComponent(ChronicleComponent.create([event1]));
      
      const chronicleEntity2 = simulationEntityManager.createEntity();
      chronicleEntity2.addComponent(ChronicleComponent.create([event2]));

      // Process the GUI entity
      system.processEntity(testEntity);

      // Should use first chronicle entity found
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].getText()).toBe('First Chronicle Event');
    });
  });

  describe('integration with scrollable menu component', () => {
    it('should work with scrollable menu that has items', () => {
      // Create entity with pre-existing menu items
      const existingItems = [new MenuItem('Existing Item', 'EXISTING_ACTION')];
      testEntity.removeComponent(ScrollableMenuComponent);
      testEntity.addComponent(ScrollableMenuComponent.createWithItemCount(existingItems, 5, ScrollStrategy.HORIZONTAL));

      // Add chronicle to simulation
      const eventType = new EventType(EventCategory.POLITICAL, 'Test');
      const time = new Time(100);
      const place = createTestLocation('TestPlace');
      const event = ChronicleEvent.create('New Event', eventType, time, place, 'Description');
      
      const chronicleEntity = simulationEntityManager.createEntity();
      chronicleEntity.addComponent(ChronicleComponent.create([event]));

      // Process the GUI entity
      system.processEntity(testEntity);

      // Verify menu was replaced with chronicle events and strategy is vertical
      const scrollableComponent = testEntity.getComponent(ScrollableMenuComponent);
      const items = scrollableComponent!.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].getText()).toBe('New Event');
      expect(scrollableComponent!.getScrollStrategy()).toBe(ScrollStrategy.VERTICAL);
    });
  });
});