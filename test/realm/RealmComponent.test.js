import { RealmComponent } from '../../src/realm/RealmComponent';
import { RealmResource } from '../../src/realm/RealmResource';
import { ModifierSourceType } from '../../src/realm/ModifierSourceType';
import { ModifierType } from '../../src/realm/ModifierType';

describe('RealmComponent', () => {
  // ========================================================================
  // Factory Method Tests
  // ========================================================================

  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create instance with default values', () => {
        const component = RealmComponent.create();
        
        expect(component).toBeInstanceOf(RealmComponent);
        expect(component.getTreasury()).toBe(100);
        expect(component.getStability()).toBe(50);
        expect(component.getLegitimacy()).toBe(50);
        expect(component.getHubris()).toBe(0);
      });

      it('should create instance with custom values', () => {
        const component = RealmComponent.create(
          200,  // treasury
          75,   // stability
          80,   // legitimacy
          10    // hubris
        );
        
        expect(component.getTreasury()).toBe(200);
        expect(component.getStability()).toBe(75);
        expect(component.getLegitimacy()).toBe(80);
        expect(component.getHubris()).toBe(10);
      });



      it('should create instance with custom failure thresholds', () => {
        const thresholds = {
          treasury: 10,
          stability: 5,
          legitimacy: 5,
          hubris: 90
        };
        
        const component = RealmComponent.create(
          100, 50, 50, 0,
          thresholds
        );
        
        const result = component.getFailureThresholds();
        expect(result.treasury).toBe(10);
        expect(result.stability).toBe(5);
        expect(result.legitimacy).toBe(5);
        expect(result.hubris).toBe(90);
      });

      it('should validate treasury parameter type', () => {
        expect(() => {
          RealmComponent.create('invalid');
        }).toThrow(TypeError);
      });

      it('should validate stability parameter type', () => {
        expect(() => {
          RealmComponent.create(100, 'invalid');
        }).toThrow(TypeError);
      });

      it('should validate legitimacy parameter type', () => {
        expect(() => {
          RealmComponent.create(100, 50, 'invalid');
        }).toThrow(TypeError);
      });

      it('should validate hubris parameter type', () => {
        expect(() => {
          RealmComponent.create(100, 50, 50, 'invalid');
        }).toThrow(TypeError);
      });

      it('should validate modifiers parameter type', () => {
        expect(() => {
          RealmComponent.create(
            100, 50, 50, 0,
            new Map(), new Map(),
            { treasury: 0, stability: 0, legitimacy: 0, hubris: 100 },
            'invalid'
          );
        }).toThrow(TypeError);
      });

      it('should validate resourceHistory parameter type', () => {
        expect(() => {
          RealmComponent.create(
            100, 50, 50, 0,
            new Map(), new Map(),
            { treasury: 0, stability: 0, legitimacy: 0, hubris: 100 },
            [],
            'invalid'
          );
        }).toThrow(TypeError);
      });
    });

    describe('createNull()', () => {
      it('should create null instance with zero values', () => {
        const nullComponent = RealmComponent.createNull();
        
        expect(nullComponent).toBeInstanceOf(RealmComponent);
        expect(nullComponent.getTreasury()).toBe(0);
        expect(nullComponent.getStability()).toBe(0);
        expect(nullComponent.getLegitimacy()).toBe(0);
        expect(nullComponent.getHubris()).toBe(0);
      });

      it('should return same singleton instance on multiple calls', () => {
        const instance1 = RealmComponent.createNull();
        const instance2 = RealmComponent.createNull();
        
        expect(instance1).toBe(instance2);
      });



      it('should have empty modifier array', () => {
        const nullComponent = RealmComponent.createNull();
        
        expect(nullComponent.getAllModifiers().length).toBe(0);
      });

      it('should have empty resource history', () => {
        const nullComponent = RealmComponent.createNull();
        
        expect(nullComponent.getResourceHistory().length).toBe(0);
      });
    });
  });

  // ========================================================================
  // Core Resource Management Tests
  // ========================================================================

  describe('Core Resource Management', () => {
    describe('Treasury', () => {
      it('should get treasury value', () => {
        const component = RealmComponent.create(150);
        expect(component.getTreasury()).toBe(150);
      });

      it('should set treasury value', () => {
        const component = RealmComponent.create();
        component.setTreasury(250);
        expect(component.getTreasury()).toBe(250);
      });

      it('should accept negative treasury values', () => {
        const component = RealmComponent.create();
        component.setTreasury(-50);
        expect(component.getTreasury()).toBe(-50);
      });

      it('should accept zero treasury value', () => {
        const component = RealmComponent.create();
        component.setTreasury(0);
        expect(component.getTreasury()).toBe(0);
      });

      it('should accept very large treasury values', () => {
        const component = RealmComponent.create();
        component.setTreasury(999999);
        expect(component.getTreasury()).toBe(999999);
      });

      it('should validate treasury setter type', () => {
        const component = RealmComponent.create();
        expect(() => {
          component.setTreasury('invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Stability', () => {
      it('should get stability value', () => {
        const component = RealmComponent.create(100, 75);
        expect(component.getStability()).toBe(75);
      });

      it('should set stability value', () => {
        const component = RealmComponent.create();
        component.setStability(80);
        expect(component.getStability()).toBe(80);
      });

      it('should accept negative stability values', () => {
        const component = RealmComponent.create();
        component.setStability(-10);
        expect(component.getStability()).toBe(-10);
      });

      it('should accept zero stability value', () => {
        const component = RealmComponent.create();
        component.setStability(0);
        expect(component.getStability()).toBe(0);
      });

      it('should accept very large stability values', () => {
        const component = RealmComponent.create();
        component.setStability(1000);
        expect(component.getStability()).toBe(1000);
      });

      it('should validate stability setter type', () => {
        const component = RealmComponent.create();
        expect(() => {
          component.setStability('invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Legitimacy', () => {
      it('should get legitimacy value', () => {
        const component = RealmComponent.create(100, 50, 85);
        expect(component.getLegitimacy()).toBe(85);
      });

      it('should set legitimacy value', () => {
        const component = RealmComponent.create();
        component.setLegitimacy(90);
        expect(component.getLegitimacy()).toBe(90);
      });

      it('should accept negative legitimacy values', () => {
        const component = RealmComponent.create();
        component.setLegitimacy(-5);
        expect(component.getLegitimacy()).toBe(-5);
      });

      it('should accept zero legitimacy value', () => {
        const component = RealmComponent.create();
        component.setLegitimacy(0);
        expect(component.getLegitimacy()).toBe(0);
      });

      it('should accept very large legitimacy values', () => {
        const component = RealmComponent.create();
        component.setLegitimacy(500);
        expect(component.getLegitimacy()).toBe(500);
      });

      it('should validate legitimacy setter type', () => {
        const component = RealmComponent.create();
        expect(() => {
          component.setLegitimacy('invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Hubris', () => {
      it('should get hubris value', () => {
        const component = RealmComponent.create(100, 50, 50, 25);
        expect(component.getHubris()).toBe(25);
      });

      it('should set hubris value', () => {
        const component = RealmComponent.create();
        component.setHubris(30);
        expect(component.getHubris()).toBe(30);
      });

      it('should accept negative hubris values', () => {
        const component = RealmComponent.create();
        component.setHubris(-20);
        expect(component.getHubris()).toBe(-20);
      });

      it('should accept zero hubris value', () => {
        const component = RealmComponent.create();
        component.setHubris(0);
        expect(component.getHubris()).toBe(0);
      });

      it('should accept very large hubris values', () => {
        const component = RealmComponent.create();
        component.setHubris(200);
        expect(component.getHubris()).toBe(200);
      });

      it('should validate hubris setter type', () => {
        const component = RealmComponent.create();
        expect(() => {
          component.setHubris('invalid');
        }).toThrow(TypeError);
      });
    });
  });

  // ========================================================================
  // Modifier System Tests
  // ========================================================================

  describe('Modifier System', () => {
    const createTestModifier = (id, resource = RealmResource.Treasury) => ({
      id,
      sourceType: ModifierSourceType.PlayerAction,
      sourceId: 'test-source',
      affectedResource: resource,
      modifierType: ModifierType.Flat,
      value: 10,
      duration: -1,
      description: `Test modifier ${id}`
    });

    describe('Adding Modifiers', () => {
      it('should add a modifier', () => {
        const component = RealmComponent.create();
        const modifier = createTestModifier('mod1');
        
        component.addModifier(modifier);
        
        const result = component.getModifier('mod1');
        expect(result).toBeDefined();
        expect(result.id).toBe('mod1');
      });

      it('should add multiple modifiers', () => {
        const component = RealmComponent.create();
        
        component.addModifier(createTestModifier('mod1'));
        component.addModifier(createTestModifier('mod2'));
        component.addModifier(createTestModifier('mod3'));
        
        const allModifiers = component.getAllModifiers();
        expect(allModifiers.length).toBe(3);
      });

      it('should validate modifier id', () => {
        const component = RealmComponent.create();
        const modifier = { ...createTestModifier('mod1'), id: '' };
        
        expect(() => {
          component.addModifier(modifier);
        }).toThrow(TypeError);
      });

      it('should validate modifier sourceId', () => {
        const component = RealmComponent.create();
        const modifier = { ...createTestModifier('mod1'), sourceId: '' };
        
        expect(() => {
          component.addModifier(modifier);
        }).toThrow(TypeError);
      });

      it('should validate modifier value', () => {
        const component = RealmComponent.create();
        const modifier = { ...createTestModifier('mod1'), value: 'invalid' };
        
        expect(() => {
          component.addModifier(modifier);
        }).toThrow(TypeError);
      });

      it('should validate modifier duration', () => {
        const component = RealmComponent.create();
        const modifier = { ...createTestModifier('mod1'), duration: 'invalid' };
        
        expect(() => {
          component.addModifier(modifier);
        }).toThrow(TypeError);
      });

      it('should validate modifier description', () => {
        const component = RealmComponent.create();
        const modifier = { ...createTestModifier('mod1'), description: '' };
        
        expect(() => {
          component.addModifier(modifier);
        }).toThrow(TypeError);
      });
    });

    describe('Removing Modifiers', () => {
      it('should remove a modifier by id', () => {
        const component = RealmComponent.create();
        component.addModifier(createTestModifier('mod1'));
        
        const removed = component.removeModifier('mod1');
        
        expect(removed).toBe(true);
        expect(component.getModifier('mod1')).toBeUndefined();
      });

      it('should return false when removing non-existent modifier', () => {
        const component = RealmComponent.create();
        
        const removed = component.removeModifier('non-existent');
        
        expect(removed).toBe(false);
      });

      it('should only remove specified modifier', () => {
        const component = RealmComponent.create();
        component.addModifier(createTestModifier('mod1'));
        component.addModifier(createTestModifier('mod2'));
        component.addModifier(createTestModifier('mod3'));
        
        component.removeModifier('mod2');
        
        expect(component.getModifier('mod1')).toBeDefined();
        expect(component.getModifier('mod2')).toBeUndefined();
        expect(component.getModifier('mod3')).toBeDefined();
      });

      it('should validate modifier id in removeModifier', () => {
        const component = RealmComponent.create();
        
        expect(() => {
          component.removeModifier('');
        }).toThrow(TypeError);
      });
    });

    describe('Retrieving Modifiers', () => {
      it('should get modifier by id', () => {
        const component = RealmComponent.create();
        const modifier = createTestModifier('mod1');
        component.addModifier(modifier);
        
        const result = component.getModifier('mod1');
        
        expect(result).toBeDefined();
        expect(result.id).toBe('mod1');
        expect(result.value).toBe(10);
      });

      it('should return undefined for non-existent modifier', () => {
        const component = RealmComponent.create();
        
        const result = component.getModifier('non-existent');
        
        expect(result).toBeUndefined();
      });

      it('should get all modifiers as defensive copy', () => {
        const component = RealmComponent.create();
        component.addModifier(createTestModifier('mod1'));
        component.addModifier(createTestModifier('mod2'));
        
        const allModifiers = component.getAllModifiers();
        expect(allModifiers.length).toBe(2);
        
        // Verify defensive copy
        allModifiers.push(createTestModifier('mod3'));
        expect(component.getAllModifiers().length).toBe(2);
      });

      it('should get modifiers by resource', () => {
        const component = RealmComponent.create();
        component.addModifier(createTestModifier('mod1', RealmResource.Treasury));
        component.addModifier(createTestModifier('mod2', RealmResource.Stability));
        component.addModifier(createTestModifier('mod3', RealmResource.Treasury));
        
        const treasuryModifiers = component.getModifiersByResource(RealmResource.Treasury);
        
        expect(treasuryModifiers.length).toBe(2);
        expect(treasuryModifiers.every(m => m.affectedResource === RealmResource.Treasury)).toBe(true);
      });

      it('should get modifiers by source type', () => {
        const component = RealmComponent.create();
        const mod1 = { ...createTestModifier('mod1'), sourceType: ModifierSourceType.PlayerAction };
        const mod2 = { ...createTestModifier('mod2'), sourceType: ModifierSourceType.Event };
        const mod3 = { ...createTestModifier('mod3'), sourceType: ModifierSourceType.PlayerAction };
        
        component.addModifier(mod1);
        component.addModifier(mod2);
        component.addModifier(mod3);
        
        const playerModifiers = component.getModifiersBySourceType(ModifierSourceType.PlayerAction);
        
        expect(playerModifiers.length).toBe(2);
        expect(playerModifiers.every(m => m.sourceType === ModifierSourceType.PlayerAction)).toBe(true);
      });

      it('should validate modifier id in getModifier', () => {
        const component = RealmComponent.create();
        
        expect(() => {
          component.getModifier('');
        }).toThrow(TypeError);
      });
    });
  });

  // ========================================================================
  // Resource History Tests
  // ========================================================================

  describe('Resource History Tracking', () => {
    const createHistoryEntry = (timestamp, resource, oldValue, newValue) => ({
      timestamp,
      resource,
      oldValue,
      newValue,
      source: 'test-source'
    });

    describe('Adding History Entries', () => {
      it('should add resource history entry', () => {
        const component = RealmComponent.create();
        const entry = createHistoryEntry(1000, RealmResource.Treasury, 100, 150);
        
        component.addResourceHistoryEntry(entry);
        
        const history = component.getResourceHistory();
        expect(history.length).toBe(1);
        expect(history[0].timestamp).toBe(1000);
      });

      it('should add multiple history entries', () => {
        const component = RealmComponent.create();
        
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        component.addResourceHistoryEntry(createHistoryEntry(3000, RealmResource.Legitimacy, 50, 45));
        
        const history = component.getResourceHistory();
        expect(history.length).toBe(3);
      });

      it('should validate timestamp', () => {
        const component = RealmComponent.create();
        const entry = { ...createHistoryEntry(1000, RealmResource.Treasury, 100, 150), timestamp: 'invalid' };
        
        expect(() => {
          component.addResourceHistoryEntry(entry);
        }).toThrow(TypeError);
      });

      it('should validate oldValue', () => {
        const component = RealmComponent.create();
        const entry = { ...createHistoryEntry(1000, RealmResource.Treasury, 100, 150), oldValue: 'invalid' };
        
        expect(() => {
          component.addResourceHistoryEntry(entry);
        }).toThrow(TypeError);
      });

      it('should validate newValue', () => {
        const component = RealmComponent.create();
        const entry = { ...createHistoryEntry(1000, RealmResource.Treasury, 100, 150), newValue: 'invalid' };
        
        expect(() => {
          component.addResourceHistoryEntry(entry);
        }).toThrow(TypeError);
      });

      it('should validate source', () => {
        const component = RealmComponent.create();
        const entry = { ...createHistoryEntry(1000, RealmResource.Treasury, 100, 150), source: '' };
        
        expect(() => {
          component.addResourceHistoryEntry(entry);
        }).toThrow(TypeError);
      });
    });

    describe('Retrieving History', () => {
      it('should get all resource history as defensive copy', () => {
        const component = RealmComponent.create();
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        
        const history = component.getResourceHistory();
        expect(history.length).toBe(2);
        
        // Verify defensive copy
        history.push(createHistoryEntry(3000, RealmResource.Hubris, 0, 10));
        expect(component.getResourceHistory().length).toBe(2);
      });

      it('should get history by resource', () => {
        const component = RealmComponent.create();
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        component.addResourceHistoryEntry(createHistoryEntry(3000, RealmResource.Treasury, 150, 200));
        
        const treasuryHistory = component.getResourceHistoryByResource(RealmResource.Treasury);
        
        expect(treasuryHistory.length).toBe(2);
        expect(treasuryHistory.every(e => e.resource === RealmResource.Treasury)).toBe(true);
      });

      it('should get history by time range', () => {
        const component = RealmComponent.create();
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        component.addResourceHistoryEntry(createHistoryEntry(3000, RealmResource.Legitimacy, 50, 45));
        component.addResourceHistoryEntry(createHistoryEntry(4000, RealmResource.Hubris, 0, 10));
        
        const rangeHistory = component.getResourceHistoryByTimeRange(1500, 3500);
        
        expect(rangeHistory.length).toBe(2);
        expect(rangeHistory[0].timestamp).toBe(2000);
        expect(rangeHistory[1].timestamp).toBe(3000);
      });

      it('should include boundaries in time range', () => {
        const component = RealmComponent.create();
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        component.addResourceHistoryEntry(createHistoryEntry(3000, RealmResource.Legitimacy, 50, 45));
        
        const rangeHistory = component.getResourceHistoryByTimeRange(1000, 3000);
        
        expect(rangeHistory.length).toBe(3);
      });

      it('should validate time range parameters', () => {
        const component = RealmComponent.create();
        
        expect(() => {
          component.getResourceHistoryByTimeRange('invalid', 2000);
        }).toThrow(TypeError);
        
        expect(() => {
          component.getResourceHistoryByTimeRange(1000, 'invalid');
        }).toThrow(TypeError);
      });
    });

    describe('Clearing History', () => {
      it('should clear all resource history', () => {
        const component = RealmComponent.create();
        component.addResourceHistoryEntry(createHistoryEntry(1000, RealmResource.Treasury, 100, 150));
        component.addResourceHistoryEntry(createHistoryEntry(2000, RealmResource.Stability, 50, 60));
        
        component.clearResourceHistory();
        
        expect(component.getResourceHistory().length).toBe(0);
      });
    });
  });

  // ========================================================================
  // Failure Threshold Management Tests
  // ========================================================================

  describe('Failure Threshold Management', () => {
    describe('Getting Thresholds', () => {
      it('should get failure thresholds', () => {
        const component = RealmComponent.create();
        
        const thresholds = component.getFailureThresholds();
        
        expect(thresholds).toBeDefined();
        expect(thresholds.treasury).toBe(0);
        expect(thresholds.stability).toBe(0);
        expect(thresholds.legitimacy).toBe(0);
        expect(thresholds.hubris).toBe(100);
      });

      it('should return defensive copy of thresholds', () => {
        const component = RealmComponent.create();
        
        const thresholds = component.getFailureThresholds();
        thresholds.treasury = 999;
        
        const newThresholds = component.getFailureThresholds();
        expect(newThresholds.treasury).toBe(0);
      });
    });

    describe('Setting Thresholds', () => {
      it('should set failure thresholds', () => {
        const component = RealmComponent.create();
        const newThresholds = {
          treasury: 10,
          stability: 15,
          legitimacy: 20,
          hubris: 85
        };
        
        component.setFailureThresholds(newThresholds);
        
        const result = component.getFailureThresholds();
        expect(result.treasury).toBe(10);
        expect(result.stability).toBe(15);
        expect(result.legitimacy).toBe(20);
        expect(result.hubris).toBe(85);
      });

      it('should validate treasury threshold', () => {
        const component = RealmComponent.create();
        const thresholds = {
          treasury: 'invalid',
          stability: 0,
          legitimacy: 0,
          hubris: 100
        };
        
        expect(() => {
          component.setFailureThresholds(thresholds);
        }).toThrow(TypeError);
      });

      it('should validate stability threshold', () => {
        const component = RealmComponent.create();
        const thresholds = {
          treasury: 0,
          stability: 'invalid',
          legitimacy: 0,
          hubris: 100
        };
        
        expect(() => {
          component.setFailureThresholds(thresholds);
        }).toThrow(TypeError);
      });

      it('should validate legitimacy threshold', () => {
        const component = RealmComponent.create();
        const thresholds = {
          treasury: 0,
          stability: 0,
          legitimacy: 'invalid',
          hubris: 100
        };
        
        expect(() => {
          component.setFailureThresholds(thresholds);
        }).toThrow(TypeError);
      });

      it('should validate hubris threshold', () => {
        const component = RealmComponent.create();
        const thresholds = {
          treasury: 0,
          stability: 0,
          legitimacy: 0,
          hubris: 'invalid'
        };
        
        expect(() => {
          component.setFailureThresholds(thresholds);
        }).toThrow(TypeError);
      });
    });
  });
});
