# PR: Refactor `numSectors` to `numberOfSectors` for Consistency

## Overview

This PR refactors the field name `numSectors` to `numberOfSectors` throughout the codebase to improve naming consistency and readability.

## Motivation

The current codebase uses inconsistent naming conventions for similar configuration fields:
- ✅ `numberOfRealms` - uses full word "number"
- ❌ `numSectors` - uses abbreviated "num"
- ✅ `planetsPerSector` - descriptive naming
- ✅ `continentsPerPlanet` - descriptive naming

This inconsistency makes the codebase harder to read and maintain. By standardizing on `numberOfSectors`, we align with the existing convention used in `numberOfRealms` within the same configuration structure.

## Changes

### Files Modified

#### 1. Data Configuration
- **`data/geography/world/worldgen.json`**
  - Renamed: `"numSectors": 3` → `"numberOfSectors": 3`

#### 2. Source Code
- **`src/data/geography/worldgen/WorldGenData.ts`**
  - Renamed private field: `numSectors` → `numberOfSectors`
  - Renamed getter method: `getNumSectors()` → `getNumberOfSectors()`
  - Updated validation message: `'WorldGenData numSectors must be a number.'` → `'WorldGenData numberOfSectors must be a number.'`
  - Updated `createNull()` factory method to use new field name

#### 3. Generator Logic
- **`src/generator/world/WorldGenerator.ts`**
  - Updated method call: `this.config.getNumSectors()` → `this.config.getNumberOfSectors()`

#### 4. Test Files
- **`test/data/geography/worldgen/WorldGenData.test.ts`**
  - Updated all test data objects to use `numberOfSectors`
  - Updated all assertions: `getNumSectors()` → `getNumberOfSectors()`
  - Updated test description: `'should throw TypeError when numSectors is not a number'`

- **`test/data/geography/worldgen/loadWorldGenData.test.ts`**
  - Updated assertion: `getNumSectors()` → `getNumberOfSectors()`

- **`test/generator/world/WorldGenerator.test.js`**
  - Updated test data: `numSectors: 3` → `numberOfSectors: 3`
  - Updated assertions: `getNumSectors()` → `getNumberOfSectors()`

## Impact Analysis

### Breaking Changes
- **API Change**: Public getter method renamed from `getNumSectors()` to `getNumberOfSectors()`
- **Configuration Schema**: JSON field renamed from `numSectors` to `numberOfSectors`

### Affected Components
1. **WorldGenData** - Data class for world generation configuration
2. **WorldGenerator** - World generation system that uses sector count
3. **All related tests** - Unit and integration tests for world generation

### Migration Required
Any external code or saved configurations using `numSectors` will need to be updated to use `numberOfSectors`.

## Testing

All existing tests have been updated and pass:
- ✅ Unit tests for `WorldGenData` class
- ✅ Integration tests for `loadWorldGenData` loader function
- ✅ Integration tests for `WorldGenerator` class
- ✅ Type validation tests for invalid inputs
- ✅ Null object pattern tests

### Validation Commands
```powershell
npm run typecheck  # TypeScript type validation
npm run lint       # Code style validation
npm run test       # Full test suite
npm run build      # Production build validation
```

## Consistency Improvements

After this change, the `worldgen.json` configuration exhibits consistent naming:

```json
{
  "numberOfSectors": 3,           // ✅ Consistent with numberOfRealms
  "planetsPerSector": 64,         // ✅ Descriptive relationship
  "featuresPerContinent": 50,     // ✅ Descriptive relationship
  "continentsPerPlanet": 5,       // ✅ Descriptive relationship
  "featuresPerPlanetContinent": 64, // ✅ Descriptive relationship
  "political": {
    "numberOfRealms": 5,          // ✅ Uses full "numberOfX" pattern
    "minPlanetsPerRealm": 3,      // ✅ Clear min/max prefix
    "maxPlanetsPerRealm": 5,
    "ensurePlayerRealm": true,
    "spatialDistribution": "random"
  }
}
```

## Checklist

- [x] Code follows project conventions (static factory methods, TypeUtils validation)
- [x] All tests updated and passing
- [x] TypeScript compilation successful
- [x] ESLint validation passing
- [x] Documentation updated (JSDoc comments)
- [x] Breaking changes documented
- [x] Maintains data loading pattern consistency
- [x] Null object pattern preserved
- [x] Immutability maintained (Object.freeze)

## Related Issues

Closes #329
