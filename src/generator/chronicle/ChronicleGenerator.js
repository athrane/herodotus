import { Continent } from '../../geography/Continent.js';

/**
 * Generates a historical chronicle for a continent based on its geography.
 * This class is data-driven, using templates to construct the narrative.
 */
export class ChronicleGenerator {
    constructor() {
        // Data-driven templates for story generation.
        // Each feature type can influence different eras of the civilization's history.
        this.chronicleTemplates = {
            'RIVER': {
                rise: "The early peoples settled along the fertile banks of the {featureName}, where the constant flow of water promised life and prosperity.",
                goldenAge: "The great cities of the empire grew rich from the trade that flowed along the {featureName}, its waters carrying goods and ideas to every corner of the land."
            },
            'GRASSY_PLAINS': {
                rise: "Upon the vast {featureName}, the civilization first learned to tame the land, their herds and harvests growing bountiful year after year.",
                decline: "The once-fertile plains of {featureName} were exhausted by centuries of use, leading to widespread famine and the migration of desperate peoples."
            },
            'COASTLINE': {
                rise: "From the shores of the {featureName}, the people learned to build ships, becoming masters of the sea and drawing wealth from its depths.",
                goldenAge: "A grand navy, harbored along the {featureName}, projected the empire's power across the known world."
            },
            'MOUNTAIN_RANGE': {
                rise: "The imposing {featureName} served as a natural fortress, protecting the nascent civilization from outside invaders.",
                goldenAge: "Mines dug deep into the {featureName} yielded precious metals and gems, funding the empire's ambitions and artistic wonders.",
                decline: "The same mountains that once protected the people later isolated them, making them slow to adapt to new threats from beyond."
            },
            'DENSE_FOREST': {
                rise: "The people found shelter and sustenance within the ancient {featureName}, its timber providing the raw material for their first homes and tools.",
                decline: "As the civilization waned, the dark woods of the {featureName} became a place of fear, home to bandits and forgotten beasts."
            },
            'CRYSTAL_CAVES': {
                goldenAge: "The discovery of the luminous {featureName} was a turning point, its arcane energies powering the civilization's most magnificent and terrifying creations.",
                fall: "The very power drawn from the {featureName} proved to be their undoing, as its unstable magic tore their greatest cities asunder."
            },
            'ARID_DESERT': {
                decline: "Hubris drove the empire to expand into the harsh {featureName}, a costly endeavor that drained its treasury and manpower for little gain.",
                fall: "It was from the unforgiving {featureName} that a new, hardened people emerged, sweeping in to conquer the decadent and weakened civilization."
            },
            'VOLCANO': {
                fall: "The histories speak of a day of fire and ash, when the great {featureName} awoke from its slumber and buried the heart of the empire, ending its golden age in a moment of cataclysm."
            },
            'ANCIENT_RUINS': {
                rise: "The civilization was built upon the bones of another, drawing knowledge and a sense of destiny from the {featureName} they discovered in their homeland.",
                fall: "In their arrogance, they ignored the warnings left by the builders of the {featureName}, and thus they repeated the same mistakes that led to the fall of their predecessors."
            },
            'DEFAULT': {
                introduction: "The land of {continentName} is one of great contrasts, a tapestry woven from its many features."
            }
        };
    }

    /**
     * Generates a chronicle for a given continent.
     * @param {Continent} continent - The continent to write a history for.
     * @returns {string} A formatted historical chronicle.
     */
    generateForContinent(continent) {
        const chronicle = {
            introduction: [this.chronicleTemplates.DEFAULT.introduction.replace('{continentName}', continent.getName())],
            rise: [],
            goldenAge: [],
            decline: [],
            fall: []
        };

        // Populate the chronicle eras based on the continent's features
        for (const feature of continent.getFeatures()) {
            const template = this.chronicleTemplates[feature.getType().getKey()];
            if (template) {
                for (const era in template) {
                    if (chronicle[era]) {
                        const storySnippet = template[era].replace('{featureName}', feature.getName());
                        chronicle[era].push(storySnippet);
                    }
                }
            }
        }

        // Assemble the final text in the style of a chronicle
        let fullText = `THE CHRONICLE OF ${continent.getName().toUpperCase()}\n`;
        fullText += "=".repeat(fullText.length - 1) + "\n\n";
        fullText += chronicle.introduction.join(' ') + "\n\n--- The Rise of a People ---\n" + (chronicle.rise.length ? chronicle.rise.join(' ') : "The precise origins of the first peoples are lost to time, but it is clear their society was forged by the land itself.") + "\n\n--- The Golden Age ---\n" + (chronicle.goldenAge.length ? chronicle.goldenAge.join(' ') : "They entered an age of unprecedented peace and prosperity, their culture flourishing in the heart of the continent.") + "\n\n--- The Long Decline ---\n" + (chronicle.decline.length ? chronicle.decline.join(' ') : "But no golden age lasts forever. Seeds of decay, sown by ambition and misfortune, began to sprout.") + "\n\n--- The Great Fall ---\n" + (chronicle.fall.length ? chronicle.fall.join(' ') : "In the end, the civilization collapsed, leaving behind only whispers and ruins to tell its tale.") + "\n\n";

        return fullText;
    }
}