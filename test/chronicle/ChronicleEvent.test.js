import { ChronicleEvent } from '../../src/chronicle/ChronicleEvent';
import { Time } from '../../src/time/Time';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';
import { LocationComponent } from '../../src/geography/LocationComponent';
import { GeographicalFeature } from '../../src/geography/feature/GeographicalFeature';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry';
import { PlanetComponent } from '../../src/geography/planet/PlanetComponent';
import { PlanetStatus } from '../../src/geography/planet/PlanetComponent';
import { PlanetResourceSpecialization } from '../../src/geography/planet/PlanetComponent';
import { Continent } from '../../src/geography/planet/Continent';
import { EventType } from '../../src/chronicle/EventType';

/**
 * Helper function to create a test location with mock feature and planet.
 */
function createTestLocation(locationName) {
  // Register feature type if not already registered
  if (!GeographicalFeatureTypeRegistry.has('TEST_CITY')) {
    GeographicalFeatureTypeRegistry.register('TEST_CITY', 'City');
  }
  const featureType = GeographicalFeatureTypeRegistry.get('TEST_CITY');
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
  
  return LocationComponent.create(feature, planet);
}

describe('ChronicleEvent', () => {
  let heading;
  let eventType;
  let time;
  let figureComponent;
  let place;
  let description;

  beforeEach(() => {
    heading = 'Birth, Herodotus';
    eventType = new EventType('Political', 'Birth');
    time = new Time(484);
  figureComponent = HistoricalFigureComponent.create('Herodotus', -484, 59, 'Greek', 'Historian');
    place = createTestLocation('Halicarnassus');
    description = 'The birth of the Father of History.';
  });

  describe('constructor', () => {
    it('should create a ChronicleEvent with valid arguments', () => {
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figureComponent);
      expect(entry).toBeInstanceOf(ChronicleEvent);
      console.log(time);
      expect(entry.getHeading()).toBe(heading);
      expect(entry.getTime()).toBe(time);
      expect(entry.getFigure()).toBe(figureComponent);
      // Location should be cloned, not the same reference
      expect(entry.getLocation()).not.toBe(place);
      expect(entry.getLocation().getName()).toBe(place.getName());
      expect(entry.getDescription()).toBe(description);
    });

    it('should throw a TypeError for invalid argument types', () => {      
      expect(() => new ChronicleEvent(123, eventType, time, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, 'not event type', time, place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, 'not time', place, description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, 'not place', description)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, place, 123)).toThrow(TypeError);
      expect(() => new ChronicleEvent(heading, eventType, time, place, description, 'not component')).toThrow(TypeError);
    });
  });

  describe('getters', () => {
    it('should return the correct values provided in the constructor', () => {      
      const entry = new ChronicleEvent(heading, eventType, time, place, description, figureComponent);
      expect(entry.getHeading()).toBe('Birth, Herodotus');
      expect(entry.getEventType().getName()).toBe('Birth');
      expect(entry.getTime().getYear()).toBe(484);
      expect(entry.getLocation().getName()).toBe('Halicarnassus, Test Planet');
      expect(entry.getDescription()).toBe('The birth of the Father of History.');
      expect(entry.getFigure()?.name).toBe('Herodotus');
    });
  });

  describe('location immutability', () => {
    it('should create a deep copy of the location to ensure immutability', () => {
      // Create a location with a planet that has modifiable properties
      const originalLocation = createTestLocation('Athens');
      const originalPlanet = originalLocation.getPlanet();
      const originalOwnership = originalPlanet.getOwnership();
      const originalDevelopmentLevel = originalPlanet.getDevelopmentLevel();
      
      // Create the chronicle event
      const event = new ChronicleEvent(heading, eventType, time, originalLocation, description, figureComponent);
      
      // Get the location from the event
      const eventLocation = event.getLocation();
      const eventPlanet = eventLocation.getPlanet();
      
      // Verify the location in the event is NOT the same reference as the original
      expect(eventLocation).not.toBe(originalLocation);
      expect(eventPlanet).not.toBe(originalPlanet);
      
      // Verify initial values match
      expect(eventPlanet.getOwnership()).toBe(originalOwnership);
      expect(eventPlanet.getDevelopmentLevel()).toBe(originalDevelopmentLevel);
      expect(eventLocation.getName()).toBe('Athens, Test Planet');
      
      // Modify the original planet's mutable properties
      originalPlanet.setOwnership('New Owner');
      originalPlanet.setDevelopmentLevel(10);
      
      // Verify the event's location has NOT changed
      expect(eventPlanet.getOwnership()).toBe(originalOwnership);
      expect(eventPlanet.getDevelopmentLevel()).toBe(originalDevelopmentLevel);
      
      // Verify the original planet HAS changed
      expect(originalPlanet.getOwnership()).toBe('New Owner');
      expect(originalPlanet.getDevelopmentLevel()).toBe(10);
    });

    it('should preserve location data even when original location is modified after event creation', () => {
      const location = createTestLocation('Sparta');
      const planet = location.getPlanet();
      const originalStatus = planet.getStatus();
      
      // Create event with the location
      const event = ChronicleEvent.create(
        'Test Event',
        eventType,
        time,
        location,
        'A test event',
        null
      );
      
      // Modify the original location's planet
      planet.setStatus(PlanetStatus.BESIEGED);
      planet.setFortificationLevel(5);
      
      // Verify the event's location remains unchanged
      const eventPlanet = event.getLocation().getPlanet();
      expect(eventPlanet.getStatus()).toBe(originalStatus);
      expect(eventPlanet.getFortificationLevel()).not.toBe(5);
    });

    it('should handle null location cloning correctly', () => {
      const nullLocation = LocationComponent.createNullLocation();
      
      // Create event with null location
      const event = new ChronicleEvent(
        'Null Event',
        eventType,
        time,
        nullLocation,
        'Event with null location'
      );
      
      // Should not throw and should have a location
      expect(event.getLocation()).toBeDefined();
      expect(event.getLocation().getName()).toContain('Unknown');
    });

    it('should deeply clone continent features', () => {
      // Create a location with features
      if (!GeographicalFeatureTypeRegistry.has('TEST_MOUNTAIN')) {
        GeographicalFeatureTypeRegistry.register('TEST_MOUNTAIN', 'Mountain');
      }
      const mountainType = GeographicalFeatureTypeRegistry.get('TEST_MOUNTAIN');
      const mountain = GeographicalFeature.create('Mount Olympus', mountainType);
      
      const continent = Continent.create('Greece');
      continent.addFeature(mountain);
      
      const planet = PlanetComponent.create(
        'test-planet-features',
        'Feature Planet',
        'test-sector-features',
        'TestOwner',
        PlanetStatus.NORMAL,
        5,
        1,
        PlanetResourceSpecialization.AGRICULTURE,
        [continent]
      );
      
      const location = LocationComponent.create(mountain, planet);
      
      // Create event
      const event = new ChronicleEvent(heading, eventType, time, location, description);
      
      // Verify the location is cloned
      expect(event.getLocation()).not.toBe(location);
      expect(event.getLocation().getPlanet()).not.toBe(planet);
      expect(event.getLocation().getFeature()).not.toBe(mountain);
      
      // But values should be the same
      expect(event.getLocation().getFeature().getName()).toBe('Mount Olympus');
    });
  });
});