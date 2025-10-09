import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';
import { Faction } from './Faction';

/**
 * A singleton component that manages all factions within the realm.
 * This component provides centralized storage and API for faction-related operations.
 * 
 * Factions represent political and social groups with their own influence (power/control)
 * and allegiance (loyalty to the dynasty).
 * 
 * This component implements defensive copying for the faction map.
 */
export class FactionManagerComponent extends Component {
  /** Map of faction name to Faction instance */
  private factions: Map<string, Faction>;
  
  /** Singleton null instance for Null Object Pattern */
  private static nullInstance: FactionManagerComponent | null = null;

  /**
   * Private constructor to enforce static factory method pattern.
   * 
   * @param factions - Initial map of factions
   */
  private constructor(factions: Map<string, Faction>) {
    super();
    this.factions = new Map(factions);
  }

  /**
   * Gets a faction by name.
   * 
   * @param factionName - The name of the faction to retrieve
   * @returns The Faction instance, or null if not found
   */
  getFaction(factionName: string): Faction | null {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    return this.factions.get(factionName) ?? null;
  }

  /**
   * Creates or updates a faction with the given name and values.
   * If the faction already exists, it will be replaced.
   * 
   * @param factionName - The name of the faction
   * @param influence - The faction's influence value
   * @param allegiance - The faction's allegiance value
   */
  setFaction(factionName: string, influence: number, allegiance: number): void {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    TypeUtils.ensureNumber(influence, 'influence');
    TypeUtils.ensureNumber(allegiance, 'allegiance');
    
    const faction = Faction.create(factionName, influence, allegiance);
    this.factions.set(factionName, faction);
  }

  /**
   * Gets the influence value for a specific faction.
   * 
   * @param factionName - The name of the faction
   * @returns The influence value, or 0 if faction not found
   */
  getFactionInfluence(factionName: string): number {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    const faction = this.factions.get(factionName);
    return faction ? faction.getInfluence() : 0;
  }

  /**
   * Sets the influence value for a specific faction.
   * Creates the faction if it doesn't exist.
   * 
   * @param factionName - The name of the faction
   * @param value - The new influence value
   */
  setFactionInfluence(factionName: string, value: number): void {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    TypeUtils.ensureNumber(value, 'influence value');
    
    let faction = this.factions.get(factionName);
    if (!faction) {
      faction = Faction.create(factionName, value, 0);
      this.factions.set(factionName, faction);
    } else {
      faction.setInfluence(value);
    }
  }

  /**
   * Gets the allegiance value for a specific faction.
   * 
   * @param factionName - The name of the faction
   * @returns The allegiance value, or 0 if faction not found
   */
  getFactionAllegiance(factionName: string): number {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    const faction = this.factions.get(factionName);
    return faction ? faction.getAllegiance() : 0;
  }

  /**
   * Sets the allegiance value for a specific faction.
   * Creates the faction if it doesn't exist.
   * 
   * @param factionName - The name of the faction
   * @param value - The new allegiance value
   */
  setFactionAllegiance(factionName: string, value: number): void {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    TypeUtils.ensureNumber(value, 'allegiance value');
    
    let faction = this.factions.get(factionName);
    if (!faction) {
      faction = Faction.create(factionName, 0, value);
      this.factions.set(factionName, faction);
    } else {
      faction.setAllegiance(value);
    }
  }

  /**
   * Checks if a faction exists in the manager.
   * 
   * @param factionName - The name of the faction
   * @returns True if faction exists, false otherwise
   */
  hasFaction(factionName: string): boolean {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    return this.factions.has(factionName);
  }

  /**
   * Removes a faction from the manager.
   * 
   * @param factionName - The name of the faction to remove
   * @returns True if faction was removed, false if it didn't exist
   */
  removeFaction(factionName: string): boolean {
    TypeUtils.ensureNonEmptyString(factionName, 'factionName');
    return this.factions.delete(factionName);
  }

  /**
   * Gets all faction names.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns An array of all faction names
   */
  getAllFactionNames(): string[] {
    return Array.from(this.factions.keys());
  }

  /**
   * Gets all factions as a map.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A new Map containing all factions
   */
  getAllFactions(): Map<string, Faction> {
    return new Map(this.factions);
  }

  /**
   * Gets all faction influence data as a map of name to influence value.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A new Map containing faction names and their influence values
   */
  getAllFactionInfluence(): Map<string, number> {
    const influenceMap = new Map<string, number>();
    for (const [name, faction] of this.factions) {
      influenceMap.set(name, faction.getInfluence());
    }
    return influenceMap;
  }

  /**
   * Gets all faction allegiance data as a map of name to allegiance value.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A new Map containing faction names and their allegiance values
   */
  getAllFactionAllegiance(): Map<string, number> {
    const allegianceMap = new Map<string, number>();
    for (const [name, faction] of this.factions) {
      allegianceMap.set(name, faction.getAllegiance());
    }
    return allegianceMap;
  }

  /**
   * Clears all factions from the manager.
   */
  clearAllFactions(): void {
    this.factions.clear();
  }

  /**
   * Static factory method to create a new FactionManagerComponent instance.
   * 
   * @param factions - Initial map of factions (default: empty)
   * @returns A new FactionManagerComponent instance
   */
  static create(factions: Map<string, Faction> = new Map()): FactionManagerComponent {
    TypeUtils.ensureInstanceOf(factions, Map, 'factions');
    return new FactionManagerComponent(factions);
  }

  /**
   * Static factory method to create a singleton null object instance.
   * Implements the Null Object Pattern with lazy initialization.
   * 
   * @returns A singleton null FactionManagerComponent instance
   */
  static createNull(): FactionManagerComponent {
    if (!FactionManagerComponent.nullInstance) {
      FactionManagerComponent.nullInstance = new FactionManagerComponent(new Map());
    }
    return FactionManagerComponent.nullInstance;
  }
}
