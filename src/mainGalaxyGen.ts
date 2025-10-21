import { GalaxyGenerator } from './generator/galaxy/GalaxyGenerator';
import { loadGalaxyGenConfig } from './data/geography/galaxy/loadGalaxyGenConfig';
import { NameGenerator } from './naming/NameGenerator';
import { RandomComponent } from './random/RandomComponent';
import { loadRandomSeed } from './data/random/loadRandomSeed';
import * as fs from 'fs';
import * as path from 'path';

// Load dependencies
const seedData = loadRandomSeed();
const randomComponent = RandomComponent.create(seedData);
const nameGenerator = NameGenerator.create(randomComponent);
const config = loadGalaxyGenConfig();

// Generate galaxy
const generator = GalaxyGenerator.create(randomComponent, nameGenerator, config);
const galaxyMapData = generator.generateGalaxyMap();

// Write output
const outputPath = path.join(process.cwd(), 'data', 'geography', 'galaxy', 'galaxy-map.json');
fs.writeFileSync(outputPath, JSON.stringify(galaxyMapData, null, 2));

console.log(`✅ Galaxy map generated: ${outputPath}`);
console.log(`   Sectors: ${galaxyMapData.sectors.length}`);
console.log(`   Galaxy size: ${config.getGalaxySize()} LY`);
