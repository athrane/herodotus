# Herodotus

A procedural world-building and history generation tool.

## Development

This section provides an overview of the project's architecture and class structure for developers.

### Class Documentation

The project is organized into modules, with each directory representing a distinct area of functionality.

#### `generator/chronicle`

This module is responsible for generating the historical narrative of the world.

*   **`ChronicleGenerator`**: Weaves together events, characters, and geographical features to create a coherent story or timeline for the generated world.

#### `ecs`

This module implements an Entity-Component-System (ECS) architecture, a design pattern that promotes data-oriented design and flexible composition over deep inheritance hierarchies.

*   **`Entity`**: A lightweight container that represents an object in the world (e.g., a person, a city, a kingdom). It is essentially a unique ID that aggregates a collection of components.

*   **`Component`**: A simple data container that holds a specific piece of information about an entity (e.g., `PositionComponent`, `HealthComponent`). Components contain no logic.

*   **`System`**: Contains all the logic for a specific domain. Systems operate on entities that possess a certain set of components (e.g., a `MovementSystem` would process entities with `PositionComponent` and `VelocityComponent`).

*   **`EntityManager`**: A manager responsible for the entire lifecycle of entities, including their creation, destruction, and querying based on their components.

*   **`SystemManager`**: Manages the registration and execution of all `System` instances. It orchestrates the main logic loop of the simulation by calling the `update` method on each registered system in sequence.

#### `generator/event`

This module provides an event-driven framework for managing occurrences within the generated history.

*   **`EventCategory`**: Enum Defines the categories for historical events.

*   **`EventType`**: Represents the type of a historical event, including its category and specific name.

#### `generator/figure`

This module contains classes for representing key entities in the generated history, such as historical figures and significant places.

*   **`HistoricalFigure`**: Represents a historical figure involved in an event, characterized by a name.

*   **`Place`**: Represents a location where a historical event occurred, identified by a name.

#### `geography`

This module contains all the core classes for representing and managing the geographical elements of the generated world.

*   **`World`**: The top-level container for the entire world. It holds a collection of `Continent` instances.

*   **`Continent`**: Represents a single continent. It acts as a container for a collection of `GeographicalFeature` instances.

*   **`GeographicalFeature`**: Represents a specific, named instance of a feature within the world, such as "The Misty Mountains." Each feature has a name and is associated with a `FeatureType`.

*   **`FeatureType`**: Represents the *definition* or *category* of a geographical feature (e.g., the concept of a 'Mountain' or 'River'). These are immutable objects with a unique key and a display name, intended to be shared and reused.

*   **`GeographicalFeatureTypeRegistry`**: A static singleton class that acts as a central registry for all `FeatureType` definitions. It ensures that feature types are unique and provides global methods to register, retrieve, and manage them.

*   **`DefaultFeatureTypes`**: This file does not export a class. Instead, it uses the `GeographicalFeatureTypeRegistry` to pre-register a standard set of common feature types (e.g., `MOUNTAIN`, `FOREST`, `RIVER`). It exports a frozen object, `GeographicalFeatureTypes`, which provides an enum-like way to access these default types.

#### `generator/world`

This module is responsible for generating the initial world, including its geographical features and continents.

*   **`WorldGenerator`**: Orchestrates the creation of the world, ensuring all geographical elements are properly initialized and interconnected.

#### `time`

This module is responsible for tracking the passage of time, a core element of history generation.

*   **`Time`**: A simple, immutable value object that represents a specific point in time (e.g., a year). It is used to timestamp events and other historical data within the chronicle.

#### `simulation`

This module contains classes related to the simulation's core logic and its construction.

*   **`Simulation`**: The main class that orchestrates the world-building and history generation process. It manages the ECS, time, and other core components to run the simulation.

*   **`SimulationBuilder`**: A builder class for constructing `Simulation` instances. It provides a fluent API to configure various aspects of the simulation before it is built.

*   **`SimulationDirector`**: Directs the `SimulationBuilder` to construct complex `Simulation` objects. It encapsulates the knowledge of how to construct a simulation with specific configurations.

#### `util`

This module provides common utility classes used throughout the application.

*   **`TypeUtils`**: A static utility class containing helper methods for runtime type validation. It provides functions like `ensureString()`, `ensureNumber()`, and `ensureInstanceOf()` to enforce type safety in constructors and methods, throwing clear errors when type constraints are violated.