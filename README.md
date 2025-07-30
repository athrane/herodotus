# Herodotus World Generator

A procedural world generation tool.

## Development

This section provides an overview of the project's classes and their roles.

### Project Structure & Class Documentation

The project is organized into modules based on functionality.

#### `util` Module

This module contains general-purpose utility classes.

*   **`TypeUtils`**
    A static utility class for runtime type validation. It provides methods like `ensureString()`, `ensureNumber()`, and `ensureInstanceOf()` to enforce type safety throughout the application, throwing descriptive errors upon failure.

    ```javascript
    import { TypeUtils } from './src/util/TypeUtils.js';

    TypeUtils.ensureString("hello"); // OK
    TypeUtils.ensureInstanceOf([], Array); // OK
    ```

---

#### `generator/geography` Module

This module contains all the core classes for representing and generating the world's geography. The classes are designed to be composable, following a clear hierarchy.

*   **`FeatureType`**
    An immutable class that represents a *category* of a geographical feature. Each instance has a unique `key` (e.g., 'MOUNTAIN') and a `displayName` (e.g., 'Mountain'). These are the building blocks for defining what can exist in the world.

    ```javascript
    import { FeatureType } from './src/generator/geography/FeatureType.js';
    const type = new FeatureType('OCEAN', 'Ocean');
    console.log(type.getKey()); // 'OCEAN'
    ```

*   **`GeographicalFeatureTypeRegistry`**
    A static class that acts as a singleton registry for all `FeatureType` instances. It ensures that each feature type is defined only once. It's the central authority for creating and retrieving feature types via its `register()`, `get()`, and `has()` methods.

    ```javascript
    import { GeographicalFeatureTypeRegistry } from './src/generator/geography/GeographicalFeatureTypeRegistry.js';

    // Register a new type
    const volcanoType = GeographicalFeatureTypeRegistry.register('VOLCANO', 'Volcano');

    // Check if a type exists
    console.log(GeographicalFeatureTypeRegistry.has('VOLCANO')); // true
    ```

*   **`DefaultFeatureTypes`**
    This file doesn't export a class, but rather a crucial, immutable object: `GeographicalFeatureTypes`. It uses the registry to pre-register a standard set of feature types (MOUNTAIN, RIVER, FOREST, etc.) and exports them as an enum-like object. This is the preferred way to access common types throughout the application, as it avoids magic strings.

    ```javascript
    import { GeographicalFeatureTypes } from './src/generator/geography/DefaultFeatureTypes.js';

    const mountain = GeographicalFeatureTypes.MOUNTAIN;
    console.log(mountain.getName()); // 'Mountain'
    ```

*   **`GeographicalFeature`**
    Represents a *specific, named instance* of a geographical feature. For example, "The Lonely Mountain" would be a `GeographicalFeature` instance with the name "The Lonely Mountain" and the type `GeographicalFeatureTypes.MOUNTAIN`. It validates that its type is a valid, registered `FeatureType`.

    ```javascript
    import { GeographicalFeature } from './src/generator/geography/GeographicalFeature.js';
    import { GeographicalFeatureTypes } from './src/generator/geography/DefaultFeatureTypes.js';

    const mistyMountains = new GeographicalFeature(
        "The Misty Mountains",
        GeographicalFeatureTypes.MOUNTAIN
    );
    ```

*   **`Continent`**
    A class representing one of the world's continents. It primarily holds a name and will serve as a container for `GeographicalFeature` instances.

    ```javascript
    import { Continent } from './src/generator/geography/Continent.js';
    const mainContinent = new Continent("Mainland");
    ```

*   **`World`**
    The top-level class that represents the entire generated world. It acts as a container for all `Continent` instances, forming the root of the data model.

    ```javascript
    import { World } from './src/generator/geography/World.js';
    import { Continent } from './src/generator/geography/Continent.js';

    const world = new World();
    world.addContinent(new Continent("Westlands"));
    world.addContinent(new Continent("Eastlands"));
    ```