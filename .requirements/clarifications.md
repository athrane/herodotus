
# Requirements clarifications

### 3.0 Hex Tiles

| Clarification | Description |
|---|---|
| 3.0-C1 | Decide if HEX-3 should be supported. |
| 3.0-C2 | Decide if HEX-12 should be supported. |

### 3.1 Event Generation

| Clarification | Description |
|---|---|
| 3.1-C1 | Define the game state represenation that affects HEX-GEN-2. |
| 3.1-C2 | Define the game state representation of the ruler's personality and reputation that affects HEX-GEN-3. |

### 4.1 Game State Management: Ruler State

| Clarification | Description |
|---|---|
| 4.1-C1 | Define the game state represenation for STATE-RULER-2: The game state representation for STATE-RULER-2 must include variables that capture the ruler's personality traits and their impact on the realm, such as Piety, Hubris, Diplomacy, Tyranny, Erudition, Martialism, Generosity, and Avarice. |

### 4.2 Game State Management: Realm State

| Clarification | Description |
|---|---|
| 4.2-C1 | Define the game state represenation for STATE_REALM-1: The game state representation for STATE_REALM-1 must include variables that capture the overall health and political landscape of the realm, such as economic stability, public order, and the ruler's legitimacy. |
| 4.2-C2 | Define the game state representation for STATE_REALM-2: The game state representation for STATE_REALM-2 must include variables that define the failure conditions for the realm state, such as specific thresholds for Stability, Legitimacy, and other key metrics. |
| 4.2-C3 | Define the game state representation in STATE_REALM-1 should be based on these four core resources: Treasury, Stability, Legitimacy, and Hubris. Treasury is for funding actions. Stability is the realm's internal order; reaching zero triggers a run-ending catastrophe. Legitimacy is the dynasty's right to rule, influencing event probabilities. Hubris is an arrogance meter that increases and corrupts the event deck with negative "divine intervention" events, biasing the game against the player. |

---
EOD


