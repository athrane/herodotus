import { 
  RealmStateComponent, 
  ModifierSourceType, 
  RealmResource, 
  ModifierType,
  FailureThresholds,
  RealmModifier,
  ResourceHistoryEntry
} from '../../src/realm/RealmStateComponent';

describe('RealmStateComponent', () => {
  
  describe('Factory Methods', () => {
    
    it('creates instance with create() factory method', () => {
      const component = RealmStateComponent.create();
      expect(component).toBeInstanceOf(RealmStateComponent);
      expect(component.getTreasury()).toBe(100);
      expect(component.getStability()).toBe(100);
      expect(component.getLegitimacy()).toBe(100);
      expect(component.getHubris()).toBe(0);
    });

    it('creates instance with custom values', () => {
      const component = RealmStateComponent.create(200, 80, 90, 10);
      expect(component.getTreasury()).toBe(200);
      expect(component.getStability()).toBe(80);
      expect(component.getLegitimacy()).toBe(90);
      expect(component.getHubris()).toBe(10);
    });

    it('creates null instance with createNull()', () => {
      const nullComponent = RealmStateComponent.createNull();
      expect(nullComponent).toBeInstanceOf(RealmStateComponent);
      expect(nullComponent.getTreasury()).toBe(0);
      expect(nullComponent.getStability()).toBe(0);
      expect(nullComponent.getLegitimacy()).toBe(0);
      expect(nullComponent.getHubris()).toBe(0);
    });

    it('createNull() returns singleton instance', () => {
      const null1 = RealmStateComponent.createNull();
      const null2 = RealmStateComponent.createNull();
      expect(null1).toBe(null2);
    });

    it('validates treasury parameter type', () => {
      expect(() => RealmStateComponent.create('invalid' as any)).toThrow(TypeError);
      expect(() => RealmStateComponent.create('invalid' as any)).toThrow('treasury must be a number');
    });

    it('validates stability parameter type', () => {
      expect(() => RealmStateComponent.create(100, 'invalid' as any)).toThrow(TypeError);
      expect(() => RealmStateComponent.create(100, 'invalid' as any)).toThrow('stability must be a number');
    });

    it('validates legitimacy parameter type', () => {
      expect(() => RealmStateComponent.create(100, 100, 'invalid' as any)).toThrow(TypeError);
      expect(() => RealmStateComponent.create(100, 100, 'invalid' as any)).toThrow('legitimacy must be a number');
    });

    it('validates hubris parameter type', () => {
      expect(() => RealmStateComponent.create(100, 100, 100, 'invalid' as any)).toThrow(TypeError);
      expect(() => RealmStateComponent.create(100, 100, 100, 'invalid' as any)).toThrow('hubris must be a number');
    });
  });

  describe('Core Resource Management', () => {
    
    let component: RealmStateComponent;

    beforeEach(() => {
      component = RealmStateComponent.create();
    });

    describe('Treasury', () => {
      it('gets and sets treasury value', () => {
        component.setTreasury(150);
        expect(component.getTreasury()).toBe(150);
      });

      it('accepts negative treasury values', () => {
        component.setTreasury(-50);
        expect(component.getTreasury()).toBe(-50);
      });

      it('accepts zero treasury value', () => {
        component.setTreasury(0);
        expect(component.getTreasury()).toBe(0);
      });

      it('validates treasury setter parameter type', () => {
        expect(() => component.setTreasury('invalid' as any)).toThrow(TypeError);
        expect(() => component.setTreasury('invalid' as any)).toThrow('treasury must be a number');
      });
    });

    describe('Stability', () => {
      it('gets and sets stability value', () => {
        component.setStability(75);
        expect(component.getStability()).toBe(75);
      });

      it('accepts negative stability values', () => {
        component.setStability(-10);
        expect(component.getStability()).toBe(-10);
      });

      it('validates stability setter parameter type', () => {
        expect(() => component.setStability('invalid' as any)).toThrow(TypeError);
        expect(() => component.setStability('invalid' as any)).toThrow('stability must be a number');
      });
    });

    describe('Legitimacy', () => {
      it('gets and sets legitimacy value', () => {
        component.setLegitimacy(85);
        expect(component.getLegitimacy()).toBe(85);
      });

      it('accepts negative legitimacy values', () => {
        component.setLegitimacy(-20);
        expect(component.getLegitimacy()).toBe(-20);
      });

      it('validates legitimacy setter parameter type', () => {
        expect(() => component.setLegitimacy('invalid' as any)).toThrow(TypeError);
        expect(() => component.setLegitimacy('invalid' as any)).toThrow('legitimacy must be a number');
      });
    });

    describe('Hubris', () => {
      it('gets and sets hubris value', () => {
        component.setHubris(25);
        expect(component.getHubris()).toBe(25);
      });

      it('accepts large hubris values', () => {
        component.setHubris(1000);
        expect(component.getHubris()).toBe(1000);
      });

      it('validates hubris setter parameter type', () => {
        expect(() => component.setHubris('invalid' as any)).toThrow(TypeError);
        expect(() => component.setHubris('invalid' as any)).toThrow('hubris must be a number');
      });
    });
  });

  describe('Faction Management', () => {
    
    let component: RealmStateComponent;

    beforeEach(() => {
      component = RealmStateComponent.create();
    });

    describe('Faction Influence', () => {
      
      it('sets and gets faction influence', () => {
        component.setFactionInfluence('Nobility', 75);
        expect(component.getFactionInfluence('Nobility')).toBe(75);
      });

      it('returns undefined for non-existent faction', () => {
        expect(component.getFactionInfluence('Unknown')).toBeUndefined();
      });

      it('checks if faction has influence value', () => {
        component.setFactionInfluence('Priesthood', 50);
        expect(component.hasFactionInfluence('Priesthood')).toBe(true);
        expect(component.hasFactionInfluence('Unknown')).toBe(false);
      });

      it('gets all faction influence as defensive copy', () => {
        component.setFactionInfluence('Nobility', 75);
        component.setFactionInfluence('Merchants', 60);
        
        const influence = component.getAllFactionInfluence();
        expect(influence.size).toBe(2);
        expect(influence.get('Nobility')).toBe(75);
        expect(influence.get('Merchants')).toBe(60);
        
        // Modify returned map should not affect component
        influence.set('Populace', 80);
        expect(component.getFactionInfluence('Populace')).toBeUndefined();
      });

      it('validates factionId parameter type in getFactionInfluence', () => {
        expect(() => component.getFactionInfluence(123 as any)).toThrow(TypeError);
        expect(() => component.getFactionInfluence(123 as any)).toThrow('factionId must be a string');
      });

      it('validates factionId parameter type in setFactionInfluence', () => {
        expect(() => component.setFactionInfluence(123 as any, 50)).toThrow(TypeError);
        expect(() => component.setFactionInfluence(123 as any, 50)).toThrow('factionId must be a string');
      });

      it('validates value parameter type in setFactionInfluence', () => {
        expect(() => component.setFactionInfluence('Nobility', 'invalid' as any)).toThrow(TypeError);
        expect(() => component.setFactionInfluence('Nobility', 'invalid' as any)).toThrow('influence value must be a number');
      });
    });

    describe('Faction Allegiance', () => {
      
      it('sets and gets faction allegiance', () => {
        component.setFactionAllegiance('Nobility', 50);
        expect(component.getFactionAllegiance('Nobility')).toBe(50);
      });

      it('returns undefined for non-existent faction', () => {
        expect(component.getFactionAllegiance('Unknown')).toBeUndefined();
      });

      it('checks if faction has allegiance value', () => {
        component.setFactionAllegiance('Populace', -30);
        expect(component.hasFactionAllegiance('Populace')).toBe(true);
        expect(component.hasFactionAllegiance('Unknown')).toBe(false);
      });

      it('accepts negative allegiance values', () => {
        component.setFactionAllegiance('Merchants', -75);
        expect(component.getFactionAllegiance('Merchants')).toBe(-75);
      });

      it('gets all faction allegiance as defensive copy', () => {
        component.setFactionAllegiance('Nobility', 50);
        component.setFactionAllegiance('Priesthood', -20);
        
        const allegiance = component.getAllFactionAllegiance();
        expect(allegiance.size).toBe(2);
        expect(allegiance.get('Nobility')).toBe(50);
        expect(allegiance.get('Priesthood')).toBe(-20);
        
        // Modify returned map should not affect component
        allegiance.set('Merchants', 40);
        expect(component.getFactionAllegiance('Merchants')).toBeUndefined();
      });

      it('validates factionId parameter type in getFactionAllegiance', () => {
        expect(() => component.getFactionAllegiance(456 as any)).toThrow(TypeError);
        expect(() => component.getFactionAllegiance(456 as any)).toThrow('factionId must be a string');
      });

      it('validates factionId parameter type in setFactionAllegiance', () => {
        expect(() => component.setFactionAllegiance(456 as any, 30)).toThrow(TypeError);
        expect(() => component.setFactionAllegiance(456 as any, 30)).toThrow('factionId must be a string');
      });

      it('validates value parameter type in setFactionAllegiance', () => {
        expect(() => component.setFactionAllegiance('Populace', 'invalid' as any)).toThrow(TypeError);
        expect(() => component.setFactionAllegiance('Populace', 'invalid' as any)).toThrow('allegiance value must be a number');
      });
    });

    describe('Four Faction Estates', () => {
      
      it('manages all four faction estates', () => {
        // Set up all four factions
        component.setFactionInfluence('Nobility', 70);
        component.setFactionInfluence('Priesthood', 60);
        component.setFactionInfluence('Merchants', 55);
        component.setFactionInfluence('Populace', 40);
        
        component.setFactionAllegiance('Nobility', 20);
        component.setFactionAllegiance('Priesthood', 50);
        component.setFactionAllegiance('Merchants', 30);
        component.setFactionAllegiance('Populace', -10);
        
        // Verify all factions have values
        expect(component.getFactionInfluence('Nobility')).toBe(70);
        expect(component.getFactionInfluence('Priesthood')).toBe(60);
        expect(component.getFactionInfluence('Merchants')).toBe(55);
        expect(component.getFactionInfluence('Populace')).toBe(40);
        
        expect(component.getFactionAllegiance('Nobility')).toBe(20);
        expect(component.getFactionAllegiance('Priesthood')).toBe(50);
        expect(component.getFactionAllegiance('Merchants')).toBe(30);
        expect(component.getFactionAllegiance('Populace')).toBe(-10);
      });
    });
  });

  describe('Failure Threshold Management', () => {
    
    let component: RealmStateComponent;

    beforeEach(() => {
      component = RealmStateComponent.create();
    });

    it('gets failure thresholds as defensive copy', () => {
      const thresholds = component.getFailureThresholds();
      expect(thresholds).toEqual({
        treasury: 0,
        stability: 0,
        legitimacy: 0,
        hubris: 100
      });
      
      // Modify returned object should not affect component
      thresholds.treasury = -100;
      expect(component.getFailureThresholds().treasury).toBe(0);
    });

    it('sets failure thresholds', () => {
      const newThresholds: FailureThresholds = {
        treasury: -50,
        stability: 10,
        legitimacy: 20,
        hubris: 150
      };
      
      component.setFailureThresholds(newThresholds);
      expect(component.getFailureThresholds()).toEqual(newThresholds);
    });

    it('validates thresholds object type', () => {
      expect(() => component.setFailureThresholds(null as any)).toThrow(TypeError);
      expect(() => component.setFailureThresholds(null as any)).toThrow('thresholds must be an object');
    });

    it('validates treasury threshold type', () => {
      const invalidThresholds = {
        treasury: 'invalid' as any,
        stability: 0,
        legitimacy: 0,
        hubris: 100
      };
      expect(() => component.setFailureThresholds(invalidThresholds)).toThrow(TypeError);
      expect(() => component.setFailureThresholds(invalidThresholds)).toThrow('treasury threshold must be a number');
    });

    it('validates stability threshold type', () => {
      const invalidThresholds = {
        treasury: 0,
        stability: 'invalid' as any,
        legitimacy: 0,
        hubris: 100
      };
      expect(() => component.setFailureThresholds(invalidThresholds)).toThrow(TypeError);
      expect(() => component.setFailureThresholds(invalidThresholds)).toThrow('stability threshold must be a number');
    });
  });

  describe('Modifier System', () => {
    
    let component: RealmStateComponent;

    beforeEach(() => {
      component = RealmStateComponent.create();
    });

    it('adds a modifier', () => {
      const modifier: RealmModifier = {
        id: 'mod1',
        sourceType: ModifierSourceType.PlayerAction,
        sourceId: 'player1',
        affectedResource: RealmResource.Treasury,
        modifierType: ModifierType.Flat,
        value: 50,
        duration: 10,
        description: 'Tax increase'
      };
      
      component.addModifier(modifier);
      const modifiers = component.getModifiers();
      expect(modifiers.length).toBe(1);
      expect(modifiers[0].id).toBe('mod1');
    });

    it('removes a modifier by ID', () => {
      const modifier1: RealmModifier = {
        id: 'mod1',
        sourceType: ModifierSourceType.Event,
        sourceId: 'event1',
        affectedResource: RealmResource.Stability,
        modifierType: ModifierType.Percentage,
        value: -10,
        duration: 5,
        description: 'Natural disaster'
      };
      
      const modifier2: RealmModifier = {
        id: 'mod2',
        sourceType: ModifierSourceType.FactionInfluence,
        sourceId: 'faction1',
        affectedResource: RealmResource.Legitimacy,
        modifierType: ModifierType.Flat,
        value: 20,
        duration: -1,
        description: 'Faction support'
      };
      
      component.addModifier(modifier1);
      component.addModifier(modifier2);
      expect(component.getModifiers().length).toBe(2);
      
      const removed = component.removeModifier('mod1');
      expect(removed).toBe(true);
      expect(component.getModifiers().length).toBe(1);
      expect(component.getModifiers()[0].id).toBe('mod2');
    });

    it('returns false when removing non-existent modifier', () => {
      const removed = component.removeModifier('nonexistent');
      expect(removed).toBe(false);
    });

    it('gets specific modifier by ID', () => {
      const modifier: RealmModifier = {
        id: 'mod1',
        sourceType: ModifierSourceType.NonPlayerAction,
        sourceId: 'ai1',
        affectedResource: RealmResource.Hubris,
        modifierType: ModifierType.Multiplier,
        value: 1.5,
        duration: 20,
        description: 'Military victory'
      };
      
      component.addModifier(modifier);
      const retrieved = component.getModifier('mod1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('mod1');
      expect(retrieved?.value).toBe(1.5);
    });

    it('returns undefined for non-existent modifier ID', () => {
      const retrieved = component.getModifier('nonexistent');
      expect(retrieved).toBeUndefined();
    });

    it('gets all modifiers as defensive copy', () => {
      const modifier: RealmModifier = {
        id: 'mod1',
        sourceType: ModifierSourceType.PlayerAction,
        sourceId: 'player1',
        affectedResource: RealmResource.Treasury,
        modifierType: ModifierType.Flat,
        value: 50,
        duration: 10,
        description: 'Tax increase'
      };
      
      component.addModifier(modifier);
      const modifiers = component.getModifiers();
      
      // Modify returned array should not affect component
      modifiers.push({
        id: 'mod2',
        sourceType: ModifierSourceType.Event,
        sourceId: 'event1',
        affectedResource: RealmResource.Stability,
        modifierType: ModifierType.Flat,
        value: -20,
        duration: 5,
        description: 'Rebellion'
      });
      
      expect(component.getModifiers().length).toBe(1);
    });

    it('validates modifier object type', () => {
      expect(() => component.addModifier(null as any)).toThrow(TypeError);
      expect(() => component.addModifier(null as any)).toThrow('modifier must be an object');
    });

    it('validates modifier id type', () => {
      const invalidModifier = {
        id: 123 as any,
        sourceType: ModifierSourceType.Event,
        sourceId: 'event1',
        affectedResource: RealmResource.Treasury,
        modifierType: ModifierType.Flat,
        value: 50,
        duration: 10,
        description: 'Test'
      };
      expect(() => component.addModifier(invalidModifier)).toThrow(TypeError);
      expect(() => component.addModifier(invalidModifier)).toThrow('modifier.id must be a string');
    });

    it('validates modifier value type', () => {
      const invalidModifier = {
        id: 'mod1',
        sourceType: ModifierSourceType.Event,
        sourceId: 'event1',
        affectedResource: RealmResource.Treasury,
        modifierType: ModifierType.Flat,
        value: 'invalid' as any,
        duration: 10,
        description: 'Test'
      };
      expect(() => component.addModifier(invalidModifier)).toThrow(TypeError);
      expect(() => component.addModifier(invalidModifier)).toThrow('modifier.value must be a number');
    });
  });

  describe('Resource History Tracking', () => {
    
    let component: RealmStateComponent;

    beforeEach(() => {
      component = RealmStateComponent.create();
    });

    it('adds resource history entry', () => {
      const entry: ResourceHistoryEntry = {
        timestamp: 100,
        resource: RealmResource.Treasury,
        oldValue: 100,
        newValue: 150,
        source: 'Tax collection'
      };
      
      component.addResourceHistoryEntry(entry);
      const history = component.getResourceHistory();
      expect(history.length).toBe(1);
      expect(history[0].resource).toBe(RealmResource.Treasury);
    });

    it('tracks multiple history entries', () => {
      const entry1: ResourceHistoryEntry = {
        timestamp: 100,
        resource: RealmResource.Treasury,
        oldValue: 100,
        newValue: 150,
        source: 'Tax collection'
      };
      
      const entry2: ResourceHistoryEntry = {
        timestamp: 110,
        resource: RealmResource.Stability,
        oldValue: 100,
        newValue: 90,
        source: 'Minor unrest'
      };
      
      component.addResourceHistoryEntry(entry1);
      component.addResourceHistoryEntry(entry2);
      
      const history = component.getResourceHistory();
      expect(history.length).toBe(2);
      expect(history[0].timestamp).toBe(100);
      expect(history[1].timestamp).toBe(110);
    });

    it('gets history for specific resource', () => {
      const entry1: ResourceHistoryEntry = {
        timestamp: 100,
        resource: RealmResource.Treasury,
        oldValue: 100,
        newValue: 150,
        source: 'Tax collection'
      };
      
      const entry2: ResourceHistoryEntry = {
        timestamp: 110,
        resource: RealmResource.Stability,
        oldValue: 100,
        newValue: 90,
        source: 'Minor unrest'
      };
      
      const entry3: ResourceHistoryEntry = {
        timestamp: 120,
        resource: RealmResource.Treasury,
        oldValue: 150,
        newValue: 120,
        source: 'Military spending'
      };
      
      component.addResourceHistoryEntry(entry1);
      component.addResourceHistoryEntry(entry2);
      component.addResourceHistoryEntry(entry3);
      
      const treasuryHistory = component.getResourceHistoryForResource(RealmResource.Treasury);
      expect(treasuryHistory.length).toBe(2);
      expect(treasuryHistory[0].timestamp).toBe(100);
      expect(treasuryHistory[1].timestamp).toBe(120);
    });

    it('gets resource history as defensive copy', () => {
      const entry: ResourceHistoryEntry = {
        timestamp: 100,
        resource: RealmResource.Legitimacy,
        oldValue: 100,
        newValue: 110,
        source: 'Successful decree'
      };
      
      component.addResourceHistoryEntry(entry);
      const history = component.getResourceHistory();
      
      // Modify returned array should not affect component
      history.push({
        timestamp: 110,
        resource: RealmResource.Hubris,
        oldValue: 0,
        newValue: 10,
        source: 'Victory celebration'
      });
      
      expect(component.getResourceHistory().length).toBe(1);
    });

    it('validates history entry object type', () => {
      expect(() => component.addResourceHistoryEntry(null as any)).toThrow(TypeError);
      expect(() => component.addResourceHistoryEntry(null as any)).toThrow('entry must be an object');
    });

    it('validates entry timestamp type', () => {
      const invalidEntry = {
        timestamp: 'invalid' as any,
        resource: RealmResource.Treasury,
        oldValue: 100,
        newValue: 150,
        source: 'Test'
      };
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow(TypeError);
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow('entry.timestamp must be a number');
    });

    it('validates entry oldValue type', () => {
      const invalidEntry = {
        timestamp: 100,
        resource: RealmResource.Treasury,
        oldValue: 'invalid' as any,
        newValue: 150,
        source: 'Test'
      };
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow(TypeError);
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow('entry.oldValue must be a number');
    });

    it('validates entry source type', () => {
      const invalidEntry = {
        timestamp: 100,
        resource: RealmResource.Treasury,
        oldValue: 100,
        newValue: 150,
        source: 123 as any
      };
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow(TypeError);
      expect(() => component.addResourceHistoryEntry(invalidEntry)).toThrow('entry.source must be a string');
    });
  });

  describe('Enums', () => {
    
    it('defines ModifierSourceType enum', () => {
      expect(ModifierSourceType.PlayerAction).toBe('PlayerAction');
      expect(ModifierSourceType.NonPlayerAction).toBe('NonPlayerAction');
      expect(ModifierSourceType.FactionInfluence).toBe('FactionInfluence');
      expect(ModifierSourceType.Event).toBe('Event');
    });

    it('defines RealmResource enum', () => {
      expect(RealmResource.Treasury).toBe('Treasury');
      expect(RealmResource.Stability).toBe('Stability');
      expect(RealmResource.Legitimacy).toBe('Legitimacy');
      expect(RealmResource.Hubris).toBe('Hubris');
    });

    it('defines ModifierType enum', () => {
      expect(ModifierType.Flat).toBe('Flat');
      expect(ModifierType.Percentage).toBe('Percentage');
      expect(ModifierType.Multiplier).toBe('Multiplier');
    });
  });
});
