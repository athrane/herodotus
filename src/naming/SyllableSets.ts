/**
 * Defines a collection of syllable sets for procedural name generation,
 * categorized by linguistic characteristics. This allows for the creation of
 * names with distinct flavors, suitable for various cultural or geographical
 * contexts within a procedurally generated world.
 *
 * The structure is designed to be easily expandable with new syllable sets
 * to increase the variety of generated names. Each set is an object containing
 * arrays of initial, middle, and final syllables, which can be combined to
 * form names.
 */

/**
 * Represents a syllable set with initial, middle, and final syllables.
 */
export interface SyllableSet {
  /** Syllables that can start a name. */
  readonly initial: readonly string[];
  /** Syllables for the middle of a name. */
  readonly middle: readonly string[];
  /** Syllables that can end a name. */
  readonly final: readonly string[];
}

/**
 * Collection of syllable sets for procedural name generation.
 */
export const SyllableSets: Record<string, SyllableSet> = {
  /**
   * A generic, vaguely fantasy-sounding set of syllables.
   */
  GENERIC: {
    initial: ['a', 'be', 'co', 'de', 'e', 'fe', 'ge', 'he', 'i', 'je', 'ke', 'le', 'me', 'ne', 'o', 'pe', 'que', 're', 'se', 'te', 'u', 've', 'we', 'xe', 'ye', 'ze'],
    middle: ['ra', 'ta', 'sa', 'la', 'na', 'ma', 'ka', 'da', 'ga', 'pa', 'fa', 'va', 'za', 'xa', 'ca', 'ba', 'ha', 'ja', 'qa', 'wa', 'ya'],
    final: ['l', 'm', 'n', 'r', 's', 't', 'th', 'sh', 'ch', 'ph', 'gh', 'p', 'k', 'd', 'g', 'b', 'v', 'z', 'x', 'c']
  },
  /**
   * Syllables with a more guttural, harsh sound.
   */
  GUTTURAL: {
    initial: ['gor', 'ur', 'thra', 'kro', 'gru', 'o', 'u'],
    middle: ['gg', 'rr', 'kk', 'th', 'sh', 'gh'],
    final: ['k', 'g', 'r', 'th', 'sh', 'gh']
  },
  /**
   * Syllables with a more flowing, melodic sound.
   */
  MELODIC: {
    initial: ['a', 'e', 'i', 'o', 'u', 'al', 'el', 'il', 'ol', 'ul', 'an', 'en', 'in', 'on', 'un'],
    middle: ['la', 'le', 'li', 'lo', 'lu', 'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su'],
    final: ['a', 'e', 'i', 'o', 'u', 'l', 'm', 'n', 'r', 's']
  }
} as const;