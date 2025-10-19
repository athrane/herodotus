# PR #328: Refactor "political" to "realm" in worldgen.json

## Summary

Rename the `political` configuration section to `realm` in `worldgen.json` for improved semantic clarity and consistency with the codebase's domain terminology.

## Motivation

The current configuration uses `political` as the top-level key for realm generation settings, but the codebase consistently uses "realm" terminology throughout:
- `PoliticalLandscapeGenerator` generates **realms** (not generic political entities)
- `TerritorialRealmComponent` represents **realm** entities
- `RealmStateComponent`, `RealmResource`, `RealmModifier` all use **realm** naming
- Documentation refers to "political **realms**" consistently

The configuration key should align with this established domain language to improve developer experience and reduce cognitive friction.

## Changes

### Configuration Schema Update

**Before:**
```json
{
  "numSectors": 3,
  "planetsPerSector": 64,
  "featuresPerContinent": 50,
  "continentsPerPlanet": 5,
  "featuresPerPlanetContinent": 64,
  "political": {
    "numberOfRealms": 5,
    "minPlanetsPerRealm": 3,
    "maxPlanetsPerRealm": 5,
    "ensurePlayerRealm": true,
    "spatialDistribution": "random"
  }
}
```

**After:**
```json
{
  "numSectors": 3,
  "planetsPerSector": 64,
  "featuresPerContinent": 50,
  "continentsPerPlanet": 5,
  "featuresPerPlanetContinent": 64,
  "realm": {
    "numberOfRealms": 5,
    "minPlanetsPerRealm": 3,
    "maxPlanetsPerRealm": 5,
    "ensurePlayerRealm": true,
    "spatialDistribution": "random"
  }
}
```

### Code Changes

1. **`src/data/geography/worldgen/WorldGenData.ts`**
   - Rename property: `politicalConfiguration` → `realmConfiguration`
   - Update constructor validation messages
   - Update getter method: `getPoliticalConfiguration()` → `getRealmConfiguration()`
   - Update `createNull()` factory method

2. **`src/simulation/builder/SimulationBuilder.ts`**
   - Update reference: `worldGenData.getPoliticalConfiguration()` → `worldGenData.getRealmConfiguration()`
   - Update variable names for clarity

3. **`test/data/geography/worldgen/WorldGenData.test.ts`**
   - Update all test cases to use `realmConfiguration` property name
   - Update test descriptions to reference "realm" instead of "political"

4. **`data/geography/world/worldgen.json`**
   - Rename top-level key: `"political"` → `"realm"`

### Documentation Updates

- Update inline code comments referencing political configuration
- Update any JSDoc references to align with new terminology
- Update STEP_4_COMPLETION_SUMMARY.md if it references the configuration structure

## Impact Analysis

### Breaking Changes
- ✅ **Configuration File Format**: External JSON structure changes (minor version bump recommended)
- ✅ **Public API**: `WorldGenData.getPoliticalConfiguration()` renamed to `getRealmConfiguration()`

### Non-Breaking
- ❌ Internal implementation details
- ❌ ECS component structure
- ❌ Simulation behavior
- ❌ Test coverage

### Migration Path

For users with custom worldgen.json files:

```diff
{
  "numSectors": 3,
  "planetsPerSector": 64,
- "political": {
+ "realm": {
    "numberOfRealms": 5,
    "minPlanetsPerRealm": 3,
    "maxPlanetsPerRealm": 5,
    "ensurePlayerRealm": true,
    "spatialDistribution": "random"
  }
}
```

## Testing Strategy

1. **Unit Tests**
   - Verify `WorldGenData.create()` correctly parses `realm` property
   - Verify `getRealmConfiguration()` returns expected configuration object
   - Verify `createNull()` provides sensible realm defaults
   - Verify validation errors reference correct property names

2. **Integration Tests**
   - Verify `SimulationBuilder` correctly reads realm configuration
   - Verify `PoliticalLandscapeGenerator` receives correct parameters
   - Verify simulation generates expected number of realms

3. **Regression Tests**
   - Run full test suite: `npm test` (all 1024 tests must pass)
   - Verify TypeScript compilation: `npm run typecheck`
   - Verify linting: `npm run lint`
   - Verify build: `npm run build`
   - Verify simulation execution: `npm run dev`

## Validation Checklist

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Simulation runs and generates expected realms (`npm run dev`)
- [ ] No references to old "political" terminology remain in code
- [ ] Documentation updated to reflect new terminology
- [ ] Migration guide provided for users with custom configurations

## Files Changed

```
modified:   data/geography/world/worldgen.json
modified:   src/data/geography/worldgen/WorldGenData.ts
modified:   src/simulation/builder/SimulationBuilder.ts
modified:   test/data/geography/worldgen/WorldGenData.test.ts
modified:   STEP_4_COMPLETION_SUMMARY.md (optional documentation update)
```

## Semantic Versioning

This change constitutes a **minor version bump** (e.g., 1.0.0 → 1.1.0) because:
- ✅ It changes the public API in a backward-incompatible way (configuration schema)
- ✅ It requires users to update their configuration files
- ❌ It does NOT remove functionality or break runtime behavior (given updated config)

Recommended version: **v1.1.0** or **v2.0.0** if following strict semantic versioning for configuration changes.

## Review Guidance

### Key Review Points

1. **Terminology Consistency**: Verify all references to "political" are replaced with "realm"
2. **Test Coverage**: Ensure existing tests are updated to use new property names
3. **Error Messages**: Confirm validation errors reference correct property paths
4. **Documentation**: Check that user-facing docs reflect the new terminology
5. **Backward Compatibility**: Acknowledge this is a breaking change for configurations

### Testing Commands

```powershell
# Full validation sequence
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```

Expected output from `npm run dev`:
```
Generated 5 political realms
--- Chronicle Summary ---
Total events: 1584
```

## Related Issues

- Closes #328 (if tracked as an issue)
- Related to PR #316 (political landscape generation implementation)
- Follows patterns established in STEP_4_COMPLETION_SUMMARY.md

## Additional Notes

### Why "realm" instead of "political"?

The term "realm" is more precise and domain-specific:
- **Realm**: A territory under unified governance, aligns with historical/fantasy worldbuilding
- **Political**: Too generic, could refer to any political concept (parties, policies, movements)

The codebase already uses "realm" consistently in:
- Component names (`TerritorialRealmComponent`, `RealmStateComponent`)
- Domain types (`RealmResource`, `RealmModifier`, `Faction`)
- Generator output ("Generated 5 political **realms**")

This refactoring brings configuration terminology in line with implementation terminology.

### Future Considerations

This refactoring creates a cleaner foundation for future realm-related features:
- Realm relationships and diplomacy
- Realm-specific events and modifiers
- Faction influence within realms
- Dynamic realm formation/dissolution

---

**PR Checklist:**
- [ ] Code follows project style guide (ESLint passing)
- [ ] All tests pass locally
- [ ] TypeScript compilation succeeds
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Migration guide provided
- [ ] No merge conflicts with main branch
