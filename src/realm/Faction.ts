import { TypeUtils } from '../util/TypeUtils';

/**
 * Represents a political or social faction within the realm.
 * Factions have influence (their power/control) and allegiance (their loyalty to the dynasty).
 * 
 * This class implements the Null Object Pattern for safe default instances.
 */
export class Faction {
  /** The unique name/identifier of the faction */
  private readonly name: string;
  
  /** The faction's power and control within the realm (0-100) */
  private influence: number;
  
  /** The faction's loyalty to the player's dynasty (0-100) */
  private allegiance: number;
  
  /** Singleton null instance for Null Object Pattern */
  private static nullInstance: Faction | null = null;

  /**
   * Private constructor to enforce static factory method pattern.
   * 
   * @param name - The unique name of the faction
   * @param influence - The faction's power/control level (0-100)
   * @param allegiance - The faction's loyalty to the dynasty (0-100)
   */
  private constructor(name: string, influence: number, allegiance: number) {
    this.name = name;
    this.influence = influence;
    this.allegiance = allegiance;
  }

  /**
   * Gets the faction's name.
   * @returns The faction name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets the faction's influence value.
   * @returns The current influence value
   */
  getInfluence(): number {
    return this.influence;
  }

  /**
   * Sets the faction's influence value with validation.
   * @param value - The new influence value
   */
  setInfluence(value: number): void {
    TypeUtils.ensureNumber(value, 'influence');
    this.influence = value;
  }

  /**
   * Gets the faction's allegiance value.
   * @returns The current allegiance value
   */
  getAllegiance(): number {
    return this.allegiance;
  }

  /**
   * Sets the faction's allegiance value with validation.
   * @param value - The new allegiance value
   */
  setAllegiance(value: number): void {
    TypeUtils.ensureNumber(value, 'allegiance');
    this.allegiance = value;
  }

  /**
   * Static factory method to create a new Faction instance.
   * 
   * @param name - The unique name of the faction
   * @param influence - Initial influence value (default: 0)
   * @param allegiance - Initial allegiance value (default: 0)
   * @returns A new Faction instance
   */
  static create(name: string, influence: number = 0, allegiance: number = 0): Faction {
    TypeUtils.ensureNonEmptyString(name, 'name');
    TypeUtils.ensureNumber(influence, 'influence');
    TypeUtils.ensureNumber(allegiance, 'allegiance');
    
    return new Faction(name, influence, allegiance);
  }

  /**
   * Static factory method to create a singleton null object instance.
   * Implements the Null Object Pattern with lazy initialization.
   * 
   * @returns A singleton null Faction instance
   */
  static createNull(): Faction {
    if (!Faction.nullInstance) {
      Faction.nullInstance = new Faction('', 0, 0);
    }
    return Faction.nullInstance;
  }
}
