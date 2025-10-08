import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Enum representing the source type of a realm modifier.
 */
export enum ModifierSourceType {
  PlayerAction = 'PlayerAction',
  NonPlayerAction = 'NonPlayerAction',
  FactionInfluence = 'FactionInfluence',
  Event = 'Event'
}

/**
 * Enum representing realm resources that can be modified.
 */
export enum RealmResource {
  Treasury = 'Treasury',
  Stability = 'Stability',
  Legitimacy = 'Legitimacy',
  Hubris = 'Hubris'
}

/**
 * Enum representing the type of modification.
 */
export enum ModifierType {
  Flat = 'Flat',
  Percentage = 'Percentage',
  Multiplier = 'Multiplier'
}

/**
 * Interface defining critical threshold values for realm failure conditions.
 */
export interface FailureThresholds {
  treasury: number;
  stability: number;
  legitimacy: number;
  hubris: number;
}

/**
 * Interface representing an active modification to realm state.
 */
export interface RealmModifier {
  id: string;
  sourceType: ModifierSourceType;
  sourceId: string;
  affectedResource: RealmResource;
  modifierType: ModifierType;
  value: number;
  duration: number;
  description: string;
}

/**
 * Interface tracking historical resource changes.
 */
export interface ResourceHistoryEntry {
  timestamp: number;
  resource: RealmResource;
  oldValue: number;
  newValue: number;
  source: string;
}

/**
 * A singleton component that manages the global state of the dynasty's realm.
 * This component stores core resources (Treasury, Stability, Legitimacy, Hubris),
 * faction data (Influence and Allegiance), failure thresholds, modifiers, and
 * resource history.
 * 
 * This component follows the project's ECS patterns:
 * - Data-only design (no business logic)
 * - Static factory methods (create() and createNull())
 * - Runtime type validation via TypeUtils
 * - Defensive copying for mutable collections
 */
export class RealmStateComponent extends Component {
  /** Core resource: Financial resources available to the realm */
  private treasury: number;
  
  /** Core resource: Internal order and cohesion of the realm */
  private stability: number;
  
  /** Core resource: Perceived rightful authority of the dynasty */
  private legitimacy: number;
  
  /** Core resource: Dynasty's overreach and arrogance level */
  private hubris: number;
  
  /** Faction data: Power and control of each faction within the realm */
  private factionInfluence: Map<string, number>;
  
  /** Faction data: Loyalty of each faction to the player's dynasty */
  private factionAllegiance: Map<string, number>;
  
  /** Critical threshold values for core resources */
  private failureThresholds: FailureThresholds;
  
  /** Active realm-wide modifiers affecting resources */
  private modifiers: RealmModifier[];
  
  /** Historical tracking of resource changes over time */
  private resourceHistory: ResourceHistoryEntry[];
  
  /** Singleton null instance for the Null Object Pattern */
  private static nullInstance: RealmStateComponent | null = null;

  /**
   * Creates an instance of RealmStateComponent.
   * 
   * @param treasury - Financial resources (default: 100)
   * @param stability - Internal order and cohesion (default: 100)
   * @param legitimacy - Rightful authority perception (default: 100)
   * @param hubris - Dynasty's overreach (default: 0)
   * @param factionInfluence - Map of faction IDs to influence values (default: empty Map)
   * @param factionAllegiance - Map of faction IDs to allegiance values (default: empty Map)
   * @param failureThresholds - Critical threshold values (default: all 0)
   * @param modifiers - Active modifiers (default: empty array)
   * @param resourceHistory - Resource change history (default: empty array)
   */
  constructor(
    treasury: number = 100,
    stability: number = 100,
    legitimacy: number = 100,
    hubris: number = 0,
    factionInfluence: Map<string, number> = new Map(),
    factionAllegiance: Map<string, number> = new Map(),
    failureThresholds: FailureThresholds = { treasury: 0, stability: 0, legitimacy: 0, hubris: 100 },
    modifiers: RealmModifier[] = [],
    resourceHistory: ResourceHistoryEntry[] = []
  ) {
    super();
    
    // Validate core resources
    TypeUtils.ensureNumber(treasury, 'treasury must be a number');
    TypeUtils.ensureNumber(stability, 'stability must be a number');
    TypeUtils.ensureNumber(legitimacy, 'legitimacy must be a number');
    TypeUtils.ensureNumber(hubris, 'hubris must be a number');
    
    // Validate faction data structures
    if (!(factionInfluence instanceof Map)) {
      throw new TypeError('factionInfluence must be a Map');
    }
    if (!(factionAllegiance instanceof Map)) {
      throw new TypeError('factionAllegiance must be a Map');
    }
    
    // Validate arrays
    TypeUtils.ensureArray(modifiers, 'modifiers must be an array');
    TypeUtils.ensureArray(resourceHistory, 'resourceHistory must be an array');
    
    this.treasury = treasury;
    this.stability = stability;
    this.legitimacy = legitimacy;
    this.hubris = hubris;
    this.factionInfluence = new Map(factionInfluence);
    this.factionAllegiance = new Map(factionAllegiance);
    this.failureThresholds = { ...failureThresholds };
    this.modifiers = [...modifiers];
    this.resourceHistory = [...resourceHistory];
  }

  /**
   * Static factory method to create a new RealmStateComponent instance.
   * 
   * @param treasury - Financial resources (default: 100)
   * @param stability - Internal order and cohesion (default: 100)
   * @param legitimacy - Rightful authority perception (default: 100)
   * @param hubris - Dynasty's overreach (default: 0)
   * @param factionInfluence - Map of faction IDs to influence values (default: empty Map)
   * @param factionAllegiance - Map of faction IDs to allegiance values (default: empty Map)
   * @param failureThresholds - Critical threshold values (default: all 0)
   * @param modifiers - Active modifiers (default: empty array)
   * @param resourceHistory - Resource change history (default: empty array)
   * @returns A new RealmStateComponent instance
   */
  static create(
    treasury: number = 100,
    stability: number = 100,
    legitimacy: number = 100,
    hubris: number = 0,
    factionInfluence: Map<string, number> = new Map(),
    factionAllegiance: Map<string, number> = new Map(),
    failureThresholds: FailureThresholds = { treasury: 0, stability: 0, legitimacy: 0, hubris: 100 },
    modifiers: RealmModifier[] = [],
    resourceHistory: ResourceHistoryEntry[] = []
  ): RealmStateComponent {
    return new RealmStateComponent(
      treasury,
      stability,
      legitimacy,
      hubris,
      factionInfluence,
      factionAllegiance,
      failureThresholds,
      modifiers,
      resourceHistory
    );
  }

  /**
   * Static factory method to create a null RealmStateComponent instance.
   * Implements the Null Object Pattern with lazy initialization.
   * 
   * @returns A singleton null RealmStateComponent instance
   */
  static createNull(): RealmStateComponent {
    if (!RealmStateComponent.nullInstance) {
      RealmStateComponent.nullInstance = RealmStateComponent.create(
        0,
        0,
        0,
        0,
        new Map(),
        new Map(),
        { treasury: 0, stability: 0, legitimacy: 0, hubris: 0 },
        [],
        []
      );
    }
    return RealmStateComponent.nullInstance;
  }

  // Core Resource Getters and Setters

  /**
   * Gets the treasury value.
   * @returns The treasury value
   */
  getTreasury(): number {
    return this.treasury;
  }

  /**
   * Sets the treasury value.
   * @param value - The new treasury value
   */
  setTreasury(value: number): void {
    TypeUtils.ensureNumber(value, 'treasury must be a number');
    this.treasury = value;
  }

  /**
   * Gets the stability value.
   * @returns The stability value
   */
  getStability(): number {
    return this.stability;
  }

  /**
   * Sets the stability value.
   * @param value - The new stability value
   */
  setStability(value: number): void {
    TypeUtils.ensureNumber(value, 'stability must be a number');
    this.stability = value;
  }

  /**
   * Gets the legitimacy value.
   * @returns The legitimacy value
   */
  getLegitimacy(): number {
    return this.legitimacy;
  }

  /**
   * Sets the legitimacy value.
   * @param value - The new legitimacy value
   */
  setLegitimacy(value: number): void {
    TypeUtils.ensureNumber(value, 'legitimacy must be a number');
    this.legitimacy = value;
  }

  /**
   * Gets the hubris value.
   * @returns The hubris value
   */
  getHubris(): number {
    return this.hubris;
  }

  /**
   * Sets the hubris value.
   * @param value - The new hubris value
   */
  setHubris(value: number): void {
    TypeUtils.ensureNumber(value, 'hubris must be a number');
    this.hubris = value;
  }

  // Faction Management Methods

  /**
   * Gets the influence value for a specific faction.
   * @param factionId - The faction identifier
   * @returns The influence value, or undefined if faction not found
   */
  getFactionInfluence(factionId: string): number | undefined {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    return this.factionInfluence.get(factionId);
  }

  /**
   * Sets the influence value for a specific faction.
   * @param factionId - The faction identifier
   * @param value - The influence value
   */
  setFactionInfluence(factionId: string, value: number): void {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    TypeUtils.ensureNumber(value, 'influence value must be a number');
    this.factionInfluence.set(factionId, value);
  }

  /**
   * Checks if a faction has an influence value.
   * @param factionId - The faction identifier
   * @returns True if the faction has an influence value
   */
  hasFactionInfluence(factionId: string): boolean {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    return this.factionInfluence.has(factionId);
  }

  /**
   * Gets all faction influence data as a defensive copy.
   * @returns A new Map containing all faction influence values
   */
  getAllFactionInfluence(): Map<string, number> {
    return new Map(this.factionInfluence);
  }

  /**
   * Gets the allegiance value for a specific faction.
   * @param factionId - The faction identifier
   * @returns The allegiance value, or undefined if faction not found
   */
  getFactionAllegiance(factionId: string): number | undefined {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    return this.factionAllegiance.get(factionId);
  }

  /**
   * Sets the allegiance value for a specific faction.
   * @param factionId - The faction identifier
   * @param value - The allegiance value
   */
  setFactionAllegiance(factionId: string, value: number): void {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    TypeUtils.ensureNumber(value, 'allegiance value must be a number');
    this.factionAllegiance.set(factionId, value);
  }

  /**
   * Checks if a faction has an allegiance value.
   * @param factionId - The faction identifier
   * @returns True if the faction has an allegiance value
   */
  hasFactionAllegiance(factionId: string): boolean {
    TypeUtils.ensureString(factionId, 'factionId must be a string');
    return this.factionAllegiance.has(factionId);
  }

  /**
   * Gets all faction allegiance data as a defensive copy.
   * @returns A new Map containing all faction allegiance values
   */
  getAllFactionAllegiance(): Map<string, number> {
    return new Map(this.factionAllegiance);
  }

  // Failure Threshold Methods

  /**
   * Gets the failure thresholds as a defensive copy.
   * @returns A copy of the failure thresholds object
   */
  getFailureThresholds(): FailureThresholds {
    return { ...this.failureThresholds };
  }

  /**
   * Sets the failure thresholds.
   * @param thresholds - The new failure thresholds
   */
  setFailureThresholds(thresholds: FailureThresholds): void {
    if (typeof thresholds !== 'object' || thresholds === null) {
      throw new TypeError('thresholds must be an object');
    }
    TypeUtils.ensureNumber(thresholds.treasury, 'treasury threshold must be a number');
    TypeUtils.ensureNumber(thresholds.stability, 'stability threshold must be a number');
    TypeUtils.ensureNumber(thresholds.legitimacy, 'legitimacy threshold must be a number');
    TypeUtils.ensureNumber(thresholds.hubris, 'hubris threshold must be a number');
    this.failureThresholds = { ...thresholds };
  }

  // Modifier Management Methods

  /**
   * Adds a modifier to the realm state.
   * @param modifier - The modifier to add
   */
  addModifier(modifier: RealmModifier): void {
    if (typeof modifier !== 'object' || modifier === null) {
      throw new TypeError('modifier must be an object');
    }
    TypeUtils.ensureString(modifier.id, 'modifier.id must be a string');
    TypeUtils.ensureString(modifier.sourceId, 'modifier.sourceId must be a string');
    TypeUtils.ensureNumber(modifier.value, 'modifier.value must be a number');
    TypeUtils.ensureNumber(modifier.duration, 'modifier.duration must be a number');
    TypeUtils.ensureString(modifier.description, 'modifier.description must be a string');
    this.modifiers.push({ ...modifier });
  }

  /**
   * Removes a modifier by its ID.
   * @param modifierId - The ID of the modifier to remove
   * @returns True if the modifier was removed, false if not found
   */
  removeModifier(modifierId: string): boolean {
    TypeUtils.ensureString(modifierId, 'modifierId must be a string');
    const initialLength = this.modifiers.length;
    this.modifiers = this.modifiers.filter(m => m.id !== modifierId);
    return this.modifiers.length < initialLength;
  }

  /**
   * Gets all modifiers as a defensive copy.
   * @returns A new array containing copies of all modifiers
   */
  getModifiers(): RealmModifier[] {
    return this.modifiers.map(m => ({ ...m }));
  }

  /**
   * Gets a specific modifier by ID.
   * @param modifierId - The ID of the modifier to retrieve
   * @returns A copy of the modifier, or undefined if not found
   */
  getModifier(modifierId: string): RealmModifier | undefined {
    TypeUtils.ensureString(modifierId, 'modifierId must be a string');
    const modifier = this.modifiers.find(m => m.id === modifierId);
    return modifier ? { ...modifier } : undefined;
  }

  // Resource History Methods

  /**
   * Adds a resource history entry.
   * @param entry - The history entry to add
   */
  addResourceHistoryEntry(entry: ResourceHistoryEntry): void {
    if (typeof entry !== 'object' || entry === null) {
      throw new TypeError('entry must be an object');
    }
    TypeUtils.ensureNumber(entry.timestamp, 'entry.timestamp must be a number');
    TypeUtils.ensureNumber(entry.oldValue, 'entry.oldValue must be a number');
    TypeUtils.ensureNumber(entry.newValue, 'entry.newValue must be a number');
    TypeUtils.ensureString(entry.source, 'entry.source must be a string');
    this.resourceHistory.push({ ...entry });
  }

  /**
   * Gets the resource history as a defensive copy.
   * @returns A new array containing copies of all history entries
   */
  getResourceHistory(): ResourceHistoryEntry[] {
    return this.resourceHistory.map(e => ({ ...e }));
  }

  /**
   * Gets the resource history for a specific resource.
   * @param resource - The resource to filter by
   * @returns A new array containing copies of history entries for the specified resource
   */
  getResourceHistoryForResource(resource: RealmResource): ResourceHistoryEntry[] {
    return this.resourceHistory
      .filter(e => e.resource === resource)
      .map(e => ({ ...e }));
  }
}
