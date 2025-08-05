# Herodotus

A procedural world-building and history generation tool.

## Development

This section provides an overview of the project's architecture and class structure for developers.

### Class Documentation

The project is organized into modules, with each directory representing a distinct area of functionality.

#### `chronicle`

This module provides the classes for creating and managing historical events in the simulation.

*   **`ChronicleEvent`**: Represents a single, discrete entry in the chronicle, describing a historical event.
*   **`ChronicleEventComponent`**: A component to store a logbook of significant historical events. This component is typically attached to the primary World entity.
*   **`EventType`**: Represents the type of a historical event, including its category and specific name.

#### `ecs`

This module implements an Entity-Component-System (ECS) architecture, a design pattern that promotes data-oriented design and flexible composition over deep inheritance hierarchies.

*   **`Component`**: A base class for all components in the Entity-Component-System (ECS) architecture. Components are simple data containers. They should not contain any logic. This class serves as a marker to identify objects as components.
*   **`Entity`**: Represents an entity in the Entity-Component-System (ECS) architecture. An entity is essentially a container for components, identified by a unique ID. It acts as a lightweight wrapper that groups various components, which hold the actual data.
*   **`EntityManager`**: Manages the lifecycle of entities in the ECS architecture. It is responsible for creating, retrieving, destroying, and querying entities.
*   **`NameComponent`**: A component that provides a human-readable name .
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