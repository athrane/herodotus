import { RealmResource } from './RealmResource';

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
