# PR #318: Implement RandomComponent for Deterministic Random Number Generation

## Overview

This PR introduces a centralized random number generation system using the ECS architecture. The `RandomComponent` provides deterministic random number generation seeded from a JSON configuration file, enabling reproducible simulations and testing.

## Motivation

Currently, random number generation in Herodotus is decentralized, making it difficult to:
- Reproduce specific simulation runs for debugging
- Create deterministic test scenarios
- Share interesting world configurations with consistent outcomes
- Implement save/load functionality with predictable behavior

By centralizing random number generation through a singleton component, we gain:
- **Determinism**: Identical seeds produce identical simulation outcomes
- **Testability**: Predictable random sequences for unit/integration tests
- **Reproducibility**: Players can share seed values to recreate worlds
- **Save/Load Support**: Random state can be serialized/deserialized

## Design

### Architecture Overview

The design follows established ECS patterns:
1. **RandomComponent**: Data-only component storing RNG state (singleton pattern)
2. **Data Loading**: JSON-based seed configuration in `data/random/`
3. **Integration**: Component registered on global ECS entity during simulation setup
4. **Type Safety**: Full TypeScript support with runtime validation

### Component Structure

#### File: `src/ecs/RandomComponent.ts`

```typescript
/**
 * RandomComponent provides deterministic random number generation for the simulation.
 * Uses a seedable pseudo-random number generator (PRNG) to ensure reproducibility.
 * 
 * This is a singleton component - only one instance should exist per simulation,
 * attached to the global ECS entity.
 */
export class RandomComponent extends Component {
    private seed: string;           // Original seed string for serialization
    private rng: SeededRandom;      // Internal PRNG implementation
    private callCount: number;      // Number of random calls (for debugging/analysis)
    
    constructor(seed: string);
    
    // Primary API
    next(): number;                 // Returns random float [0, 1)
    nextInt(min: number, max: number): number;  // Returns random integer [min, max]
    nextBool(): boolean;            // Returns random boolean
    nextChoice<T>(array: T[]): T;   // Returns random element from array
    
    // State management
    getSeed(): string;              // Returns original seed
    getCallCount(): number;         // Returns number of random() calls
    setState(state: RandomState): void;  // Restore RNG state (for save/load)
    getState(): RandomState;        // Serialize RNG state
    
    // Factory methods
    static create(seed: string): RandomComponent;
    static createNull(): RandomComponent;
}
```

#### File: `src/ecs/RandomState.ts`

```typescript
/**
 * Serializable state for RandomComponent.
 * Used for save/load functionality and state restoration.
 */
export interface RandomState {
    seed: string;           // Original seed string
    internalState: number;  // PRNG internal state (implementation-dependent)
    callCount: number;      // Number of random() calls made
}
```

#### File: `src/ecs/SeededRandom.ts`

```typescript
/**
 * Seedable pseudo-random number generator using Mulberry32 algorithm.
 * Fast, high-quality PRNG suitable for game simulations.
 * 
 * Reference: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */
export class SeededRandom {
    private state: number;
    
    constructor(seed: string);
    
    // Generate random float [0, 1)
    next(): number;
    
    // State management
    getState(): number;
    setState(state: number): void;
    
    // Factory methods
    static create(seed: string): SeededRandom;
    static hashString(seed: string): number;  // Convert string seed to numeric state
}
```

### Data Loading

#### File: `data/random/seed.json`

```json
{
    "version": "1.0",
    "seed": "herodotus-default-seed",
    "description": "Default random seed for Herodotus simulations. Change this value to generate different random sequences."
}
```

#### File: `src/data/random/RandomSeed.ts`

```typescript
/**
 * Data structure representing a random seed configuration.
 */
export interface RandomSeed {
    version: string;        // Schema version (e.g., "1.0")
    seed: string;           // Seed string (any non-empty string)
    description?: string;   // Optional human-readable description
}
```

#### File: `src/data/random/RandomSeedComponent.ts`

```typescript
/**
 * Component holding loaded random seed configuration data.
 * Singleton component attached to DataSet entity.
 */
export class RandomSeedComponent extends Component {
    private randomSeed: RandomSeed;
    
    constructor(randomSeed: RandomSeed);
    
    getRandomSeed(): RandomSeed;
    
    static create(randomSeed: RandomSeed): RandomSeedComponent;
    static createNull(): RandomSeedComponent;
}
```

#### File: `src/data/random/loadRandomSeed.ts`

```typescript
/**
 * Loads random seed configuration from JSON file.
 * 
 * @param filePath - Path to seed.json file
 * @returns Promise resolving to RandomSeed object
 * @throws Error if file not found or invalid JSON structure
 */
export async function loadRandomSeed(filePath: string): Promise<RandomSeed>;

/**
 * Validates RandomSeed structure and content.
 * 
 * @param data - Parsed JSON object to validate
 * @throws TypeError if validation fails
 */
export function validateRandomSeed(data: unknown): asserts data is RandomSeed;
```

### Integration Points

#### SimulationBuilder Integration

Update `src/simulation/builder/SimulationBuilder.ts`:

```typescript
protected buildData(ecs: Ecs): void {
    // Existing data loading...
    
    // Load random seed configuration
    const randomSeedPath = path.join(process.cwd(), 'data', 'random', 'seed.json');
    const randomSeed = await loadRandomSeed(randomSeedPath);
    
    // Attach to DataSet entity
    const dataSetEntity = ecs.getEntityManager()
        .getEntitiesByComponent(DataSetComponent)[0];
    dataSetEntity.addComponent(RandomSeedComponent.create(randomSeed));
}

protected buildComponents(ecs: Ecs): void {
    // Existing components...
    
    // Initialize RandomComponent on global entity
    const dataSetEntity = ecs.getEntityManager()
        .getEntitiesByComponent(DataSetComponent)[0];
    const randomSeedComponent = dataSetEntity.getComponent(RandomSeedComponent);
    const seed = randomSeedComponent.getRandomSeed().seed;
    
    const globalEntity = ecs.getEntityManager()
        .getEntitiesByComponent(TimeComponent)[0];  // Global entity has TimeComponent
    globalEntity.addComponent(RandomComponent.create(seed));
}
```

### Usage Example

```typescript
// In any System that needs random numbers:
class ExampleSystem extends System {
    processEntity(entity: Entity, deltaTime: number): void {
        // Access global RandomComponent
        const randomComponent = this.ecs.getEntityManager()
            .getEntitiesByComponent(RandomComponent)[0]
            .getComponent(RandomComponent);
        
        // Generate random numbers
        const chance = randomComponent.next();              // [0, 1)
        const diceRoll = randomComponent.nextInt(1, 6);     // 1-6
        const coinFlip = randomComponent.nextBool();        // true/false
        const option = randomComponent.nextChoice(['A', 'B', 'C']);
        
        // Use random values...
    }
}
```

## Implementation Details

### Mulberry32 PRNG Algorithm

The implementation uses Mulberry32 for its:
- **Speed**: Single multiply per call (very fast)
- **Quality**: Passes most statistical tests (adequate for simulations)
- **Simplicity**: Easy to understand and debug
- **Small State**: Only 32 bits of internal state

Algorithm pseudocode:
```
state = state + 0x6D2B79F5 | 0
t = Math.imul(state ^ state >>> 15, state | 1)
t = t ^ t + Math.imul(t ^ t >>> 7, t | 61)
return ((t ^ t >>> 14) >>> 0) / 4294967296
```

### String Seed Hashing

Seeds are converted to 32-bit integers using a variant of FNV-1a hash:
```typescript
static hashString(seed: string): number {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619); // FNV prime
    }
    return hash >>> 0; // Convert to unsigned 32-bit
}
```

### Type Safety

All classes follow project conventions:
- Runtime validation using `TypeUtils.ensureNonEmptyString()`, `TypeUtils.ensureNumber()`, etc.
- TypeScript strict mode compliance
- Assertion signatures for validation functions
- Console logging + stack traces for type violations

### Null Object Pattern

`RandomComponent.createNull()` returns a singleton instance with:
- Seed: `"null-random-seed"`
- Fixed sequence: Always returns 0.5 for `next()`, consistent values for other methods
- Used in tests where random behavior is not relevant

## Test Suite

### Unit Tests

#### File: `test/ecs/RandomComponent.test.ts`

```typescript
describe('RandomComponent', () => {
    describe('constructor', () => {
        it('should create component with valid seed');
        it('should throw TypeError for empty seed');
        it('should throw TypeError for non-string seed');
    });
    
    describe('next()', () => {
        it('should return values in [0, 1) range');
        it('should return different values on successive calls');
        it('should return identical sequences for same seed');
        it('should return different sequences for different seeds');
    });
    
    describe('nextInt()', () => {
        it('should return integers within [min, max] range');
        it('should return min when min == max');
        it('should throw for min > max');
        it('should handle negative ranges');
        it('should have uniform distribution (statistical test)');
    });
    
    describe('nextBool()', () => {
        it('should return true or false');
        it('should have ~50% distribution over large sample');
    });
    
    describe('nextChoice()', () => {
        it('should return element from array');
        it('should throw for empty array');
        it('should return only element for single-element array');
        it('should have uniform distribution over array elements');
    });
    
    describe('state management', () => {
        it('should save and restore state correctly');
        it('should continue sequence after state restoration');
        it('should track call count accurately');
        it('should serialize to RandomState interface');
    });
    
    describe('factory methods', () => {
        it('should create component via create()');
        it('should return singleton null instance');
        it('should have null instance return fixed values');
    });
});
```

#### File: `test/ecs/SeededRandom.test.ts`

```typescript
describe('SeededRandom', () => {
    describe('constructor', () => {
        it('should create PRNG with string seed');
        it('should throw for empty seed');
    });
    
    describe('next()', () => {
        it('should return values in [0, 1) range');
        it('should generate 10000 values without repetition');
        it('should pass basic randomness test (runs test)');
        it('should pass chi-square distribution test');
    });
    
    describe('hashString()', () => {
        it('should hash string to 32-bit integer');
        it('should produce different hashes for different strings');
        it('should produce same hash for same string');
        it('should handle Unicode characters');
        it('should handle empty string');
    });
    
    describe('state management', () => {
        it('should get internal state');
        it('should set internal state');
        it('should continue sequence from restored state');
    });
});
```

#### File: `test/data/random/loadRandomSeed.test.ts`

```typescript
describe('loadRandomSeed', () => {
    describe('loading', () => {
        it('should load valid seed.json file');
        it('should throw for non-existent file');
        it('should throw for invalid JSON syntax');
        it('should throw for missing seed field');
        it('should handle optional description field');
    });
    
    describe('validation', () => {
        it('should validate correct RandomSeed structure');
        it('should throw for missing version');
        it('should throw for empty seed string');
        it('should throw for non-string seed');
        it('should throw for non-string version');
        it('should accept missing description');
    });
});
```

#### File: `test/data/random/RandomSeedComponent.test.ts`

```typescript
describe('RandomSeedComponent', () => {
    it('should create component with valid RandomSeed');
    it('should throw for invalid RandomSeed structure');
    it('should return stored RandomSeed');
    it('should implement null object pattern');
    it('should use factory method');
});
```

### Integration Tests

#### File: `test/integration/random.integration.test.ts`

```typescript
describe('Random Integration', () => {
    it('should load seed from JSON and initialize RandomComponent');
    it('should attach RandomSeedComponent to DataSet entity');
    it('should attach RandomComponent to global entity');
    it('should allow systems to access RandomComponent');
    it('should produce identical sequences across multiple runs with same seed');
    it('should produce different sequences with different seeds');
    it('should serialize and restore random state correctly');
});
```

### Test Data Files

#### File: `test/data/random/test-seed.json`

```json
{
    "version": "1.0",
    "seed": "test-seed-12345",
    "description": "Test seed for unit tests"
}
```

#### File: `test/data/random/invalid-seed.json`

Various invalid test cases for validation testing.

## Files Changed/Added

### New Files

**Core Component:**
- `src/ecs/RandomComponent.ts` - Main random number generation component
- `src/ecs/SeededRandom.ts` - Mulberry32 PRNG implementation
- `src/ecs/RandomState.ts` - State serialization interface

**Data Loading:**
- `src/data/random/RandomSeed.ts` - Seed data interface
- `src/data/random/RandomSeedComponent.ts` - Component holding seed data
- `src/data/random/loadRandomSeed.ts` - JSON loading and validation

**Data Files:**
- `data/random/seed.json` - Default seed configuration

**Tests:**
- `test/ecs/RandomComponent.test.ts` - Component unit tests
- `test/ecs/SeededRandom.test.ts` - PRNG unit tests
- `test/data/random/RandomSeedComponent.test.ts` - Data component tests
- `test/data/random/loadRandomSeed.test.ts` - Loading/validation tests
- `test/integration/random.integration.test.ts` - Integration tests
- `test/data/random/test-seed.json` - Test data file

### Modified Files

**Simulation Builder:**
- `src/simulation/builder/SimulationBuilder.ts`
  - Add `loadRandomSeed()` call in `buildData()`
  - Add `RandomComponent` initialization in `buildComponents()`

**Copilot Instructions (Optional):**
- `.github/copilot-instructions.md`
  - Add RandomComponent documentation to "Core Architectural Patterns" section
  - Add usage guidelines for random number generation

## Validation Checklist

Before merge, ensure:
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes (or `npm run lint:fix` applied)
- [ ] `npm run test` passes with all new tests
- [ ] `npm run build` produces valid bundle
- [ ] Integration test verifies deterministic behavior
- [ ] Default seed.json file exists and loads correctly
- [ ] All classes follow static factory method pattern
- [ ] All classes implement null object pattern where applicable
- [ ] TypeUtils validation used for all inputs
- [ ] JSDoc comments added for all public APIs
- [ ] Test coverage ≥80% for new code

## Future Enhancements (Out of Scope)

1. **Refactoring Existing Code**: Update existing systems to use `RandomComponent` instead of `Math.random()`
2. **Multiple RNG Streams**: Support separate random streams for different simulation aspects (events, terrain, names, etc.)
3. **Advanced PRNGs**: Option to switch between multiple PRNG algorithms (Xorshift, PCG, etc.)
4. **Random Seed UI**: GUI interface for entering custom seeds
5. **Seed Generation**: Auto-generate memorable seeds (e.g., three-word combinations)
6. **Save/Load Integration**: Persist random state in save files
7. **Debugging Tools**: System to replay random sequences from logs
8. **Performance Profiling**: Track which systems consume most random calls

## Testing Strategy Summary

The test suite ensures:
1. **Correctness**: All methods return values within expected ranges
2. **Determinism**: Identical seeds produce identical sequences
3. **Quality**: Statistical tests validate randomness properties
4. **Robustness**: Invalid inputs throw appropriate errors with logging
5. **Integration**: Component works within full ECS simulation context
6. **Reproducibility**: State can be saved and restored correctly

Total estimated test count: ~45 unit tests + 7 integration tests

## Notes

- PRNG state is 32-bit, limiting theoretical period to ~4.2 billion calls (adequate for current simulation scale)
- String seed hashing uses FNV-1a for speed and simplicity (not cryptographically secure, but sufficient for simulation purposes)
- Call count tracking enables analysis of random consumption patterns across simulation
- Null object pattern enables systems to gracefully handle missing RandomComponent in tests
- Design is extensible: easy to swap PRNG algorithms or add multiple independent random streams in future

## References

- [Mulberry32 PRNG](https://github.com/bryc/code/blob/master/jshash/PRNGs.md)
- [FNV Hash Function](http://www.isthe.com/chongo/tech/comp/fnv/)
- [Diehard Statistical Tests](https://en.wikipedia.org/wiki/Diehard_tests)
