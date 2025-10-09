import { loadEventCategories } from '../../../src/data/chronicle/loadEventCategories.ts';

describe('loadEventCategories', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'trace').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('successful loading', () => {
    it('should load all event categories from JSON', () => {
      const categories = loadEventCategories();
      
      expect(categories).toBeDefined();
      expect(typeof categories).toBe('object');
      expect(categories).not.toBeNull();
    });

    it('should load all expected category keys and values', () => {
      const categories = loadEventCategories();
      
      expect(categories.POLITICAL).toBe('Political');
      expect(categories.SOCIAL).toBe('Social');
      expect(categories.ECONOMIC).toBe('Economic');
      expect(categories.TECHNOLOGICAL).toBe('Technological');
      expect(categories.CULTURAL_RELIGIOUS).toBe('Cultural/Religious');
      expect(categories.MILITARY).toBe('Military');
      expect(categories.NATURAL).toBe('Natural');
      expect(categories.MYTHICAL).toBe('Mythical');
    });

    it('should load exactly 8 categories', () => {
      const categories = loadEventCategories();
      const keys = Object.keys(categories);
      
      expect(keys.length).toBe(8);
    });

    it('should return a frozen object', () => {
      const categories = loadEventCategories();
      
      expect(Object.isFrozen(categories)).toBe(true);
    });

    it('should not allow modification of the returned object', () => {
      const categories = loadEventCategories();
      const originalValue = categories.POLITICAL;
      
      // Attempt to modify should fail silently in non-strict mode
      try {
        categories.POLITICAL = 'Modified';
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Expected in strict mode
      }
      
      expect(categories.POLITICAL).toBe(originalValue);
    });

    it('should not allow adding new properties to the frozen object', () => {
      const categories = loadEventCategories();
      
      // Attempt to add new property should fail silently
      try {
        categories.NEW_CATEGORY = 'New';
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Expected in strict mode
      }
      
      expect(categories.NEW_CATEGORY).toBeUndefined();
    });
  });

  describe('data validation', () => {
    it('should validate that all keys are non-empty strings', () => {
      const categories = loadEventCategories();
      const keys = Object.keys(categories);
      
      keys.forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });

    it('should validate that all values are non-empty strings', () => {
      const categories = loadEventCategories();
      const values = Object.values(categories);
      
      values.forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have unique keys', () => {
      const categories = loadEventCategories();
      const keys = Object.keys(categories);
      const uniqueKeys = new Set(keys);
      
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });

  describe('consistency with original implementation', () => {
    it('should maintain backward compatibility with all original category keys', () => {
      const categories = loadEventCategories();
      
      // Verify all original keys exist
      expect(categories).toHaveProperty('POLITICAL');
      expect(categories).toHaveProperty('SOCIAL');
      expect(categories).toHaveProperty('ECONOMIC');
      expect(categories).toHaveProperty('TECHNOLOGICAL');
      expect(categories).toHaveProperty('CULTURAL_RELIGIOUS');
      expect(categories).toHaveProperty('MILITARY');
      expect(categories).toHaveProperty('NATURAL');
      expect(categories).toHaveProperty('MYTHICAL');
    });

    it('should return the same values as the original hard-coded implementation', () => {
      const categories = loadEventCategories();
      
      // Original implementation values
      const expectedValues = {
        POLITICAL: 'Political',
        SOCIAL: 'Social',
        ECONOMIC: 'Economic',
        TECHNOLOGICAL: 'Technological',
        CULTURAL_RELIGIOUS: 'Cultural/Religious',
        MILITARY: 'Military',
        NATURAL: 'Natural',
        MYTHICAL: 'Mythical',
      };
      
      Object.keys(expectedValues).forEach(key => {
        expect(categories[key]).toBe(expectedValues[key]);
      });
    });
  });
});
