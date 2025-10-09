import { Component } from '../ecs/Component';
import { TypeUtils } from '../util/TypeUtils';
import { ModifierSourceType } from './ModifierSourceType';
import { RealmResource } from './RealmResource';
import type { FailureThresholds } from './FailureThresholds';
import type { RealmModifier } from './RealmModifier';
import type { ResourceHistoryEntry } from './ResourceHistoryEntry';

// Re-export all types for convenient access by consumers
export { ModifierSourceType } from './ModifierSourceType';
export { RealmResource } from './RealmResource';
export { ModifierType } from './ModifierType';
export type { FailureThresholds } from './FailureThresholds';
export type { RealmModifier } from './RealmModifier';
export type { ResourceHistoryEntry } from './ResourceHistoryEntry';

/**
 * A singleton component that manages the global state of the dynasty's realm.
 * This component stores core resources (Treasury, Stability, Legitimacy, Hubris),
 * failure thresholds, modifiers, and resource history.
 * 
 * Faction management has been moved to FactionManagerComponent.
 * 
 * This component implements defensive copying for mutable collections
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
  
  /** Critical threshold values for core resources */
  private failureThresholds: FailureThresholds;
  
  /** Active realm-wide modifiers affecting resources */
  private modifiers: RealmModifier[];
  
  /** Historical tracking of resource changes over time */
  private resourceHistory: ResourceHistoryEntry[];
  
  /** Singleton null instance for Null Object Pattern */
  private static nullInstance: RealmStateComponent | null = null;

  /**
   * Private constructor to enforce static factory method pattern.
   * 
   * @param treasury - Initial treasury value
   * @param stability - Initial stability value
   * @param legitimacy - Initial legitimacy value
   * @param hubris - Initial hubris value
   * @param failureThresholds - Failure threshold configuration
   * @param modifiers - Initial modifiers array
   * @param resourceHistory - Initial resource history array
   */
  private constructor(
    treasury: number,
    stability: number,
    legitimacy: number,
    hubris: number,
    failureThresholds: FailureThresholds,
    modifiers: RealmModifier[],
    resourceHistory: ResourceHistoryEntry[]
  ) {
    super();
    this.treasury = treasury;
    this.stability = stability;
    this.legitimacy = legitimacy;
    this.hubris = hubris;
    this.failureThresholds = { ...failureThresholds };
    this.modifiers = [...modifiers];
    this.resourceHistory = [...resourceHistory];
  }

  /**
   * Gets the current treasury value.
   * @returns The current treasury value
   */
  getTreasury(): number {
    return this.treasury;
  }

  /**
   * Sets the treasury value with validation.
   * @param value - The new treasury value
   */
  setTreasury(value: number): void {
    TypeUtils.ensureNumber(value, 'treasury');
    this.treasury = value;
  }

  /**
   * Gets the current stability value.
   * @returns The current stability value
   */
  getStability(): number {
    return this.stability;
  }

  /**
   * Sets the stability value with validation.
   * @param value - The new stability value
   */
  setStability(value: number): void {
    TypeUtils.ensureNumber(value, 'stability');
    this.stability = value;
  }

  /**
   * Gets the current legitimacy value.
   * @returns The current legitimacy value
   */
  getLegitimacy(): number {
    return this.legitimacy;
  }

  /**
   * Sets the legitimacy value with validation.
   * @param value - The new legitimacy value
   */
  setLegitimacy(value: number): void {
    TypeUtils.ensureNumber(value, 'legitimacy');
    this.legitimacy = value;
  }

  /**
   * Gets the current hubris value.
   * @returns The current hubris value
   */
  getHubris(): number {
    return this.hubris;
  }

  /**
   * Sets the hubris value with validation.
   * @param value - The new hubris value
   */
  setHubris(value: number): void {
    TypeUtils.ensureNumber(value, 'hubris');
    this.hubris = value;
  }

  // ========================================================================
  // Failure Threshold Management
  // ========================================================================

  /**
   * Gets the failure thresholds configuration.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A copy of the failure thresholds object
   */
  getFailureThresholds(): FailureThresholds {
    return { ...this.failureThresholds };
  }

  /**
   * Sets the failure thresholds configuration with validation.
   * 
   * @param thresholds - The new failure thresholds
   */
  setFailureThresholds(thresholds: FailureThresholds): void {
    TypeUtils.ensureNumber(thresholds.treasury, 'treasury threshold');
    TypeUtils.ensureNumber(thresholds.stability, 'stability threshold');
    TypeUtils.ensureNumber(thresholds.legitimacy, 'legitimacy threshold');
    TypeUtils.ensureNumber(thresholds.hubris, 'hubris threshold');
    this.failureThresholds = { ...thresholds };
  }

  // ========================================================================
  // Modifier Management
  // ========================================================================

  /**
   * Adds a modifier to the realm state with validation.
   * 
   * @param modifier - The modifier to add
   */
  addModifier(modifier: RealmModifier): void {
    TypeUtils.ensureNonEmptyString(modifier.id, 'modifier id');
    TypeUtils.ensureNonEmptyString(modifier.sourceId, 'modifier sourceId');
    TypeUtils.ensureNumber(modifier.value, 'modifier value');
    TypeUtils.ensureNumber(modifier.duration, 'modifier duration');
    TypeUtils.ensureNonEmptyString(modifier.description, 'modifier description');
    
    this.modifiers.push(modifier);
  }

  /**
   * Removes a modifier from the realm state by its ID.
   * 
   * @param modifierId - The ID of the modifier to remove
   * @returns True if modifier was removed, false if not found
   */
  removeModifier(modifierId: string): boolean {
    TypeUtils.ensureNonEmptyString(modifierId, 'modifierId');
    
    const initialLength = this.modifiers.length;
    this.modifiers = this.modifiers.filter(m => m.id !== modifierId);
    return this.modifiers.length < initialLength;
  }

  /**
   * Gets a modifier by its ID.
   * 
   * @param modifierId - The ID of the modifier to retrieve
   * @returns The modifier if found, undefined otherwise
   */
  getModifier(modifierId: string): RealmModifier | undefined {
    TypeUtils.ensureNonEmptyString(modifierId, 'modifierId');
    return this.modifiers.find(m => m.id === modifierId);
  }

  /**
   * Gets all modifiers as an immutable copy.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A new array containing all modifiers
   */
  getAllModifiers(): RealmModifier[] {
    return [...this.modifiers];
  }

  /**
   * Gets modifiers affecting a specific resource.
   * 
   * @param resource - The resource to filter by
   * @returns An array of modifiers affecting the specified resource
   */
  getModifiersByResource(resource: RealmResource): RealmModifier[] {
    return this.modifiers.filter(m => m.affectedResource === resource);
  }

  /**
   * Gets modifiers from a specific source type.
   * 
   * @param sourceType - The source type to filter by
   * @returns An array of modifiers from the specified source type
   */
  getModifiersBySourceType(sourceType: ModifierSourceType): RealmModifier[] {
    return this.modifiers.filter(m => m.sourceType === sourceType);
  }

  // ========================================================================
  // Resource History Management
  // ========================================================================

  /**
   * Adds a resource history entry with validation.
   * 
   * @param entry - The history entry to add
   */
  addResourceHistoryEntry(entry: ResourceHistoryEntry): void {
    TypeUtils.ensureNumber(entry.timestamp, 'history entry timestamp');
    TypeUtils.ensureNumber(entry.oldValue, 'history entry oldValue');
    TypeUtils.ensureNumber(entry.newValue, 'history entry newValue');
    TypeUtils.ensureNonEmptyString(entry.source, 'history entry source');
    
    this.resourceHistory.push(entry);
  }

  /**
   * Gets all resource history entries as an immutable copy.
   * Returns a defensive copy to prevent external modification.
   * 
   * @returns A new array containing all history entries
   */
  getResourceHistory(): ResourceHistoryEntry[] {
    return [...this.resourceHistory];
  }

  /**
   * Gets resource history entries for a specific resource.
   * 
   * @param resource - The resource to filter by
   * @returns An array of history entries for the specified resource
   */
  getResourceHistoryByResource(resource: RealmResource): ResourceHistoryEntry[] {
    return this.resourceHistory.filter(entry => entry.resource === resource);
  }

  /**
   * Gets resource history entries within a time range.
   * 
   * @param startTimestamp - The start of the time range (inclusive)
   * @param endTimestamp - The end of the time range (inclusive)
   * @returns An array of history entries within the specified time range
   */
  getResourceHistoryByTimeRange(startTimestamp: number, endTimestamp: number): ResourceHistoryEntry[] {
    TypeUtils.ensureNumber(startTimestamp, 'startTimestamp');
    TypeUtils.ensureNumber(endTimestamp, 'endTimestamp');
    
    return this.resourceHistory.filter(
      entry => entry.timestamp >= startTimestamp && entry.timestamp <= endTimestamp
    );
  }

  /**
   * Clears all resource history entries.
   * Useful for resetting history or managing memory usage.
   */
  clearResourceHistory(): void {
    this.resourceHistory = [];
  }

  /**
   * Static factory method to create a new RealmStateComponent instance.
   * Creates with default starting values for a new dynasty.
   * 
   * @param treasury - Initial treasury value (default: 100)
   * @param stability - Initial stability value (default: 50)
   * @param legitimacy - Initial legitimacy value (default: 50)
   * @param hubris - Initial hubris value (default: 0)
   * @param failureThresholds - Failure threshold configuration (default: standard thresholds)
   * @param modifiers - Initial modifiers array (default: empty)
   * @param resourceHistory - Initial resource history array (default: empty)
   * @returns A new RealmStateComponent instance
   */
  static create(
    treasury: number = 100,
    stability: number = 50,
    legitimacy: number = 50,
    hubris: number = 0,
    failureThresholds: FailureThresholds = {
      treasury: 0,
      stability: 0,
      legitimacy: 0,
      hubris: 100
    },
    modifiers: RealmModifier[] = [],
    resourceHistory: ResourceHistoryEntry[] = []
  ): RealmStateComponent {
    TypeUtils.ensureNumber(treasury, 'treasury');
    TypeUtils.ensureNumber(stability, 'stability');
    TypeUtils.ensureNumber(legitimacy, 'legitimacy');
    TypeUtils.ensureNumber(hubris, 'hubris');
    TypeUtils.ensureArray(modifiers, 'modifiers');
    TypeUtils.ensureArray(resourceHistory, 'resourceHistory');

    return new RealmStateComponent(
      treasury,
      stability,
      legitimacy,
      hubris,
      failureThresholds,
      modifiers,
      resourceHistory
    );
  }

  /**
   * Static factory method to create a singleton null object instance.
   * Implements the Null Object Pattern with lazy initialization.
   * 
   * @returns A singleton null RealmStateComponent instance
   */
  static createNull(): RealmStateComponent {
    if (!RealmStateComponent.nullInstance) {
      RealmStateComponent.nullInstance = new RealmStateComponent(
        0,
        0,
        0,
        0,
        { treasury: 0, stability: 0, legitimacy: 0, hubris: 100 },
        [],
        []
      );
    }
    return RealmStateComponent.nullInstance;
  }

}
