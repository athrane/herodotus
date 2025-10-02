# Requirements

This document captures the requirements for the Chronicle (map-driven) interface used in the Herodotus project. Each section lists requirement identifiers, a short heading, and a concise description.

## 1.0 Setting: The Universe

| Identifier | Heading | Description |
|---|---|---|
| UNIVERSE-1 | Fictional universe | The game is set in a fictional universe inspired by various historical periods and cultures. |
| UNIVERSE-2 | Outer reach of some galaxy | The game takes place in the outer reaches of a galaxy, where players tried to build and maintain a dynasty. |
| UNIVERSE-3 | The old empire | The is a old dying empire at the center of the galaxy. Which will affect is remote and minimal way. Is is mainly there to provide story background. |
| UNIVERSE-4 | 3 planets | All games start with a realm on three distinct planets within this galaxy. This includes the player and computer players. 3 planets is choosen to give the player a sense of power and importance. |
| UNIVERSE-5 | Drama, not sci-fi| The game emphasizes dramatic storytelling and relationship dynamics over sci-fi. The sci-fi elements is so toned down so much the the game could take place in at the time of Herodotus chronicles. |
| UNIVERSE-6 | Drama, not resource management | The game emphasizes dramatic storytelling and relationship dynamics over realistic resource management. The resource management elements are computed but not exposed to the player (and computer players)  |

## 2.0 Core Systems: The Chronicle Map

| Identifier | Heading | Description |
|---|---|---|
| CORE-MAP-1 | The Chronicle Map | The game is played on a hexagonal map that visually represents a ruler's history. |
| CORE-MAP-2 | Origin Hex | Each new reign starts with a single, central Origin Hex on an otherwise empty map. |
| CORE-MAP-3 | Hex Placement | Players build the map by placing new hexagonal tiles adjacent to existing ones. |
| CORE-MAP-4 | Placement Rule | A hex can only be placed if its Cause (CA) prerequisite matches the Consequence (CO) of an adjacent, already-placed hex. See CORE-LOOP-1. |
| CORE-MAP-5 | Map as Chronicle | The map grows as a visual chronicle of the player's reign, with its shape reflecting the nature of the rule. The shape and growth pattern of the map must itself be a readable chronicle of the ruler's reign (e.g., an expansionist rule creates outward-spreading, militarized map shapes; a mercantile rule forms linear trade corridors). |

## 2.1 Core Systems: Dilemmas

| Identifier | Heading | Description |
|---|---|---|
| CORE-CHOICE-1 | Every choice must be a dilemma | Dilemmas are the main component of the gameplay, forcing players to make difficult decisions that impact the story. |

## 2.2 Core Systems: No Administration

| Identifier | Heading | Description |
|---|---|---|
| CORE-ADM-1 | 4x game without the administration | The game focuses on exploration, expansion, exploitation, and extermination, but without the traditional administrative overhead. |

## 2.3 Core Systems: Cause and Consequence

| Identifier | Heading | Description |
|---|---|---|
| CORE-LOOP-1 | Cause and Consequence Gameplay Loop | The core gameplay loop must be driven by the Cause (CA) of a hex needing to match the Consequence (CO) of an adjacent, already-placed hex on the map, creating a causal chain of events. |

## 3.0 Hex Tiles

| Identifier | Heading | Description |
|---|---|---|
| HEX-1 | Hex Definition | Hexes function as "cards" or tiles representing events, actions, and decisions. |
| HEX-2 | Hex Components | Every hex tile must have: Cause (CA), Action (A), Consequence (CO), and State Modifiers. |
| HEX-3 | Multiple outcomes | Every hex tile have a set of possible Consequences (CO) instead of a single one, depending whehter the action succeds or fails. |
| HEX-4 | Hex Types | Hex tiles must be categorized into seven distinct types: Mythical, Military, Political, Social, Religious, Cultural, and Natural. |
| HEX-5 | Mythical | Supernatural, fate-level phenomena (omens, curses, miracles). Primary effects: bounded global modifiers to Hubris and Legitimacy (e.g., Hubris ±[1..5], Legitimacy ±[1..4]). Frequency: rare (<=5% base deck). Rules: flagged as "supernatural"; treated as limited-repeat or unique; may trigger run-wide mechanics. No overlap with institutional (Religious) or environmental (Natural) categories. |
| HEX-6 | Military | Force and defense: battles, mobilization, fortifications. Primary effects: Manpower deltas, Treasury costs, Stability impact, combat/defense bonuses. Frequency: scales with Martialism (baseline 5–20%). Rules: enforce preconditions (Treasury/Manpower thresholds), produce deterministic numeric outcomes, and grant adjacency synergies with Natural (terrain) tiles. Distinct from Political and Social effects. |
| HEX-7 | Political | Statecraft, diplomacy, court intrigue, and faction-level maneuvers. Primary effects: Legitimacy changes, Faction Influence and Allegiance adjustments, access to policy branches. Frequency: biased by Diplomacy/Tyranny (5–15%). Rules: expose deterministic Allegiance/Influence deltas and conditional branching driven by faction metrics; no population-level mechanics (Social) or religious institution effects (Religious). |
| HEX-8 | Social | Population-focused domestic dynamics: rebellions, public works, unrest, festivals. Primary effects: Stability, Populace Allegiance, production/manpower modifiers. Frequency: increases as Stability decreases (e.g., +X% draw per threshold). Rules: define containment mechanics (e.g., adjacent Military reduces rebellion severity by Y%) and persistent local modifiers; distinct from elite/political mechanics. |
| HEX-9 | Religious | Organized faith and priesthood institution actions (doctrinal campaigns, clerical power). Primary effects: Priesthood Influence, Piety changes, unlock/lock of Religious-only mechanics. Frequency: biased by Piety (3–12%). Rules: institutional gating (Piety thresholds) and numeric/institutional effects; excludes supernatural effects (Mythical category handles those). |
| HEX-10 | Cultural | Knowledge, arts, technology, and prestige institutions (libraries, universities, festivals). Primary effects: Erudition, persistent Legitimacy or Production modifiers, idea/technology unlocks. Frequency: moderate (3–12%). Rules: grant explicit persistent modifiers with defined durations and numeric values; create synergies with Political and Social but remain separate from Religious/Mythical. |
| HEX-11 | Natural | Geography, resources, weather and ecological events (rivers, forests, harvests, plagues). Primary effects: Production, Food, Wealth, terrain tags and deterministic adjacency modifiers. Frequency: common in map generation; deck frequency depends on map composition. Rules: expose terrain tags and apply deterministic adjacency effects (e.g., river => +trade% for adjacent tiles); distinct from Military (use of terrain) and Social (population reaction). |
| HEX-12 | Adjacency synergy | Some hex types have an adjacency synergy. An adjacency synergy is a bonus effect that occurs when specific hex types are placed next to each other. |

## 3.1 Event Generation

| Identifier | Heading | Description |
|---|---|---|
| HEX-GEN-1 | Hand of Fates | At each turn, the player draws 2–3 playable hexes from a larger dataset, known as the "Hand of Fates". |
| HEX-GEN-2 | State-Dependent Draws | The pool of potential events must be dynamically modified by the current game state. |
| HEX-GEN-3 | Character-Driven Events | The pool of events must be influenced by the ruler's personality and reputation, that is the ruler's attributes. Some hexes must only be offered if the relevant attribute exceeds a numeric threshold. |
| HEX-GEN-4 | Faction-Driven Events | The pool of events must be influenced by the realm's faction metrics (Influence, Allegiance per faction). Some hexes must only be offered if the relevant faction metric exceeds a numeric threshold. |
| HEX-GEN-5 | Unique & Limited-Repeat Events | The game must include a set of unique and limited-repeat events to ensure narrative variety and prevent repetition. Unique events can only occur once per run, while limited-repeat events have a defined maximum number of occurrences. |
| HEX-GEN-6 | Event Rarity | Events must be categorized by rarity (Common, Uncommon, Rare, Epic, Legendary) to control their frequency of appearance in the Hand of Fates. Rarer events should have more significant impacts on the game state. |
| HEX-GEN-7 | Event Prerequisites | Certain events must have prerequisites based on the game state or ruler attributes. For example, a "Religious Uprising" event may only trigger if the Priesthood faction has high Influence and low Allegiance. |
| HEX-GEN-8 | Event Consequences | Events must have clear and impactful consequences that affect the game state, ruler attributes, or faction metrics. These consequences should be communicated to the player to inform their decisions. |

## 4.0 Game State Management

| Identifier | Heading | Description |
|---|---|---|
| STATE-1 | Two Tiers of State (overview) | The simulation must maintain two distinct, explicitly-modeled layers of state: the State of the Realm (Global State) and the State of the Ruler (Character State). |
| STATE-2 | Game State Management | The game must implement a robust system for managing the state of the dynasty and its realm. This includes tracking resources, faction dynamics, character attributes, and other variables that influence gameplay. |

## 4.1 Game State Management: Ruler State

| Identifier | Heading | Description |
|---|---|---|
| STATE-RULER-1 | State of the Ruler | Subjective personality and reputation of the ruler is represented by a set of variables. |
| STATE-RULER-2 | Ruler Attributes | the ruler state is represented by a set of evolving, opposing attributes that reflect the ruler's personality. These attributes include: Piety vs. Hubris, Diplomacy vs. Tyranny, Erudition vs. Martialism, and Generosity vs. Avarice. |
| STATE-RULER-3 | Ruler State Subject to Player Actions | The ruler state is subject to player actions. Every hex the player affect one or more ruler state variables. The "State Modifiers" on Hexes represent the immediate cost and reward of the decision. |
| STATE-RULER-4 | Ruler State Subject to Non-Player Actions | The ruler state is subject to non-player actions. Every hex the player affect one or more ruler state variables. |
| STATE-RULER-5 | Ruler State Subject to Realm Factions | The ruler state is subject to realm faction metrics (Influence, Allegiance per faction). Every hex the player affect one or more ruler state variables. |
| STATE-RULER-6 | Single Run Modifiers (Omens) | The ruler state is subject to Omen Modifiers that act as passive modifiers for a single run. A ruler's Trait (e.g., "Pious King," "Cruel") will be active for their entire reign, while Omens (e.g., "Favorable Omen") are temporary boons or banes received from specific choices.|

## 4.2 Game State Management: Realm State

| Identifier | Heading | Description |
|---|---|---|
| STATE-REALM-1 | State of the Realm (Global State) | The objective health and political landscape of your dynasty is represented by a set of variables. |
| STATE-REALM-2 | Realm failure condition | Realm state variables have defined realm-level deterministic failure conditions (e.g., Stability <= 0). |
| STATE-REALM-3 | Consequence of Realm failure condition | When a Realm failure condition is met, it triggers a predefined consequence, such as a rebellion or loss of territory. Such a consequence corresponds to a forced play of a hex. |
| STATE-REALM-4 | Realm state subject to player actions | The realm state is subject to player actions (e.g., decisions made on hex tiles). |
| STATE-REALM-5 | Realm state subject to non-player actions | The realm state is subject to non-player actions (e.g., events triggered by the game system). |
| STATE-REALM-6 | Realm state subject to realm factions | Realm state is is subject to realm faction metrics. |
| STATE-REALM-8 | Decisions Affecting Allegiance | The Action (A) on a hex must often involve a choice between factions, directly affecting their Allegiance. |

## 4.3 Game State Management: Realm Factions

| Identifier | Heading | Description |
|---|---|---|
| STATE-FACTION-1 | State of a realm faction | The State of a realm faction is represented by a set of variables. |
| STATE-FACTION-2 | Faction Influence | A faction is  modelled by an Influence variable. The variable represents the power and control within the realm. |
| STATE-FACTION-3 | Faction Allegiance | A faction is  modelled by an Allegiance variable. The variable represents the loyalty to the player's dynasty. |
| STATE-FACTION-4 | Faction Risk | A high-influence, low-allegiance faction must be treated as a high civil-war risk. |
| STATE-FACTION-5 | Faction Estates | The game must include at least four distinct Faction Estates: the Nobility (military power and land), the Priesthood (spiritual authority), the Merchants (wealth and trade), and the Populace (labor and potential for rebellion). |

## 4.4 Game State Management: Hidden Resource Management

| Identifier | Heading | Description |
|---|---|---|
| STATE-RESOURCE-1 | Resource Management is hidden from the player | The player must not have direct visibility into the underlying resource management mechanics. |
| STATE-RESOURCE-2 | Resource Model | The economy is modelled by a physical economy where planets produce, consume, or transport resources. |
| STATE-RESOURCE-3 | Track resources via Resource Balance Sheet | In the Resource Model, the game state must be defined by a Resource Balance Sheet that tracks the flow of tangible resources across the planets.  |
| STATE-RESOURCE-4 | Core Resources | The Resource Balance Sheet tracks a set economic variables. The variables can be: Food, Production, Wealth and Manpower. |
| STATE-RESOURCE-5 | Resource-Based Actions | All player choices on hexes must have clear state costs tied to the economic variables. For instance, a military action like A=War should require a minimum Treasury and immediately inflict a Stability penalty. |

## 4.5 Game State Management: Territory Model

| Identifier | Heading | Description |
|---|---|---|
| STATE-TERRITORY-1 | Territory Map | The game must implement a Territory Model where the physical map represents the player's controlled territory. |
| STATE-TERRITORY-2 | The Territory Map is visible to the player | The player has visibility of the physical map. |
| STATE-TERRITORY-3 | Territory Control | The player's controlled territory is represented by the controlled planets. |
| STATE-TERRITORY-4 | Territory Expansion | The player's territory can be expanded through specific hex actions (e.g., conquest, colonization). |
| STATE-TERRITORY-5 | Territory Loss | The player's territory can be lost through specific hex actions (e.g., rebellion, invasion). |  

## 5 Game Objectives

| Identifier | Heading | Description |
|---|---|---|
| OBJECTIVE-1 | Map Objectives | Each run may have procedurally generated, long-term goals tied to the map's geography. Achieving these goals provides Legacy Points for meta-progression. |

## 6.0 Roguelike Framework: The Dynastic Cycle

| Identifier | Heading | Description |
|---|---|---|
| ROGUE-1 | The Run | A single "run" is the complete reign of one ruler. |
| ROGUE-2 | End of a Run | A run ends when the ruler dies. |
| ROGUE-3 | Ruler Death | A ruler can die as a consequence of a played hex. |
| ROGUE-4 | Ruler Death | A ruler can die as a consequence of another player's hex actions. |
| ROGUE-5 | Ruler Death | A ruler can die as a consequence of the loss of their territory, that is when the three original planets are lost. |
| ROGUE-6 | Meta-Progression | Players earn Legacy Points by completing difficult map objectives or achieving specific narrative outcomes. These points are spent at the beginning of a new dynasty to unlock permanent benefits. |
| ROGUE-7 | Death as Chapter Conclusion | When a ruler dies, it should be treated as the conclusion of a chapter rather than a traditional "game over". The game should offer a new game option where the player can start a new game playing as the ruler of the same realm as the heir of the ruler. This game should inherit the previous game's state, positive and negative. |

## 7.0 Succession & Inheritance

| Identifier | Heading | Description |
|---|---|---|
| SUCC-1 | Inheritance of State | An heir inherits the final game state of their predecessor. |
| SUCC-2 | Inheritance of Realm Resources | The inherited state includes the realm's resources (The Resource Balance Sheet). |
| SUCC-3 | Inheritance of Territory Map | The inherited state includes the territory of the realm (The Territory Map). |
| SUCC-4 | New Faction State | The inherited state includes faction state. Faction state resets as they might have a different view on the new ruler. |
| SUCC-5 | Preparing Faction State | In the late reign, the player can choose to prepare the faction for the new ruler. This includes addressing any discontent and potentially reshaping the faction's goals. |
| SUCC-6 | Inheritance of Political Relations to Neighboring Realms | The inherited state includes political relations with neighboring realms. |
| SUCC-7 | New Ruler Attributes | The ruler starts with new attributes. |
| SUCC-8 | Heir's Origin Hex | The heir's starting Origin Hex is determined by the state of the realm upon their predecessor's death. A ruler who dies with high Stability and Treasury should result in their heir starting with a powerful Origin Hex and bonus resources, while a ruler who dies in chaos will cause their heir to start with significant disadvantages.|
| SUCC-9 | Mentorship | Players may be given a "mentorship" choice late in a reign to influence their heir's starting stats. |

---
EOD


