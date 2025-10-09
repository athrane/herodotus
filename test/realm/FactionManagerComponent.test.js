import { FactionManagerComponent } from '../../src/realm/FactionManagerComponent';
import { Faction } from '../../src/realm/Faction';

describe('FactionManagerComponent', () => {
  // ========================================================================
  // Factory Method Tests
  // ========================================================================

  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create instance with empty faction map by default', () => {
        const component = FactionManagerComponent.create();
        
        expect(component).toBeInstanceOf(FactionManagerComponent);
        expect(component.getAllFactions().size).toBe(0);
      });

      it('should create instance with custom factions', () => {
        const factions = new Map([
          ['Military', Faction.create('Military', 50, 60)],
          ['Clergy', Faction.create('Clergy', 30, 70)]
        ]);
        
        const component = FactionManagerComponent.create(factions);
        
        expect(component.getFactionInfluence('Military')).toBe(50);
        expect(component.getFactionInfluence('Clergy')).toBe(30);
        expect(component.getFactionAllegiance('Military')).toBe(60);
        expect(component.getFactionAllegiance('Clergy')).toBe(70);
      });

      it('should validate factions parameter type', () => {
        expect(() => {
          FactionManagerComponent.create('invalid');
        }).toThrow(TypeError);
      });
    });

    describe('createNull()', () => {
      it('should create null instance', () => {
        const nullComponent = FactionManagerComponent.createNull();
        
        expect(nullComponent).toBeInstanceOf(FactionManagerComponent);
        expect(nullComponent.getAllFactions().size).toBe(0);
      });

      it('should return same singleton instance on multiple calls', () => {
        const null1 = FactionManagerComponent.createNull();
        const null2 = FactionManagerComponent.createNull();
        
        expect(null1).toBe(null2);
      });

      it('should have empty faction map', () => {
        const nullComponent = FactionManagerComponent.createNull();
        
        expect(nullComponent.getAllFactionInfluence().size).toBe(0);
        expect(nullComponent.getAllFactionAllegiance().size).toBe(0);
      });
    });
  });

  // ========================================================================
  // Faction Management Tests
  // ========================================================================

  describe('Faction Management', () => {
    describe('Basic Faction Operations', () => {
      it('should get faction by name', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        
        const faction = component.getFaction('Military');
        expect(faction).not.toBeNull();
        expect(faction.getName()).toBe('Military');
        expect(faction.getInfluence()).toBe(50);
        expect(faction.getAllegiance()).toBe(60);
      });

      it('should return null for non-existent faction', () => {
        const component = FactionManagerComponent.create();
        expect(component.getFaction('NonExistent')).toBeNull();
      });

      it('should set faction with influence and allegiance', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Clergy', 40, 55);
        
        expect(component.getFactionInfluence('Clergy')).toBe(40);
        expect(component.getFactionAllegiance('Clergy')).toBe(55);
      });

      it('should replace existing faction when set again', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        component.setFaction('Military', 70, 80);
        
        expect(component.getFactionInfluence('Military')).toBe(70);
        expect(component.getFactionAllegiance('Military')).toBe(80);
      });

      it('should check if faction exists', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Merchants', 45, 65);
        
        expect(component.hasFaction('Merchants')).toBe(true);
        expect(component.hasFaction('NonExistent')).toBe(false);
      });

      it('should remove faction', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        
        const removed = component.removeFaction('Military');
        expect(removed).toBe(true);
        expect(component.hasFaction('Military')).toBe(false);
      });

      it('should return false when removing non-existent faction', () => {
        const component = FactionManagerComponent.create();
        const removed = component.removeFaction('NonExistent');
        expect(removed).toBe(false);
      });

      it('should get all faction names', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        component.setFaction('Clergy', 40, 55);
        component.setFaction('Merchants', 45, 65);
        
        const names = component.getAllFactionNames();
        expect(names).toHaveLength(3);
        expect(names).toContain('Military');
        expect(names).toContain('Clergy');
        expect(names).toContain('Merchants');
      });

      it('should clear all factions', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        component.setFaction('Clergy', 40, 55);
        
        component.clearAllFactions();
        
        expect(component.getAllFactions().size).toBe(0);
      });
    });

    describe('Faction Influence', () => {
      it('should get faction influence', () => {
        const component = FactionManagerComponent.create();
        component.setFactionInfluence('Military', 60);
        expect(component.getFactionInfluence('Military')).toBe(60);
      });

      it('should return 0 for non-existent faction', () => {
        const component = FactionManagerComponent.create();
        expect(component.getFactionInfluence('NonExistent')).toBe(0);
      });

      it('should set faction influence', () => {
        const component = FactionManagerComponent.create();
        component.setFactionInfluence('Clergy', 45);
        expect(component.getFactionInfluence('Clergy')).toBe(45);
      });

      it('should create faction if it does not exist when setting influence', () => {
        const component = FactionManagerComponent.create();
        component.setFactionInfluence('Merchants', 50);
        
        expect(component.hasFaction('Merchants')).toBe(true);
        expect(component.getFactionInfluence('Merchants')).toBe(50);
        expect(component.getFactionAllegiance('Merchants')).toBe(0);
      });

      it('should update influence of existing faction', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        component.setFactionInfluence('Military', 70);
        
        expect(component.getFactionInfluence('Military')).toBe(70);
        expect(component.getFactionAllegiance('Military')).toBe(60);
      });

      it('should get all faction influence as defensive copy', () => {
        const component = FactionManagerComponent.create();
        component.setFactionInfluence('Military', 60);
        component.setFactionInfluence('Clergy', 40);
        
        const allInfluence = component.getAllFactionInfluence();
        expect(allInfluence.size).toBe(2);
        expect(allInfluence.get('Military')).toBe(60);
        expect(allInfluence.get('Clergy')).toBe(40);
        
        // Verify defensive copy - modifying returned map shouldn't affect component
        allInfluence.set('Military', 999);
        expect(component.getFactionInfluence('Military')).toBe(60);
      });

      it('should handle multiple faction influence updates', () => {
        const component = FactionManagerComponent.create();
        component.setFactionInfluence('Nobility', 70);
        component.setFactionInfluence('Merchants', 50);
        component.setFactionInfluence('Clergy', 60);
        component.setFactionInfluence('Military', 80);
        
        expect(component.getFactionInfluence('Nobility')).toBe(70);
        expect(component.getFactionInfluence('Merchants')).toBe(50);
        expect(component.getFactionInfluence('Clergy')).toBe(60);
        expect(component.getFactionInfluence('Military')).toBe(80);
      });

      it('should validate faction name in getFactionInfluence', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.getFactionInfluence('');
        }).toThrow(TypeError);
      });

      it('should validate faction name in setFactionInfluence', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.setFactionInfluence('', 50);
        }).toThrow(TypeError);
      });

      it('should validate influence value in setFactionInfluence', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.setFactionInfluence('Military', 'invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Faction Allegiance', () => {
      it('should get faction allegiance', () => {
        const component = FactionManagerComponent.create();
        component.setFactionAllegiance('Military', 75);
        expect(component.getFactionAllegiance('Military')).toBe(75);
      });

      it('should return 0 for non-existent faction', () => {
        const component = FactionManagerComponent.create();
        expect(component.getFactionAllegiance('NonExistent')).toBe(0);
      });

      it('should set faction allegiance', () => {
        const component = FactionManagerComponent.create();
        component.setFactionAllegiance('Clergy', 55);
        expect(component.getFactionAllegiance('Clergy')).toBe(55);
      });

      it('should create faction if it does not exist when setting allegiance', () => {
        const component = FactionManagerComponent.create();
        component.setFactionAllegiance('Merchants', 65);
        
        expect(component.hasFaction('Merchants')).toBe(true);
        expect(component.getFactionAllegiance('Merchants')).toBe(65);
        expect(component.getFactionInfluence('Merchants')).toBe(0);
      });

      it('should update allegiance of existing faction', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        component.setFactionAllegiance('Military', 80);
        
        expect(component.getFactionInfluence('Military')).toBe(50);
        expect(component.getFactionAllegiance('Military')).toBe(80);
      });

      it('should get all faction allegiance as defensive copy', () => {
        const component = FactionManagerComponent.create();
        component.setFactionAllegiance('Military', 70);
        component.setFactionAllegiance('Clergy', 50);
        
        const allAllegiance = component.getAllFactionAllegiance();
        expect(allAllegiance.size).toBe(2);
        expect(allAllegiance.get('Military')).toBe(70);
        expect(allAllegiance.get('Clergy')).toBe(50);
        
        // Verify defensive copy
        allAllegiance.set('Military', 999);
        expect(component.getFactionAllegiance('Military')).toBe(70);
      });

      it('should handle multiple faction allegiance updates', () => {
        const component = FactionManagerComponent.create();
        component.setFactionAllegiance('Nobility', 80);
        component.setFactionAllegiance('Merchants', 60);
        component.setFactionAllegiance('Clergy', 70);
        component.setFactionAllegiance('Military', 90);
        
        expect(component.getFactionAllegiance('Nobility')).toBe(80);
        expect(component.getFactionAllegiance('Merchants')).toBe(60);
        expect(component.getFactionAllegiance('Clergy')).toBe(70);
        expect(component.getFactionAllegiance('Military')).toBe(90);
      });

      it('should validate faction name in getFactionAllegiance', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.getFactionAllegiance('');
        }).toThrow(TypeError);
      });

      it('should validate faction name in setFactionAllegiance', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.setFactionAllegiance('', 50);
        }).toThrow(TypeError);
      });

      it('should validate allegiance value in setFactionAllegiance', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.setFactionAllegiance('Military', 'invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Defensive Copying', () => {
      it('should return defensive copy in getAllFactions', () => {
        const component = FactionManagerComponent.create();
        component.setFaction('Military', 50, 60);
        
        const allFactions = component.getAllFactions();
        allFactions.set('Hacker', Faction.create('Hacker', 100, 0));
        
        expect(component.hasFaction('Hacker')).toBe(false);
      });
    });

    describe('Validation', () => {
      it('should validate faction name in getFaction', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.getFaction('');
        }).toThrow(TypeError);
      });

      it('should validate parameters in setFaction', () => {
        const component = FactionManagerComponent.create();
        
        expect(() => {
          component.setFaction('', 50, 60);
        }).toThrow(TypeError);
        
        expect(() => {
          component.setFaction('Military', 'invalid', 60);
        }).toThrow(TypeError);
        
        expect(() => {
          component.setFaction('Military', 50, 'invalid');
        }).toThrow(TypeError);
      });

      it('should validate faction name in hasFaction', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.hasFaction('');
        }).toThrow(TypeError);
      });

      it('should validate faction name in removeFaction', () => {
        const component = FactionManagerComponent.create();
        expect(() => {
          component.removeFaction('');
        }).toThrow(TypeError);
      });
    });
  });
});
