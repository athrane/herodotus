import { Faction } from '../../../src/realm/faction/Faction';

describe('Faction', () => {
  // ========================================================================
  // Factory Method Tests
  // ========================================================================

  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create instance with default values', () => {
        const faction = Faction.create('Military');
        
        expect(faction).toBeInstanceOf(Faction);
        expect(faction.getName()).toBe('Military');
        expect(faction.getInfluence()).toBe(0);
        expect(faction.getAllegiance()).toBe(0);
      });

      it('should create instance with custom influence value', () => {
        const faction = Faction.create('Clergy', 50);
        
        expect(faction.getName()).toBe('Clergy');
        expect(faction.getInfluence()).toBe(50);
        expect(faction.getAllegiance()).toBe(0);
      });

      it('should create instance with custom influence and allegiance values', () => {
        const faction = Faction.create('Merchants', 45, 75);
        
        expect(faction.getName()).toBe('Merchants');
        expect(faction.getInfluence()).toBe(45);
        expect(faction.getAllegiance()).toBe(75);
      });

      it('should validate name parameter', () => {
        expect(() => {
          Faction.create('');
        }).toThrow(TypeError);
      });

      it('should validate influence parameter type', () => {
        expect(() => {
          Faction.create('Military', 'invalid');
        }).toThrow(TypeError);
      });

      it('should validate allegiance parameter type', () => {
        expect(() => {
          Faction.create('Military', 50, 'invalid');
        }).toThrow(TypeError);
      });
    });

    describe('createNull()', () => {
      it('should create null instance', () => {
        const nullFaction = Faction.createNull();
        
        expect(nullFaction).toBeInstanceOf(Faction);
        expect(nullFaction.getName()).toBe('');
        expect(nullFaction.getInfluence()).toBe(0);
        expect(nullFaction.getAllegiance()).toBe(0);
      });

      it('should return same singleton instance on multiple calls', () => {
        const null1 = Faction.createNull();
        const null2 = Faction.createNull();
        
        expect(null1).toBe(null2);
      });
    });
  });

  // ========================================================================
  // Property Access Tests
  // ========================================================================

  describe('Property Access', () => {
    describe('getName()', () => {
      it('should return faction name', () => {
        const faction = Faction.create('Military', 50, 60);
        expect(faction.getName()).toBe('Military');
      });
    });

    describe('getInfluence()', () => {
      it('should return influence value', () => {
        const faction = Faction.create('Clergy', 40, 55);
        expect(faction.getInfluence()).toBe(40);
      });
    });

    describe('setInfluence()', () => {
      it('should set influence value', () => {
        const faction = Faction.create('Military', 50, 60);
        faction.setInfluence(70);
        expect(faction.getInfluence()).toBe(70);
      });

      it('should validate influence value type', () => {
        const faction = Faction.create('Military', 50, 60);
        expect(() => {
          faction.setInfluence('invalid');
        }).toThrow(TypeError);
      });
    });

    describe('getAllegiance()', () => {
      it('should return allegiance value', () => {
        const faction = Faction.create('Merchants', 45, 65);
        expect(faction.getAllegiance()).toBe(65);
      });
    });

    describe('setAllegiance()', () => {
      it('should set allegiance value', () => {
        const faction = Faction.create('Military', 50, 60);
        faction.setAllegiance(80);
        expect(faction.getAllegiance()).toBe(80);
      });

      it('should validate allegiance value type', () => {
        const faction = Faction.create('Military', 50, 60);
        expect(() => {
          faction.setAllegiance('invalid');
        }).toThrow(TypeError);
      });
    });
  });

  // ========================================================================
  // Integration Tests
  // ========================================================================

  describe('Integration', () => {
    it('should handle multiple property updates', () => {
      const faction = Faction.create('Nobility', 30, 40);
      
      faction.setInfluence(60);
      faction.setAllegiance(70);
      
      expect(faction.getName()).toBe('Nobility');
      expect(faction.getInfluence()).toBe(60);
      expect(faction.getAllegiance()).toBe(70);
    });

    it('should maintain name immutability', () => {
      const faction = Faction.create('Military', 50, 60);
      
      // Name should remain constant
      faction.setInfluence(70);
      faction.setAllegiance(80);
      
      expect(faction.getName()).toBe('Military');
    });
  });
});
