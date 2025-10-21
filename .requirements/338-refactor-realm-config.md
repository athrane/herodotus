# PR #338: Refactor Realm Configuration into Separate File

## Overview

This PR refactors the realm generation configuration out of the `worldgen.json` file into a dedicated `realm.json` file. This change improves separation of concerns by isolating realm-specific configuration from world generation parameters, making the codebase more modular and maintainable.

## Problem Statement

Currently, realm generation configuration is embedded within `data/geography/world/worldgen.json`:

```json
{
  "numberOfSectors": 3,
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

**Issues with current structure:**
1. **Mixed concerns**: World generation and realm generation are conceptually distinct subsystems
2. **Tight coupling**: `WorldGenData` class depends on `RealmGeneratorConfig` from `src/generator/realm/`
3. **Poor modularity**: Changes to realm configuration require touching world generation files
4. **Inconsistent architecture**: Other subsystems (e.g., historical figures, geography features) have dedicated data loading modules

## Proposed Solution

### Architecture Changes

```
Before:
data/geography/world/worldgen.json  (contains realm config)
  ↓
src/data/geography/worldgen/WorldGenData.ts  (stores realm config)
  ↓
src/generator/realm/RealmGenerator.ts  (uses config)

After:
data/realm/realm.json  (dedicated realm config file)
  ↓
src/data/realm/RealmData.ts  (new data class)
  ↓
src/data/realm/loadRealmData.ts  (new loader)
  ↓
src/generator/realm/RealmGenerator.ts  (uses RealmData)
```

### File Structure

#### New Files

1. **`data/realm/realm.json`** - Dedicated realm configuration file
   ```json
   {
     "numberOfRealms": 5,
     "minPlanetsPerRealm": 3,
     "maxPlanetsPerRealm": 5,
     "ensurePlayerRealm": true,
     "spatialDistribution": "random"
   }
   ```

2. **`src/data/realm/RealmData.ts`** - Data class for realm configuration
   - Implements immutability pattern with `Object.freeze()`
   - Runtime validation using `TypeUtils`
   - Static factory method `create()`
   - Null object pattern with `createNull()`
   - Validates all numeric constraints (min/max planets per realm)

3. **`src/data/realm/loadRealmData.ts`** - Loader function
   - Imports `realm.json` directly
   - Delegates to `RealmData.create()`
   - Returns immutable `RealmData` instance

4. **`test/data/realm/RealmData.test.ts`** - Unit tests for `RealmData`
   - Tests valid data loading
   - Tests immutability (`Object.isFrozen()`)
   - Tests runtime validation for all fields
   - Tests null object pattern singleton
   - Tests constraint validation (e.g., `minPlanetsPerRealm >= 1`)

5. **`test/data/realm/loadRealmData.test.ts`** - Integration tests for loader
   - Tests successful loading from JSON
   - Tests correct values match `realm.json`
   - Tests immutability of loaded instance

#### Modified Files

1. **`data/geography/world/worldgen.json`**
   - **Remove**: `realm` section
   - **Keep**: All world generation parameters (sectors, planets, features, continents)

2. **`src/data/geography/worldgen/WorldGenData.ts`**
   - **Remove**: `realmConfiguration` field
   - **Remove**: `getRealmConfiguration()` method
   - **Remove**: Import of `RealmGeneratorConfig`
   - **Remove**: Realm initialization in constructor
   - **Update**: `createNull()` to remove realm defaults

3. **`src/data/geography/worldgen/loadWorldGenData.ts`**
   - No changes required (already minimal loader)

4. **`src/generator/realm/RealmGenerator.ts`**
   - **Update**: Accept `RealmData` instead of `RealmGeneratorConfig`
   - **Update**: Constructor parameter type
   - **Update**: `create()` factory method signature
   - **Simplify**: Validation logic (move to `RealmData`)

5. **`src/generator/realm/RealmGeneratorConfig.ts`**
   - **Consider**: This interface may become redundant if `RealmData` provides equivalent functionality
   - **Option 1**: Keep as interface for API compatibility
   - **Option 2**: Remove and use `RealmData` directly everywhere
   - **Recommendation**: Keep initially, evaluate for removal in future PR

6. **`src/simulation/builder/SimulationBuilder.ts`**
   - **Add**: Import `loadRealmData`
   - **Add**: Field `private realmData: RealmData;`
   - **Update**: `buildData()` to call `loadRealmData()`
   - **Update**: `buildEntities()` to pass `realmData` to `RealmGenerator.create()`
   - **Remove**: Call to `worldGenConfig.getRealmConfiguration()`

7. **`test/data/geography/worldgen/WorldGenData.test.ts`**
   - **Remove**: Tests for `getRealmConfiguration()`
   - **Remove**: Realm data from test fixtures
   - **Remove**: Tests for default realm values

8. **`test/data/geography/worldgen/loadWorldGenData.test.ts`**
   - **Remove**: Assertions about realm configuration (if any)
   - Tests should focus solely on world generation parameters

#### Test Data Files

- **`test/data/realm/fixtures/valid-realm-config.json`** (optional)
- **`test/data/realm/fixtures/invalid-realm-config.json`** (optional)

## Implementation Details

### RealmData Class Structure

```typescript
import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents realm generation configuration data loaded from JSON.
 * This class provides runtime validation and type safety for realm generation parameters.
 */
export class RealmData {
  private readonly numberOfRealms: number;
  private readonly minPlanetsPerRealm: number;
  private readonly maxPlanetsPerRealm: number;
  private readonly ensurePlayerRealm: boolean;
  private readonly spatialDistribution: 'random' | 'distributed' | 'sectored';

  private static instance: RealmData | null = null;

  /**
   * Creates a new RealmData instance from JSON data.
   * @param data - The JSON object containing realm generation configuration.
   */
  constructor(data: any) {
    TypeUtils.ensureNumber(data?.numberOfRealms, 'RealmData numberOfRealms must be a number.');
    TypeUtils.ensureNumber(data?.minPlanetsPerRealm, 'RealmData minPlanetsPerRealm must be a number.');
    TypeUtils.ensureNumber(data?.maxPlanetsPerRealm, 'RealmData maxPlanetsPerRealm must be a number.');
    TypeUtils.ensureBoolean(data?.ensurePlayerRealm, 'RealmData ensurePlayerRealm must be a boolean.');
    TypeUtils.ensureString(data?.spatialDistribution, 'RealmData spatialDistribution must be a string.');

    if (data.minPlanetsPerRealm < 1) {
      throw new TypeError('RealmData minPlanetsPerRealm must be at least 1.');
    }
    if (data.maxPlanetsPerRealm < data.minPlanetsPerRealm) {
      throw new TypeError('RealmData maxPlanetsPerRealm must be >= minPlanetsPerRealm.');
    }
    if (!['random', 'distributed', 'sectored'].includes(data.spatialDistribution)) {
      throw new TypeError('RealmData spatialDistribution must be one of: random, distributed, sectored.');
    }

    this.numberOfRealms = data.numberOfRealms;
    this.minPlanetsPerRealm = data.minPlanetsPerRealm;
    this.maxPlanetsPerRealm = data.maxPlanetsPerRealm;
    this.ensurePlayerRealm = data.ensurePlayerRealm;
    this.spatialDistribution = data.spatialDistribution;

    Object.freeze(this);
  }

  /**
   * Static factory method to create a RealmData instance.
   * @param data - The JSON object containing realm generation configuration.
   * @returns A new RealmData instance.
   */
  static create(data: any): RealmData {
    return new RealmData(data);
  }

  /**
   * Creates a null instance of RealmData with default values.
   * Uses lazy initialization to create singleton null instance.
   * @returns A null RealmData instance.
   */
  static createNull(): RealmData {
    if (!RealmData.instance) {
      RealmData.instance = RealmData.create({
        numberOfRealms: 0,
        minPlanetsPerRealm: 0,
        maxPlanetsPerRealm: 0,
        ensurePlayerRealm: false,
        spatialDistribution: 'random'
      });
    }
    return RealmData.instance;
  }

  getNumberOfRealms(): number {
    return this.numberOfRealms;
  }

  getMinPlanetsPerRealm(): number {
    return this.minPlanetsPerRealm;
  }

  getMaxPlanetsPerRealm(): number {
    return this.maxPlanetsPerRealm;
  }

  getEnsurePlayerRealm(): boolean {
    return this.ensurePlayerRealm;
  }

  getSpatialDistribution(): 'random' | 'distributed' | 'sectored' {
    return this.spatialDistribution;
  }
}
```

### RealmGenerator Refactoring

**Option 1: Accept RealmData directly**
```typescript
constructor(nameGenerator: NameGenerator, realmData: RealmData) {
  TypeUtils.ensureInstanceOf(nameGenerator, NameGenerator);
  TypeUtils.ensureInstanceOf(realmData, RealmData);
  
  this.nameGenerator = nameGenerator;
  this.realmData = realmData;
}
```

**Option 2: Keep RealmGeneratorConfig, extract from RealmData**
```typescript
constructor(nameGenerator: NameGenerator, config: RealmGeneratorConfig) {
  // Existing validation logic
}

static create(nameGenerator: NameGenerator, realmData: RealmData): RealmGenerator {
  const config: RealmGeneratorConfig = {
    numberOfRealms: realmData.getNumberOfRealms(),
    minPlanetsPerRealm: realmData.getMinPlanetsPerRealm(),
    maxPlanetsPerRealm: realmData.getMaxPlanetsPerRealm(),
    ensurePlayerRealm: realmData.getEnsurePlayerRealm(),
    spatialDistribution: realmData.getSpatialDistribution()
  };
  return new RealmGenerator(nameGenerator, config);
}
```

**Recommendation**: Use Option 2 initially to minimize changes, then evaluate Option 1 in a follow-up PR if `RealmGeneratorConfig` becomes redundant.

### SimulationBuilder Integration

```typescript
// In buildData():
this.worldGenConfig = loadWorldGenData();
this.realmData = loadRealmData();  // NEW

// In buildEntities():
const realmGenerator = RealmGenerator.create(
  nameGenerator,
  this.realmData  // Changed from this.worldGenConfig.getRealmConfiguration()
);
```

## Testing Strategy

### Unit Tests

1. **RealmData Tests** (`test/data/realm/RealmData.test.ts`)
   - ✅ Create with valid data
   - ✅ Immutability verification
   - ✅ Type validation for all fields
   - ✅ Constraint validation (min < max, min >= 1)
   - ✅ Enum validation for `spatialDistribution`
   - ✅ Null object pattern singleton

2. **loadRealmData Tests** (`test/data/realm/loadRealmData.test.ts`)
   - ✅ Successful loading from JSON
   - ✅ Correct values from `realm.json`
   - ✅ Immutability of loaded instance

3. **WorldGenData Tests** (update existing)
   - ✅ Remove realm-related test cases
   - ✅ Verify realm fields removed from class

### Integration Tests

1. **RealmGenerator Tests** (update existing if needed)
   - ✅ Verify RealmGenerator works with RealmData
   - ✅ Test realm generation with various configurations

2. **SimulationBuilder Tests** (update existing if needed)
   - ✅ Verify both `worldGenConfig` and `realmData` loaded correctly
   - ✅ Test realm generation during simulation build

### Validation Coverage

| Validation Type | Test Location | Coverage |
|----------------|---------------|----------|
| Type validation | `RealmData.test.ts` | All fields (number, boolean, string) |
| Constraint validation | `RealmData.test.ts` | min >= 1, max >= min |
| Enum validation | `RealmData.test.ts` | spatialDistribution values |
| Immutability | `RealmData.test.ts` + `loadRealmData.test.ts` | `Object.isFrozen()` |
| Null object pattern | `RealmData.test.ts` | Singleton behavior |
| JSON loading | `loadRealmData.test.ts` | Successful import and parse |

## Migration Checklist

### Phase 1: Create New Infrastructure
- [ ] Create `data/realm/realm.json` with realm configuration
- [ ] Create `src/data/realm/` directory
- [ ] Implement `src/data/realm/RealmData.ts`
- [ ] Implement `src/data/realm/loadRealmData.ts`
- [ ] Create `test/data/realm/` directory
- [ ] Implement `test/data/realm/RealmData.test.ts`
- [ ] Implement `test/data/realm/loadRealmData.test.ts`
- [ ] Run tests: `npm run test -- test/data/realm`

### Phase 2: Update Consumers
- [ ] Update `src/generator/realm/RealmGenerator.ts` to accept `RealmData`
- [ ] Update `src/simulation/builder/SimulationBuilder.ts` to load and use `RealmData`
- [ ] Run tests: `npm run test`
- [ ] Run typecheck: `npm run typecheck`

### Phase 3: Remove Old Infrastructure
- [ ] Remove `realm` section from `data/geography/world/worldgen.json`
- [ ] Remove `realmConfiguration` field from `src/data/geography/worldgen/WorldGenData.ts`
- [ ] Remove `getRealmConfiguration()` method from `WorldGenData`
- [ ] Remove `RealmGeneratorConfig` import from `WorldGenData.ts`
- [ ] Update `WorldGenData.createNull()` to remove realm defaults
- [ ] Update `test/data/geography/worldgen/WorldGenData.test.ts` to remove realm tests
- [ ] Update `test/data/geography/worldgen/loadWorldGenData.test.ts` (if needed)
- [ ] Run tests: `npm run test`
- [ ] Run typecheck: `npm run typecheck`

### Phase 4: Validation
- [ ] Run full test suite: `npm run test`
- [ ] Run linter: `npm run lint`
- [ ] Run type checker: `npm run typecheck`
- [ ] Build project: `npm run build`
- [ ] Run simulation: `npm run dev` (verify realms generate correctly)
- [ ] Verify console output shows correct realm count
- [ ] Check for any deprecation warnings or errors

### Phase 5: Documentation
- [ ] Update this PR description with final implementation notes
- [ ] Update code comments if needed
- [ ] Consider updating architecture documentation (if exists)

## Benefits

### Separation of Concerns
- **Before**: Realm configuration mixed with world generation parameters
- **After**: Dedicated realm configuration file and loading infrastructure

### Modularity
- Realm generation can be configured independently
- World generation changes don't affect realm configuration
- Easier to extend realm generation with additional parameters

### Consistency
- Follows established data loading patterns (e.g., `src/data/geography/feature/`, `src/data/historicalfigure/`)
- Consistent with project architecture guidelines
- Matches pattern: `data/*.json` → `src/data/*/Data.ts` → `src/data/*/load*.ts`

### Maintainability
- Clear ownership of configuration data
- Easier to locate and modify realm-specific settings
- Reduced coupling between subsystems

### Type Safety
- Runtime validation at data loading boundary
- Immutable data structures prevent accidental modifications
- TypeScript types enforced at compile time and runtime

## Risks and Mitigations

### Risk: Breaking Changes
- **Impact**: Existing code depends on `WorldGenData.getRealmConfiguration()`
- **Mitigation**: Update all consumers in same PR (only `SimulationBuilder` identified)
- **Validation**: Comprehensive test coverage, typecheck, and manual simulation run

### Risk: Data Migration
- **Impact**: Existing `worldgen.json` structure changes
- **Mitigation**: Create `realm.json` first, then remove from `worldgen.json`
- **Validation**: Version control allows easy rollback if issues arise

### Risk: Test Coverage Gaps
- **Impact**: New code may have insufficient tests
- **Mitigation**: Follow established testing patterns from similar data classes
- **Validation**: Achieve >90% coverage for new files

### Risk: Configuration Mismatch
- **Impact**: Default values may differ between old and new systems
- **Mitigation**: Copy exact values from `worldgen.json` to `realm.json`
- **Validation**: Integration test verifying identical realm generation behavior

## Performance Considerations

- **No performance impact expected**
- Loader functions execute once during simulation initialization
- Data classes are immutable singletons (null object pattern)
- File I/O occurs at startup, not during simulation loop

## Future Enhancements

### Potential Follow-ups
1. **Remove `RealmGeneratorConfig` interface** - If redundant with `RealmData`, consolidate
2. **Realm validation rules** - Add cross-validation with galaxy size (e.g., ensure enough planets exist)
3. **Multiple realm configurations** - Support loading different realm generation profiles
4. **Realm templates** - Predefined realm configurations for different gameplay scenarios
5. **Configuration composition** - Allow realm.json to reference world generation parameters

### Architecture Alignment
This refactoring aligns with potential future patterns:
- `data/faction/faction.json` → `src/data/faction/FactionData.ts`
- `data/event/event.json` → `src/data/event/EventData.ts`
- Consistent data loading across all subsystems

## Success Criteria

- ✅ All tests pass (`npm run test`)
- ✅ No lint errors (`npm run lint`)
- ✅ No type errors (`npm run typecheck`)
- ✅ Clean build (`npm run build`)
- ✅ Simulation runs successfully with realms generated
- ✅ Realm count matches configuration
- ✅ No breaking changes to public APIs (beyond intentional refactoring)
- ✅ Code coverage maintained or improved
- ✅ Documentation updated

## Related Issues

- Issue #338: Refactor realm configuration (if exists)
- Architecture documentation: Data loading patterns
- Related: Historical figure data loading (`src/data/historicalfigure/`)
- Related: Geographical feature data loading (`src/data/geography/feature/`)

## Review Checklist

### Code Quality
- [ ] Follows project coding conventions (static `create()` methods, TypeUtils validation)
- [ ] JSDoc comments for all public methods
- [ ] No ESLint warnings
- [ ] No TypeScript errors
- [ ] Consistent naming conventions

### Testing
- [ ] Unit tests for all new classes
- [ ] Integration tests for data loading
- [ ] Existing tests updated for removed functionality
- [ ] Test coverage meets project standards

### Architecture
- [ ] Follows established data loading patterns
- [ ] Maintains immutability guarantees
- [ ] Implements null object pattern correctly
- [ ] Proper separation of concerns

### Documentation
- [ ] This PR description complete and accurate
- [ ] Code comments updated
- [ ] Breaking changes clearly identified
- [ ] Migration path documented

## Notes

- This refactoring is purely structural and should not change runtime behavior
- The `spatialDistribution` field currently only supports `'random'`; other values are placeholders for future implementation
- Consider this PR a template for similar refactoring of other configuration subsystems

---

**Estimated Effort**: 2-4 hours
**Complexity**: Medium
**Priority**: Low (refactoring, no functional changes)
**Dependencies**: None
