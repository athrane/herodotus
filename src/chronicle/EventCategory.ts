/**
 * Defines the categories for historical events.
 * Exported as a frozen object to prevent runtime mutation.
 */
export const EventCategory = Object.freeze({
  POLITICAL: 'Political',
  SOCIAL: 'Social',
  ECONOMIC: 'Economic',
  TECHNOLOGICAL: 'Technological',
  CULTURAL_RELIGIOUS: 'Cultural/Religious',
  MILITARY: 'Military',
  NATURAL: 'Natural',
  MYTHICAL: 'Mythical',
} as const);

/**
 * Union of all category string values, e.g., 'Political' | 'Social' | ... 
 * @typedef {string} EventCategoryValue
 * 
 * @example
 * const a: EventCategoryValue = EventCategory.POLITICAL;
 * const b: EventCategoryValue = 'Social'; // also valid
 */
export type EventCategoryValue = typeof EventCategory[keyof typeof EventCategory];

/** 
 * Union of all category keys, e.g., 'POLITICAL' | 'SOCIAL' | ... 
 * @typedef {string} EventCategoryKey
 */
export type EventCategoryKey = keyof typeof EventCategory;

/**
 * Convenience function to look up an EventCategory value from a string.
 * Performs case-insensitive matching against both keys and values.
 * @param str - The string to match against category names
 * @returns The matching EventCategoryValue, or SOCIAL as default
 */
export function getEventCategoryFromString(str: string): EventCategoryValue {
  if (!str) return EventCategory.SOCIAL;
  
  const upperStr = str.toUpperCase();
  
  // First try exact key match
  const categoryKeys = Object.keys(EventCategory) as EventCategoryKey[];
  for (const key of categoryKeys) {
    if (key === upperStr) {
      return EventCategory[key];
    }
  }
  
  // Then try case-insensitive value match
  const entries = Object.entries(EventCategory) as [EventCategoryKey, EventCategoryValue][];
  for (const [, value] of entries) {
    if (value.toUpperCase() === upperStr) {
      return value;
    }
  }
  
  // Default fallback
  return EventCategory.SOCIAL;
}