import eventCategoriesRaw from '../../../data/chronicle/event-category.json';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * Loads event categories from JSON configuration.
 * Validates data structure using TypeUtils for runtime type safety.
 * @returns A frozen object mapping category keys to values.
 * @throws {TypeError} If JSON structure is invalid or missing required fields.
 */
export function loadEventCategories(): Record<string, string> {
  TypeUtils.ensureObject(eventCategoriesRaw, 'eventCategoriesRaw');
  TypeUtils.ensureArray(eventCategoriesRaw.categories, 'eventCategoriesRaw.categories');
  
  const categories: Record<string, string> = {};
  
  for (const category of eventCategoriesRaw.categories) {
    TypeUtils.ensureObject(category, 'category');
    TypeUtils.ensureNonEmptyString(category.key, 'category.key');
    TypeUtils.ensureNonEmptyString(category.value, 'category.value');
    
    categories[category.key] = category.value;
  }
  
  return Object.freeze(categories);
}
