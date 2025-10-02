# Implementation Plan

This document outlines the implementation plan for the requirements detailed in `design.md`. The requirements are ordered to ensure a logical development progression, starting with core mechanics and progressively adding more complex systems.

## Phase 1: Core Game State

This phase focuses on establishing the fundamental components for managing the ruler and realm state. At the end of this phase, the game will have a basic data structure for the player's dynasty and its ruler.

1.  **STATE-REALM-1: Singleton Realm State Component**
    *   **Implementation:** Create the `RealmStateComponent` as a singleton to hold core resources (Treasury, Stability, Legitimacy, Hubris) and faction data.
    *   **Game State:** The game will have a central place to track the dynasty's high-level status.

2.  **STATE-RULER-1: Singleton Ruler State Component**
    *   **Implementation:** Create the `RulerStateComponent` as a singleton to manage the current ruler's state, including personality traits and reputation.
    *   **Game State:** The game will be able to represent the current ruler and their basic attributes.

3.  **STATE-RULER-2: Ruler-Specific Attribute Component**
    *   **Implementation:** Create the `DynasticAttributeComponent` to manage the ruler's personality sliders (e.g., Piety vs. Hubris).
    *   **Game State:** The ruler's personality will be quantifiable and ready to be influenced by game events.

4.  **STATE-REALM-2: Realm Failure Conditions**
    *   **Implementation:** Implement threshold values within the `RealmStateComponent` for failure conditions.
    *   **Game State:** The game will have defined "lose" conditions, such as when Stability or Treasury drops to critical levels.

5.  **STATE-REALM-3: Consequence of Realm Failure**
    *   **Implementation:** Create a `RealmFailureSystem` to monitor resource thresholds and trigger consequences, like forced hex events.
    *   **Game State:** The game will be able to react to failure conditions, creating a dynamic sense of risk.

## Phase 2: Actions and State Modification

This phase introduces the systems responsible for changing the game state based on player and non-player actions. At the end of this phase, the game will have a basic cause-and-effect loop.

1.  **STATE-REALM-4: Player Action Effects**
    *   **Implementation:** Create a `RealmStateModificationSystem` to process player choices from hex events and apply costs/rewards to the `RealmStateComponent`.
    *   **Game State:** Player actions will have a direct and immediate impact on the realm's resources.

2.  **STATE-REALM-5: Non-Player Action Effects**
    *   **Implementation:** Extend the `RealmStateModificationSystem` to handle state changes from random events, time progression, etc.
    *   **Game State:** The game world will feel more alive, with events happening outside of the player's direct control.

3.  **STATE-RULER-3: Ruler State Subject to Player Actions**
    *   **Implementation:** Create a `RulerStateSystem` to modify the ruler's attributes based on player choices.
    *   **Game State:** The ruler's personality will evolve based on the player's decisions.

4.  **STATE-RULER-4: Ruler State Subject to Non-Player Actions**
    *   **Implementation:** Extend the `RulerStateSystem` to process changes from non-player sources.
    *   **Game State:** The ruler's character can be shaped by external events, creating unexpected narrative developments.

## Phase 3: Factions

This phase introduces political factions, adding a layer of internal politics to the game. At the end of this phase, the player will have to consider the desires of different groups within their realm.

1.  **STATE-REALM-6: Faction Metric Effects**
    *   **Implementation:** Create a `FactionInfluenceSystem` to calculate how faction metrics (Influence and Allegiance) affect realm resources like Stability and Legitimacy.
    *   **Game State:** Factions will have a tangible impact on the overall health of the realm.

2.  **STATE-REALM-8: Faction Allegiance Decisions**
    *   **Implementation:** Implement a `HexChoiceSystem` that presents the player with choices that directly affect faction allegiance.
    *   **Game State:** The player will be forced to make political decisions, balancing the interests of competing factions.

3.  **STATE-RULER-5: Ruler State Subject to Realm Factions**
    *   **Implementation:** Create a `RulerFactionInteractionSystem` to model how faction opinions influence the ruler's reputation and trigger faction-specific events.
    *   **Game State:** The ruler's standing will be influenced by their relationship with the various factions.

## Phase 4: Territory and Military

This phase builds the spatial model of the galaxy and the mechanics for military conquest. At the end of this phase, the game will have a map and the ability to wage war.

1.  **STATE-TERRITORY-1: Galaxy Map Component**
    *   **Implementation:** Create the `GalaxyMapComponent` as a singleton to represent planets and space lanes.
    *   **Game State:** The game will have a spatial dimension, with a map of the known galaxy.

2.  **STATE-TERRITORY-2: Planet Component**
    *   **Implementation:** Create the `PlanetComponent` to track the status, ownership, and development of individual planets.
    *   **Game State:** Each planet in the galaxy will have its own set of attributes.

3.  **STATE-TERRITORY-4: Fleet Component**
    *   **Implementation:** Create the `FleetComponent` to represent military units with attributes like Strength and Experience.
    *   **Game State:** The player will be able to build and maintain a military.

4.  **STATE-TERRITORY-5: Military Operations System**
    *   **Implementation:** Create a `MilitaryOperationsSystem` to manage the phases of conquest (declaration, deployment, siege, etc.).
    *   **Game State:** The game will have a structured system for warfare.

5.  **STATE-TERRITORY-6: Battle Resolution System**
    *   **Implementation:** Create a `BattleResolutionSystem` to determine the outcome of battles based on the strength of the opposing forces.
    *   **Game State:** Battles will have clear winners and losers, with tangible consequences.

6.  **STATE-TERRITORY-7: Military Event Integration**
    *   **Implementation:** Create a `MilitaryCampaignComponent` to link military hex events to the state of ongoing campaigns.
    *   **Game State:** Military actions will be driven by and influence the hex-based event system.

7.  **STATE-TERRITORY-3: Control Status System**
    *   **Implementation:** Create a `ControlStatusSystem` to manage different levels of planetary control (Full, Occupied, etc.).
    *   **Game State:** Conquered planets will not be immediately loyal, adding a layer of complexity to military expansion.

## Phase 5: Hidden Economic Model

This phase implements the underlying economic simulation. At the end of this phase, the game will have a more detailed and realistic economic model that influences the high-level resources visible to the player.

1.  **STATE-RESOURCE-2: Planetary Resource Production**
    *   **Implementation:** Create a `PlanetaryResourceComponent` for each planet to model its production of hidden resources.
    *   **Game State:** Each planet will contribute to the realm's economy in a unique way.

2.  **STATE-RESOURCE-3: Resource Balance Sheet**
    *   **Implementation:** Create a `RealmResourceBalanceComponent` to track the global ledger of hidden resources.
    *   **Game State:** The game will have a detailed internal model of the realm's economy.

3.  **STATE-RESOURCE-4: Core Resources Tracking**
    *   **Implementation:** Create a `ResourceBalanceSystem` to track the four core hidden resources (Food, Production, Wealth, Manpower).
    *   **Game State:** The hidden economy will be fully functional, with surpluses and deficits affecting the realm.

4.  **STATE-RESOURCE-1: Hidden Resource Management**
    *   **Implementation:** Create a `ResourceManagementSystem` to calculate and track hidden resources without direct player visibility.
    *   **Game State:** The economic model will be "hidden" from the player, who will only see the consequences of economic events.

5.  **STATE-RESOURCE-5: Hex-Based Resource Actions**
    *   **Implementation:** Create a `ResourceCostComponent` for hex actions, defining their costs and rewards in terms of hidden resources.
    *   **Game State:** Player actions will have a direct impact on the underlying economy.

## Phase 6: Modifiers and Omens

This final phase adds a system for temporary and permanent modifiers, adding another layer of dynamicism to the game.

1.  **STATE-RULER-6: Single Run Modifiers (Omens)**
    *   **Implementation:** Create an `OmenSystem` to manage temporary (Omens) and permanent (Traits) modifiers to ruler attributes.
    *   **Game State:** The ruler's attributes can be affected by a variety of special conditions, creating unique narrative opportunities.
