# Design

## 4.1 Game State Management: Ruler State

| Requirement | Heading | Design |
|---|---|---|
| STATE-RULER-1 | Singleton Ruler State Component | A singleton component, RulerStateComponent, must be implemented to manage the state of the current ruler. It must contain the ruler's personality traits, reputation, and the Dynastic Attribute Model. |
| STATE-RULER-2 | Ruler-Specific Attribute Component | A component, DynasticAttributeComponent, must be implemented and attached to the entity representing the current ruler. It must manage the opposing personality sliders (e.g., Piety vs. Hubris, Diplomacy vs. Tyranny) as defined in the Dynastic Attribute Model. |
| STATE-RULER-3 | Ruler State Subject to Player Actions | A RulerStateSystem must be implemented to process how player choices affect ruler state variables. The system must read ruler state modifiers from hex events chosen by the player and apply the appropriate changes to the RulerStateComponent and DynasticAttributeComponent. Clear visual feedback must be provided when attributes change significantly. |
| STATE-RULER-4 | Ruler State Subject to Non-Player Actions | The RulerStateSystem must also process changes to ruler state from non-player sources such as random events, time progression, or neighboring realm actions. These modifications must be clearly attributed to their source in the notification system. The system must ensure these external influences create meaningful narrative moments. |
| STATE-RULER-5 | Ruler State Subject to Realm Factions | A RulerFactionInteractionSystem must be implemented to calculate how faction metrics influence ruler state variables. The system must monitor faction Influence and Allegiance values to determine if they should impact ruler reputation or trigger faction-specific events. Extreme faction states (high influence, low allegiance) must have tangible effects on ruler attributes. |
| STATE-RULER-6 | Single Run Modifiers (Omens) | An OmenSystem must be implemented to manage temporary and permanent modifiers to ruler attributes. The system must distinguish between Traits (permanent modifiers lasting an entire reign) and Omens (temporary modifiers with specific durations). It must handle stacking rules when multiple modifiers affect the same attribute and trigger appropriate narrative events when significant Omens occur. |

## 4.2 Game State Management: Realm State

| Requirement | Heading | Design |
|---|---|---|
| STATE-REALM-1 | Singleton Realm State Component | A singleton component, RealmStateComponent, must be implemented to manage the global state of the dynasty. It must contain the four core resources (Treasury, Stability, Legitimacy, Hubris) and the data structures for all Faction Estates (Influence and Allegiance). |
| STATE-REALM-2 | Realm Failure Conditions | The RealmStateComponent must implement threshold values for each core resource that, when crossed, trigger failure conditions. A RealmFailureSystem must monitor these thresholds and initiate appropriate consequences when breached. |
| STATE-REALM-3 | Consequence of Realm Failure | The RealmFailureSystem must generate forced hex events when failure conditions are met. These events must correspond to appropriate consequences such as rebellions or territory loss. For example, when Stability falls to 0, a forced rebellion hex must be played. |
| STATE-REALM-4 | Player Action Effects | A RealmStateModificationSystem must process all hex actions chosen by players, applying their resource costs and modifications to the RealmStateComponent. This system must enforce prerequisites (e.g., minimum Treasury for war) and apply immediate effects (e.g., Stability penalties). |
| STATE-REALM-5 | Non-Player Action Effects | The RealmStateModificationSystem must also process state changes from non-player sources such as time progression, random events, or neighbor actions. These modifications must be clearly attributed to their source in the notification system. |
| STATE-REALM-6 | Faction Metric Effects | A FactionInfluenceSystem must calculate how faction metrics affect realm state variables. High Nobility Influence with low Allegiance should directly impact Stability, while high Priesthood Influence affects Legitimacy. |
| STATE-REALM-8 | Faction Allegiance Decisions | The HexChoiceSystem must present players with explicit faction-versus-faction choices that directly modify Allegiance values. Each significant action must favor at least one faction while potentially alienating others. |

## 4.3 Game State Management: Territory & Military Model

| Requirement | Heading | Design |
|---|---|---|
| STATE-TERRITORY-1 | Galaxy Map Component | A singleton component, GalaxyMapComponent, must be implemented to represent the spatial relationships between planets. It must maintain a node-based structure where planets are nodes and space lanes are edges, with sectors grouping planets into distinct regions. |
| STATE-TERRITORY-2 | Planet Component | A component, PlanetComponent, must be implemented for each planet entity. It must track ownership, status (Normal, Besieged, Rebellious, Devastated), development level (1-10), fortification level (0-5), and resource specialization (Agriculture, Industry, Commerce, Military). |
| STATE-TERRITORY-3 | Control Status System | A system, ControlStatusSystem, must be implemented to manage the varying degrees of planetary control: Full Control (100% resource contribution), Occupied Control (50% contribution with rebellion risk), Contested Control (no contribution), and Tributary Status (25% contribution to overlord). |
| STATE-TERRITORY-4 | Fleet Component | A component, FleetComponent, must be implemented for military units. Each Fleet must track Strength (1-100 value derived from Manpower), Experience (Novice, Veteran, Elite), optional Commander assignment, and Specialization (Assault, Siege, Defense). |
| STATE-TERRITORY-5 | Military Operations System | A system, MilitaryOperationsSystem, must be implemented to manage the conquest process: Declaration Phase (war declaration hex), Deployment Phase (fleet movement), Siege Phase (duration based on fortification), Resolution Phase (combat outcome), and Occupation Phase (status change if successful). |
| STATE-TERRITORY-6 | Battle Resolution System | A system, BattleResolutionSystem, must be implemented to determine military outcomes using Battle Strength (Fleet Strength + Martialism + Terrain modifiers) vs Defense Strength (Fortification + Defender Fleet + Defender Martialism), with Victory Threshold requiring 20% advantage. |
| STATE-TERRITORY-7 | Military Event Integration | A component, MilitaryCampaignComponent, must be implemented to track ongoing military campaigns (Punitive, Conquest, Defensive, Rebellion Suppression) and tie military hex events to state changes as reflected in the military events JSON. |

## 4.4 Game State Management: Hidden Economic Model

| Requirement | Heading | Design |
|---|---|---|
| STATE-RESOURCE-1 | Hidden Resource Management | A ResourceManagementSystem must be implemented to calculate and track resources behind the scenes without direct player visibility. Players will see outcomes and consequences rather than raw resource numbers. |
| STATE-RESOURCE-2 | Planetary Resource Production | A PlanetaryResourceComponent must be attached to each planet entity to model its resource generation capabilities across four primary resources. The component must track base production rates, modifiers, and specialization bonuses. |
| STATE-RESOURCE-3 | Resource Balance Sheet | A singleton RealmResourceBalanceComponent must maintain the global ledger of resources, tracking both production and consumption across the realm with input from all controlled planets. This component must handle resource flow, storage limits, and deficit consequences. |
| STATE-RESOURCE-4 | Core Resources Tracking | The ResourceBalanceSystem must track the four core resources (Food, Production, Wealth, Manpower) across all planets and calculate the realm totals, surpluses, and deficits while applying appropriate effects to realm state variables. |
| STATE-RESOURCE-5 | Hex-Based Resource Actions | A ResourceCostComponent must be implemented for hex actions, defining explicit resource costs and rewards. The HexResourceSystem will validate resource availability before actions and apply resource changes after hex placement. |

# Solution Architecture
Documenting the ECS components and systems needed to implement the design.

## 4.1 Game State Management: Ruler State

### Components

#### RulerStateComponent (Singleton)
  * Attributes:
    * `entityId`: Reference to the entity representing the current ruler
    * `personalityTraits`: Array of trait objects affecting ruler decisions and events
    * `reputation`: Object tracking how different factions and realms view the ruler
    * `dynasticAttributes`: Reference to the DynasticAttributeComponent
    * `singleRunModifiers`: Array of active Omen modifiers affecting the ruler
    * `rulerHistory`: Array tracking significant events and decisions made by the ruler
  * Responsibilities:
    * Store ruler personality data
    * Track ruler reputation metrics
    * Reference the Dynastic Attribute Model
    * Store active omens and traits

#### DynasticAttributeComponent
  * Attributes:
    * `pietyVsHubris`: Number (-100 to 100) representing ruler's religious virtue vs. arrogance
    * `diplomacyVsTyranny`: Number (-100 to 100) representing ruler's negotiation skill vs. authoritarian tendencies
    * `eruditionVsMartialism`: Number (-100 to 100) representing ruler's scholarly vs. military focus
    * `generosityVsAvarice`: Number (-100 to 100) representing ruler's charity vs. greed
    * `attributeHistory`: Map tracking attribute changes over time
    * `attributeModifiers`: Array of active modifiers affecting attributes
  * Responsibilities:
    * Store opposing personality slider values
    * Track attribute changes over time
    * Store attribute modifiers

#### RulerModifierComponent
  * Attributes:
    * `modifierType`: Enum (Trait, Omen, Event, Faction)
    * `name`: String identifier for the modifier
    * `description`: String explaining the modifier's narrative effect
    * `affectedAttributes`: Map of attribute names to modification values
    * `duration`: Number of turns modifier remains active (-1 for permanent traits)
    * `source`: String describing the source of the modifier
    * `conditions`: Optional conditions under which this modifier applies
  * Responsibilities:
    * Store modifications to ruler attributes
    * Track duration of temporary effects
    * Store modifier source information

### Systems

#### RulerStateSystem
  * Responsibilities:
    * **Ruler State Initialization**: Sets up initial ruler state when a new ruler takes the throne. The system populates the RulerStateComponent with default values or inherited attributes as appropriate for succession scenarios.
    * **Player Action Processing**: Processes how player choices affect ruler state variables. The system applies the ruler state modifiers defined in chosen hex events and updates RulerStateComponent values accordingly.
    * **Non-Player Action Processing**: Applies changes to ruler state from non-player sources such as random events, time progression, or neighboring realm actions. The system ensures these modifications are properly attributed to their source.
    * **Realm Faction Impact Processing**: Calculates how faction metrics influence ruler state variables. The system monitors faction Influence and Allegiance values to determine if they should impact ruler reputation or trigger faction-specific events.
    * **Threshold Monitoring**: Identifies when ruler attributes cross significant thresholds. The system flags extreme attribute values that may trigger special events or unlock unique gameplay options.
  * Interactions:
    * **Hex Event Processing**: Processes ruler state modifications from hex choices in coordination with the event system. The system reads modifier data from chosen hexes and applies the appropriate changes to RulerStateComponent.
    * **Attribute Value Updates**: Modifies attribute values in DynasticAttributeComponent based on player choices and external events. The system ensures values remain within valid ranges (-100 to 100) and records significant changes in the attribute history.
    * **Modifier Management**: Reads from and updates RulerModifierComponent instances as modifiers are applied or expire. The system tracks the lifecycle of temporary modifiers and removes them when their duration ends.
    * **Faction State Coordination**: Communicates with FactionInfluenceSystem to process how faction metrics affect ruler state. The system receives faction state updates and determines their impact on ruler reputation or attributes.
    * **Chronicle Integration**: Records significant ruler state changes through the ChronicleSystem for narrative continuity. The system generates appropriate events when ruler attributes reach extreme values or cross important thresholds.

#### RulerAttributeSystem
  * Responsibilities:
    * **Attribute Balance Calculation**: Processes the relationships and tensions between opposing attributes. The system ensures that changes to one attribute appropriately influence its opposing counterpart.
    * **Attribute Effect Application**: Computes how attribute values affect gameplay systems and event probabilities. The system applies attribute-based modifiers to relevant gameplay systems such as military operations or diplomatic interactions.
    * **Threshold Effect Triggering**: Identifies when attributes cross thresholds that unlock special abilities or trigger events. The system monitors attribute values and flags when they reach levels that should activate special gameplay features.
    * **Attribute Decay Processing**: Applies gradual changes to attributes over time based on natural tendencies. The system implements regression toward neutrality for attributes that haven't been reinforced recently.
    * **Conflicting Attribute Resolution**: Resolves tensions between attributes that directly oppose each other. The system ensures that extreme values in opposing attributes create appropriate narrative and gameplay tension.
  * Interactions:
    * **Attribute Value Management**: Reads and updates attribute values in DynasticAttributeComponent during attribute processing. The system handles the primary responsibility for attribute value modifications.
    * **Event System Integration**: Communicates with the event generation system to influence the probability of attribute-related events. The system provides attribute values that modify event selection probabilities based on ruler personality.
    * **System Modifier Application**: Provides attribute-based modifiers to other gameplay systems like military operations or diplomatic negotiations. The system calculates modifier values based on current attribute levels and distributes them to relevant systems.
    * **Chronicle Event Generation**: Coordinates with ChronicleSystem to generate narrative events when attributes reach significant levels. The system identifies noteworthy attribute states and ensures they are reflected in the game's narrative.
    * **Faction Attitude Influence**: Communicates with FactionInfluenceSystem to indicate how ruler attributes affect faction attitudes. The system calculates how attributes like Piety or Tyranny should influence faction Allegiance values.

#### OmenSystem
  * Responsibilities:
    * **Omen Generation**: Creates and applies single-run modifiers (Omens) at appropriate times. The system generates Omens based on game events, player choices, or random occurrences.
    * **Trait Management**: Handles permanent ruler traits that persist throughout a reign. The system applies trait effects consistently throughout the ruler's lifetime.
    * **Modifier Duration Tracking**: Monitors the lifespan of temporary Omens and removes them when appropriate. The system tracks turn counts for time-limited modifiers and removes expired effects.
    * **Stacking Effect Resolution**: Resolves how multiple Omens and Traits interact when affecting the same attributes. The system applies rules for how modifiers stack, override, or conflict with each other.
    * **Special Event Triggering**: Identifies opportunities for Omen-related events based on current game state. The system flags conditions where Omen-related events would be narratively appropriate.
  * Interactions:
    * **Modifier Component Management**: Creates and updates RulerModifierComponent instances for Omens and Traits. The system handles the lifecycle of these modifier components.
    * **Ruler State Coordination**: Communicates with RulerStateSystem to apply Omen effects to ruler attributes. The system provides calculated modifier values that RulerStateSystem applies to attributes.
    * **Hex Event Integration**: Coordinates with the event system to process Omen-granting hex choices. The system receives requests to apply new Omens when players select certain hex options.
    * **Chronicle Event Generation**: Works with ChronicleSystem to generate narrative events when significant Omens occur. The system ensures important Omens are properly recorded in the game's narrative history.
    * **Inter-Run Persistence**: Coordinates with the succession system to determine which Traits should be inherited or influenced by predecessor rulers. The system identifies heritable characteristics for succession planning.

## 4.2 Game State Management: Realm State

### Components

#### RealmStateComponent (Singleton)
  * Attributes:
    * `treasury`: Number representing the realm's financial resources
    * `stability`: Number representing internal order and cohesion
    * `legitimacy`: Number representing rightful authority perception
    * `hubris`: Number representing dynasty's overreach
    * `factionInfluence`: Map of faction IDs to influence values
    * `factionAllegiance`: Map of faction IDs to allegiance values
    * `failureThresholds`: Object defining critical thresholds for core resources
    * `modifiers`: Array of active realm-wide modifiers
    * `resourceHistory`: Array tracking resource changes over time
  * Responsibilities:
    * Store core realm resources
    * Track faction influence and allegiance values
    * Store failure condition thresholds
    * Track realm-wide modifiers

#### RealmFailureConditionComponent
  * Attributes:
    * `conditionType`: Enum defining the type of failure (Bankruptcy, Instability, Illegitimacy, Nemesis)
    * `resourceType`: Enum indicating affected resource (Treasury, Stability, Legitimacy, Hubris)
    * `thresholdValue`: Number indicating the critical value
    * `consequenceHexes`: Array of hex IDs that can be triggered
    * `severity`: Enum (Minor, Major, Critical)
    * `recoveryActions`: Array of actions that can reverse the condition
  * Responsibilities:
    * Define specific failure conditions
    * Link conditions to consequence hexes
    * Store recovery options

#### RealmModifierComponent
  * Attributes:
    * `sourceType`: Enum (PlayerAction, NonPlayerAction, FactionInfluence, Event)
    * `sourceId`: ID of the source entity
    * `affectedResource`: Enum indicating the affected realm resource
    * `modifierType`: Enum (Flat, Percentage, Multiplier)
    * `value`: Number representing modification amount
    * `duration`: Number of turns modifier remains active (-1 for permanent)
    * `description`: String explaining the modifier
  * Responsibilities:
    * Store modifications to realm resources
    * Track duration of temporary effects
    * Store modifier source information

#### FactionComponent
  * Attributes:
    * `factionType`: Enum (Nobility, Priesthood, Merchants, Populace)
    * `influence`: Number (0-100) representing power in the realm
    * `allegiance`: Number (-100 to 100) representing loyalty to dynasty
    * `specialInterests`: Array of resource types this faction cares about
    * `leaderEntity`: Optional entity ID of faction leader
    * `rivalFactions`: Array of faction IDs this faction opposes
    * `allyFactions`: Array of faction IDs this faction aligns with
  * Responsibilities:
    * Store faction influence and allegiance values
    * Track inter-faction relationships
    * Store faction preferences

### Systems

#### RealmFailureSystem
  * Responsibilities:
    * **Threshold Monitoring**: Continuously monitors realm resources against defined failure thresholds. The system checks each resource value after any state change to determine if a threshold has been crossed.
    * **Failure Condition Detection**: Identifies when a realm resource crosses its failure threshold. The system compares current values to threshold values defined in RealmFailureConditionComponent and generates appropriate alerts when breaches occur.
    * **Consequence Selection**: Selects appropriate consequence hexes when failure conditions are triggered. The system accesses the consequenceHexes array in RealmFailureConditionComponent to determine which hex events should be forced.
    * **Forced Hex Generation**: Creates and injects forced hex events into the player's hand when failure conditions are met. The system bypasses normal hex drawing mechanics to ensure the consequence is unavoidable.
    * **Recovery Path Generation**: Provides recovery options when possible for triggered failure conditions. The system identifies and highlights actions that could reverse or mitigate the failure condition.
  * Interactions:
    * **Resource Value Reading**: Reads resource values from RealmStateComponent after each update to check against thresholds. The system subscribes to change events on the RealmStateComponent to ensure timely threshold checking.
    * **Condition Evaluation**: Evaluates RealmFailureConditionComponent instances against current realm state to detect failures. The system applies complex condition logic that may involve multiple resources or faction metrics.
    * **Forced Hex Injection**: Communicates with the HexChoiceSystem to inject forced consequence hexes when failure conditions are met. The system ensures these hexes are prioritized over normal player options.
    * **Notification Generation**: Sends alert notifications through the ChronicleSystem when thresholds are approaching or crossed. The system generates appropriate severity levels for these notifications based on how close resources are to failure thresholds.
    * **History Recording**: Records failure conditions in the realm's history through the ChronicleSystem for narrative continuity. The system ensures major realm failures become part of the dynasty's recorded history.

#### RealmStateModificationSystem
  * Responsibilities:
    * **Resource Modification Processing**: Applies changes to realm resources from various sources. The system handles modifications to Treasury, Stability, Legitimacy, and Hubris, ensuring all changes are properly recorded and constrained within valid ranges.
    * **Player Action Resolution**: Processes resource costs and rewards from player hex choices. The system deducts required resources for actions, validates that prerequisites are met, and applies immediate effects to realm state variables.
    * **Non-Player Effect Application**: Applies state changes from non-player sources such as time progression, random events, or neighbor actions. The system tags these modifications with their source to ensure clear attribution in the notification system.
    * **Prerequisite Enforcement**: Validates that resource prerequisites are met before allowing certain actions. The system blocks actions that require minimum resource levels (e.g., Treasury for war) when those levels aren't met.
    * **Modifier Aggregation**: Combines all active modifiers affecting each realm resource to determine final values. The system applies flat adjustments, percentage modifiers, and multipliers in the correct order of operations.
  * Interactions:
    * **Hex Action Processing**: Receives action requests from HexChoiceSystem and validates resource requirements before approving. The system reads cost data from chosen hexes and verifies against current resource levels in RealmStateComponent.
    * **Resource Value Updates**: Modifies resource values in RealmStateComponent based on validated actions and external events. The system handles the actual writing of new resource values after all modifications are aggregated.
    * **Modifier Management**: Reads from and updates RealmModifierComponent instances as resource modifiers are applied or expire. The system tracks the lifecycle of temporary modifiers and removes them when their duration ends.
    * **Event Generation**: Communicates with ChronicleSystem to generate events when significant resource changes occur. The system determines significance thresholds for different resources and generates appropriate narrative events.
    * **Failure Condition Alerts**: Notifies RealmFailureSystem when resources approach failure thresholds. The system implements early warning logic to alert when resources fall within a warning range of their failure thresholds.

#### FactionInfluenceSystem
  * Responsibilities:
    * **Faction-Realm Interaction Calculation**: Computes how faction metrics affect realm state variables. The system translates faction Influence and Allegiance combinations into specific effects on core realm resources.
    * **Inter-Faction Relationship Processing**: Manages the interactions and conflicts between different factions. The system applies relationship modifiers between allied or rival factions when actions favor one over others.
    * **Faction Metric Updates**: Processes changes to faction Influence and Allegiance from various sources. The system applies modifications from player choices, events, and time progression to faction metrics.
    * **Critical Faction State Detection**: Identifies dangerous faction states such as high Influence with low Allegiance. The system flags these conditions as potential threats to realm stability or legitimacy.
    * **Faction Leader Influence**: Calculates the special effects of faction leaders on faction behavior. The system applies modifiers based on leader traits and relationships with the ruling dynasty.
  * Interactions:
    * **Faction Data Reading**: Reads faction metrics from FactionComponent instances to determine their effect on realm state. The system aggregates influence and allegiance values across all factions to calculate their net effect.
    * **Realm Resource Modification**: Updates realm resources in RealmStateComponent based on faction states. The system applies faction-based modifiers to Stability, Legitimacy, and other core resources.
    * **Faction Metric Updates**: Modifies Influence and Allegiance values in FactionComponent instances in response to events and player choices. The system implements the rules for how these metrics change over time and in response to actions.
    * **Event Threshold Monitoring**: Communicates with ChronicleSystem when faction metrics reach significant thresholds. The system generates appropriate narrative events when factions become powerful or disloyal enough to warrant special attention.
    * **Inter-Faction Adjustment**: Updates relationships between factions when player choices favor some over others. The system applies Allegiance penalties to rival factions when a particular faction is consistently favored.

#### HexChoiceSystem
  * Responsibilities:
    * **Faction-Oriented Choice Presentation**: Presents players with hex choices that explicitly impact faction relationships. The system ensures that significant actions require choosing between factions, forcing players to make meaningful political decisions.
    * **Allegiance Impact Calculation**: Computes how player choices affect faction allegiance values. The system applies appropriate bonuses to favored factions and penalties to disfavored ones based on the nature of the choice.
    * **Choice Prerequisite Validation**: Verifies that players meet the necessary requirements to select certain choices. The system checks faction allegiance thresholds, resource levels, and other prerequisites before allowing selection.
    * **Choice Consequence Preview**: Provides players with clear previews of how their choices will affect faction allegiances. The system displays projected allegiance changes to help inform decision-making.
    * **Faction Conflict Generation**: Creates situations where factions have competing interests, forcing difficult choices. The system identifies opportunities to generate competing faction priorities and constructs appropriate choice scenarios.
  * Interactions:
    * **Choice Option Generation**: Creates hex options that reflect current faction dynamics and realm situation. The system communicates with the event generation subsystem to ensure hex choices are contextually appropriate.
    * **Faction Data Reading**: Reads current faction metrics from FactionComponent instances to inform choice options and consequences. The system uses current allegiance and influence values to determine which faction conflicts are most narratively appropriate.
    * **Allegiance Modification**: Updates faction allegiance values in FactionComponent instances based on player choices. The system applies the defined allegiance changes when players select options that favor or disfavor specific factions.
    * **Resource Requirement Validation**: Coordinates with RealmStateModificationSystem to verify resource requirements for choices. The system checks that players have sufficient resources before allowing them to select options with resource costs.
    * **Event Generation**: Communicates with ChronicleSystem to generate appropriate narrative events based on faction-affecting choices. The system ensures that significant faction decisions are recorded in the chronicle with appropriate narrative framing.

## 4.3 Game State Management: Territory & Military Model

### Components

#### GalaxyMapComponent (Singleton)
  * Attributes:
    * `sectors`: Map of sector IDs to sector objects
    * `planets`: Map of planet IDs to planet entities
    * `spaceLanes`: Array of connections between planets
    * `currentOwnership`: Map tracking planet ownership
  * Responsibilities:
    * Store spatial relationships between planets
    * Track sector groupings

#### PlanetComponent
  * Attributes:
    * `name`: String identifier
    * `owner`: Entity ID of controlling ruler/realm
    * `status`: Enum (Normal, Besieged, Rebellious, Devastated)
    * `developmentLevel`: Integer (1-10)
    * `fortificationLevel`: Integer (0-5) 
    * `resourceSpecialization`: Enum (Agriculture, Industry, Commerce, Military)
    * `productionOutput`: Object containing resource generation rates
  * Responsibilities:
    * Store planetary attributes
    * Track development state
    * Store planetary defense capabilities

#### FleetComponent
  * Attributes:
    * `strength`: Integer (1-100)
    * `experience`: Enum (Novice, Veteran, Elite)
    * `commander`: Optional entity ID reference
    * `specialization`: Enum (Assault, Siege, Defense)
    * `location`: Planet ID reference
    * `status`: Enum (Mustering, Idle, Moving, Besieging, Engaged, Retreating)
    * `targetLocation`: Optional planet ID for movement
    * `movementProgress`: Float (0-1) tracking movement completion
  * Responsibilities:
    * Store military unit data
    * Track unit status and position
    * Store combat capabilities
    * Reference commander entity

#### MilitaryCampaignComponent
  * Attributes:
    * `campaignType`: Enum (Punitive, Conquest, Defensive, Rebellion)
    * `targetPlanets`: Array of planet IDs
    * `assignedFleets`: Array of fleet entity IDs
    * `startDate`: Timestamp
    * `objectives`: Array of objective objects
    * `warScore`: Integer tracking overall campaign success
    * `casualtyCount`: Object tracking losses
  * Responsibilities:
    * Store campaign details
    * Track campaign progress data
    * Store victory conditions
    * Store historical records of the campaign

#### ResourceCostComponent
  * Attributes:
    * `actionType`: Enum specifying what type of action this cost applies to
    * `resourceCosts`: Object mapping resource types to required quantities
    * `resourceRewards`: Object mapping resource types to reward quantities
    * `scalingFactor`: Float modifying costs based on action scale or scope
    * `conditionalModifiers`: Array of conditions that may modify costs
    * `specialRequirements`: Array of non-resource requirements
    * `duration`: Integer representing how long resources are committed
    * `refundable`: Boolean indicating if costs can be refunded on failure
  * Responsibilities:
    * Store resource requirements for game actions
    * Define reward structures for successful actions
    * Track special conditions affecting costs
    * Define resource commitment duration

### Systems

#### GalaxyPathfindingSystem
  * Responsibilities:
    * **Path Calculation**: Calculates the shortest path between any two planets in the galaxy map. The system uses graph traversal algorithms to determine optimal routes and assigns movement costs based on space lane properties.
    * **Travel Time Estimation**: Computes the expected travel duration between planets for fleet movement planning. This calculation factors in space lane distances, fleet speed attributes, and any traversal modifiers from spatial anomalies.
    * **Route Optimization**: Determines the most efficient multi-stop routes for strategic fleet deployments. The system employs prioritization algorithms to balance speed, safety, and strategic value of different path options.
  * Interactions:
    * **Spatial Data Reading**: Reads spatial data from GalaxyMapComponent to construct a navigable graph representation of the galaxy. The system utilizes sector definitions, planet positions, and space lane connections to build its pathfinding model.
    * **Path Service Provision**: Provides calculated paths and travel time estimates to the MilitaryOperationsSystem for fleet movement planning. The system offers an interface that other systems can query to obtain optimal routes between any two points in the galaxy.
    * **Route Cache Management**: Maintains a cache of frequently requested routes to optimize performance during repeated path queries. The system interacts with its internal cache and the GalaxyMapComponent to balance computation speed with accuracy when spatial relationships change.

#### GalaxyVisualizationSystem
  * Responsibilities:
    * **Strategic Map Rendering**: Generates visual representations of the galaxy for player strategic decision-making. The system transforms spatial data into coherent visual displays that highlight important information such as ownership, fleet positions, and conflict zones.
    * **Control Visualization**: Renders different visual indicators for planetary ownership and control status. The system applies distinct visual styling to show Full Control, Occupied Control, Contested Control, and Tributary Status of planets.
    * **Sector Boundary Display**: Calculates and renders the boundaries between different sectors in the galaxy. The system processes sector definitions to create clear visual demarcations while maintaining the spatial integrity of the map.
  * Interactions:
    * **Galaxy Structure Rendering**: Reads spatial layout data from GalaxyMapComponent to generate the visual structure of the galaxy map. The system transforms raw positional data into a coherent visualization that shows planets, space lanes, and sector boundaries.
    * **Control Status Visualization**: Reads ownership and status data from PlanetComponent instances to render appropriate visual indicators for each planet. The system coordinates with the GUI subsystem to ensure consistent color coding and iconography for different control statuses.
    * **Fleet Position Display**: Reads position data from FleetComponent instances to show military unit locations on the strategic map. The system updates visual indicators when fleet positions change and highlights active movement paths during fleet transit.

#### ControlStatusSystem
  * Responsibilities:
    * **Ownership Processing**: Manages the transfer of planet ownership between different realms or factions. The system performs validation checks on ownership claims and applies the appropriate ownership state changes to affected planets.
    * **Control Level Calculation**: Determines the effective level of control (Full, Occupied, Contested, Tributary) for each planet. The system applies different resource contribution percentages (100%, 50%, 0%, 25%) based on the calculated control level.
    * **Rebellion Risk Assessment**: Calculates the probability of rebellion for planets under Occupied Control. The system factors in occupation duration, cultural differences, military presence, and local stability to determine if a rebellion event should trigger.
    * **Tributary Management**: Processes the special relationship between overlord and tributary planets. The system calculates resource transfers from tributary to overlord and applies any associated diplomatic modifiers.
  * Interactions:
    * **Planet Status Management**: Reads and updates the control status and owner fields in PlanetComponent instances as ownership changes occur. The system coordinates with MilitaryOperationsSystem when conquest events trigger ownership transfers and updates the GalaxyMapComponent's ownership records.
    * **Resource Contribution Calculation**: Calculates resource contribution modifiers based on control levels and updates the appropriate multipliers in PlanetaryResourceComponent. The system communicates these contribution rates to ResourceProductionSystem to ensure correct resource calculations.
    * **Rebellion Risk Processing**: Monitors occupied planets for potential rebellion triggers and communicates with the ChronicleSystem to generate rebellion events when thresholds are exceeded. The system reads stability factors from RealmStateComponent and local resistance values from PlanetComponent to determine rebellion probability.
    * **Tributary Relationship Management**: Processes resource transfers from tributary planets to their overlords by interacting with ResourceTransferSystem. The system reads tributary relationships from diplomatic data structures and ensures proper resource flow between the involved realms.

#### MilitaryOperationsSystem
  * Responsibilities:
    * **War Declaration Processing**: Handles the initiation of hostilities between realms based on player choices. The system updates diplomatic relationships, triggers appropriate chronicle events, and prepares the conflict state data structures.
    * **Fleet Movement Coordination**: Calculates and executes the movement of fleets between planets. The system updates fleet positions incrementally, checks for interceptions, and handles arrival events at destinations.
    * **Siege Operations**: Manages the siege process when fleets attack fortified planets. The system calculates siege duration based on fortification level, applies appropriate status effects to the besieged planet, and tracks siege progress.
    * **Multi-Fleet Coordination**: Combines multiple fleets into coordinated operations against common targets. The system calculates combined strength values, manages command hierarchy between fleets, and ensures proper coordination bonuses.
    * **Occupation Management**: Applies the appropriate occupation status to newly conquered planets. The system calculates initial garrison requirements, sets control status to Occupied, and initiates the occupation administration systems.
  * Interactions:
    * **Fleet Status Updates**: Reads and modifies FleetComponent status, position, and movement progress during military operations. The system coordinates with GalaxyPathfindingSystem to determine movement paths and updates fleet positions incrementally during execution.
    * **Planet Status Modification**: Updates PlanetComponent status fields when planets come under siege, are occupied, or change ownership. The system coordinates with ControlStatusSystem to process ownership transfers and applies appropriate status effects to planets during military operations.
    * **Battle Coordination**: Triggers combat resolution by passing opposing fleet data to BattleResolutionSystem when engagement conditions are met. The system processes the returned battle outcome data and applies appropriate status changes to the involved fleets and planets.
    * **Campaign Progress Tracking**: Updates MilitaryCampaignComponent data structures with operation progress, captures, and territorial changes. The system communicates with ChronicleSystem to generate significant campaign events and maintains campaign objective tracking.
    * **Galaxy Ownership Updates**: Modifies ownership records in GalaxyMapComponent when planets are successfully conquered or liberated. The system ensures all spatial data structures reflect current territorial control after military operations conclude.

#### BattleResolutionSystem
  * Responsibilities:
    * **Combat Strength Calculation**: Determines the effective combat strength of opposing forces in a military engagement. The system combines fleet strength values, commander martial attributes, terrain modifiers, and technology factors to compute final battle strength values.
    * **Battle Outcome Determination**: Compares calculated strength values to determine victors, casualties, and battle effects. The system applies the victory threshold check (20% advantage requirement) and generates appropriate outcome results including retreats, defeats, and pyrrhic victories.
    * **Casualty Distribution**: Calculates and applies combat losses to participating fleets. The system distributes casualties based on fleet position, experience level, and tactical circumstances while updating fleet strength values accordingly.
    * **Combat Experience Processing**: Adjusts experience levels of surviving fleets based on battle participation. The system awards experience points based on battle scale, difficulty, and outcome to potentially promote fleets from Novice to Veteran or Veteran to Elite status.
  * Interactions:
    * **Combat Input Processing**: Receives combat participants data from MilitaryOperationsSystem including fleet strengths, commander attributes, and terrain factors. The system reads RulerStateComponent for martial attribute values and PlanetComponent for fortification and terrain modifiers to compute comprehensive combat parameters.
    * **Fleet Strength Modification**: Updates FleetComponent strength values based on calculated combat losses after battle resolution. The system applies differentiated casualty rates based on experience levels and communicates these changes back to MilitaryOperationsSystem.
    * **Experience Level Updates**: Modifies FleetComponent experience levels when units gain sufficient combat experience through battle participation. The system calculates experience point gains and determines when fleets should be promoted to higher experience categories.
    * **Campaign Impact Recording**: Updates MilitaryCampaignComponent with battle outcomes, casualty figures, and war score adjustments. The system communicates significant battle results to ChronicleSystem for historical recording and player notification.
    * **Commander Effect Application**: Reads commander special abilities from historical figure components and applies their effects to combat calculations. The system coordinates with historical figure systems to process leadership bonuses and special tactical abilities.

#### MilitaryEventProcessorSystem
  * Responsibilities:
    * **Hex Event Interpretation**: Translates player-chosen military hex events into specific military operations. The system parses event data, identifies required military actions, and initiates appropriate operation workflows.
    * **Resource Cost Application**: Calculates and applies the resource costs associated with military actions. The system deducts treasury, manpower, and other resources based on operation scale, type, and special circumstances.
    * **Campaign Objective Tracking**: Updates the objectives and success metrics of ongoing military campaigns. The system evaluates event outcomes against campaign goals, adjusts war score values, and checks for campaign completion conditions.
    * **Military Follow-up Generation**: Creates contextually appropriate follow-up hex options based on military situation. The system analyzes current military state, campaign progress, and available resources to generate relevant new military decision points.
  * Interactions:
    * **Hex Event Translation**: Receives military-focused hex events from the event system and translates them into specific military operations. The system communicates with MilitaryOperationsSystem to initiate the appropriate military actions based on player choices.
    * **Resource Verification and Deduction**: Coordinates with RealmStateComponent and HexResourceSystem to verify resource availability and apply costs for military actions. The system ensures sufficient Treasury and Manpower are available before allowing military operations to proceed.
    * **Campaign Management**: Creates and updates MilitaryCampaignComponent instances when new campaigns are initiated through hex events. The system coordinates with ChronicleSystem to record campaign declarations and major milestones.
    * **Fleet Assignment Processing**: Updates FleetComponent assignment status when players allocate military units to specific campaigns. The system coordinates these assignments with MilitaryOperationsSystem to ensure proper unit utilization.
    * **Follow-up Generation**: Creates contextually appropriate follow-up hex options based on military operation outcomes. The system communicates with the event generation subsystem to create new military decision points that reflect the current strategic situation.

## 4.4 Game State Management: Hidden Economic Model

### Components

#### RealmResourceBalanceComponent (Singleton)
  * Attributes:
    * `foodBalance`: Object tracking food production, consumption, and reserves
    * `productionBalance`: Object tracking industrial output and utilization
    * `wealthBalance`: Object tracking income, expenses, and treasury
    * `manpowerBalance`: Object tracking population growth, military recruitment, and available forces
    * `planetaryContributions`: Map of planet IDs to resource contribution objects
    * `resourceTransfers`: Array of inter-planetary resource movements
    * `resourceDeficits`: Object tracking realm-wide resource shortages
    * `surplusStorage`: Object tracking stockpiled resources
  * Responsibilities:
    * Store realm-wide resource data
    * Track stockpiles and deficits
    * Store resource transfer records
  * Fulfills Requirement:
    * STATE-RESOURCE-3 (Resource Balance Sheet)

#### PlanetaryResourceComponent
  * Attributes:
    * `baseProduction`: Object containing base production rates for each resource type
    * `currentProduction`: Object containing actual production after modifiers
    * `specialization`: Enum indicating resource specialization focus
    * `productionHistory`: Array tracking production changes over time
    * `modifiers`: Array of active production modifiers
  * Responsibilities:
    * Store planetary resource production capabilities
    * Track production history and changes
    * Store specialization bonuses
  * Fulfills Requirement:
    * STATE-RESOURCE-2 (Planetary Resource Production)

#### ResourceModifierComponent
  * Attributes:
    * `targetResource`: Enum specifying which resource is affected
    * `modifierType`: Enum (Percentage, Flat, Multiplier)
    * `value`: Numeric modification amount
    * `source`: String describing the source of the modifier
    * `duration`: Integer for temporary modifiers, -1 for permanent
    * `scopeType`: Enum (Planet, Sector, Realm)
    * `scopeId`: ID of the entity to which this applies
  * Responsibilities:
    * Store modifications to resource production
    * Track duration of temporary effects
    * Store modifier source information
    * Define scope of effects

#### ResourceCostComponent
  * Attributes:
    * `actionType`: Enum specifying what type of action this cost applies to
    * `resourceCosts`: Object mapping resource types to required quantities
    * `resourceRewards`: Object mapping resource types to reward quantities
    * `scalingFactor`: Float modifying costs based on action scale or scope
    * `conditionalModifiers`: Array of conditions that may modify costs
    * `specialRequirements`: Array of non-resource requirements
    * `duration`: Integer representing how long resources are committed
    * `refundable`: Boolean indicating if costs can be refunded on failure
  * Responsibilities:
    * Store resource requirements for game actions
    * Define reward structures for successful actions
    * Track special conditions affecting costs
    * Define resource commitment duration
  * Fulfills Requirement:
    * STATE-RESOURCE-5 (Hex-Based Resource Actions)

### Systems

#### ResourceManagementSystem
  * Responsibilities:
    * **Resource Flow Coordination**: Orchestrates the overall resource management pipeline including production, consumption, and transfers
    * **Hidden Value Calculation**: Performs background calculations of resource values without exposing raw numbers to players
    * **System Lifecycle Coordination**: Manages the execution order of specialized resource subsystems
    * **Resource State Change Notification**: Generates appropriate feedback when resource states change significantly
  * Interactions:
    * **Subsystem Orchestration**: Coordinates the execution of ResourceProductionSystem, ResourceBalanceSystem, and other specialized resource systems
    * **Outcome Visualization**: Communicates with GUI systems to represent resource outcomes through narrative and visual cues rather than raw numbers
    * **Event Integration**: Coordinates with ChronicleSystem to generate resource-related events that convey economic state changes
  * Fulfills Requirement:
    * STATE-RESOURCE-1 (Hidden Resource Management)

#### ResourceProductionSystem
  * Responsibilities:
    * **Base Production Calculation**: Computes the raw resource production for each planet based on its inherent properties
    * **Modifier Application**: Applies all active modifiers to each planet's resource production
    * **Seasonal Variation Processing**: Calculates random and seasonal fluctuations in planetary resource production
    * **Specialization Bonus Calculation**: Computes the additional resource output from planet specializations
  * Interactions:
    * **Planet Data Reading**: Reads development level, specialization, and status data from PlanetComponent
    * **Modifier Application**: Reads active modifiers from ResourceModifierComponent instances
    * **Production Value Updates**: Updates the currentProduction field in PlanetaryResourceComponent
    * **Event Generation**: Communicates with ChronicleSystem for significant production changes
    * **Seasonal System Coordination**: Coordinates with TimeSystem for seasonal variations
  * Fulfills Requirement:
    * STATE-RESOURCE-2 (Planetary Resource Production)

#### ResourceBalanceSystem
  * Responsibilities:
    * **Global Production Aggregation**: Collects and sums resource production from all controlled planets
    * **Consumption Calculation**: Determines resource consumption rates across the realm
    * **Surplus/Deficit Determination**: Compares production against consumption to identify surpluses or deficits
    * **Effect Application**: Applies gameplay effects of resource states to realm metrics
    * **Surplus Distribution**: Allocates excess resources according to realm priorities
  * Interactions:
    * **Planetary Production Aggregation**: Reads from PlanetaryResourceComponent instances
    * **Global Balance Updates**: Updates RealmResourceBalanceComponent with calculations
    * **Realm State Effect Application**: Applies resource effects to core realm metrics
    * **Event Threshold Monitoring**: Communicates with ChronicleSystem for significant changes
    * **System Coordination**: Coordinates with ResourceTransferSystem for movement accounting
  * Fulfills Requirement:
    * STATE-RESOURCE-3 (Resource Balance Sheet)
    * STATE-RESOURCE-4 (Core Resources Tracking)

#### ResourceTransferSystem
  * Responsibilities:
    * **Transfer Validation**: Checks if requested resource transfers are feasible
    * **Efficiency Calculation**: Computes transfer efficiency and loss rates
    * **Transfer Execution**: Processes actual movement of resources between planets
    * **Transfer Logging**: Records resource transfers in economic history
  * Interactions:
    * **Transfer Request Processing**: Validates transfers against resource availability
    * **Path Dependency**: Coordinates with GalaxyPathfindingSystem for routes
    * **Resource Component Modification**: Updates PlanetaryResourceComponent values
    * **Transfer Record Management**: Updates resourceTransfers in RealmResourceBalanceComponent
    * **Event Generation**: Communicates with ChronicleSystem for significant transfers

#### ResourceModifierSystem
  * Responsibilities:
    * **Modifier Lifecycle Management**: Tracks and updates temporary resource modifiers
    * **Hex Event Processing**: Interprets and applies modifiers from player choices
    * **Modifier Stacking**: Computes combined effects of multiple modifiers
    * **Development Effect Calculation**: Translates development changes into modifiers
  * Interactions:
    * **Modifier Lifecycle Tracking**: Manages ResourceModifierComponent instances
    * **Event System Integration**: Receives modifier requests from HexEventSystem
    * **Production System Coordination**: Notifies ResourceProductionSystem of changes
    * **Development Integration**: Coordinates with development systems
    * **Chronicle Event Creation**: Communicates with ChronicleSystem for significant modifiers

#### HexResourceSystem
  * Responsibilities:
    * **Requirement Validation**: Checks resource sufficiency for hex actions
    * **Cost Application**: Deducts resources when actions are executed
    * **Reward Distribution**: Grants resource rewards from successful outcomes
    * **Military Cost Integration**: Calculates specialized costs for military actions
    * **Resource Event Generation**: Creates follow-up events based on resource changes
  * Interactions:
    * **Resource Availability Checking**: Reads from RealmResourceBalanceComponent
    * **Cost Application Coordination**: Updates RealmResourceBalanceComponent
    * **Military System Integration**: Coordinates with MilitaryEventProcessorSystem
    * **Reward Distribution Processing**: Updates RealmResourceBalanceComponent with rewards
    * **Event System Feedback**: Communicates with event generation system
  * Fulfills Requirement:
    * STATE-RESOURCE-5 (Hex-Based Resource Actions)

### Resource Conversion Mechanics
  * Excess Food can be converted to Manpower growth
  * Production can be converted to Wealth through trade
  * Wealth can accelerate development but at diminishing returns
  * Manpower can be converted to military strength but depletes quickly
  * Planets are connected by space lanes forming a simple network
  * Sectors group 3-5 planets into distinct regions

#### Control Levels
  * **Full Control**: 100% resource contribution
  * **Occupied Control**: 50% resource contribution, rebellion risk
  * **Contested Control**: No resource contribution, active conflict
  * **Tributary Status**: 25% resource contribution to overlord

#### Resource Conversion Mechanics
  * Excess Food can be converted to Manpower growth
  * Production can be converted to Wealth through trade
  * Wealth can accelerate development but at diminishing returns
  * Manpower can be converted to military strength but depletes quickly

## Random game rules and states 

### Starting Configuration
  * Each realm begins with three planets:
    * **Homeworld**: Balanced resource generation, capital bonuses
    * **Industrial Colony**: Enhanced production output
    * **Agricultural Settlement**: Population growth focus
  * Planets are connected by space lanes forming a simple network
  * Sectors group 3-5 planets into distinct regions

### Control Levels
  * **Full Control**: 100% resource contribution
  * **Occupied Control**: 50% resource contribution, rebellion risk
  * **Contested Control**: No resource contribution, active conflict
  * **Tributary Status**: 25% resource contribution to overlord

### Resource Conversion Mechanics
  * Excess Food can be converted to Manpower growth
  * Production can be converted to Wealth through trade
  * Wealth can accelerate development but at diminishing returns
  * Manpower can be converted to military strength but depletes quickly

# Event design

## Event Representation in the ECS Architecture

Event #4 ("Hellenes wage war") represents a **Military** hex tile with "Abduction" as its **Cause (CA)** and "War" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Abduction" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "War" (the action being taken)
   - **consequence**: "War" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Hellenes wage war"
   - **description**: "After the abduction of Helen, the Hellenes organized a large military force to invade Asia and take vengeance upon the Trojans."
   - **consequence**: "This event is cited as the first time the Hellenes set an example for waging war against the Barbarians."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Hellenes" 
   - **secondaryActor**: "Priam"
   - **motive**: "Vengeance"
   - **place**: "Asia"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Hellenes wage war" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +3 (significant increase as ruler leads a military campaign)
   - **hubris**: +2 (vengeance-motivated war increases pride)
   - **diplomacy**: -2 (aggressive action reduces diplomatic standing)

2. **RealmStateComponent**:
   - **stability**: -2 (war effort disrupts domestic affairs)
   - **legitimacy**: +1 (successful military leadership increases legitimacy)

3. **ResourceComponent**: 
   - **treasury**: Significant cost (represents war funding)
   - **manpower**: Major reduction (troops committed to campaign)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +2 (military action increases noble warriors' standing)
     - **allegiance**: +2 (nobles support military glory)
   - **Priesthood**: 
     - **influence**: +1 (religious support for vengeance)
     - **allegiance**: +1 (supporting divine justice)
   - **Populace**:
     - **influence**: -1 (war disrupts common people)
     - **allegiance**: -1 (bearing burden of conflict)

5. **TerritoryComponent**:
   - Adds **campaignTarget**: "Asia" (creates potential for territory expansion)
   - Sets **militaryPresence**: "High" in target region

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Reduces resources according to costs

3. **MilitaryCampaignSystem**: Creates and tracks the military campaign
   - Initializes campaign state
   - Sets up potential outcomes
   - Creates opportunity for future related events

4. **FactionReactionSystem**: Processes how factions respond to the military action
   - Calculates influence and allegiance changes
   - Determines if any faction threshold events are triggered

5. **EventGenerationSystem**: Modifies the pool of future available events
   - Increases probability of follow-up military events
   - Adds war-specific events to the pool
   - Makes "War" cause events more likely in the Hand of Fates

#### State Costs

This military hex requires significant resources to play, representing the commitment to a major war:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -30 (major expenditure)
   - **manpower**: -25 (significant troop commitment)
   - **stability**: -2 (domestic disruption)

2. **Risk Costs** (potential future costs):
   - 20% chance of additional **stability** loss if war drags on
   - Potential for further **manpower** losses based on future hex choices
   - Risk of **faction allegiance** deterioration if campaign fails

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **WarStateComponent** attached to realm entity
   - Sets **warTarget**: "Trojans"
   - Sets **warGoal**: "Vengeance"
   - Sets **warProgress**: 0 (starting value)

2. **Ongoing Effects** (persist until resolved by future hexes):
   - -5% **production** (resources diverted to war)
   - +15% **military effectiveness** (mobilized forces)
   - +10% probability of military event types in Hand of Fates

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Creates historical precedent for wars against Barbarians
   - Adds "War with Trojans" to dynasty chronicle
   - Potential territorial gains in follow-up hexes





