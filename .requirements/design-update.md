# Design Update Proposal

This document contains proposed updates to `requirements.md` and `design.md` to introduce a more detailed model for territorial claims.

## Proposed Additions to `requirements.md`

### 4.6 Game State Management: Territorial Claims

| Identifier | Heading | Description |
|---|---|---|
| STATE-CLAIM-1 | Realm as a Territorial Entity | A realm must be defined as a collection of planets. Each realm must maintain a list of planets that it considers part of its territory. |
| STATE-CLAIM-2 | Territorial Claims | Realms must be able to lay claims on planets. A claim is a declaration of interest in a planet, which can be a prerequisite for conquest or integration. |
| STATE-CLAIM-3 | Claim Status | Claims must have different statuses, such as "core" (an integral part of the realm), "claimed" (recently acquired), and "contested" (claimed by multiple realms). |
| STATE-CLAIM-4 | Acquiring Claims | Claims can be acquired through hex actions (e.g., "Fabricate Claim" hex), ruler attributes (e.g., high martialism), or historical events. |
| STATE-CLAIM-5 | Integrating Claims | Planets with a "claimed" status must be integrated into the realm over time to become "core" planets. This process can be influenced by player actions and events. |
| STATE-CLAIM-6 | Losing Claims | Claims can be lost over time if not enforced, or as a result of diplomatic agreements or war. |

## Proposed Additions to `design.md`

### 4.5 Game State Management: Territorial Claims Model

This section details the components and systems required to implement the territorial claims feature.

### Components

#### RealmComponent (Singleton)
Attached to the primary realm entity, this component defines the realm as a territorial entity.

*   **Attributes**:
    *   `name`: String - The name of the realm.
    *   `claimedPlanets`: `Map<planetId, claimStatus>` - A map of planet IDs that the realm has a claim on, and the status of that claim (e.g., 'core', 'claimed').
*   **Responsibilities**:
    *   Define the territorial extent of a realm.
    *   Track all planets claimed by the realm.

#### TerritoryClaimComponent
Attached to each planet entity, this component tracks claims from various realms.

*   **Attributes**:
    *   `claims`: `Map<realmId, claimType>` - A map where the key is the ID of the realm making a claim, and the value is the type of claim (e.g., 'core', 'claimed').
*   **Responsibilities**:
    *   Store all claims made on a planet by different realms.
    *   Allow for contested claims by multiple realms.

#### PlanetComponent (Modification)
The existing `PlanetComponent` will be modified to include a direct reference to its current realm.

*   **New Attribute**:
    *   `realmId`: Entity ID of the realm that currently controls the planet.
*   **Responsibilities**:
    *   Clearly associate a planet with its controlling realm.

### Systems

#### TerritorialClaimSystem
A new system to manage the lifecycle of territorial claims.

*   **Responsibilities**:
    *   **Claim Management**: Add, remove, and update claims in the `TerritoryClaimComponent` of planets and the `RealmComponent` of realms.
    *   **Claim Integration**: Manage the process of a "claimed" planet becoming a "core" planet over time. This could be a simple timer or a more complex process influenced by ruler attributes, events, and realm stability.
    *   **Event Generation**: Generate events related to territorial claims, such as "Border Dispute" when two realms claim the same planet, or "Integration Complete" when a planet becomes a core part of the realm.
    *   **Claim Logic**: Implement the rules for acquiring and losing claims. For example, a claim might be lost if a realm loses a war, or gained through a specific hex action.

### Integration with Existing Systems

*   **MilitaryOperationsSystem**:
    *   The cost and difficulty of conquering a planet could be reduced if the attacking realm has a claim on it.
    *   Declaring war could require a valid claim on a planet.
*   **HexChoiceSystem**:
    *   New hexes will be introduced to allow players to "Fabricate Claim" on a planet, "Press Claim" to go to war, or "Renounce Claim" for diplomatic reasons.
*   **ControlStatusSystem**:
    *   The presence of a foreign claim on a planet could increase its rebellion risk.
    *   A planet that is part of a realm but has a "core" claim from another realm could be a constant source of instability.
*   **RealmStateModificationSystem**:
    *   Integrating a new planet could have an impact on realm stability, either positive or negative.
