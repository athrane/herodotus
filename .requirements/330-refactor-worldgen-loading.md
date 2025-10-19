# PR: Refactor WorldGenData Loading to buildData() Phase

## Overview

This PR refactors the loading of world generation configuration (`WorldGenData`) from the `buildEntities()` method to the `buildData()` method in `SimulationBuilder`, following the established Builder pattern architecture.

## Motivation

The current implementation violates the Builder pattern's phase separation by loading configuration data during entity construction:

```typescript
// ❌ CURRENT: Data loading during buildEntities()
buildEntities(): void {
    const worldGenConfig = loadWorldGenData();  // Loading data in wrong phase
    const worldGenerator = WorldGenerator.create(nameGenerator, randomComponent, worldGenConfig);
    // ... rest of entity creation
}
```

This breaks the intended Builder lifecycle:
1. `buildData()` → Load and validate all configuration from JSON
2. `buildComponents()` → Create singleton components
3. `buildSystems()` → Register systems
4. `buildEntities()` → Instantiate game entities using loaded data

**Problems with Current Approach:**
- ❌ Inconsistent with other data loading (events, historical figures, random seed)
- ❌ Violates separation of concerns (entity creation mixed with data loading)
- ❌ Makes the `buildEntities()` method responsible for both data loading AND entity creation
- ❌ Harder to test in isolation
- ❌ Data not available to other builder phases if needed

**Benefits of Correct Approach:**
- ✅ Consistent with established patterns (`dataSetEvents`, `historicalFigureConfig`, `randomSeedConfig`)
- ✅ Clear separation: data loading → component creation → system registration → entity instantiation
- ✅ Easier to test each phase independently
- ✅ WorldGenData available throughout the builder lifecycle
- ✅ Follows Single Responsibility Principle

## Changes

### Files Modified

#### 1. `src/simulation/builder/SimulationBuilder.ts`

**Add Private Field:**
```typescript
/**
 * Configuration data for world generation.
 * ! signifies that this property is not yet initialized.
 */
private worldGenConfig!: WorldGenData;
```

**Update `buildData()` Method:**
```typescript
buildData(): void {
    // Load dataset events from JSON data files
    this.dataSetEvents = loadEvents();

    // Initialize geographical features in the registry
    GeographicalFeaturesFactory.create();

    // Load historical figure configuration
    this.historicalFigureConfig = loadHistoricalFigureData();

    // Load event categories from JSON configuration
    this.eventCategories = loadEventCategories();

    // Load random seed configuration
    this.randomSeedConfig = loadRandomSeed();

    // Load world generation configuration  ← NEW
    this.worldGenConfig = loadWorldGenData();  ← NEW
}
```

**Update `buildEntities()` Method:**
```typescript
buildEntities(): void {
    const entityManager: EntityManager = this.simEcs.getEntityManager();

    // Create RandomComponent first so it can be used by other components
    const randomComponent = RandomComponent.create(this.randomSeedConfig);

    // create galaxy map as the root game world object
    const nameGenerator = NameGenerator.create(randomComponent);
    // REMOVED: const worldGenConfig = loadWorldGenData();
    // CHANGED: Use this.worldGenConfig instead of local variable
    const worldGenerator = WorldGenerator.create(nameGenerator, randomComponent, this.worldGenConfig);
    const galaxyMapComponent = worldGenerator.generateGalaxyMap();

    // Generate political landscape (realms controlling clusters of planets)
    const politicalGenerator = PoliticalLandscapeGenerator.create(
        nameGenerator,
        this.worldGenConfig.getPolitical()  // ← CHANGED: Use field instead of local variable
    );
    const realmIds = politicalGenerator.generate(galaxyMapComponent, randomComponent, this.simEcs);
    console.log(`Generated ${realmIds.length} political realms`);

    // ... rest of entity creation unchanged
}
```

## Architecture Alignment

This refactoring aligns `SimulationBuilder` with the documented Builder pattern lifecycle:

### Before (Inconsistent)
```typescript
buildData():
  ✅ Load dataSetEvents
  ✅ Load historicalFigureConfig
  ✅ Load eventCategories
  ✅ Load randomSeedConfig
  ❌ worldGenConfig NOT loaded here

buildEntities():
  ❌ Load worldGenConfig (wrong phase!)
  ✅ Create entities
```

### After (Consistent)
```typescript
buildData():
  ✅ Load dataSetEvents
  ✅ Load historicalFigureConfig
  ✅ Load eventCategories
  ✅ Load randomSeedConfig
  ✅ Load worldGenConfig  ← NOW CONSISTENT

buildEntities():
  ✅ Create entities using loaded data
```

## Data Loading Pattern Compliance

This change makes `worldGenConfig` follow the same pattern as other configuration data:

| Configuration | Type | Loaded In | Used In | Pattern Match |
|--------------|------|-----------|---------|---------------|
| `dataSetEvents` | `DataSetEvent[]` | `buildData()` | `buildEntities()` | ✅ |
| `historicalFigureConfig` | `HistoricalFigureData` | `buildData()` | `buildSystems()` | ✅ |
| `eventCategories` | `Record<string, string>` | `buildData()` | (stored for later) | ✅ |
| `randomSeedConfig` | `RandomSeedData` | `buildData()` | `buildEntities()` | ✅ |
| `worldGenConfig` | `WorldGenData` | ~~`buildEntities()`~~ → `buildData()` | `buildEntities()` | ✅ (after fix) |

## Impact Analysis

### Breaking Changes
None. This is an internal refactoring that does not change:
- Public API surface
- Entity creation logic
- System behavior
- Configuration file format

### Affected Components
- **SimulationBuilder** - Data loading phase refactored
- **Builder lifecycle** - Now fully consistent across all data loading

### Code Quality Improvements
1. **Separation of Concerns**: Data loading isolated in `buildData()`
2. **Consistency**: All configuration follows same pattern
3. **Maintainability**: Clear phase boundaries in builder lifecycle
4. **Testability**: Each builder phase can be tested independently
5. **Clarity**: Reader can understand data dependencies by examining `buildData()` alone

## Testing

All existing tests continue to pass without modification:
- ✅ SimulationBuilder integration tests
- ✅ WorldGenerator tests
- ✅ PoliticalLandscapeGenerator tests
- ✅ loadWorldGenData() unit tests
- ✅ Full simulation end-to-end tests

No test changes required because the refactoring is internal to `SimulationBuilder`.

### Validation Commands
```powershell
npm run typecheck  # TypeScript type validation
npm run lint       # Code style validation
npm run test       # Full test suite
npm run build      # Production build validation
```

## Implementation Notes

### TypeScript Definite Assignment Assertion
The field uses the `!` operator to indicate it will be initialized during the builder lifecycle:

```typescript
private worldGenConfig!: WorldGenData;
```

This is the same pattern used for:
- `simEcs!: Ecs`
- `dataSetEvents!: DataSetEvent[]`
- `historicalFigureConfig!: HistoricalFigureData`
- `eventCategories!: Record<string, string>`
- `randomSeedConfig!: RandomSeedData`

The `BuilderDirector` enforces the correct call order:
1. `build()`
2. `buildData()` ← `worldGenConfig` initialized here
3. `buildComponents()`
4. `buildSystems()`
5. `buildEntities()` ← `worldGenConfig` accessed here

### Data Loading Pattern
Following the established pattern from the project's Copilot instructions:

> **Component Integration:**
> Data is loaded during `SimulationBuilder.buildData()` phase:
> 1. Builder calls loader function (synchronous or async)
> 2. Stores loaded data in builder's private field
> 3. Uses data during `buildComponents()` to initialize components
> 4. Data classes are wrapped in Components or used directly

This refactoring makes `worldGenConfig` comply with this documented pattern.

## Builder Pattern Diagram

```
BuilderDirector.build()
    ↓
Builder.build()
    → Creates ECS instance
    ↓
Builder.buildData()
    → Load dataSetEvents        ✅
    → Load historicalFigureConfig ✅
    → Load eventCategories      ✅
    → Load randomSeedConfig     ✅
    → Load worldGenConfig       ✅ (FIXED)
    ↓
Builder.buildComponents()
    → Create singleton components
    ↓
Builder.buildSystems()
    → Register systems (may use loaded data)
    ↓
Builder.buildEntities()
    → Create game entities using loaded data ✅
```

## Checklist

- [x] Code follows Builder pattern architecture
- [x] Consistent with other data loading in `buildData()`
- [x] All existing tests passing
- [x] TypeScript compilation successful
- [x] ESLint validation passing
- [x] No breaking changes to public API
- [x] Phase separation maintained (data loading vs entity creation)
- [x] Follows established patterns from Copilot instructions
- [x] Documentation updated (JSDoc comments)
- [x] Single Responsibility Principle enforced

## Related Issues

Closes #330

## References

- **Copilot Instructions**: `.github/copilot-instructions.md` - Builder Pattern section
- **Builder Pattern**: Abstract `Builder` class defines build order
- **Data Loading Pattern**: All configuration loaded in `buildData()` phase
