# Herodotus

A procedural world-building and his- start:ts — same as `start:main`; runs `src/main.ts` via tsx.
	Purpose: alternate name if you prefer explicit "ts" in scripts or for CI environments.
	- Run:
		```powershell
		npm run start:ts
		```

- start:gui — run the interactive text-based GUI - `src/gui/rendering/ScreenBufferRenderSystem.ts` — Renders the screen buffer to terminal
- `src/gui/rendering/ScreenBufferTextUpdateSystem.ts` — Updates text entries in the screen buffer
- `src/gui/rendering/HeaderUpdateSystem.ts` — Updates header area each tick; uses dependency injection pattern with simulation ECS for decoupled access to time data
- `src/gui/rendering/FooterUpdateSystem.ts` — Updates footer/status area
- `src/gui/rendering/DynamicTextUpdateSystem.ts` — Updates `TextComponent` values by calling `DynamicTextComponent.getText(guiEntityManager, simulationEntityManager)` for visible entities; uses dependency injection pattern with simulation ECS for decoupled system architectureon of the simulation via tsx.
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

The Herodotus simulation includes an interactive text-based GUI built on an Entity-Component-System (ECS) architecture. Each screen is implemented as an entity with components, providing a modular and extensible interface for controlling your player character and making decisions that shape history.

### Features

The ECS-based GUI provides the following functionality:

- **Interactive Decision Making**: Make choices for your player character when dilemmas arise
- **Real-time Simulation Control**: View live simulation updates with automatic screen refresh
- **Modular Screen System**: Each screen is a separate entity with its own components
- **Chronicle Viewing**: Review recent historical events and decisions

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

### ECS Architecture

The GUI system is built using the Entity-Component-System (ECS) pattern, where each screen is implemented as an entity with specific components:

#### Components

**IsActiveComponent** (`src/gui/IsActiveComponent.ts`)
- Marks an entity as the currently active screen
- Only one entity should have this component at a time
- Used by the ScreenRenderSystem to determine which screen to render

**ScreenComponent** (`src/gui/ScreenComponent.ts`)
- Contains the render logic and input handling for a screen
- Takes two functions: `renderFunction` and `handleInputFunction`
- Provides `render()` and `handleInput()` methods

#### Systems

**ScreenRenderSystem** (`src/gui/ScreenRenderSystem.ts`)
- System responsible for rendering the currently active screen
- Key methods:
  - `renderActiveScreen()`: Renders the entity with IsActiveComponent
  - `handleActiveScreenInput()`: Routes input to the active screen
  - `setActiveScreen()`: Changes which screen is active

#### Screen Entities

Each screen is implemented as a separate entity with appropriate components:

- **MainInterfaceScreen**: Main menu with navigation options and pending dilemmas
- **StatusScreen**: Displays detailed simulation status and historical figures
- **ChoicesScreen**: Handles dilemma choice selection and validation
- **ChronicleScreen**: Displays recent historical events from the chronicle

#### Management Classes

**GuiEcsManager** (`src/gui/GuiEcsManager.ts`)
- Manages a separate ECS instance specifically for GUI components and systems
- Creates and manages all screen entities with their components
- Maps screen names to entity IDs and handles screen initialization
- Provides independent update frequency from the simulation

**TextBasedGui2** (`src/gui/TextBasedGui2.ts`)
- Advanced GUI class using separate ECS architecture for screen management
- Uses its own ECS instance decoupled from the simulation ECS
- Handles global navigation commands with independent update frequencies
- Manages GUI systems through GuiEcsManager for responsive UI

### Architecture Benefits

1. **Modularity**: Each screen is a separate entity with its own components
2. **Extensibility**: Easy to add new screens by creating new entities
3. **Consistency**: All screens follow the same ECS pattern
4. **Separation of Concerns**: Render logic separated from input handling
5. **Testability**: Individual screens can be tested in isolation

### Key Menu Systems

#### ActionSystem (`src/gui/menu/ActionSystem.ts`)
The ActionSystem is responsible for processing UI action IDs and managing application flow:

**Core Functionality:**
- Processes actions from the `ActionQueueComponent` in FIFO order
- Handles screen navigation actions (e.g., "goto-main-menu", "goto-status")
- Manages application lifecycle with "quit" action processing
- Integrates with `GuiEcsManager` for screen switching operations

**Supported Actions:**
- **Navigation**: "goto-main-menu", "goto-status", "goto-choices", "goto-chronicle"
- **Application Control**: "quit" (terminates application)
- **Extensible**: New actions can be added by extending the switch statement

**Architecture:**
- Queries entities with `ActionQueueComponent` to find pending actions
- Processes actions sequentially from the queue using `shift()` method  
- Delegates screen switching to `GuiEcsManager.setActiveScreen()`
- Handles unknown actions gracefully with warning messages

**Test Coverage:**
- Comprehensive test suite with 18+ test cases
- Tests action processing, screen switching, queue management
- Includes edge cases: rapid successive actions, large queues, malformed actions
- Verifies FIFO order processing and proper cleanup

#### MenuInputSystem (`src/gui/menu/MenuInputSystem.ts`)
The MenuInputSystem handles user input processing for menu navigation and interaction:

**Input Support:**
- **Navigation**: A/D keys ('a'/'d') and arrow keys ('left'/'right') for menu item selection (was previously W/S)
- **Selection**: 'enter' key to activate the selected menu item
- **Wrap-around**: Automatic cycling between first and last menu items

**Core Functionality:**
- Queries entities with both `MenuComponent` and `InputComponent`
- Processes navigation input by calling `selectPrevious()`/`selectNext()` on MenuComponent
- Handles selection input by adding the selected item's action to ActionQueueComponent
- Maintains menu state and selection index through MenuComponent

**Integration:**
- Works with `MenuComponent` for menu state management
- Integrates with `ActionQueueComponent` for action dispatching
- Filters entities using `IsVisibleComponent` to ensure only active menus respond
- Coordinates with `ActionSystem` for downstream action processing

**Test Coverage:**
- Extensive test suite covering navigation, selection, and edge cases
- Tests single-item menus, many-item navigation patterns
- Verifies wrap-around behavior and state preservation
- Includes rapid input processing and error handling scenarios

### Architecture Benefits

Both systems follow the Entity-Component-System pattern providing:

1. **Modularity**: Each system has a single, well-defined responsibility
2. **Testability**: Systems can be tested in isolation with mocked components
3. **Extensibility**: New actions and input types can be added easily
4. **Performance**: Efficient querying using component filters
5. **Reliability**: Comprehensive test coverage ensures stable behavior

### Available Commands

The GUI accepts both full commands and single-letter shortcuts:

- **[H]elp** / `h` - Show available commands and interface help
- **[S]tatus** / `s` - Display detailed simulation status  
- **[C]hoices** / `c` - View and make decisions for current dilemmas
- **Ch[r]onicle** / `r` - Display recent historical events (last 10)
- **[Q]uit** / `q` - Exit the simulation

Navigation note: The main menu now uses the A and D keys for scrolling between menu items (or left/right arrow keys); previous W/S navigation has been replaced.

### How It Works

#### ECS Integration
The GUI integrates seamlessly with the existing ECS architecture:
- Each screen is an entity with `ScreenComponent` and optionally `IsActiveComponent`
- The `ScreenRenderSystem` queries for active screen entities
- Screen entities can be created, modified, and destroyed dynamically
- All screen logic is encapsulated in their respective component functions
The header shows all essential information in one line:
- **Year**: Current simulation year (zero-padded to 4 digits)
- **Simulation**: Running/Stopped status
- **Player**: Character name  
- **Status**: Number of pending decisions or "No pending decisions"
- **App Title**: "Herodotus 1.0.0"

#### Player Integration
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
- `src/gui/TextBasedGui2.ts` - Advanced GUI implementation using separate ECS architecture
- `src/gui/GuiEcsManager.ts` - Manages separate GUI ECS instance, systems, and screen entities
- `src/gui/ScreenRenderSystem.ts` - System for rendering active screens
- `src/gui/IsActiveComponent.ts` - Component marking the active screen
- `src/gui/ScreenComponent.ts` - Component containing screen logic
- `src/gui/menu/ActionComponent.ts` - Component that holds an action identifier for menu items
- `src/gui/menu/InputComponent.ts` - Component that stores the last user input for menu screens
- `src/gui/screens/` - Directory containing individual screen implementations
- `src/mainGUI.ts` - Entry point for GUI mode


### Class Documentation

This section lists exported classes found in the codebase grouped by area (file path shown) with a short description.

#### Core ECS
- `src/ecs/Component.ts` — Component base class (marker for entity components)
- `src/ecs/System.ts` — Base System class (logic executed against entities)
- `src/ecs/SystemManager.ts` — Manages systems lifecycle and registration
- `src/ecs/Entity.ts` — Entity abstraction (id and components)
- `src/ecs/EntityManager.ts` — Manages entities and their components
- `src/ecs/Ecs.ts` — High-level ECS facade (factory and orchestration)
- `src/ecs/NameComponent.ts` — Component storing a human-readable name
- `src/ecs/PlayerComponent.ts` — Marks an entity as the player

#### GUI / Rendering
- `src/gui/TextBasedGui2.ts` — Text-based GUI main class (interactive mode entry)
- `src/gui/GuiEcsManager.ts` — Manages GUI-specific ECS instance, screens and systems
- `src/gui/GuiHelper.ts` — Helper utilities for rendering and input handling
- `src/gui/ScreenComponent.ts` — Component holding render and input handlers for a screen
- `src/gui/screens/ScreenRenderSystem.ts` — System that renders and routes input for the active screen
- `src/gui/screens/IsActiveScreenComponent.ts` — Component marking the active screen entity

##### Rendering primitives
- `src/gui/rendering/TextComponent.ts` — Static text display component
- `src/gui/rendering/DynamicTextComponent.ts` — Runtime-generated text via callback; uses strategy pattern with functions accepting GUI and simulation entity managers
- `src/gui/rendering/ScreenBufferComponent.ts` — Holds terminal buffer content for rendering
- `src/gui/rendering/PositionComponent.ts` — Positioning data for UI elements
- `src/gui/rendering/IsVisibleComponent.ts` — Visibility flag for renderable elements
- `src/gui/rendering/ScreenBufferRenderSystem.ts` — Renders the screen buffer to terminal
- `src/gui/rendering/ScreenBufferTextUpdateSystem.ts` — Updates text entries in the screen buffer
- `src/gui/rendering/HeaderUpdateSystem.ts` — Updates header area each tick
- `src/gui/rendering/FooterUpdateSystem.ts` — Updates footer/status area
 - `src/gui/rendering/DynamicTextRenderSystem.ts`  Updates `TextComponent` values by calling `DynamicTextComponent.getText(simulation)` for visible entities

#### Menu components & systems
- `src/gui/menu/MenuItem.ts` — Menu item model (text + action id)
- `src/gui/menu/MenuComponent.ts` — Holds an ordered list of `MenuItem`s and selection state with wrap-around navigation
- `src/gui/menu/ActionComponent.ts` — Component storing an action identifier for menu items
- `src/gui/menu/InputComponent.ts` — Stores last user input for menu screens
- `src/gui/menu/ActionSystem.ts` — System that processes UI action IDs from queue with screen switching and application lifecycle management
- `src/gui/menu/ActionQueueComponent.ts` — Singleton component holding a FIFO queue of pending UI action IDs
- `src/gui/menu/MenuRenderSystem.ts` — Renders `MenuComponent` items into a `TextComponent`, showing the selected item
- `src/gui/menu/MenuInputSystem.ts` — Processes user input for menus with navigation support for both WASD ('w'/'s') and arrow keys ('up'/'down'), plus 'enter' selection that dispatches actions to ActionSystem

#### Simulation & Time
- `src/simulation/Simulation.ts` — Main simulation (run loop and global state)
- `src/simulation/builder/SimulationBuilder.ts` — Builder for simulation instances
- `src/simulation/builder/SimulationDirector.ts` — High-level construction orchestration
- `src/time/Time.ts` — Simulation time model
- `src/time/TimeComponent.ts` — Component holding current time state
- `src/time/TimeSystem.ts` — System advancing simulation time

#### Geography & World Generation
- `src/geography/World.ts` — World model (collection of places and features)
- `src/geography/WorldComponent.ts` — Component carrying world instance
- `src/geography/Continent.ts` — Continent model
- `src/geography/FeatureType.ts` — Feature type metadata
- `src/geography/GeographicalFeature.ts` — Geographical feature instances
- `src/geography/GeographicalFeaturesFactory.ts` — Factory to create features
- `src/geography/GeographicalFeatureTypeRegistry.ts` — Registry of feature types
- `src/generator/Place.ts` — Place model used during generation
- `src/generator/world/WorldGenerator.ts` — World generator implementation

#### Data & Chronicle
- `src/data/DataSetComponent.ts` — Component for dataset storage on entities
- `src/data/DataSetEvent.ts` — Data-set event model
- `src/data/DataSetEventComponent.ts` — Component wrapping dataset events
- `src/chronicle/ChronicleEvent.ts` — Chronicle event model
- `src/chronicle/ChronicleComponent.ts` — Component that stores chronicle entries
- `src/chronicle/EventType.ts` — Event type metadata and helpers

#### Historical Figures
- `src/historicalfigure/HistoricalFigure.ts` — Model for historical figures
- `src/historicalfigure/HistoricalFigureComponent.ts` — Component storing figure data
- `src/historicalfigure/HistoricalFigureBirthSystem.ts` — System that seeds/births figures
- `src/historicalfigure/HistoricalFigureLifecycleSystem.ts` — Manages lifecycle events for figures
- `src/historicalfigure/HistoricalFigureInfluenceSystem.ts` — Applies influence changes to figures

#### Behaviour / Dilemmas
- `src/behaviour/DilemmaComponent.ts` — Component holding current dilemma choices
- `src/behaviour/DilemmaSystem.ts` — System creating and scheduling dilemmas
- `src/behaviour/DilemmaResolutionSystem.ts` — Resolves choices and records outcomes

#### Naming & Utilities
- `src/naming/MarkovChain.ts` — Markov-chain utility used by name generation
- `src/naming/NameGenerator.ts` — High-level name generator using syllable sets
- `src/util/TypeUtils.ts` — Runtime type checks and validators (ensureInstanceOf, ensureString, etc.)
- `src/util/log/LogHelper.ts` — Simple logging helpers used across the project


#### Screen Implementations
- `MainInterfaceScreen.ts` - Main menu with navigation and pending dilemmas
- `StatusScreen.ts` - Detailed simulation status display
- `ChoicesScreen.ts` - Dilemma choice selection and processing
- `ChronicleScreen.ts` - Historical events display

#### Integration Points
The GUI uses a dual-ECS architecture:
- **Simulation ECS**: Handles game logic, entities with `PlayerComponent`, `DilemmaComponent`, etc.
- **GUI ECS**: Separate instance for screen management with independent update frequencies
- Reads/writes simulation state through the main ECS instance
- Monitors simulation state through singleton components
- Utilizes the existing chronicle system for event recording
- Provides clean screen management through the separate GUI ECS pattern
- Maintains decoupled architecture with responsive UI updates

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

