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

## Event Representation in the ECS Architecture - Event #12 "Gyges attacks Miletos"

Event #12 ("Gyges attacks Miletos") represents a **Military** hex tile with "Prophecy" as its **Cause (CA)** and "Conquest" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Prophecy" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "Expansion" (the action being taken)
   - **consequence**: "Conquest" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Gyges attacks Miletos"
   - **description**: "After becoming king, Gyges led an army against Miletos and Smyrna, conquering a part of Colophon."
   - **consequence**: "The conquest of a part of Colophon was one of his great deeds as king."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Gyges" 
   - **secondaryActor**: "Milesians"
   - **motive**: "Ambition"
   - **place**: "Miletos"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Gyges attacks Miletos" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +2 (ruler leads a military expansion campaign)
   - **hubris**: +1 (ambitious territorial grab increases pride)
   - **diplomacy**: -1 (aggressive expansion reduces diplomatic standing)

2. **RealmStateComponent**:
   - **stability**: -1 (military campaign creates some domestic disruption)
   - **legitimacy**: +2 (territorial conquest significantly increases ruler legitimacy)

3. **ResourceComponent**: 
   - **treasury**: -20 (moderate cost for military campaign)
   - **manpower**: -15 (troops committed to campaign)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +2 (military action increases noble warriors' standing)
     - **allegiance**: +2 (nobles support territorial expansion)
   - **Merchants**: 
     - **influence**: +1 (new trade opportunities in conquered territory)
     - **allegiance**: +1 (economic benefits of expansion)
   - **Populace**:
     - **allegiance**: -1 (bearing burden of military campaign)

5. **TerritoryComponent**:
   - Adds **newPlanet**: "Colophon" (partial control)
   - Sets **developmentLevel**: 2 (newly conquered territory)
   - Sets **controlStatus**: "Occupied" (50% resource contribution, rebellion risk)

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "Prophecy" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Reduces resources according to costs

3. **MilitaryOperationsSystem**: Manages the expansion campaign
   - Creates a fleet movement to target location
   - Processes the battle outcome
   - Changes control status of target territory

4. **TerritoryAcquisitionSystem**: Handles the addition of new territory
   - Adds newly conquered planet to realm
   - Sets appropriate control status
   - Calculates resource contribution

5. **FactionReactionSystem**: Processes how factions respond to the expansion
   - Calculates influence and allegiance changes
   - Determines if any faction threshold events are triggered

6. **ResourceBalanceSystem**: Updates the realm's resource balance
   - Applies immediate costs
   - Calculates new resource generation from conquered territory
   - Updates production and consumption rates

#### State Costs

This military hex requires significant resources to play, representing the commitment to territorial expansion:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -20 (moderate expenditure)
   - **manpower**: -15 (moderate troop commitment)
   - **stability**: -1 (minor domestic disruption)

2. **Risk Costs** (potential future costs):
   - 15% chance of **rebellion** in newly conquered territory
   - Potential for diplomatic tensions with neighboring realms
   - Risk of **faction allegiance** deterioration if occupation is mismanaged

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **ExpansionCampaignComponent** attached to realm entity
   - Sets **campaignTarget**: "Colophon"
   - Sets **campaignType**: "Conquest"
   - Sets **occupationLevel**: "Initial" (requiring follow-up actions to secure)

2. **Ongoing Effects** (persist until resolved by future hexes):
   - -10% **production** in newly conquered territory until fully integrated
   - +5% **military effectiveness** (mobilized forces)
   - +10% probability of follow-up conquest events in Hand of Fates

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Conquest of Colophon" to dynasty chronicle
   - Creates historical claim on Miletos and Smyrna for future expansion

## Event Representation in the ECS Architecture - Event #13 "Cimmerians invade Lydia"

Event #13 ("Cimmerians invade Lydia") represents a **Military** hex tile with "Conquest" as its **Cause (CA)** and "Invasion" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Conquest" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "Invasion" (the action being taken)
   - **consequence**: "Invasion" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Cimmerians invade Lydia"
   - **description**: "During the reign of Ardys, the son of Gyges, the Cimmerians invaded Lydia and took the city of Sardis, except for the citadel."
   - **consequence**: "This invasion resulted in the taking of Sardis, which remained under Cimmerian control for some time."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Cimmerians" 
   - **secondaryActor**: "Lydians"
   - **motive**: "Invasion"
   - **place**: "Sardis"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Cimmerians invade Lydia" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +1 (modest increase as ruler must organize defense)
   - **hubris**: -2 (significant reduction due to being on receiving end of invasion)
   - **diplomacy**: +1 (opportunity to forge alliances against common threat)

2. **RealmStateComponent**:
   - **stability**: -3 (major disruption due to foreign invasion)
   - **legitimacy**: -2 (loss of territory damages ruler's perceived authority)

3. **ResourceComponent**: 
   - **treasury**: -15 (resources lost to plundering)
   - **production**: -25% in affected territory (economic disruption)
   - **manpower**: -10 (troops lost defending territory)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +1 (military leadership opportunities)
     - **allegiance**: -1 (blame for inadequate defenses)
   - **Merchants**: 
     - **influence**: -2 (trade routes disrupted)
     - **allegiance**: -2 (economic interests severely damaged)
   - **Populace**:
     - **influence**: +1 (local resistance movements form)
     - **allegiance**: -2 (suffering under occupation)

5. **TerritoryComponent**:
   - Changes **planetStatus**: "Sardis" to "Occupied" (partial loss of control)
   - Sets **controlLevel**: "Contested" (no resource contribution)
   - Creates **occupationData**: { occupier: "Cimmerians", duration: 0, resistance: "Active" }

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "Conquest" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Reduces resources according to costs

3. **TerritoryControlSystem**: Processes the change in territorial control
   - Updates control status of affected territory
   - Calculates resource generation loss
   - Creates resistance potential

4. **MilitaryDefenseSystem**: Manages the defensive response
   - Calculates remaining defensive capabilities
   - Determines potential for counterattack
   - Sets up siege mechanics for the citadel

5. **FactionReactionSystem**: Processes how factions respond to the invasion
   - Calculates influence and allegiance changes
   - May trigger faction-specific events (nobility calling for military action, merchants seeking trade alternatives)

6. **ResourceBalanceSystem**: Recalculates the realm's resource balance
   - Applies immediate losses
   - Adjusts ongoing production and consumption
   - Creates potential for economic crisis events

#### State Costs

This military hex imposes significant costs, representing the impact of an invasion:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -15 (wealth lost to plundering)
   - **manpower**: -10 (defenders killed or captured)
   - **stability**: -3 (major social disruption)

2. **Risk Costs** (potential future costs):
   - 30% chance of additional **treasury** loss as invasion continues
   - Ongoing **production** penalty in occupied territory (-25%)
   - High risk (40%) of **rebellion** events in occupied territory (which may be beneficial or harmful)

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **OccupationComponent** attached to affected territory
   - Sets **occupationLevel**: "Major" (city captured, citadel holding)
   - Sets **territoryStatus**: "Contested" (resource generation severely impacted)
   - Creates **DefensiveStanceComponent** for remaining military forces

2. **Ongoing Effects** (persist until resolved by future hexes):
   - -25% **production** in affected territory (occupation disruption)
   - +20% **military effectiveness** in defending the citadel (desperate defense)
   - +15% probability of "Liberation" and "Resistance" event types in Hand of Fates

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Cimmerian Invasion" to dynasty chronicle
   - Creates historical claim dispute for affected territory
   - Adds potential for "Revenge" campaign events in future generations
   - Establishes diplomatic penalty with Cimmerian factions

## Event Representation in the ECS Architecture - Event #14 "Alyattes wars with Medes"

Event #14 ("Alyattes wars with Medes") represents a **Military** hex tile with "Invasion" as its **Cause (CA)** and "War" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Invasion" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "War" (the action being taken)
   - **consequence**: "War" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Alyattes wars with Medes"
   - **description**: "After Ardys, his son Sadyattes reigned for twelve years before Alyattes made war on the Medes and drove the Cimmerians out of Asia."
   - **consequence**: "This act of war successfully expelled the Kimmerians from Asia, establishing the Lydian dominance."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Alyattes" 
   - **secondaryActor**: "Medes"
   - **motive**: "Ambition"
   - **place**: "Asia"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Alyattes wars with Medes" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +3 (significant increase for leading a successful counter-invasion)
   - **hubris**: +2 (ambitious war and successful expulsion of invaders)
   - **diplomacy**: -2 (aggressive military expansion reduces diplomatic standing)
   - **generosity**: -1 (resources prioritized for war effort over domestic needs)

2. **RealmStateComponent**:
   - **stability**: -2 (initial disruption from war mobilization)
   - **legitimacy**: +3 (major increase from successful reclamation of territory)
   - **treasury**: -25 (significant war expenditure)

3. **ResourceComponent**: 
   - **treasury**: -25 (major expenditure for dual-front campaign)
   - **manpower**: -20 (significant troop commitment)
   - **production**: +10% (after success, from reclaimed territories)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +3 (military leadership in successful campaign)
     - **allegiance**: +3 (strong support for regaining lost territory)
   - **Merchants**: 
     - **influence**: +2 (trade routes restored after Cimmerian expulsion)
     - **allegiance**: +2 (economic benefits from territorial reconquest)
   - **Populace**:
     - **influence**: -1 (burden of war effort)
     - **allegiance**: +1 (increased from successful defense of homeland)

5. **TerritoryComponent**:
   - Changes **planetStatus**: "Sardis" back to "Normal" (regaining full control)
   - Adds **campaignTarget**: "Medes Territory" (creates potential for new expansion)
   - Sets **militaryPresence**: "Very High" in contested regions
   - Removes **occupationData** for previously Cimmerian-held territories

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "Invasion" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Reduces resources according to initial costs

3. **MultiCampaignSystem**: Manages the complex war on two fronts
   - Orchestrates operations against both Medes and Cimmerians
   - Allocates military resources between defensive and offensive operations
   - Calculates success probabilities for each front

4. **TerritoryReclamationSystem**: Processes the liberation of previously lost territories
   - Restores control status of recaptured territories
   - Calculates reconstruction needs
   - Reinstates resource production

5. **MilitaryVictorySystem**: Processes the outcomes of the successful campaign
   - Calculates legitimacy bonuses
   - Determines territorial gains
   - Generates appropriate chronicle entries

6. **FactionReactionSystem**: Processes how factions respond to the military victories
   - Calculates influence and allegiance changes
   - May trigger celebratory events or factional demands for rewards

#### State Costs

This military hex requires significant resources to play, representing the commitment to a major two-front war:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -25 (major expenditure)
   - **manpower**: -20 (significant troop commitment)
   - **stability**: -2 (initial domestic disruption)

2. **Risk Costs** (potential future costs):
   - 25% chance of additional **manpower** loss if war with Medes extends
   - 15% risk of **diplomatic penalty** with neutral powers
   - Potential for **resource strain** if campaign extends beyond initial expectations

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **CounterInvasionComponent** attached to realm entity
   - Sets **primaryTarget**: "Cimmerians"
   - Sets **secondaryTarget**: "Medes"
   - Sets **warObjective**: "Territory Reclamation"
   - Sets **offensiveStance**: "Aggressive"

2. **Ongoing Effects** (persist until resolved by future hexes):
   - -5% **production** (resources diverted to war)
   - +20% **military effectiveness** (mobilized forces with high morale)
   - +15% probability of military victory events in Hand of Fates
   - "Wartime Economy" status (reduced luxury goods, increased military production)

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Expulsion of Cimmerians" to dynasty chronicle
   - Creates historical animosity with Medes faction
   - Establishes "Defender of Lydia" reputation bonus
   - Forms basis for potential territorial claims in future generations

## Event Representation in the ECS Architecture - Event #15 "Alyattes besieges Miletos"

Event #15 ("Alyattes besieges Miletos") represents a **Military** hex tile with "War" as its **Cause (CA)** and "Sickness" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "War" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "Campaign" (the action being taken)
   - **consequence**: "Sickness" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Alyattes besieges Miletos"
   - **description**: "Alyattes continued his father's war against the Milesians by invading their land yearly and destroying their crops and trees."
   - **consequence**: "This protracted war lasted for eleven years and caused two great defeats for the Milesians."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Alyattes" 
   - **secondaryActor**: "Milesians"
   - **motive**: "Revenge"
   - **place**: "Miletos"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Alyattes besieges Miletos" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +2 (increase from leading a siege campaign)
   - **hubris**: +2 (revenge-motivated campaign increases pride)
   - **diplomacy**: -2 (aggressive destruction of civilian resources damages reputation)
   - **generosity**: -3 (significant decrease due to civilian targeting)

2. **RealmStateComponent**:
   - **stability**: -1 (prolonged campaign creates domestic strain)
   - **legitimacy**: +1 (asserting dominance over rivals)

3. **ResourceComponent**: 
   - **treasury**: -15 (moderate expenditure for ongoing campaign)
   - **manpower**: -10 (troops committed to seasonal campaigns)
   - **foodProduction**: +10% (stolen/plundered crops)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +2 (military leadership opportunities)
     - **allegiance**: +1 (support for military action)
   - **Merchants**: 
     - **influence**: -1 (trade disruption with target region)
     - **allegiance**: -1 (economic interests harmed)
   - **Priesthood**:
     - **influence**: -1 (moral qualms about targeting civilian livelihood)
     - **allegiance**: -2 (opposition to scorched earth tactics)
   - **Populace**:
     - **allegiance**: -1 (war weariness from prolonged campaign)

5. **PlanetComponent** modifications for target planet:
   - Sets **developmentLevel**: -2 (destruction of agriculture and infrastructure)
   - Sets **resourceSpecialization**: changes from "Agriculture" to "Undeveloped"
   - Sets **productionOutput**: { food: -50%, production: -25% }

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "War" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Reduces resources according to costs

3. **SiegeOperationsSystem**: Manages the protracted siege mechanics
   - Creates recurring seasonal campaign events
   - Calculates damage to target territory resources
   - Tracks siege progress and enemy attrition

4. **ResourceRaidingSystem**: Processes the effects of crop destruction and plundering
   - Calculates resource transfer from target to attacker
   - Applies infrastructure damage to target region
   - Sets up long-term economic penalties

5. **PublicHealthSystem**: Initiates disease risk mechanics
   - Calculates probability of disease outbreak in armies
   - Sets up potential for "Sickness" follow-up events
   - Creates risk modifiers for extended campaigns

6. **FactionReactionSystem**: Processes how factions respond to the siege tactics
   - Calculates influence and allegiance changes
   - May trigger faction-specific events related to the brutality of the campaign

#### State Costs

This military hex requires moderate resources to play, representing the commitment to a protracted campaign:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -15 (moderate expenditure)
   - **manpower**: -10 (moderate troop commitment)
   - **stability**: -1 (minor domestic disruption)

2. **Risk Costs** (potential future costs):
   - 25% chance of **disease outbreak** in military forces
   - 20% risk of **diplomatic penalty** with third parties
   - Ongoing **treasury** drain (-2 per year) for campaign maintenance

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **SiegeCampaignComponent** attached to realm entity
   - Sets **campaignTarget**: "Miletos"
   - Sets **campaignType**: "Scorched Earth"
   - Sets **campaignDuration**: "Extended" (11 years)
   - Sets **siegeProgress**: 0 (starting value)

2. **Ongoing Effects** (persist until resolved by future hexes):
   - -5% **diplomatic reputation** with neutral realms
   - +10% **military effectiveness** against Milesians
   - +15% probability of "Sickness" and "Starvation" event types in Hand of Fates
   - "War Weariness" status (-1 Stability per 3 years of ongoing campaign)

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Siege of Miletos" to dynasty chronicle
   - Creates "Blood Feud" with Milesian factions
   - Establishes "Ruthless Tactician" reputation
   - +20% increased chance of retaliation events from affected populations

## Event Representation in the ECS Architecture - Event #26 "Croesus conquers Ionia"

Event #26 ("Croesus conquers Ionia") represents a **Military** hex tile with "Dedication" as its **Cause (CA)** and "Conquest" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Dedication" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "Conquest" (the action being taken)
   - **consequence**: "Conquest" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Croesus conquers Ionia"
   - **description**: "Croesus, after receiving the kingdom, conquered the Ionian and Aiolian cities one by one."
   - **consequence**: "The conquest of the Hellenic cities made them tributaries to Lydia and Croesus sought to build a fleet against the islanders."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Croesus" 
   - **secondaryActor**: "Ephesians, Ionians"
   - **motive**: "Ambition"
   - **place**: "Ionia, Ephesus"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Croesus conquers Ionia" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +3 (significant increase from successful conquests)
   - **hubris**: +3 (major increase from expansionist success)
   - **diplomacy**: +1 (establishing tributary relationships shows diplomatic skill)
   - **erudition**: +1 (exposure to Hellenic knowledge and culture)

2. **RealmStateComponent**:
   - **stability**: -2 (temporary disruption from major military operations)
   - **legitimacy**: +3 (major boost from successful territorial expansion)
   - **treasury**: +10 (immediate tribute from conquered cities)

3. **ResourceComponent**: 
   - **treasury**: -30 initial cost, +10 immediate gain (campaign expenses offset by initial tribute)
   - **manpower**: -25 (significant troop commitment)
   - **production**: +15% (after integration, from new tributaries)
   - **navalCapacity**: +5 (preparation for naval expansion)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +3 (significant increase from military successes)
     - **allegiance**: +3 (strong support for territorial expansion)
   - **Merchants**: 
     - **influence**: +2 (new trade opportunities in conquered regions)
     - **allegiance**: +3 (economic benefits from controlling trade hubs)
   - **Priesthood**:
     - **influence**: +1 (religious significance of conquering renowned cities)
     - **allegiance**: +1 (support for realm expansion)
   - **Populace**:
     - **influence**: -1 (burden of military campaign)
     - **allegiance**: +2 (pride in realm's growing power)

5. **TerritoryComponent**:
   - Adds **newTerritories**: ["Ionia", "Aiolia"] (major territorial acquisition)
   - Sets **controlStatus**: "Tributary" for conquered cities (25% resource contribution)
   - Sets **navalDevelopment**: "Planned" (preparation for fleet building)

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "Dedication" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Processes initial costs and rewards

3. **MassConquestSystem**: Manages the sequential conquest mechanics
   - Processes multi-target military campaigns
   - Calculates varied conquest outcomes across cities
   - Manages surrender negotiations and terms

4. **TributaryManagementSystem**: Sets up tributary relationships with conquered cities
   - Establishes tributary status parameters
   - Calculates ongoing tribute income
   - Sets rebellion risk factors based on terms

5. **NavalDevelopmentSystem**: Initiates naval expansion mechanics
   - Creates naval development projects
   - Sets up potential for naval-focused follow-up events
   - Establishes new strategic capabilities

6. **FactionReactionSystem**: Processes how factions respond to the major territorial expansion
   - Calculates influence and allegiance changes
   - May trigger special events related to newly acquired populations and resources

#### State Costs

This military hex requires significant resources to play, representing a major conquest campaign:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -30 (major expenditure)
   - **manpower**: -25 (significant troop commitment)
   - **stability**: -2 (temporary disruption)

2. **Risk Costs** (potential future costs):
   - 20% chance of **rebellions** in newly tributary cities
   - 15% risk of **diplomatic tension** with nearby powers
   - Ongoing **administration costs** (+2 treasury/year) for controlling diverse territories

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **ExpansionistRealmComponent** attached to realm entity
   - Sets **majorcConquests**: ["Ionian Cities", "Aiolian Cities"]
   - Sets **tributaryIncome**: +5 treasury per turn
   - Sets **navalAmbition**: "Rising" (unlocks naval development options)

2. **Ongoing Effects** (persist until resolved by future hexes):
   - +15% **production** from tributary contributions
   - +10% **treasury income** from trade control
   - -5% **stability** in newly acquired regions until fully integrated
   - +20% probability of "Naval" and "Trade" event types in Hand of Fates

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Conquest of Ionia" to dynasty chronicle
   - Creates "Hellenic Cultural Exchange" ongoing event series
   - Establishes "Lydian Hegemony" reputation in the region
   - Opens path to naval power development options

## Event Representation in the ECS Architecture - Event #28 "Croesus expands empire"

Event #28 ("Croesus expands empire") represents a **Military** hex tile with "Alliance" as its **Cause (CA)** and "Expansion" as its **Consequence (CO)**. In the ECS architecture, this event would be represented through the following structure:

1. **HexTileEntity**: The core entity representing the played hex tile
   - Contains a unique entity ID managed by the EntityManager
   - Links to component data through component references

2. **HexTileComponent**: Stores the base hex data
   - **hexType**: "Military" (from HEX-6 requirement)
   - **cause**: "Alliance" (prerequisite that must match an adjacent hex's consequence)
   - **action**: "Conquest" (the action being taken)
   - **consequence**: "Expansion" (the outcome that can match with future hex causes)

3. **NarrativeComponent**: Contains the storytelling elements
   - **heading**: "Croesus expands empire"
   - **description**: "Croesus successfully subdued nearly all the nations on his side of the Halys river, except for the Kilikians and Lykians."
   - **consequence**: "The expansion of his empire made Sardis a major city and attracted many wise men from Greece."
   
4. **ActorComponent**: Defines the actors involved
   - **primaryActor**: "Croesus" 
   - **secondaryActor**: "Phrygians, Mysians"
   - **motive**: "Ambition"
   - **place**: "Lydia, Halys River"

5. **StateModifierComponent**: Defines how this hex modifies game state
   - Contains both cost data and modifier data (detailed below)

### Game State Changes

#### ECS Components Affected

When the "Croesus expands empire" hex is played, the following state components are affected:

1. **RulerAttributeComponent**:
   - **martialism**: +2 (increase from successful military expansion)
   - **hubris**: +3 (major increase from establishing a true empire)
   - **diplomacy**: +2 (successful management of multiple subjugated nations)
   - **erudition**: +2 (attraction of wise men and cultural exchange)

2. **RealmStateComponent**:
   - **stability**: -1 then +2 (initial disruption followed by strengthening)
   - **legitimacy**: +4 (significant boost from creating a true empire)
   - **developmentLevel**: +2 (Sardis becomes a major cultural center)

3. **ResourceComponent**: 
   - **treasury**: -35 initial cost, +15 return (campaign expenses offset by new tribute)
   - **manpower**: -30 (major troop commitment)
   - **production**: +25% (after integration, from expanded territories)
   - **culturalOutput**: +3 (attraction of wise men and scholars)

4. **FactionComponent** modifications:
   - **Nobility**: 
     - **influence**: +3 (major increase from territorial governance)
     - **allegiance**: +3 (enthusiastic support for imperial expansion)
   - **Merchants**: 
     - **influence**: +2 (significant new trade networks)
     - **allegiance**: +3 (strong economic benefits from expanded market control)
   - **Priesthood**:
     - **influence**: +1 (religious integration opportunities)
     - **allegiance**: +2 (increased patronage opportunities)
   - **Populace**:
     - **influence**: +1 (pride in imperial status)
     - **allegiance**: +2 (economic benefits and prestige)

5. **ImperialStatusComponent** (new):
   - Sets **imperialRank**: "Regional Empire" (upgraded from kingdom)
   - Sets **subjectNations**: ["Phrygians", "Mysians", "Various Minor Nations"]
   - Sets **imperialBorders**: "Halys River" (natural boundary)
   - Sets **culturalCapital**: "Sardis" (emerging center of learning)

#### ECS Systems Involved

1. **HexPlacementSystem**: Validates the placement legality (matching "Alliance" Cause to adjacent Consequence)

2. **StateModificationSystem**: Applies the costs and modifiers to the relevant components
   - Updates ruler attributes
   - Adjusts realm state variables
   - Modifies faction influence and allegiance
   - Processes initial costs and rewards

3. **ImperialTransformationSystem**: Manages the transformation from kingdom to empire
   - Creates new imperial governance structures
   - Establishes proper relationships with subject nations
   - Sets diplomatic stance with remaining independent powers (Kilikians, Lykians)
   - Calculates imperial prestige bonuses

4. **CulturalDevelopmentSystem**: Processes the cultural flourishing mechanics
   - Attracts notable figures from Greece
   - Enhances capital city development
   - Creates cultural exchange opportunities
   - Sets up potential cultural advancement events

5. **TerritorialAdministrationSystem**: Manages the vastly expanded territories
   - Organizes provinces and satrapies
   - Assigns governors from nobility faction
   - Calculates administrative efficiency
   - Sets development priorities across the empire

6. **FactionReactionSystem**: Processes how factions respond to imperial transformation
   - Calculates influence and allegiance changes
   - Generates faction-specific opportunities and expectations
   - May trigger special events related to imperial governance

#### State Costs

This military hex requires substantial resources to play, representing the final phase of establishing an empire:

1. **Direct Costs** (immediately deducted):
   - **treasury**: -35 (substantial expenditure)
   - **manpower**: -30 (major troop commitment)
   - **stability**: -1 (temporary disruption before stabilization)

2. **Risk Costs** (potential future costs):
   - 15% chance of **border conflicts** with powers beyond the Halys River
   - 20% risk of **administrative strain** from rapid expansion
   - 10% chance of **cultural tensions** between diverse subject peoples

#### State Modifiers

Playing this hex creates the following modifiers to the game state:

1. **Immediate State Changes**:
   - Creates **ImperialRealmComponent** attached to realm entity
   - Sets **imperialCapital**: "Sardis"
   - Sets **imperialCoreRegion**: "Lydia"
   - Sets **subjectNationCount**: 12+
   - Sets **naturalBoundary**: "Halys River"

2. **Ongoing Effects** (persist until resolved by future hexes):
   - +25% **production** from imperial territories
   - +20% **treasury income** from tribute and trade
   - +3 **cultural advancement** per turn (attraction of wise men)
   - +15% probability of "Cultural", "Philosophical", and "Diplomatic" event types in Hand of Fates
   - "Imperial Administration" status (requiring ongoing management)

3. **Legacy Effects** (persist beyond this ruler's reign):
   - Adds "Foundation of Lydian Empire" to dynasty chronicle
   - Creates "Imperial Legacy" permanent effect for successors
   - Establishes "Center of Learning" status for capital city
   - Opens path to imperial governance mechanics and events
   - +25% increased legitimacy for successors claiming imperial title





