import { ModifierSourceType } from './ModifierSourceType';
import { RealmResource } from './RealmResource';
import { ModifierType } from './ModifierType';

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
