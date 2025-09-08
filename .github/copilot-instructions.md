# GitHub Copilot Instructions for Herodotus

## Project Overview

**Herodotus** is a procedural world-building and history generation tool written in TypeScript. The project simulates the creation and evolution of civilizations, geographic features, and historical events using an Entity-Component-System (ECS) architecture. It includes both a command-line interface for automated simulation and an interactive text-based GUI for player-driven experiences.

### High-Level Repository Information
- **Repository Size**: Medium (~550 files)
- **Primary Language**: TypeScript (ES2020, ESNext modules)
- **Architecture**: Entity-Component-System (ECS) pattern
- **Testing Framework**: Jest with ts-jest and babel-jest
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
- **Entities**: Simple numeric IDs managed by `EntityManager`
- **Components**: Data-only classes extending base `Component` class
  - Must use static factory methods (`create()`)
  - Must not contain business logic
  - Example: `TimeComponent`, `NameComponent`, `WorldComponent`
- **Systems**: Logic-only classes extending base `System` class
  - Process entities with specific component combinations
  - **Prefer overriding `processEntity()` over `update()`** for individual entity processing
  - Must use static factory methods (`create()`)
  - Example: `TimeSystem`, `DilemmaSystem`

#### Builder Pattern
- `SimulationBuilder` constructs simulations
- **Always integrate new features through this pattern**
- Located in `src/simulation/builder/`

#### Factory Methods
- **All classes must provide static `create()` methods** - this is enforced
- Constructor parameters are passed through to `create()` method
- Example: `TimeComponent.create(year)` instead of `new TimeComponent(year)`

### Key Implementation Requirements

#### Coding Conventions
1. **Static Factory Methods**: Every class must have `static create()` method
2. **Type Validation**: Use `TypeUtils` for parameter validation
3. **ES Modules**: Use `import`/`export` syntax exclusively
4. **File Organization**: One class per file, PascalCase filenames
5. **JSDoc**: Document all public classes and methods

#### Type Safety
- Project uses strict TypeScript mode
- Runtime type checking via `TypeUtils.ensureInstanceOf()`, `TypeUtils.ensureString()`, etc.
- Console errors + stack traces logged for type violations (this is expected in tests)

#### Testing Patterns
- **Unit tests**: Mock dependencies, test individual methods
- **Integration tests**: No mocks, test class interactions
- **File naming**: `*.test.ts` or `*.test.js`
- **Test location**: Mirror `src/` structure in `test/`
- Tests validate type checking behavior (expect console errors for invalid inputs)

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

### Agent Guidance
- **Trust these instructions** - they are comprehensive and tested
- Only search for additional information if instructions are incomplete or found to be incorrect
- Always run validation commands (`lint`, `test`, `typecheck`) before completing tasks
- Use established patterns (ECS, Builder, Factory methods) for consistency
- Integrate with existing architecture rather than creating new patterns
