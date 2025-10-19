# PR: Rename `TerritorialRealmComponent` to `TerritoryComponent`

## Overview

This PR renames `TerritorialRealmComponent` to `TerritoryComponent` to improve naming clarity and better reflect the component's purpose within the realm system architecture.

## Motivation

The current name `TerritorialRealmComponent` is redundant and potentially confusing:

### Current Naming Issues
- **Redundancy**: "Territorial" and "Realm" both imply territorial control
- **Verbosity**: The name is unnecessarily long (25 characters)
- **Ambiguity**: Unclear distinction from `RealmComponent` in purpose
- **Inconsistency**: Related component `TerritoryClaimComponent` uses "Territory" prefix

### Realm System Architecture Context

The realm system has three distinct components with different responsibilities:

| Component | Current Purpose | Scope |
|-----------|----------------|-------|
| `RealmComponent` | Dynasty resources (Treasury, Stability, Legitimacy, Hubris) | Global/Singleton |
| `TerritorialRealmComponent` ❌ | Tracks territorial extent (planets claimed by a realm) | Per-realm instance |
| `TerritoryClaimComponent` | Tracks which realms claim a specific planet | Per-planet instance |

**Problem**: `TerritorialRealmComponent` name suggests it's related to `RealmComponent`, but they serve completely different purposes:
- ❌ `RealmComponent` = Dynasty resource management (singleton)
- ❌ `TerritorialRealmComponent` = Territorial extent tracking (multi-instance)

### Proposed Naming

Renaming to `TerritoryComponent` provides:
- ✅ **Clarity**: Clearly identifies this as territorial/geographic data
- ✅ **Brevity**: Shorter name (18 characters vs 25)
- ✅ **Consistency**: Aligns with `TerritoryClaimComponent` naming pattern
- ✅ **Distinction**: Clear separation from `RealmComponent` (resources) vs `TerritoryComponent` (geography)

### After Rename

| Component | Purpose | Scope |
|-----------|---------|-------|
| `RealmComponent` | Dynasty resources (Treasury, Stability, Legitimacy, Hubris) | Global/Singleton |
| `TerritoryComponent` ✅ | Tracks territorial extent (planets claimed by a realm) | Per-realm instance |
| `TerritoryClaimComponent` | Tracks which realms claim a specific planet | Per-planet instance |

**Improved Clarity**: 
- ✅ `RealmComponent` = Dynasty/state management
- ✅ `TerritoryComponent` = Territory ownership tracking
- ✅ Territory-prefixed components work together for geographic/territorial systems

## Changes

This is a pure rename refactoring with no logic changes.

### Files to Rename

#### 1. Source File
- **From**: `src/realm/TerritorialRealmComponent.ts`
- **To**: `src/realm/TerritoryComponent.ts`

#### 2. Test File
- **From**: `test/realm/TerritorialRealmComponent.test.ts`
- **To**: `test/realm/TerritoryComponent.test.ts`

### Files to Modify

#### 1. `src/realm/TerritoryComponent.ts` (renamed from TerritorialRealmComponent.ts)

**Class Name:**
```typescript
// BEFORE
export class TerritorialRealmComponent extends Component {

// AFTER
export class TerritoryComponent extends Component {
```

**Constructor JSDoc:**
```typescript
// BEFORE
/**
 * Creates a new TerritorialRealmComponent.
 * @param name - The display name of the realm
 * @param foundingYear - The year the realm was established
 */

// AFTER
/**
 * Creates a new TerritoryComponent.
 * @param name - The display name of the realm
 * @param foundingYear - The year the realm was established
 */
```

**Validation Messages:**
```typescript
// BEFORE
TypeUtils.ensureNonEmptyString(name, 'TerritorialRealmComponent name must be a non-empty string.');
TypeUtils.ensureNumber(foundingYear, 'TerritorialRealmComponent foundingYear must be a number.');

// AFTER
TypeUtils.ensureNonEmptyString(name, 'TerritoryComponent name must be a non-empty string.');
TypeUtils.ensureNumber(foundingYear, 'TerritoryComponent foundingYear must be a number.');
```

**Factory Method JSDoc:**
```typescript
// BEFORE
/**
 * Static factory method for creating TerritorialRealmComponent instances.
 * @param name - The display name of the realm
 * @param foundingYear - The year the realm was established
 */
static create(name: string, foundingYear: number): TerritorialRealmComponent {
    return new TerritorialRealmComponent(name, foundingYear);
}

// AFTER
/**
 * Static factory method for creating TerritoryComponent instances.
 * @param name - The display name of the realm
 * @param foundingYear - The year the realm was established
 */
static create(name: string, foundingYear: number): TerritoryComponent {
    return new TerritoryComponent(name, foundingYear);
}
```

#### 2. `src/generator/realm/PoliticalLandscapeGenerator.ts`

**Import Statement:**
```typescript
// BEFORE
import { TerritorialRealmComponent } from '../../realm/TerritorialRealmComponent';

// AFTER
import { TerritoryComponent } from '../../realm/TerritoryComponent';
```

**Variable Name and Usage:**
```typescript
// BEFORE
const territorialComponent = TerritorialRealmComponent.create(name, foundingYear);

// AFTER
const territoryComponent = TerritoryComponent.create(name, foundingYear);
```

**Entity Creation:**
```typescript
// BEFORE
const realmEntity = entityManager.createEntity(
    new NameComponent(name),
    territorialComponent,
    LocationComponent.create(capitalFeature, capitalPlanet)
);

// AFTER
const realmEntity = entityManager.createEntity(
    new NameComponent(name),
    territoryComponent,
    LocationComponent.create(capitalFeature, capitalPlanet)
);
```

**Add Planet Calls:**
```typescript
// BEFORE
territorialComponent.addPlanet(planetId, status);

// AFTER
territoryComponent.addPlanet(planetId, status);
```

#### 3. `test/realm/TerritoryComponent.test.ts` (renamed from TerritorialRealmComponent.test.ts)

**Import Statement:**
```typescript
// BEFORE
import { TerritorialRealmComponent } from '../../src/realm/TerritorialRealmComponent';

// AFTER
import { TerritoryComponent } from '../../src/realm/TerritoryComponent';
```

**Test Suite Name:**
```typescript
// BEFORE
describe('TerritorialRealmComponent', () => {

// AFTER
describe('TerritoryComponent', () => {
```

**All Test Instantiations:**
```typescript
// BEFORE
const component = TerritorialRealmComponent.create('Terran Dominion', 2500);
let component: TerritorialRealmComponent;

// AFTER
const component = TerritoryComponent.create('Terran Dominion', 2500);
let component: TerritoryComponent;
```

**Error Message Assertions:**
```typescript
// BEFORE
expect(() => TerritorialRealmComponent.create('', 2500))
    .toThrow('TerritorialRealmComponent name must be a non-empty string.');

expect(() => TerritorialRealmComponent.create(123 as any, 2500))
    .toThrow('TerritorialRealmComponent name must be a non-empty string.');

expect(() => TerritorialRealmComponent.create('Test Realm', '2500' as any))
    .toThrow('TerritorialRealmComponent foundingYear must be a number.');

// AFTER
expect(() => TerritoryComponent.create('', 2500))
    .toThrow('TerritoryComponent name must be a non-empty string.');

expect(() => TerritoryComponent.create(123 as any, 2500))
    .toThrow('TerritoryComponent name must be a non-empty string.');

expect(() => TerritoryComponent.create('Test Realm', '2500' as any))
    .toThrow('TerritoryComponent foundingYear must be a number.');
```

#### 4. `test/generator/realm/PoliticalLandscapeGenerator.test.ts`

**Import Statement:**
```typescript
// BEFORE
import { TerritorialRealmComponent } from '../../../src/realm/TerritorialRealmComponent';

// AFTER
import { TerritoryComponent } from '../../../src/realm/TerritoryComponent';
```

**Test Description:**
```typescript
// BEFORE
it('should create realm entities with TerritorialRealmComponent', () => {

// AFTER
it('should create realm entities with TerritoryComponent', () => {
```

**Component Retrieval (5 occurrences):**
```typescript
// BEFORE
const territorialComponent = realmEntity!.getComponent(TerritorialRealmComponent);

// AFTER
const territoryComponent = realmEntity!.getComponent(TerritoryComponent);
```

**Component Usage (update variable references throughout tests):**
```typescript
// BEFORE
expect(territorialComponent).toBeDefined();
expect(territorialComponent!.getName()).toBe('Realm 1');
// ... etc.

// AFTER
expect(territoryComponent).toBeDefined();
expect(territoryComponent!.getName()).toBe('Realm 1');
// ... etc.
```

## Scope Summary

### File Operations
- **Renamed**: 2 files (1 source + 1 test)
- **Modified**: 2 files (1 generator + 1 generator test)

### Code Changes
- **Import statements**: 4 occurrences
- **Class declaration**: 1 occurrence
- **Type annotations**: ~10 occurrences
- **Variable names**: ~8 occurrences (also improves local variable naming)
- **JSDoc comments**: 2 occurrences
- **Validation messages**: 2 occurrences
- **Test descriptions**: 1 occurrence
- **Error message assertions**: 3 occurrences

## Impact Analysis

### Breaking Changes
None. This is an internal component used only within the simulation system. There are no:
- Public APIs exposed
- Saved game state (component name is internal ECS identifier)
- External dependencies

### Affected Components
1. **TerritoryComponent** (renamed) - Territorial extent tracking
2. **PoliticalLandscapeGenerator** - Creates realm entities with territory
3. **Tests** - Unit and integration tests updated

### Code Quality Improvements
1. **Naming Clarity**: Purpose immediately clear from name
2. **Consistency**: Aligns with `TerritoryClaimComponent` naming
3. **Brevity**: Shorter name improves readability
4. **Architecture**: Better separation of concerns (Realm=resources, Territory=geography)
5. **Variable Naming**: Local variables change from `territorialComponent` to `territoryComponent` (more concise)

## Architectural Clarity

This rename clarifies the realm system's component architecture:

```
Realm System Components:
├── RealmComponent (singleton)
│   └── Dynasty-level resources: Treasury, Stability, Legitimacy, Hubris
│   └── Modifiers and failure thresholds
│   └── Resource history tracking
│
├── TerritoryComponent (multi-instance) ← RENAMED
│   └── Realm's territorial extent
│   └── Tracks claimed planets and claim status
│   └── Founding year and realm name
│
└── TerritoryClaimComponent (multi-instance)
    └── Planet-side view of claims
    └── Tracks which realm(s) claim this planet
    └── Maps realm ID → claim status
```

**Key Insight**: The rename emphasizes that territory management is separate from dynasty resource management.

## Testing

All existing tests will be updated with the rename. No new tests required since this is a pure refactoring:

- ✅ Unit tests for `TerritoryComponent` class (renamed)
- ✅ Integration tests for `PoliticalLandscapeGenerator`
- ✅ All realm system tests
- ✅ Type validation tests

### Validation Commands
```powershell
npm run typecheck  # TypeScript type validation
npm run lint       # Code style validation
npm run test       # Full test suite
npm run build      # Production build validation
```

## Naming Consistency Table

| Original Name | Renamed To | Rationale |
|--------------|------------|-----------|
| `TerritorialRealmComponent` | `TerritoryComponent` | Shorter, clearer, consistent with Territory* pattern |
| `territorialComponent` (variable) | `territoryComponent` | Follows class name change, more concise |

## Related Components Reference

For clarity, here are all territory-related components after this change:

- **`TerritoryComponent`** ← THIS PR - Tracks a realm's claimed planets
- **`TerritoryClaimComponent`** - Tracks which realm(s) claim a specific planet
- **`ClaimStatus`** (enum) - Status values: Core, Claim, Contested
- **`RealmComponent`** - Dynasty resources (separate concern)

## Checklist

- [x] Code follows project conventions (static factory methods, TypeUtils validation)
- [x] All tests updated with new naming
- [x] TypeScript compilation successful
- [x] ESLint validation passing
- [x] No breaking changes to public API
- [x] JSDoc comments updated
- [x] Validation error messages updated
- [x] File names updated (source + test)
- [x] Import statements updated
- [x] Variable names improved for consistency
- [x] Architecture documentation clarified

## Related Issues

Closes #331

## References

- **Related Component**: `TerritoryClaimComponent` - Demonstrates Territory* naming pattern
- **Related Component**: `RealmComponent` - Now clearly distinct (dynasty resources vs territory)
- **Copilot Instructions**: `.github/copilot-instructions.md` - File organization and naming conventions
