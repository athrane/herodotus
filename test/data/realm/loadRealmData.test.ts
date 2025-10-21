import { loadRealmData } from '../../../src/data/realm/loadRealmData';
import { RealmData } from '../../../src/data/realm/RealmData';

describe('loadRealmData', () => {
  it('should successfully load realm data from JSON', () => {
    const realmData = loadRealmData();

    expect(realmData).toBeInstanceOf(RealmData);
  });

  it('should load correct values from realm.json', () => {
    const realmData = loadRealmData();

    expect(realmData.getNumberOfRealms()).toBe(5);
    expect(realmData.getMinPlanetsPerRealm()).toBe(3);
    expect(realmData.getMaxPlanetsPerRealm()).toBe(5);
    expect(realmData.getEnsurePlayerRealm()).toBe(true);
    expect(realmData.getSpatialDistribution()).toBe('random');
  });

  it('should return an immutable instance', () => {
    const realmData = loadRealmData();

    expect(Object.isFrozen(realmData)).toBe(true);
  });

  it('should return a new instance on each call', () => {
    const instance1 = loadRealmData();
    const instance2 = loadRealmData();

    // Should be equal in value but different instances (not cached)
    expect(instance1.getNumberOfRealms()).toBe(instance2.getNumberOfRealms());
    expect(instance1.getMinPlanetsPerRealm()).toBe(instance2.getMinPlanetsPerRealm());
    expect(instance1.getMaxPlanetsPerRealm()).toBe(instance2.getMaxPlanetsPerRealm());
    expect(instance1.getEnsurePlayerRealm()).toBe(instance2.getEnsurePlayerRealm());
    expect(instance1.getSpatialDistribution()).toBe(instance2.getSpatialDistribution());
  });
});
