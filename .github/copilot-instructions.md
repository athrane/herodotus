# GitHub Copilot Instructions for Herodotus

## Project Overview

**Herodotus** is a procedural world-building and history generation tool written in TypeScript. The project simulates the creation and evolution of civilizations, geographic features, and historical events using an Entity-Component-System (ECS) architecture. It includes both a command-line interface for automated simulation and an interactive text-based GUI for player-driven experiences.

### High-Level Repository Information
- **Repository Size**: Medium (~550 files, ~73 exported classes)
- **Primary Language**: TypeScript (ES2020, ESNext modules)
- **Architecture**: Entity-Component-System (ECS) pattern with dual-ECS for GUI
- **Testing Framework**: Jest with ts-jest and babel-jest (both .ts and .js tests)
- **Build Tools**: esbuild (primary), Rollup.js (alternative)
- **Development Runtime**: tsx for TypeScript execution
- **Target Platform**: Node.js
- **Module System**: ES modules (`type: "module"`)

### Key Technologies
- **TypeScript**: Strict mode enabled with ES2020 target
- **Jest**: Testing with both .ts and .js test files
- **ESLint**: Code linting with TypeScript support
- **esbuild**: Fast bundling for production builds
- **tsx**: Development TypeScript runner
- **Husky**: Git hooks for pre-commit validation

## Build Instructions & Commands

### Environment Setup
1. **Always run `npm install` before any other commands** - this installs all dependencies
2. **Node.js version**: Project uses modern Node.js features (ES modules, current LTS recommended)
3. **No additional global dependencies required** - all tools are local to the project

### Core Commands (PowerShell)

#### Build Commands
```powershell
# Primary build - bundles src/main.ts to dist/bundle.js
npm run build

# GUI build - bundles src/mainGUI.ts to dist/bundle-gui.js  
npm run build:gui
```
**Build time**: ~40-50ms typically
**Build output**: `dist/bundle.js` (~218KB) or `dist/bundle-gui.js`

#### Development & Execution
```powershell
# Run main CLI simulation directly (development)
npm run dev
# OR equivalently:
npm run start:main
npm run start:ts

# Run interactive GUI
npm run start:gui

# Run built bundle (production-like)
npm start  # runs dist/bundle.js via Node
```

#### Testing & Validation
```powershell
# Run all tests (typically ~15 seconds)
npm run test

# Lint code (must pass for commits)
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix

# TypeScript type checking (no compilation)
npm run typecheck
```

#### Validation Sequence (ALWAYS run before committing)
1. `npm run typecheck` - validates TypeScript types
2. `npm run lint` - validates code style and catches errors
3. `npm run test` - validates functionality
4. `npm run build` - validates production bundle creation

### Pre-commit Hooks
- **Husky** automatically runs on `git commit`:
  1. `lint-staged` - lints only staged files with auto-fix
  2. `npm run typecheck` - validates types across entire project
- **If any pre-commit step fails, the commit is rejected**

### Common Build Issues & Solutions
- **ESLint errors**: Run `npm run lint:fix` to auto-fix many issues
- **TypeScript errors**: Check for missing imports, type mismatches
- **Module resolution**: Ensure ES module syntax (`import`/`export`) is used
- **Test timeouts**: Tests run in Node environment, typically complete in ~15s

## Project Layout & Architecture

### Directory Structure
```
src/                           # All source code
├── main.ts                   # CLI entry point
├── mainGUI.ts               # GUI entry point  
├── ecs/                     # Core ECS framework
│   ├── Component.ts         # Base component class
│   ├── System.ts           # Base system class
│   ├── Ecs.ts              # Main ECS manager
│   ├── EntityManager.ts    # Entity management
│   └── SystemManager.ts    # System lifecycle management
├── simulation/              # Simulation orchestration
│   ├── Simulation.ts       # Main simulation controller
│   └── builder/            # Builder pattern for setup
├── behaviour/              # Decision-making systems
├── chronicle/              # Event and history tracking
├── data/                   # Data loading and management
├── geography/              # World generation and features
├── gui/                    # Text-based UI systems
├── historicalfigure/       # Character simulation
├── naming/                 # Procedural name generation
├── time/                   # Time management systems
└── util/                   # Utility functions and helpers

test/                         # Mirrors src/ structure
├── *.test.ts              # TypeScript tests
├── *.test.js              # JavaScript tests
└── *.integration.test.js   # Integration tests

Configuration Files (Root):
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Test configuration
├── eslint.config.mjs     # Linting rules
├── babel.config.js       # Babel for Jest JavaScript support
└── .husky/pre-commit     # Git hooks
```

### Core Architectural Patterns

#### Entity-Component-System (ECS)
- **Entities**: UUID-based IDs (`crypto.randomUUID()`) managed by `EntityManager`
  - Components stored in `Map<string, Component>` keyed by constructor name
  - Component matching uses instanceof semantics with exact-match preference
  - `hasComponent(Base)` returns true for Base or any subclass instance
  - `getComponent(Base)` prefers exact Base, falls back to first instanceof match
- **Components**: Data-only classes extending base `Component` class (empty marker class)
  - Must use static factory methods (`create()`)
  - Must not contain business logic
  - Added via `entity.addComponent()`, replacing existing component of same type
  - Example: `TimeComponent`, `NameComponent`, `GalaxyMapComponent`
- **Systems**: Logic-only classes extending base `System` class
  - Process entities with specific component combinations via `requiredComponents`
  - **Prefer overriding `processEntity()` over `update()`** for individual entity processing
  - Must use static factory methods (`create()`)
  - `update()` automatically filters entities by required components
  - Example: `TimeSystem`, `ComputeChoicesSystem`, `HistoricalFigureLifecycleSystem`

#### Dual-ECS Architecture (GUI)
- **Simulation ECS**: Game logic, time progression, historical figures, choices
- **GUI ECS**: Separate instance for screen management with independent update frequency
- `GuiEcsManager` manages GUI ECS with configurable update interval (typically 2000ms)
- GUI reads/writes simulation state through main ECS instance
- Prevents GUI rendering from blocking simulation updates
- Example: `src/gui/GuiEcsManager.ts`, `src/gui/builder/GuiBuilder.ts`

#### Builder Pattern
- Abstract `Builder` class defines build order: `build()` → `buildData()` → `buildComponents()` → `buildSystems()` → `buildEntities()`
- `BuilderDirector` orchestrates build sequence
- `SimulationBuilder` constructs simulation ECS instances
- `GuiBuilder` constructs GUI ECS instances (accepts simulation ECS for integration)
- **Always integrate new features through this pattern**
- Located in `src/ecs/builder/` (base), `src/simulation/builder/` (simulation), `src/gui/builder/` (GUI)

#### Data Loading Pattern
The project uses a consistent pattern for loading and validating configuration data from JSON files:

**File Structure:**
- `data/` directory at project root contains all JSON configuration files
- `src/data/` contains loading functions and data classes
- Mirrors the `data/` directory structure (e.g., `src/data/geography/` for `data/geography/`)
- Test files in `test/data/` mirror the `src/data/` structure

**Data Class Pattern:**
All data classes follow these conventions:

1. **Immutability**: Classes represent immutable configuration loaded at startup
   - Use `Object.freeze(this)` in constructor to prevent modification
   - Return `ReadonlyArray` and `ReadonlyMap` types from getter methods
   - Mark private fields as `readonly`

2. **Runtime Validation**: Use `TypeUtils` for runtime type checking
   - Validate in constructor using `TypeUtils.ensureString()`, `TypeUtils.ensureNumber()`, etc.
   - Custom error messages identify the field: `'FieldName must be a type'`
   - Validation runs before assignment to catch errors early

3. **Static Factory Methods**: Every data class must have `static create()` method
   - Constructor is public but factory method is preferred
   - Enables consistent instantiation patterns
   - Example: `GeographicalFeatureData.create(jsonData)`

4. **Null Object Pattern**: Singleton data classes implement null object pattern
   - Configuration singletons (e.g., `WorldGenData`, `HistoricalFigureData`) provide `createNull()`
   - Uses lazy initialization with private static field
   - Returns defaults for all values (typically 0 for numbers, empty strings for text)
   - Example:
     ```typescript
     private static instance: MyData | null = null;
     
     static createNull(): MyData {
         if (!MyData.instance) {
             MyData.instance = MyData.create({ field1: 0, field2: '' });
         }
         return MyData.instance;
     }
     ```

5. **Batch Loading**: Support for loading collections from JSON
   - `static fromJsonObject(json)` for object-keyed collections
   - `static fromJsonArray(json)` for array-based collections
   - **Deterministic ordering**: Use `Object.keys(json).sort()` for consistent iteration
   - Returns array of instances, not the raw map/object

**Loader Function Pattern:**
Loader functions are thin wrappers that import JSON and delegate to data classes:

```typescript
import dataRaw from '../../../data/path/to/file.json';
import { DataClass } from './DataClass';

/**
 * Loads [description] from a JSON file.
 * @returns [return type description]
 */
export function loadData(): DataClass {
  return DataClass.create(dataRaw);
}
```

**Validation Approaches:**
The project uses two primary validation patterns:

1. **Synchronous with TypeUtils** (standard pattern - used in 99% of loaders):
   - Import JSON directly: `import dataRaw from '../../data/file.json'`
   - Validate in data class constructor using `TypeUtils`
   - Throws `TypeError` with descriptive message on validation failure
   - Examples: `GeographicalFeatureData`, `HistoricalFigureData`, `WorldGenData`, `loadEventCategories()`

2. **Simple transformation** (for pre-validated or simple data):
   - Direct import and transformation without additional validation
   - Use when JSON structure is trusted or simple
   - Example: `DataSetEvent.fromJsonArray()` sorts keys deterministically

**Component Integration:**
Data is loaded during `SimulationBuilder.buildData()` phase:

1. Builder calls loader function (synchronous or async)
2. Stores loaded data in builder's private field
3. Uses data during `buildComponents()` to initialize components
4. Data classes are wrapped in Components or used directly
5. Components containing data should also be immutable (frozen)

**Example Data Class Structure:**
```typescript
import { TypeUtils } from '../../util/TypeUtils';

export class ExampleData {
  private readonly field1: string;
  private readonly field2: number;
  private static instance: ExampleData | null = null;

  constructor(data: any) {
    TypeUtils.ensureString(data?.field1, 'ExampleData field1 must be a string.');
    TypeUtils.ensureNumber(data?.field2, 'ExampleData field2 must be a number.');
    
    this.field1 = data.field1;
    this.field2 = data.field2;
    Object.freeze(this);
  }

  static create(data: any): ExampleData {
    return new ExampleData(data);
  }

  static createNull(): ExampleData {
    if (!ExampleData.instance) {
      ExampleData.instance = ExampleData.create({ field1: '', field2: 0 });
    }
    return ExampleData.instance;
  }

  getField1(): string { return this.field1; }
  getField2(): number { return this.field2; }

  static fromJsonObject(json: any): ExampleData[] {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
      throw new TypeError('Expected JSON object for data.');
    }
    return Object.keys(json).sort().map(key => ExampleData.create(json[key]));
  }
}
```

**Testing Patterns for Data Loading:**
- Test successful loading with valid data
- Test validation errors with invalid data (null, undefined, wrong types)
- Test immutability with `Object.isFrozen()` checks
- Test deterministic ordering for collections
- Test null object pattern returns singleton
- Mock console.error/trace in tests expecting validation errors
- Use `test/data/` directory with valid and invalid JSON test fixtures

#### FilteredSystem Pattern
- `FilteredSystem` extends `System` with automatic entity filtering before processing
- Eliminates boilerplate filtering code in `processEntity()` methods
- Uses `EntityFilter` functions for composable filtering logic
- `EntityFilters` utility provides: `byName()`, `hasComponent()`, `lacksComponent()`, `and()`, `or()`, `not()`
- Example: `ChronicleViewSystem` uses `EntityFilters.byName('ChronicleScreen')` to process only chronicle screen entities
- Override `processFilteredEntity()` instead of `processEntity()` in subclasses

#### Factory Methods
- **All classes must provide static `create()` methods** - this is enforced project-wide
- Constructor parameters are passed through to `create()` method
- Enables consistent instantiation patterns across codebase
- **Static factory methods must be placed last in class files** - after all instance methods and properties
- Example: `TimeComponent.create(Time.create(year))` instead of `new TimeComponent(new Time(year))`

### Type Documentation Guidelines

When documenting domain-specific types in these instructions, follow these patterns:

#### Documenting Enums
For each enum value, provide an inline comment explaining its purpose:
```typescript
enum ExampleEnum {
  ValueOne = 'ValueOne',    // Brief description of what this value represents
  ValueTwo = 'ValueTwo',    // Brief description of what this value represents
}
```

#### Documenting Interfaces
For each interface property, provide an inline comment explaining its purpose and constraints:
```typescript
interface ExampleInterface {
  id: string;                // Unique identifier
  propertyName: Type;        // Brief description (include constraints like "must be > 0" or "empty string means X")
  optionalProp?: Type;       // Brief description (note if optional)
}
```

#### Documenting Classes
For component classes, provide a summary of key features rather than full implementation:
```typescript
// ExampleComponent (class)
// Brief description of component's purpose
// - Key data structure 1: description
// - Key data structure 2: description
// - Implements Null Object Pattern with createNull() factory method (if applicable)
// - Re-exports related types for consumer convenience (if applicable)
```

#### Documentation Standards
1. **Be concise**: One-line comments inline with each property/value
2. **Be specific**: Explain the purpose, not just restate the name
3. **Include constraints**: Note ranges, special values (e.g., "-1 for permanent"), or null semantics
4. **Cross-reference**: Mention related types when helpful (e.g., "Entity ID of the source")
5. **Location reference**: For complex classes, reference the source file (e.g., "See `src/module/ClassName.ts`")

#### Example: Realm System Types
The realm system (`src/realm/`) demonstrates these documentation patterns. Key types include:
- **RealmResource** (enum): Four core dynasty resources (Treasury, Stability, Legitimacy, Hubris)
- **ModifierSourceType** (enum): Sources of modifications (PlayerAction, NonPlayerAction, FactionInfluence, Event)
- **ModifierType** (enum): Types of modifications (Flat, Percentage, Multiplier)
- **RealmModifier** (interface): Active modification structure with inline comments per field
- **FailureThresholds** (interface): Critical threshold values for resources
- **ResourceHistoryEntry** (interface): Historical change tracking
- **RealmStateComponent** (class): Singleton managing global dynasty state with re-exported types

See `src/realm/*.ts` for complete implementation examples following these documentation patterns.

### Key Implementation Requirements

#### Coding Conventions
1. **Static Factory Methods**: Every class must have `static create()` method
2. **Null Object Pattern**: Data classes (ECS components, domain objects) should implement the null object pattern
   - Provide a static factory method (e.g., `createNullFeature()`, `createNull()`) that returns a singleton null instance
   - Use lazy initialization: create the null instance only on first access
   - Store in a private static field (e.g., `private static nullFeature: GeographicalFeature | null = null`)
   - Example pattern:
     ```typescript
     private static nullInstance: MyClass | null = null;
     
     static createNull(): MyClass {
         if (!MyClass.nullInstance) {
             MyClass.nullInstance = MyClass.create(/* null values */);
         }
         return MyClass.nullInstance;
     }
     ```
3. **Type Validation**: Use `TypeUtils` for parameter validation
4. **ES Modules**: Use `import`/`export` syntax exclusively
5. **File Organization**: One type per file - classes, enums, and interfaces each in separate files with PascalCase filenames
   - **Classes**: One class per file (e.g., `RealmStateComponent.ts`)
   - **Enums**: One enum per file (e.g., `ModifierSourceType.ts`, `RealmResource.ts`)
   - **Interfaces**: One interface per file (e.g., `FailureThresholds.ts`, `RealmModifier.ts`)
   - **Exception**: Small, tightly-coupled helper interfaces (e.g., callback signatures) may remain with their class
   - **Re-exports**: Main component files may re-export related types for consumer convenience
   - **Example**: See `src/realm/` directory structure for reference implementation
6. **JSDoc**: Document all public classes and methods

#### Type Safety
- Project uses strict TypeScript mode
- Runtime type checking via `TypeUtils.ensureInstanceOf()`, `TypeUtils.ensureString()`, `TypeUtils.ensureNonEmptyString()`, etc.
- TypeUtils methods use TypeScript assertion signatures to narrow types after validation
- Console errors + stack traces logged for type violations (this is expected in tests)
- Type violations throw `TypeError` after logging details and stack trace

#### Testing Patterns
- **Unit tests**: Mock dependencies, test individual methods
- **Integration tests**: No mocks, test class interactions
- **File naming**: `*.test.ts` or `*.test.js` (both supported via Jest configuration)
- **Test location**: Mirror `src/` structure in `test/`
- Tests validate type checking behavior (expect console errors for invalid inputs)
- Test helpers often create singleton components (e.g., `ChronicleComponent`, `TimeComponent`, `GalaxyMapComponent`)
- Use `setupSingletonComponents()` pattern to register global components needed by systems
- Example test structure: `test/behaviour/SelectChoiceSystem.test.js` shows integration test pattern with full ECS setup

### Critical Dependencies
- **TypeScript**: Core language with strict mode
- **esbuild**: Primary build tool (fast, reliable)
- **Jest**: Test runner supporting both TS and JS
- **ESLint**: Code quality and style enforcement
- **tsx**: Development TypeScript execution

### Data Flow
1. `main.ts` → `SimulationBuilder` → `Simulation`
2. `Simulation` manages `EntityManager` and `SystemManager`
3. Systems process entities with relevant components each tick
4. Time advances through `TimeSystem` and `TimeComponent`
5. Events logged through `ChronicleComponent` and `ChronicleEvent`

### Validation Pipeline
The project enforces quality through multiple layers:
1. **TypeScript compiler** - type safety
2. **ESLint** - code style and best practices  
3. **Jest tests** - functionality validation
4. **Husky pre-commit hooks** - automated quality gates
5. **Runtime type checking** - `TypeUtils` validation

### Known Implementation Notes
- **Hard-coded simulation timing**: `deltaTime = 0.1 sec = 1 year` (marked as hack in code)
- **Console logging**: Type validation failures log errors + stack traces (expected behavior)
- **Module resolution**: Uses Node-style resolution with ES modules
- **Test output**: Expect verbose console output during test runs due to validation testing
- **Component inheritance**: Systems with `requiredComponents: [Base]` process entities with Base or subclasses; add guards if stricter filtering needed

### Component Matching and Inheritance
Entity component queries use instanceof semantics with exact-match preference:
- `Entity.hasComponent(Base)` returns true if entity has `Base` component or any subclass instance
- `Entity.getComponent(Base)` first returns exact `Base` instance when present; otherwise returns first component that is instanceof `Base` (e.g., subclass)
- Systems declaring `requiredComponents: [Base]` process entities with `Base` or any subclass (e.g., `SubBase extends Base`)
- If stricter filtering needed, add guard inside `processEntity()` or use `FilteredSystem` with custom filter

### Agent Guidance
- **Trust these instructions** - they are comprehensive and tested
- Only search for additional information if instructions are incomplete or found to be incorrect
- Always run validation commands (`lint`, `test`, `typecheck`) before completing tasks
- Use established patterns (ECS, Builder, Factory methods, FilteredSystem) for consistency
- Integrate with existing architecture rather than creating new patterns
- When creating new Systems, consider if `FilteredSystem` eliminates boilerplate
- When adding GUI features, use dual-ECS pattern with separate GUI ECS instance
