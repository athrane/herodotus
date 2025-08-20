# Herodotus

A procedural world-building and his- start:ts — same as `start:main`; runs `src/main.ts` via tsx.
	Purpose: alternate name if you prefer explicit "ts" in scripts or for CI environments.
	- Run:
		```powershell
		npm run start:ts
		```

- start:gui — run the interactive text-based GUI version of the simulation via tsx.
	Purpose: launches the GUI interface for interactive gameplay with player decision-making and real-time simulation control.
	- Run:
		```powershell
		npm run start:gui
		```

- build:gui — bundle `src/mainGUI.ts` to `dist/bundleGUI.js` using esbuild.
	Purpose: produce an optimized ESM bundle for the GUI version, ideal for distribution and production deployment of the interactive interface.
	- Run:
		```powershell
		npm run build:gui
		```

- test — run Jest test suite.eration tool.

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

## Text-Based GUI

The Herodotus simulation includes an interactive text-based GUI that allows you to control your player character and make decisions that shape history.

### Features

The text-based GUI provides the following functionality:

- **Interactive Decision Making**: Make choices for your player character when dilemmas arise
- **Real-time Simulation Control**: View live simulation updates with automatic screen refresh
- **Compact Status Display**: All key information displayed in a single header line
- **Chronicle Viewing**: Review recent historical events and decisions
- **Clean Interface**: Screen-clearing display that avoids scrolling for better readability

### Running the GUI

To start the interactive GUI version of the simulation:

```bash
npm run start:gui
```

Alternatively, you can run it directly with tsx:

```bash
tsx src/mainGUI.ts --gui
```

### Interface Layout

The GUI features a clean, fixed-layout interface that refreshes every 2 seconds:

```
============================================================
Year: 0035 | Simulation: Running | Player: Player Character | Status: No pending decisions | Herodotus 1.0.0
============================================================

============================================================

*** DECISION REQUIRED *** (when applicable)
[1] Economic Reform
    Type: Economic
    Description: The kingdom's treasury is running low...
    → Your choice will affect the kingdom's prosperity...

[2] Maintain Status Quo
    Type: Economic  
    Description: Keep current economic policies...
    → The situation may worsen, but no disruption...

============================================================
Commands: [H]elp [S]tatus [C]hoices Ch[r]onicle [Q]uit
============================================================
```

### Available Commands

The GUI accepts both full commands and single-letter shortcuts:

- **[H]elp** / `h` - Show available commands and interface help
- **[S]tatus** / `s` - Display detailed simulation status  
- **[C]hoices** / `c` - View and make decisions for current dilemmas
- **Ch[r]onicle** / `r` - Display recent historical events (last 10)
- **[Q]uit** / `q` - Exit the simulation

### How It Works

#### Compact Header Display
The header shows all essential information in one line:
- **Year**: Current simulation year (zero-padded to 4 digits)
- **Simulation**: Running/Stopped status
- **Player**: Character name  
- **Status**: Number of pending decisions or "No pending decisions"
- **App Title**: "Herodotus 1.0.0"

#### Player Entity
The simulation creates a dedicated player entity with:
- `PlayerComponent` - Marks the entity as player-controlled
- `DilemmaComponent` - Contains available choices when decisions are needed
- `DataSetEventComponent` - Holds the current event/decision state
- `HistoricalFigureComponent` - Contains character information

#### Decision Making Process
1. The `DilemmaSystem` generates choices and adds them to the player's `DilemmaComponent`
2. The GUI automatically displays pending choices in the main interface
3. Player uses `c` or `choices` command to access the decision screen
4. Player selects a choice by number (1-N)
5. The choice is set in the player's `DataSetEventComponent`
6. The `DilemmaResolutionSystem` processes the choice and records it in the chronicle

#### Automatic Updates
- The GUI refreshes the display every 2 seconds automatically
- No scrolling - the screen clears and redraws for clean presentation
- Pending decisions appear immediately in the main interface
- All commands return to the main screen after completion

### Architecture

#### Key Files
- `src/gui/TextBasedGUI.ts` - Main GUI implementation with screen management
- `src/mainGUI.ts` - Entry point for GUI mode
- `src/behaviour/DilemmaResolutionSystem.ts` - Modified to support player input
- `src/ecs/PlayerComponent.ts` - Marker component for player entities

#### Integration Points
The GUI integrates with the existing ECS architecture by:
- Querying for entities with `PlayerComponent`
- Reading/writing to `DilemmaComponent` and `DataSetEventComponent`
- Monitoring simulation state through singleton components
- Using the existing chronicle system for event recording
- Clearing and redrawing the screen for a clean interface

### Example Session

```
============================================================
Year: 0001 | Simulation: Running | Player: Player Character | Status: 1 pending decision(s) | Herodotus 1.0.0
============================================================

============================================================

*** DECISION REQUIRED ***

[1] Economic Reform
    Type: Economic
    Description: The kingdom's treasury is running low. You must decide how to address the financial crisis.
    → Your choice will affect the kingdom's prosperity and your subjects' loyalty.

[2] Maintain Status Quo
    Type: Economic
    Description: Keep current economic policies and hope for the best.
    → The situation may worsen, but no immediate disruption will occur.

============================================================
Commands: [H]elp [S]tatus [C]hoices Ch[r]onicle [Q]uit
============================================================

Command: c

============================================================
                    DECISION REQUIRED
============================================================

[1] Economic Reform
    Type: Economic
    Description: The kingdom's treasury is running low. You must decide how to address the financial crisis.
    Consequence: Your choice will affect the kingdom's prosperity and your subjects' loyalty.

[2] Maintain Status Quo
    Type: Economic
    Description: Keep current economic policies and hope for the best.
    Consequence: The situation may worsen, but no immediate disruption will occur.

============================================================
Choose your decision (1-2), or 'back': 1

You chose: Economic Reform
This decision will shape your reign...
Press Enter to continue...
```

### Interface Design

#### Clean Screen Management
- Uses ANSI escape codes to clear screen and reset cursor position
- Fixed layout that updates in place rather than scrolling
- Consistent bordered sections using `=` characters
- Professional appearance with organized information display

#### User Experience
- **No Scrolling**: Screen clearing prevents information from scrolling off
- **Immediate Feedback**: All commands show results and wait for acknowledgment
- **Visual Consistency**: All screens use the same layout and styling
- **Efficient Navigation**: Single-letter shortcuts for quick access
- **Clear Information Hierarchy**: Header, content, and command areas clearly separated

### Technical Notes

- Uses Node.js `readline` for input handling
- Simulation runs with 2-second background intervals for better readability
- Player input is processed synchronously with screen clearing
- Chronicle events are recorded automatically by the DilemmaResolutionSystem
- Compatible with the existing test suite and build system
- ANSI escape codes provide cross-platform screen clearing support

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

#### `behaviour`

This module contains classes for managing player behavior and decision-making systems.

*   **`DilemmaComponent`**: Component representing a player choice scenario with multiple options.
*   **`DilemmaSystem`**: The engine of the dilemma loop, responsible for generating choices based on the player's current state. Implements the read_state → find_triggers → generate_choices sequence.
*   **`DilemmaResolutionSystem`**: Processes entities with DilemmaComponents to resolve player choices. Selects one of the available choices, updates the entity's DataSetEventComponent, and removes the DilemmaComponent to prepare for the next cycle.

#### `data`

This module contains classes for loading and accessing event data.

*   **`DataSetComponent`**: Component holding all loaded data set events (immutable snapshot at load time). Stored internally as a Map keyed by EventTrigger, supporting multiple events per trigger.
*   **`DataSetEvent`**: Represents a data-driven event that can occur during gameplay.
*   **`DataSetEventComponent`**: Component storing the current state of data-driven events on an entity.
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

#### `gui`

This module provides the interactive text-based user interface for the simulation.

*   **`TextBasedGUI`**: A clean, screen-clearing text-based interface for interacting with the Herodotus simulation. Provides real-time status display, interactive decision-making for player dilemmas, chronicle viewing, and comprehensive simulation control. Features a compact header display, automatic screen refresh, and single-letter command shortcuts for efficient navigation.

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