# PR #333: Refactor - Move Territory and Faction Types to Dedicated Subdirectories

## Overview

This PR reorganizes the realm module by moving territory-related and faction-related types (classes, enums, and interfaces) from `src/realm/` to dedicated subdirectories:
- Territory management → `src/realm/territory/`
- Faction management → `src/realm/faction/`

This improves code organization and establishes clear separation between different realm concerns (territory management, faction management, and resource management).

## Motivation

The `src/realm/` directory currently contains multiple concerns:
- **Territory management**: Components and enums for managing planetary claims and territorial boundaries
- **Faction management**: Components and classes for managing political/social factions, their influence and allegiance
- **Resource management**: Components and types for dynasty resources (Treasury, Stability, Legitimacy, Hubris)
- **Modifier system**: Types and interfaces for applying temporal modifications to resources

Following the project's architectural pattern of organizing related functionality into subdirectories (similar to `src/geography/galaxy/`, `src/geography/planet/`, `src/geography/feature/`), this refactoring groups related types together for improved maintainability and discoverability.

## Changes

### Files to Move

#### Territory Management Files

The following files will be relocated from `src/realm/` to `src/realm/territory/`:

##### 1. **ClaimStatus.ts** (Enum)
- **Type**: Enum defining territorial claim statuses
- **Purpose**: Represents the status of a realm's claim on a planet
- **Values**:
  - `Core`: Integral part of realm (starting planets, fully integrated)
  - `Claimed`: Recently acquired territory needing integration
  - `Contested`: Territory claimed by multiple realms simultaneously
- **Usage**: Referenced by both `TerritoryComponent` and `TerritoryClaimComponent`

##### 2. **TerritoryComponent.ts** (Class)
- **Type**: ECS Component
- **Purpose**: Identifies an entity as a realm and tracks its territorial extent
- **Key Features**:
  - Manages collection of claimed planets with their claim statuses
  - Tracks realm name and founding year
  - Provides methods for adding/removing planets, querying claim status
  - Distinguishes territorial claims from dynasty resource management (handled by `RealmStateComponent`)
- **Dependencies**: 
  - Imports `ClaimStatus` from same directory
  - Extends `Component` from `src/ecs/Component.ts`
  - Uses `TypeUtils` from `src/util/TypeUtils.ts`

##### 3. **TerritoryClaimComponent.ts** (Class)
- **Type**: ECS Component
- **Purpose**: Attached to planet entities to track which realms claim them
- **Key Features**:
  - Manages multiple simultaneous claims from different realms (contested territories)
  - Tracks claim status for each realm
  - Provides methods for identifying controlling realm (Core status)
  - Enables queries for contested claims and claim counts
- **Dependencies**:
  - Imports `ClaimStatus` from same directory
  - Extends `Component` from `src/ecs/Component.ts`
  - Uses `TypeUtils` from `src/util/TypeUtils.ts`

#### Faction Management Files

The following files will be relocated from `src/realm/` to `src/realm/faction/`:

##### 1. **Faction.ts** (Class)
- **Type**: Domain class representing a political/social faction
- **Purpose**: Represents a faction with influence (power/control) and allegiance (loyalty to dynasty)
- **Key Features**:
  - Tracks faction name, influence (0-100), and allegiance (0-100)
  - Provides methods to modify influence and allegiance values
  - Implements Null Object Pattern with `createNull()` factory method
  - Immutable name with mutable influence/allegiance values
- **Dependencies**:
  - Uses `TypeUtils` from `src/util/TypeUtils.ts`

##### 2. **FactionManagerComponent.ts** (Class)
- **Type**: ECS Component (singleton)
- **Purpose**: Centralized management of all factions within the realm
- **Key Features**:
  - Stores map of faction name to `Faction` instance
  - Provides API for creating, updating, removing, and querying factions
  - Returns defensive copies to prevent external modification
  - Implements Null Object Pattern with `createNull()` factory method
- **Dependencies**:
  - Imports `Faction` from same directory
  - Extends `Component` from `src/ecs/Component.ts`
  - Uses `TypeUtils` from `src/util/TypeUtils.ts`

### Directory Structure

**Before:**
```
src/realm/
├── ClaimStatus.ts
├── Faction.ts
├── FactionManagerComponent.ts
├── FailureThresholds.ts
├── ModifierSourceType.ts
├── ModifierType.ts
├── RealmComponent.ts
├── RealmModifier.ts
├── RealmResource.ts
├── ResourceHistoryEntry.ts
├── TerritoryClaimComponent.ts
└── TerritoryComponent.ts
```

**After:**
```
src/realm/
├── FailureThresholds.ts
├── ModifierSourceType.ts
├── ModifierType.ts
├── RealmComponent.ts
├── RealmModifier.ts
├── RealmResource.ts
├── ResourceHistoryEntry.ts
├── faction/
│   ├── Faction.ts
│   └── FactionManagerComponent.ts
└── territory/
    ├── ClaimStatus.ts
    ├── TerritoryClaimComponent.ts
    └── TerritoryComponent.ts
```

### Import Path Updates

The following files require import path updates to reflect the new directory structure:

#### Production Code - Territory Files

**File**: `src/realm/territory/TerritoryComponent.ts`
```typescript
// Before:
import { ClaimStatus } from './ClaimStatus';

// After:
import { ClaimStatus } from './ClaimStatus'; // No change (same directory)
```

**File**: `src/realm/territory/TerritoryClaimComponent.ts`
```typescript
// Before:
import { ClaimStatus } from './ClaimStatus';

// After:
import { ClaimStatus } from './ClaimStatus'; // No change (same directory)
```

**File**: `src/generator/realm/RealmGenerator.ts`
```typescript
// Before:
import { TerritoryComponent } from '../../realm/TerritoryComponent';
import { TerritoryClaimComponent } from '../../realm/TerritoryClaimComponent';
import { ClaimStatus } from '../../realm/ClaimStatus';

// After:
import { TerritoryComponent } from '../../realm/territory/TerritoryComponent';
import { TerritoryClaimComponent } from '../../realm/territory/TerritoryClaimComponent';
import { ClaimStatus } from '../../realm/territory/ClaimStatus';
```

#### Production Code - Faction Files

**File**: `src/realm/faction/FactionManagerComponent.ts`
```typescript
// Before:
import { Faction } from './Faction';

// After:
import { Faction } from './Faction'; // No change (same directory)
```

**File**: `src/simulation/builder/SimulationBuilder.ts`
```typescript
// Before:
import { FactionManagerComponent } from '../../realm/FactionManagerComponent';

// After:
import { FactionManagerComponent } from '../../realm/faction/FactionManagerComponent';
```

#### Test Code

**File**: `test/realm/TerritoryComponent.test.ts` → `test/realm/territory/TerritoryComponent.test.ts`
```typescript
// Before:
import { TerritoryComponent } from '../../src/realm/TerritoryComponent';
import { ClaimStatus } from '../../src/realm/ClaimStatus';

// After:
import { TerritoryComponent } from '../../../src/realm/territory/TerritoryComponent';
import { ClaimStatus } from '../../../src/realm/territory/ClaimStatus';
```

**File**: `test/realm/TerritoryClaimComponent.test.ts` → `test/realm/territory/TerritoryClaimComponent.test.ts`
```typescript
// Before:
import { TerritoryClaimComponent } from '../../src/realm/TerritoryClaimComponent';
import { ClaimStatus } from '../../src/realm/ClaimStatus';

// After:
import { TerritoryClaimComponent } from '../../../src/realm/territory/TerritoryClaimComponent';
import { ClaimStatus } from '../../../src/realm/territory/ClaimStatus';
```

**File**: `test/realm/ClaimStatus.test.ts` → `test/realm/territory/ClaimStatus.test.ts`
```typescript
// Before:
import { ClaimStatus } from '../../src/realm/ClaimStatus';

// After:
import { ClaimStatus } from '../../../src/realm/territory/ClaimStatus';
```

**File**: `test/generator/realm/RealmGenerator.test.ts`
```typescript
// Before:
import { TerritoryComponent } from '../../../src/realm/TerritoryComponent';
import { TerritoryClaimComponent } from '../../../src/realm/TerritoryClaimComponent';
import { ClaimStatus } from '../../../src/realm/ClaimStatus';

// After:
import { TerritoryComponent } from '../../../src/realm/territory/TerritoryComponent';
import { TerritoryClaimComponent } from '../../../src/realm/territory/TerritoryClaimComponent';
import { ClaimStatus } from '../../../src/realm/territory/ClaimStatus';
```

**File**: `test/realm/Faction.test.js` → `test/realm/faction/Faction.test.js`
```typescript
// Before:
import { Faction } from '../../src/realm/Faction';

// After:
import { Faction } from '../../../src/realm/faction/Faction';
```

**File**: `test/realm/FactionManagerComponent.test.js` → `test/realm/faction/FactionManagerComponent.test.js`
```typescript
// Before:
import { FactionManagerComponent } from '../../src/realm/FactionManagerComponent';
import { Faction } from '../../src/realm/Faction';

// After:
import { FactionManagerComponent } from '../../../src/realm/faction/FactionManagerComponent';
import { Faction } from '../../../src/realm/faction/Faction';
```

### Test Directory Structure

Tests will follow the project's mirror structure pattern, moving from `test/realm/` to subdirectories:

**Before:**
```
test/realm/
├── ClaimStatus.test.ts
├── Faction.test.js
├── FactionManagerComponent.test.js
├── ...
├── TerritoryClaimComponent.test.ts
└── TerritoryComponent.test.ts
```

**After:**
```
test/realm/
├── ...
├── faction/
│   ├── Faction.test.js
│   └── FactionManagerComponent.test.js
└── territory/
    ├── ClaimStatus.test.ts
    ├── TerritoryClaimComponent.test.ts
    └── TerritoryComponent.test.ts
```

## Implementation Checklist

### Directory Creation
- [ ] Create `src/realm/territory/` directory
- [ ] Create `src/realm/faction/` directory
- [ ] Create `test/realm/territory/` directory
- [ ] Create `test/realm/faction/` directory

### Source Code Migration - Territory
- [ ] Move `src/realm/ClaimStatus.ts` → `src/realm/territory/ClaimStatus.ts`
- [ ] Move `src/realm/TerritoryComponent.ts` → `src/realm/territory/TerritoryComponent.ts`
- [ ] Move `src/realm/TerritoryClaimComponent.ts` → `src/realm/territory/TerritoryClaimComponent.ts`

### Source Code Migration - Faction
- [ ] Move `src/realm/Faction.ts` → `src/realm/faction/Faction.ts`
- [ ] Move `src/realm/FactionManagerComponent.ts` → `src/realm/faction/FactionManagerComponent.ts`

### Test Code Migration - Territory
- [ ] Move `test/realm/ClaimStatus.test.ts` → `test/realm/territory/ClaimStatus.test.ts`
- [ ] Move `test/realm/TerritoryComponent.test.ts` → `test/realm/territory/TerritoryComponent.test.ts`
- [ ] Move `test/realm/TerritoryClaimComponent.test.ts` → `test/realm/territory/TerritoryClaimComponent.test.ts`

### Test Code Migration - Faction
- [ ] Move `test/realm/Faction.test.js` → `test/realm/faction/Faction.test.js`
- [ ] Move `test/realm/FactionManagerComponent.test.js` → `test/realm/faction/FactionManagerComponent.test.js`

### Import Path Updates - Production Code (Territory)
- [ ] Update imports in `src/generator/realm/RealmGenerator.ts` (3 imports)
- [ ] Update imports in `src/realm/territory/TerritoryComponent.ts` (verify relative paths)
- [ ] Update imports in `src/realm/territory/TerritoryClaimComponent.ts` (verify relative paths)

### Import Path Updates - Production Code (Faction)
- [ ] Update imports in `src/simulation/builder/SimulationBuilder.ts` (1 import)
- [ ] Update imports in `src/realm/faction/FactionManagerComponent.ts` (verify relative paths)

### Import Path Updates - Test Code (Territory)
- [ ] Update imports in `test/realm/territory/ClaimStatus.test.ts`
- [ ] Update imports in `test/realm/territory/TerritoryComponent.test.ts`
- [ ] Update imports in `test/realm/territory/TerritoryClaimComponent.test.ts`
- [ ] Update imports in `test/generator/realm/RealmGenerator.test.ts`

### Import Path Updates - Test Code (Faction)
- [ ] Update imports in `test/realm/faction/Faction.test.js`
- [ ] Update imports in `test/realm/faction/FactionManagerComponent.test.js`

### Validation
- [ ] Run `npm run typecheck` - verify no TypeScript errors
- [ ] Run `npm run lint` - verify no linting errors
- [ ] Run `npm run test` - verify all tests pass (particularly territory and faction tests)
- [ ] Run `npm run build` - verify production bundle builds successfully
- [ ] Search codebase for any missed import references to moved files

## Testing Strategy

### Automated Validation
1. **Type checking**: `npm run typecheck` ensures all imports resolve correctly
2. **Linting**: `npm run lint` catches any style issues from refactoring
3. **Unit tests**: `npm run test` verifies all territory component tests pass
4. **Build**: `npm run build` confirms bundle generation succeeds

### Specific Tests to Verify
- `test/realm/territory/ClaimStatus.test.ts` - Enum value validation
- `test/realm/territory/TerritoryComponent.test.ts` - Component creation, planet management, claim status queries
- `test/realm/territory/TerritoryClaimComponent.test.ts` - Multi-realm claims, contested territories, controlling realm logic
- `test/realm/faction/Faction.test.js` - Faction creation, influence/allegiance modification, null object pattern
- `test/realm/faction/FactionManagerComponent.test.js` - Faction management, CRUD operations, defensive copying
- `test/generator/realm/RealmGenerator.test.ts` - Realm generation with territorial claims

### Manual Verification
- Search for any imports of `ClaimStatus`, `TerritoryComponent`, `TerritoryClaimComponent`, `Faction`, or `FactionManagerComponent` to ensure all references are updated
- Verify no broken imports remain in the codebase
- Check that IDE auto-import suggestions reference the new paths

## Risk Assessment

### Low Risk
This is a **low-risk refactoring** for the following reasons:

1. **Pure structural change**: No logic modifications, only file relocations and import path updates
2. **Limited scope**: Only 5 files in production code (3 territory + 2 faction), 5 test files, and 2 consumers affected
3. **TypeScript safety**: Compiler will catch any incorrect import paths immediately
4. **Comprehensive test coverage**: All moved components have existing unit tests that verify behavior is unchanged
5. **Isolated functionality**: Territory and faction types have minimal cross-cutting concerns with other realm features

### Potential Issues
- **IDE caching**: Developers may need to restart their IDE/TypeScript server after pulling changes
- **Git merge conflicts**: If other branches have uncommitted changes touching these files, merge conflicts may occur

### Rollback Plan
If issues arise, the changes can be easily reverted by:
1. Moving files back to `src/realm/` and `test/realm/`
2. Restoring original import paths
3. Re-running validation suite

## Benefits

### Code Organization
- **Clear separation of concerns**: Territory and faction management each isolated in their own subdirectories, separate from resource/modifier systems
- **Improved discoverability**: Developers can quickly locate all territory-related or faction-related types in dedicated directories
- **Scalability**: Future features have natural homes:
  - Territory: territorial disputes, border systems, expansion mechanics
  - Faction: faction events, faction relationships, faction-specific resources

### Consistency
- **Follows established patterns**: Mirrors existing subdirectory structure in `src/geography/` (`galaxy/`, `planet/`, `feature/`)
- **Aligns with ECS architecture**: Groups related components together as recommended in project guidelines
- **Maintains test mirroring**: Test directory structure continues to mirror source structure

### Maintainability
- **Reduced cognitive load**: Realm module is now easier to navigate with clear subdirectory organization
- **Future-proofing**: Prepares codebase for potential expansion of territory and faction systems
- **Documentation alignment**: Directory structure now reflects logical domain boundaries (territory, faction, resources)

## Notes

- No changes to runtime behavior or public APIs
- No changes to component functionality or system logic
- File contents remain unchanged except for import paths
- Follows project convention: "One type per file - classes, enums, and interfaces each in separate files" (already satisfied)
- Maintains project requirement: All classes have static `create()` factory methods (no changes needed)

## Related Files Not Moved

The following realm-related files remain in `src/realm/` as they serve different purposes:

- **Resource Management**: `RealmResource.ts`, `RealmModifier.ts`, `ModifierSourceType.ts`, `ModifierType.ts`, `FailureThresholds.ts`, `ResourceHistoryEntry.ts`
- **Core Realm**: `RealmComponent.ts` (if it exists and represents non-territorial realm aspects)

These may warrant their own subdirectory in future refactoring efforts (e.g., `src/realm/resources/`), completing the modularization of the realm system.
