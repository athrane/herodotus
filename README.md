# Herodotus

A procedural world-building and history generation tool.

## Development

This section provides an overview of the project's architecture and class structure for developers.

### Scripts

All available npm scripts and what they do. Commands below are for PowerShell.

- build — bundle `src/main.ts` to `dist/bundle.js` using esbuild.
	Purpose: produce an optimized ESM bundle for Node (no TypeScript at runtime), ideal for reproducible runs and CI.
	- Run:
		```powershell
		npm run build
		```

- start — alias for `start:bundle`.
	Purpose: conventional entry to run the built bundle; safe default for production-like runs.
	- Run:
		```powershell
		npm start
		```

- start:bundle — builds (via prestart hook) and runs `node dist/bundle.js`.
	Purpose: ensures the bundle is up to date, then executes the exact artifact that would be deployed.
	- Run:
		```powershell
		npm run start:bundle
		```

- prestart:bundle — automatic pre-hook that runs `npm run build` before `start:bundle`.
	Purpose: guarantees the bundle reflects the latest sources without needing a separate build step.

- start:main — run `src/main.ts` directly via tsx (no bundling).
	Purpose: fastest developer loop; executes TypeScript directly with TS-aware loader, no files emitted.
	- Run:
		```powershell
		npm run start:main
		```

- dev — same as `start:main`; runs `src/main.ts` via tsx for fast iteration.
	Purpose: convenient alias commonly used during active development.
	- Run:
		```powershell
		npm run dev
		```

- start:ts — same as `start:main`; runs `src/main.ts` via tsx.
	Purpose: alternate name if you prefer explicit “ts” in scripts or for CI environments.
	- Run:
		```powershell
		npm run start:ts
		```

- test — run Jest test suite.
	Purpose: executes all unit tests using `jest.config.js`; use to validate behavior locally and in CI.
	- Run:
		```powershell
		npm test
		```

- lint — run ESLint on the project.
	Purpose: checks code quality and style across JS/TS; integrates with VS Code ESLint extension.
	- Run:
		```powershell
		npm run lint
		```

- lint:fix — ESLint with automatic fixes.
	Purpose: applies safe fixes where possible (formatting, simple refactors) to keep the codebase consistent.
	- Run:
		```powershell
		npm run lint:fix
		```

- typecheck — run TypeScript type-checking without emitting files.
	Purpose: validates types according to `tsconfig.json`; useful pre-commit or CI gate.
	- Run:
		```powershell
		npm run typecheck
		```

- prepare — runs Husky install (managed by npm automatically on install).
	Purpose: sets up Git hooks (e.g., pre-commit) defined by Husky; typically runs during `npm install`.

### Linting

This project uses ESLint (flat config) to lint both JavaScript and TypeScript.

- Config file: `eslint.config.mjs` (ESLint v9 flat config)
- Scope: lints `src/**/*.js` and `src/**/*.ts`; Jest globals enabled for files in `test/`
- Ignored by default: `dist/`, `coverage/`, `node_modules/`

Run locally:

```powershell
npm run lint      # report issues
npm run lint:fix  # attempt automatic fixes
```

Notes:
- Rules are intentionally lenient to ease adoption (e.g., fewer errors in tests and JS unused-vars shown as warnings). Tightening can be done later in `eslint.config.mjs`.
- For best DX, install the "ESLint" extension in VS Code to see problems inline and auto-fix on save.

### Class Documentation

The project is organized into modules, with each directory representing a distinct area of functionality.

#### `chronicle`

This module provides the classes for creating and managing historical events in the simulation.

*   **`ChronicleEvent`**: Represents a single, discrete entry in the chronicle, describing a historical event.
*   **`ChronicleComponent`**: A component to store a logbook of significant historical events. This component is typically attached to the primary World entity.
*   **`EventType`**: Represents the type of a historical event, including its category and specific name.
*   **`EventCategory`**: Defines categories for historical events (Political, Social, Economic, Technological, Cultural/Religious, Military, Natural).

#### `data`

This module contains classes for loading and accessing event data.

*   **`DataSetComponent`**: Component holding all loaded data set events (immutable snapshot at load time). Stored internally as a Map keyed by EventTrigger, supporting multiple events per trigger.
*   **`DataSetEvent`**: Represents a data-driven event that can occur during gameplay.
*   **`DataSetEventComponent`**: Component storing the current state of data-driven events on an entity.
*   **`DilemmaComponent`**: Component representing a player choice scenario with multiple options.
*   **`DilemmaSystem`**: The engine of the dilemma loop, responsible for generating choices based on the player's current state. Implements the read_state → find_triggers → generate_choices sequence.
*   **`DilemmaResolutionSystem`**: Processes entities with DilemmaComponents to resolve player choices. Selects one of the available choices, updates the entity's DataSetEventComponent, and removes the DilemmaComponent to prepare for the next cycle.
*   **`loadEvents`**: A function that loads events from a JSON file.

#### `ecs`

This module implements an Entity-Component-System (ECS) architecture, a design pattern that promotes data-oriented design and flexible composition over deep inheritance hierarchies.

*   **`Component`**: A base class for all components in the Entity-Component-System (ECS) architecture. Components are simple data containers. They should not contain any logic. This class serves as a marker to identify objects as components.
*   **`Entity`**: Represents an entity in the Entity-Component-System (ECS) architecture. An entity is essentially a container for components, identified by a unique ID. It acts as a lightweight wrapper that groups various components, which hold the actual data.
*   **`EntityManager`**: Manages the lifecycle of entities in the ECS architecture. It is responsible for creating, retrieving, destroying, and querying entities.
*   **`NameComponent`**: A component that provides a human-readable name.
*   **`PlayerComponent`**: A marker component to identify an entity as the player.
*   **`System`**: A base class for all systems in the Entity-Component-System (ECS) architecture. Systems contain the logic that operates on entities possessing a specific set of components.
*   **`SystemManager`**: Manages the registration, lifecycle, and execution of all systems in the ECS. This class orchestrates the logic updates for the simulation.

#### `generator`

This module contains classes responsible for generating various aspects of the world, including places and the world itself.

*   **`Place`**: Represents a location where a historical event occurred.

#### `generator/world`

This module is responsible for generating the initial world, including its geographical features and continents.

*   **`WorldGenerator`**: A self-contained generator that orchestrates the creation of a world, including its geography and history.

#### `geography`

This module contains all the core classes for representing and managing the geographical elements of the generated world.

*   **`Continent`**: Represents a continent in the world.
*   **`FeatureType`**: Represents a single geographical feature type. This class ensures each type has a consistent structure (e.g., a unique key and a display name).
*   **`GeographicalFeature`**: Represents a specific, named instance of a geographical feature in the world. e.g., "The Misty Mountains" which is of type MOUNTAIN.
*   **`GeographicalFeaturesFactory`**: Responsible for creating and registering various geographical feature types in the `GeographicalFeatureTypeRegistry`. This factory method initializes the registry with a comprehensive list of geographical features, allowing for easy access and management of these types throughout the application.
*   **`GeographicalFeatureTypeRegistry`**: A registry for managing and providing access to all defined geographical feature types. This acts as the central point for defining and retrieving types, making it extensible. This is implemented as a static class to enforce a single registry instance.
*   **`World`**: Represents the entire world, which can contain multiple continents.
*   **`WorldComponent`**: Holds the world data.

#### `historicalfigure`

This module contains classes for representing key entities in the generated history, such as historical figures and significant places.

*   **`HistoricalFigure`**: Represents a historical figure involved in an event.
*   **`HistoricalFigureBirthSystem`**: Manages the birth of historical figures.
*   **`HistoricalFigureComponent`**: A marker component to identify an entity as a historical figure. Components are simple data containers. They should not contain any logic.
*   **`HistoricalFigureInfluenceSystem`**: Translates the existence and roles of active historical figures into concrete historical events.
*   **`HistoricalFigureLifecycleSystem`**: Manages the birth and death of historical figures based on their lifespan.

#### `naming`

This module provides a flexible and powerful system for procedurally generating names, supporting various linguistic styles.

*   **`MarkovChain`**: Represents a Markov chain for procedural name generation. This class learns from a set of example names and can generate new names that mimic the patterns found in the input data. It is particularly useful for creating names that have a consistent linguistic feel. The chain is built by analyzing the frequency of character sequences (of a specified order) in the training data. It can then generate new sequences by making probabilistic choices based on the learned frequencies.
*   **`NameGenerator`**: Provides a flexible and powerful system for procedurally generating names. This class supports multiple generation strategies, including syllable-based combination and Markov chains, allowing for a wide range of linguistic styles. It is designed to be the central point for all name generation needs within the application, from continents and geographical features to historical figures and settlements.
*   **`SyllableSets`**: Defines collections of syllable sets for procedural name generation, categorized by linguistic characteristics, allowing creation of names with distinct cultural or geographical flavors.

#### `simulation`

This module contains classes related to the simulation's core logic and its construction.

*   **`Simulation`**: The main class that orchestrates an Entity-Component-System (ECS) based simulation. It manages all entities and systems, and drives the main simulation loop.

#### `simulation/builder`

This module provides classes for constructing and directing the simulation.

*   **`Builder`**: An abstract base class for building simulations. It defines the methods that must be implemented by subclasses to build entities, systems, and geographical features in a simulation.
*   **`SimulationBuilder`**: Responsible for building an ECS-based simulation. It extends the Builder to create a simulation with ECS components.
*   **`SimulationDirector`**: Responsible for directing the simulation building process. It uses a builder to construct the simulation and its components.

#### `time`

This module is responsible for tracking the passage of time, a core element of history generation.

*   **`Time`**: Represents a point in time within the chronicle.
*   **`TimeComponent`**: A component that associates a specific point in time with an entity. This is useful for entities that represent historical events, scheduled tasks, or any other time-sensitive data.
*   **`TimeSystem`**: A system that advances the simulation's global time. It processes all entities with a TimeComponent and updates their time based on the delta time.

#### `util`

This module provides common utility classes used throughout the application.

*   **`TypeUtils`**: Utility class for generic checks.

#### `util/log`

This module provides common utility classes used throughout the application.

*   **`LogHelper`**: A helper class with static methods for logging application-specific details. This provides a centralized place for logging formats.