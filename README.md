# herodotus
History generator for fictional worlds

## Usage

### Available Scripts

In the project directory, you can run:

#### `npm run build`
Builds the application into a single file, ready for distribution. This project uses esbuild for fast and efficient bundling. The build artifacts will be stored in the `dist/` directory.

#### `npm start`
Runs the application's entry point (`src/main.js`).

#### `npm test`
Launches the test runner to execute all tests.

## Requirements

### Development requirements

D1) JavaScript 
The application is implemented in JavaScript.

D2) SOLID
The design must observed SOLID principles.


### Clarity of historical event requirements

H1) The chronicle consist of discrete historical entries describing historical events.

H2) Each entry takes place at a time, involving a historical figurue, at a place.

H3) Each entry must start with a super condensed heading, almost like keywords.

H4) An entry can either be due to either
- the action/initative of historical figure
- natural events

H5) Diverse Event Types: 
Beyond actions/initiatives and natural events, entries should cover a broad spectrum of historical occurrences:
- Political: Dynastic changes, treaties, rebellions, alliances, formation/dissolution of states, legal reforms.
- Social: Major migrations, class conflicts, significant social reforms, famines, plagues, population booms/busts.
- Economic: Trade route establishment/disruption, discovery of valuable resources, economic innovations (e.g., new currency), periods of prosperity or recession.
- Technological: Invention or adoption of new tools, architectural advancements, military innovations.
- Cultural/Religious: Founding of new cults/religions, artistic movements, significant festivals, philosophical shifts, construction of monumental structures (temples, wonders).
- Military: Battles, sieges, campaigns, conquests, establishment of garrisons, military reforms.

H6) Interconnectedness and Causality: 
Entries should demonstrate a chain of cause and effect. 
Events should logically follow from previous ones, even if the connections are sometimes subtle or open to interpretation (reflecting the "unverified tales" aspect). 
For example, a famine might lead to a rebellion, or a technological breakthrough might lead to a military advantage.

H7) Varying Scale of Events: 
The chronicle should include events of different magnitudes:
- Minor/Local: Events impacting a single city or small region (e.g., a local chieftain's decree, a minor skirmish).
- Regional: Events affecting a significant portion of the continent (e.g., a regional trade agreement, a widespread drought).
- Continental/Epochal: Events that fundamentally alter the course of history for the entire continent (e.g., the collapse of a major empire, the discovery of a new landmass, a continent-wide plague).

H8) Narrative Arc for Civilizations: 
Each civilization's rise and fall should follow a discernible narrative arc, even if presented through discrete entries. 
This includes periods of growth, stability, decline, and eventual collapse or transformation.

H9) Legacy and Influence of Figures: 
Historical figures should not just appear and disappear. 
Their actions, decisions, and even their personal traits should have lasting consequences that are referenced in later entries, contributing to their legend.

H10) The produced chronicle should have a subtle layer incorrectness, due to the inclusion of what is sometimes seen as fanciful or unverified tales. 

H11) Many of the incredible claims will be corroborated by archaeological and historical discoveries in the game, solidifying the chronicle a crucial source of information for an ancient world. 

H12) Beyond the military conflicts, the chronicle also encompasses geography, cultural descriptions, and observations about various peoples, their customs, and beliefs.

H13) Historical events become legend and legend become myth.

H14) Attribution of Fanciful Elements: 
The generator should subtly attribute unverified claims or fantastical elements to specific sources within the narrative (e.g., "It is said by the mountain folk...", "The ancient scrolls of X describe...", "A bard's tale recounts..."). 
This enhances the Herodotus-like feel and provides in-game hooks for corroboration.

H15) Gradual Evolution of Events: 
The generator should demonstrate the transformation of historical events into legend and then into myth. This can be achieved by:
Early Entries: More factual, direct accounts.
Later Entries (referencing past events): Introduce embellishments, heroic exaggerations, divine intervention, or symbolic interpretations.
Mythic Entries: Focus on archetypal figures, creation stories, or grand cosmic narratives that are loosely tied to historical events but have become foundational myths.

H16) Foreshadowing Corroboration: 
The language used for fanciful claims should subtly hint at their potential for in-game discovery. 
This could involve mentioning specific landmarks, unique artifacts, or unusual natural phenomena that players might later encounter and verify.

### Geography requirements

G1) Create a continent where the chronicle will take place.

G2) Detailed Geographic Features: 
The continent should be described with a variety of distinct geographic features, each influencing events:
Landforms: Mountain ranges (impassable, resource-rich), vast plains (ideal for agriculture/conflict), dense forests, deserts, swamps.
Water Bodies: Major rivers (trade routes, borders), large lakes, coastlines (ports, naval power), archipelagos.
Climate Zones: Varying climates (temperate, arid, tropical, arctic) that impact civilizations and natural events.

G3) Rich Cultural Descriptions: 
The chronicle should delve into the cultural fabric of the civilizations:
Religion/Beliefs: Pantheon of gods, significant rituals, prophecies, sacred sites.
Social Structure: Class systems, governance (monarchy, republic, tribal), family units, roles of different groups.
Art & Architecture: Unique styles, famous monuments, artistic expressions.
Technology & Craft: Distinctive tools, engineering feats, common crafts.
Customs & Traditions: Unique social practices, festivals, rites of passage.

G4) Distinct Peoples and Factions: 
Introduce multiple distinct peoples or factions residing on the continent, each with:
Unique Names: For peoples, tribes, cities, and regions.
Defining Characteristics: (e.g., nomadic horse tribes, seafaring traders, stoic mountain dwellers, scholarly city-states).
Interactions: Describe their relationships (alliances, rivalries, trade, warfare, cultural exchange).

G5) Dynamic Geography and Culture: 
Both geography and culture should evolve over the 1000-year period:
Geographic Changes: Rivers changing course, new islands forming/disappearing, forests expanding/receding, cities being founded or abandoned.
Cultural Evolution: Cultures adapting, merging, or being supplanted; new technologies emerging; religions transforming or being replaced.

### Period requirements

P1) The chronicle should cover events over a period of 1000 years.

P2) There is fictive time for each entry, the time should be the month and year and only dates for very special events. 

P3) Event Pacing: 
The density of historical entries should vary:
Periods of Stability: Fewer, more descriptive entries.
Periods of Conflict/Change: More frequent, action-oriented entries.
Epochal Shifts: Significant events marking the end of one era and the beginning of another.

P4) Defined Historical Epochs: 
The 1000-year span should naturally divide into several distinct historical epochs (e.g., "The Age of Founding," "The Era of Expansion," "The Time of Troubles," "The Twilight of Empires"). The generator should implicitly or explicitly mark these transitions.

P5) Consistent Time Notation: 
Reiterate that time should be presented as "Month, Year" (e.g., "The 3rd Month of the Year 273") for most events, with specific dates (Day, Month, Year) reserved for truly pivotal, continent-altering events (e.g., "The 12th Day of the 7th Month, Year 501: The Great Cataclysm").

### Generator Logic and Mechanism Requirements (L-series)

L1) Seeded Generation: 
The generator must be able to produce the exact same chronicle given the same initial seed value, ensuring reproducibility for game development and testing.

L2) Configurable Parameters: 
The user should be able to configure initial parameters to influence the chronicle's generation:
Number of initial civilizations/peoples.
Dominant themes (e.g., "Age of Conquest," "Era of Innovation," "Mystical Awakening").
Severity/frequency of natural disasters.
Overall tone (e.g., more heroic, more tragic, more mundane).

L3) Event Pool and Selection: 
The generator should draw from a diverse pool of event templates, applying them based on current historical context, civilization traits, and geographic location.

L4) Character Generation: 
The generator needs a system to create historical figures with names, roles (e.g., king, general, prophet, explorer), and perhaps simple personality traits that influence their actions.
L5) Continent Generation: 
A basic system for generating the continent's geography, including naming conventions for regions, rivers, mountains, and initial settlements.

L6) Inter-Civilization Dynamics: 
A mechanism to model relationships between civilizations (e.g., friendship, rivalry, war, trade) and how these evolve over time.

L7) Resource and Population Modeling (Simplified): 
A simplified model where civilizations have resources (e.g., food, wealth, military strength) and population, which influence their ability to expand, wage war, or survive disasters.

L8) Output Format: 
The primary output should be a structured format (e.g., JSON) that can then be easily parsed and formatted into the final chronicle text, allowing for flexible in-game display.

-----------------

## Prompt 

Analyze the README file, extend the design with requirement H2 only.
The design must observe requirements D1, D2.
State how design observes requirements D2.
Create a design proposal. 
State how the design adjusts to already implemented requirements.

# Data Model

Based on requirement H1, we can establish a basic data model.

- **`Chronicle`**: A class representing the entire historical document, which holds a collection of entries.
- **`HistoricalEntry`**: A class representing a single, discrete entry in the chronicle.
