import realmDataRaw from '../../../data/realm/realm.json';
import { RealmData } from './RealmData';

/**
 * Loads realm generation configuration from a JSON file.
 * @returns A RealmData instance containing realm generation configuration.
 */
export function loadRealmData(): RealmData {
  return RealmData.create(realmDataRaw);
}
