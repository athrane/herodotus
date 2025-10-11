# Add Political Landscape Generator for Galaxy Realm Creation

## Overview

This PR introduces a new **`PoliticalLandscapeGenerator`** class that procedurally generates the initial political landscape of the galaxy. The generator creates a set of **realms** (represented as ECS entities) that control clusters of 3-5 neighboring planets on the galaxy map, establishing the starting conditions for territorial dynamics and inter-realm politics.

## Motivation

Per requirements **UNIVERSE-4** and the territorial claims design (`.requirements/312-design-territorial claims.md`), the game must start with multiple realms controlling distinct planetary clusters. This generator automates the creation of these initial political boundaries, ensuring:

- Each realm controls a coherent territorial cluster (3-5 adjacent planets)
- Realms are spatially distributed across the galaxy map
- The political landscape provides meaningful territorial dynamics from game start
- The generated realms integrate with existing ECS systems for realm state management

## Requirements Addressed

### From `requirements.md`

- **UNIVERSE-4**: "All games start with a realm on three distinct planets within this galaxy. This includes the player and computer players."
- **STATE-REALM-1**: "State of the Realm (Global State) - The objective health and political landscape of your dynasty is represented by a set of variables."

### From `design.md` (Section 4.2)

- **STATE-REALM-1**: "A singleton component, RealmStateComponent, must be implemented to manage the global state of the dynasty."

### From `312-design-territorial claims.md`

- **STATE-CLAIM-1**: "Realm as a Territorial Entity - A realm must be defined as a collection of planets."
- **STATE-CLAIM-2**: "Territorial Claims - Realms must be able to lay claims on planets."
- **STATE-CLAIM-3**: "Claim Status - Claims must have different statuses, such as 'core' (an integral part of the realm), 'claimed' (recently acquired), and 'contested' (claimed by multiple realms)."

## Design

### Architecture

The generator follows the established **Generator Pattern** used by `WorldGenerator` and integrates with the existing ECS architecture:

```
PoliticalLandscapeGenerator
├── Input: GalaxyMapComponent (pre-generated galaxy map)
├── Input: NameGenerator (for realm naming)
├── Input: Configuration (number of realms, planets per realm)
└── Output: Array of Realm Entities with components
```

### Core Components

#### 1. **PoliticalLandscapeGenerator** (New Class)

**Location**: `src/generator/realm/PoliticalLandscapeGenerator.ts`

**Responsibilities**:
- Generate N realms (configurable, typically 4-8 for initial gameplay)
- For each realm:
  - Select a seed planet from unclaimed planets
  - Expand territory to 3-5 adjacent planets using breadth-first traversal
  - Create a realm entity with appropriate components
  - Assign initial realm state values
- Ensure spatial distribution (avoid clustering all realms in one sector)
- Handle edge cases (insufficient planets, isolated planets)

**Key Methods**:
```typescript
class PoliticalLandscapeGenerator {
  constructor(nameGenerator: NameGenerator, config: PoliticalLandscapeConfig);
  
  // Main generation method
  generate(galaxyMap: GalaxyMapComponent, ecs: Ecs): string[];
  
  // Helper methods
  private selectSeedPlanets(galaxyMap: GalaxyMapComponent, count: number): string[];
  private expandTerritory(seedPlanetId: string, targetSize: number, galaxyMap: GalaxyMapComponent): string[];
  private createRealmEntity(name: string, planetIds: string[], ecs: Ecs): string;
  private assignInitialState(realmEntity: Entity): void;
  
  static create(nameGenerator: NameGenerator, config: PoliticalLandscapeConfig): PoliticalLandscapeGenerator;
}
```

#### 2. **RealmComponent** (New Component)

**Location**: `src/realm/RealmComponent.ts`

**Purpose**: Identifies an entity as a realm and tracks its territorial extent.

**Attributes**:
```typescript
class RealmComponent extends Component {
  private readonly name: string;                    // Realm's display name
  private readonly claimedPlanets: Map<string, ClaimStatus>;  // Planet ID -> claim status
  private foundingYear: number;                     // Year realm was established
  
  // Methods
  addPlanet(planetId: string, status: ClaimStatus): void;
  removePlanet(planetId: string): void;
  getPlanets(): string[];
  getCorePlanets(): string[];
  hasPlanet(planetId: string): boolean;
  getClaimStatus(planetId: string): ClaimStatus | null;
}
```

#### 3. **TerritoryClaimComponent** (New Component)

**Location**: `src/realm/TerritoryClaimComponent.ts`

**Purpose**: Attached to planet entities to track which realms claim them.

**Attributes**:
```typescript
class TerritoryClaimComponent extends Component {
  private readonly claims: Map<string, ClaimStatus>;  // Realm ID -> claim status
  
  // Methods
  addClaim(realmId: string, status: ClaimStatus): void;
  removeClaim(realmId: string): void;
  getClaims(): Map<string, ClaimStatus>;
  hasContestingClaims(): boolean;
  getControllingRealm(): string | null;
}
```

#### 4. **ClaimStatus** (New Enum)

**Location**: `src/realm/ClaimStatus.ts`

```typescript
enum ClaimStatus {
  Core = 'Core',           // Integral part of realm (starting planets)
  Claimed = 'Claimed',     // Recently acquired, needs integration
  Contested = 'Contested'  // Claimed by multiple realms
}
```

#### 5. **PoliticalLandscapeConfig** (New Interface)

**Location**: `src/generator/realm/PoliticalLandscapeConfig.ts`

```typescript
interface PoliticalLandscapeConfig {
  numberOfRealms: number;           // Total realms to generate (default: 5-7)
  minPlanetsPerRealm: number;       // Minimum planets per realm (default: 3)
  maxPlanetsPerRealm: number;       // Maximum planets per realm (default: 5)
  ensurePlayerRealm: boolean;       // Whether to designate one realm as player-controlled
  spatialDistribution: 'random' | 'distributed' | 'sectored';  // How to place seed planets
}
```

### Algorithm: Territory Expansion

The generator uses a **constrained breadth-first search** to expand realm territories:

1. **Seed Selection**: Randomly select N unclaimed planets as realm seeds, ensuring spatial distribution
2. **Territory Growth**: For each seed planet:
   - Initialize BFS queue with seed planet
   - Target size = random(3, 5) planets
   - While queue not empty and territory size < target:
     - Pop planet from queue
     - Add unclaimed neighbors to queue
     - Mark planet as claimed by this realm
3. **Claim Assignment**: 
   - Assign `ClaimStatus.Core` to all starting planets
   - Create bidirectional references (RealmComponent ↔ TerritoryClaimComponent)

### Integration Points

#### With Existing Components

1. **GalaxyMapComponent**: 
   - Generator queries adjacency information to find neighboring planets
   - Uses sector data for spatial distribution strategies

2. **PlanetComponent**:
   - Generator reads planet IDs and validates planet existence
   - Adds `TerritoryClaimComponent` to planet entities

3. **RealmStateComponent**:
   - Each generated realm entity receives a `RealmStateComponent` with initial values
   - Initial resources set to balanced starting values (Treasury: 100, Stability: 50, etc.)

#### With Builder Pattern

The generator will be invoked during the **`SimulationBuilder.buildEntities()`** phase:

```typescript
// In SimulationBuilder.buildEntities()
protected buildEntities(): void {
  // ... existing entity creation ...
  
  // Generate political landscape after galaxy map is created
  const galaxyMap = this.ecs.getSingletonComponent(GalaxyMapComponent);
  const politicalGen = PoliticalLandscapeGenerator.create(this.nameGenerator, this.config.political);
  const realmIds = politicalGen.generate(galaxyMap, this.ecs);
  
  // Designate first realm as player realm
  if (this.config.political.ensurePlayerRealm && realmIds.length > 0) {
    const playerRealm = this.ecs.getEntity(realmIds[0]);
    playerRealm.addComponent(PlayerComponent.create());
  }
}
```

## Implementation Plan

Following the established pattern in `plan.md`, this feature fits into **Phase 4: Territory and Military**:

### Step 1: Create Supporting Types
- [ ] `ClaimStatus.ts` - Enum for claim statuses
- [ ] `PoliticalLandscapeConfig.ts` - Configuration interface
- [ ] Tests for enum and config validation

### Step 2: Create Components
- [ ] `RealmComponent.ts` - Realm territorial data
- [ ] `TerritoryClaimComponent.ts` - Planet claim tracking
- [ ] Unit tests for both components
- [ ] Integration with Null Object Pattern

### Step 3: Create Generator
- [ ] `PoliticalLandscapeGenerator.ts` - Main generator class
- [ ] Implement seed selection algorithm
- [ ] Implement territory expansion algorithm
- [ ] Implement realm entity creation
- [ ] Unit tests for generator logic

### Step 4: Integration
- [ ] Modify `PlanetComponent` to support `TerritoryClaimComponent`
- [ ] Update `SimulationBuilder` to invoke generator
- [ ] Add configuration to `WorldGenData`
- [ ] Integration tests with full ECS setup

### Step 5: Validation
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint`
- [ ] Run `npm run test`
- [ ] Run `npm run build`
- [ ] Manual testing in CLI and GUI modes

## File Structure

```
src/
├── generator/
│   └── realm/
│       ├── PoliticalLandscapeGenerator.ts      (new)
│       └── PoliticalLandscapeConfig.ts         (new)
└── realm/
    ├── ClaimStatus.ts                          (new)
    ├── RealmComponent.ts                       (new)
    └── TerritoryClaimComponent.ts              (new)

test/
├── generator/
│   └── realm/
│       ├── PoliticalLandscapeGenerator.test.ts (new)
│       └── PoliticalLandscapeConfig.test.ts    (new)
└── realm/
    ├── RealmComponent.test.ts                  (new)
    └── TerritoryClaimComponent.test.ts         (new)
```

## Testing Strategy

### Unit Tests

1. **Component Tests**:
   - `RealmComponent`: Add/remove planets, claim status tracking, null object pattern
   - `TerritoryClaimComponent`: Add/remove claims, contested claim detection
   - Validate `TypeUtils` enforcement for all parameters

2. **Generator Tests**:
   - Territory expansion with various galaxy map configurations
   - Edge cases: insufficient planets, isolated planets, single-planet realms
   - Configuration validation and boundary conditions
   - Spatial distribution algorithms

### Integration Tests

1. **Full Generation Pipeline**:
   - Create galaxy map → generate political landscape → validate realm entities
   - Verify bidirectional component references (Realm ↔ Planet)
   - Verify no planet is claimed by multiple realms as Core
   - Verify all realms have 3-5 planets (or max available)

2. **ECS Integration**:
   - Verify realm entities have required components
   - Verify planet entities have `TerritoryClaimComponent`
   - Verify component queries work correctly

## Example Output

After generation, the galaxy will contain realm entities like:

```
Realm Entity: "realm-001"
├── NameComponent: "Terran Dominion"
├── RealmComponent:
│   ├── claimedPlanets: {
│   │   "planet-042": ClaimStatus.Core,
│   │   "planet-043": ClaimStatus.Core,
│   │   "planet-044": ClaimStatus.Core,
│   │   "planet-045": ClaimStatus.Core
│   │ }
│   └── foundingYear: 0
└── RealmStateComponent:
    ├── treasury: 100
    ├── stability: 50
    ├── legitimacy: 50
    └── hubris: 0

Planet Entity: "planet-042"
├── PlanetComponent: ...
├── LocationComponent: ...
└── TerritoryClaimComponent:
    └── claims: { "realm-001": ClaimStatus.Core }
```

## Future Extensions

This PR establishes the foundation for future territorial features:

1. **Territorial Expansion System**: Use existing claims to enable realm expansion
2. **Border Conflict System**: Generate events when contested claims exist
3. **Integration System**: Process to convert "Claimed" planets to "Core" status
4. **Diplomatic Boundaries**: Use realm territories for diplomatic interactions
5. **Rebellion System**: Planet claims affect rebellion likelihood

## Checklist

- [ ] All new classes follow ECS patterns (Components extend `Component`, static `create()` methods)
- [ ] All new classes implement Null Object Pattern where appropriate
- [ ] All parameters validated with `TypeUtils`
- [ ] JSDoc comments on all public methods
- [ ] Unit tests achieve >80% coverage
- [ ] Integration tests verify ECS integration
- [ ] Code passes `npm run lint`
- [ ] Code passes `npm run typecheck`
- [ ] All tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Follows one-type-per-file convention
- [ ] Static factory methods placed last in class files

## Breaking Changes

None. This is a new feature that adds optional generation during world setup. Existing simulations without realm generation will continue to work.

## Dependencies

- Requires `GalaxyMapComponent` to be initialized before generation
- Requires `NameGenerator` instance for realm naming
- Integrates with existing `RealmStateComponent` and `PlanetComponent`

## Related Issues

- Implements territorial claims design from `.requirements/312-design-territorial claims.md`
- Prerequisite for military conquest and expansion features
- Foundation for diplomatic system and faction-realm interactions

## References

- **Requirements**: `.requirements/requirements.md` (UNIVERSE-4, STATE-REALM-1)
- **Design**: `.requirements/design.md` (Section 4.2, 4.6)
- **Territorial Claims**: `.requirements/312-design-territorial claims.md`
- **Implementation Plan**: `.requirements/plan.md` (Phase 4)
- **Architecture**: `.github/copilot-instructions.md` (ECS patterns, Builder pattern)
