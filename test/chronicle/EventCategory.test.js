import { EventCategory, getEventCategoryFromString } from '../../src/chronicle/EventCategory';

describe('EventCategory', () => {
  describe('constant values', () => {
    it('should have all expected category constants', () => {
      expect(EventCategory.POLITICAL).toBe('Political');
      expect(EventCategory.SOCIAL).toBe('Social');
      expect(EventCategory.ECONOMIC).toBe('Economic');
      expect(EventCategory.TECHNOLOGICAL).toBe('Technological');
      expect(EventCategory.CULTURAL_RELIGIOUS).toBe('Cultural/Religious');
      expect(EventCategory.MILITARY).toBe('Military');
      expect(EventCategory.NATURAL).toBe('Natural');
      expect(EventCategory.MYTHICAL).toBe('Mythical');
    });

    it('should be frozen to prevent mutation', () => {
      expect(Object.isFrozen(EventCategory)).toBe(true);
      
      // Attempt to modify should fail (but won't throw in non-strict mode)
      const originalValue = EventCategory.POLITICAL;
      
      // In strict mode this would throw, in non-strict mode it fails silently
      // We'll test that the value doesn't actually change
      try {
        EventCategory.POLITICAL = 'Modified';
      } catch (e) {
        // Expected in strict mode
      }
      
      expect(EventCategory.POLITICAL).toBe(originalValue);
    });

    it('should have correct number of categories', () => {
      const categoryKeys = Object.keys(EventCategory);
      expect(categoryKeys.length).toBe(8);
    });
  });

  describe('getEventCategoryFromString', () => {
    describe('key matching', () => {
      it('should match exact uppercase keys', () => {
        expect(getEventCategoryFromString('POLITICAL')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('SOCIAL')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('ECONOMIC')).toBe(EventCategory.ECONOMIC);
        expect(getEventCategoryFromString('TECHNOLOGICAL')).toBe(EventCategory.TECHNOLOGICAL);
        expect(getEventCategoryFromString('CULTURAL_RELIGIOUS')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('MILITARY')).toBe(EventCategory.MILITARY);
        expect(getEventCategoryFromString('NATURAL')).toBe(EventCategory.NATURAL);
        expect(getEventCategoryFromString('MYTHICAL')).toBe(EventCategory.MYTHICAL);
      });

      it('should match keys case-insensitively', () => {
        expect(getEventCategoryFromString('political')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('Political')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('pOlItIcAl')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('SOCIAL')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('social')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Social')).toBe(EventCategory.SOCIAL);
      });

      it('should match compound keys case-insensitively', () => {
        expect(getEventCategoryFromString('CULTURAL_RELIGIOUS')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('cultural_religious')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('Cultural_Religious')).toBe(EventCategory.CULTURAL_RELIGIOUS);
      });
    });

    describe('value matching', () => {
      it('should match exact category values', () => {
        expect(getEventCategoryFromString('Political')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('Social')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Economic')).toBe(EventCategory.ECONOMIC);
        expect(getEventCategoryFromString('Technological')).toBe(EventCategory.TECHNOLOGICAL);
        expect(getEventCategoryFromString('Cultural/Religious')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('Military')).toBe(EventCategory.MILITARY);
        expect(getEventCategoryFromString('Natural')).toBe(EventCategory.NATURAL);
        expect(getEventCategoryFromString('Mythical')).toBe(EventCategory.MYTHICAL);
      });

      it('should match values case-insensitively', () => {
        expect(getEventCategoryFromString('political')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('POLITICAL')).toBe(EventCategory.POLITICAL);
        expect(getEventCategoryFromString('social')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('SOCIAL')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('economic')).toBe(EventCategory.ECONOMIC);
        expect(getEventCategoryFromString('ECONOMIC')).toBe(EventCategory.ECONOMIC);
      });

      it('should match complex values case-insensitively', () => {
        expect(getEventCategoryFromString('cultural/religious')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('CULTURAL/RELIGIOUS')).toBe(EventCategory.CULTURAL_RELIGIOUS);
        expect(getEventCategoryFromString('Cultural/Religious')).toBe(EventCategory.CULTURAL_RELIGIOUS);
      });
    });

    describe('fallback behavior', () => {
      it('should return SOCIAL for empty strings', () => {
        expect(getEventCategoryFromString('')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('   ')).toBe(EventCategory.SOCIAL);
      });

      it('should return SOCIAL for null/undefined', () => {
        expect(getEventCategoryFromString(null)).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString(undefined)).toBe(EventCategory.SOCIAL);
      });

      it('should return SOCIAL for unrecognized strings', () => {
        expect(getEventCategoryFromString('InvalidCategory')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Random')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('NotACategory')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('123')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('!@#$%')).toBe(EventCategory.SOCIAL);
      });
    });

    describe('edge cases', () => {
      it('should handle whitespace-padded inputs', () => {
        // Note: Current implementation doesn't trim whitespace, so these will fall back to SOCIAL
        expect(getEventCategoryFromString(' POLITICAL ')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString(' Political ')).toBe(EventCategory.SOCIAL);
      });

      it('should handle partial matches', () => {
        expect(getEventCategoryFromString('Polit')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Politi')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Soc')).toBe(EventCategory.SOCIAL);
      });

      it('should handle numbers and special characters', () => {
        expect(getEventCategoryFromString('123Political')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Political123')).toBe(EventCategory.SOCIAL);
        expect(getEventCategoryFromString('Political-Test')).toBe(EventCategory.SOCIAL);
      });
    });

    describe('all categories coverage', () => {
      it('should be able to look up all categories by key', () => {
        const allKeys = Object.keys(EventCategory);
        for (const key of allKeys) {
          expect(getEventCategoryFromString(key)).toBe(EventCategory[key]);
        }
      });

      it('should be able to look up all categories by value', () => {
        const allValues = Object.values(EventCategory);
        for (const value of allValues) {
          expect(getEventCategoryFromString(value)).toBe(value);
        }
      });
    });
  });
});
