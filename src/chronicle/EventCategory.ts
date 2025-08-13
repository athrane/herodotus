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
