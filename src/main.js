import { Generator } from './generator/Generator.js';

// Instantiate the Generator
const generator = new Generator();

// Generate the chronicle
const chronicle = generator.generate();

// Output the generated chronicle to the console
console.log('--- Generated Chronicle ---');
chronicle.getEntries().forEach(entry => {
  const figureName = entry.getFigure() ? entry.getFigure().getName() : 'N/A';
  console.log(`
    Heading: ${entry.getHeading()}
    Time: Year ${entry.getTime().getYear()}
    Place: ${entry.getPlace().getName()}
    Figure: ${figureName}
    Event: ${entry.getEventType().getCategory()} - ${entry.getEventType().getName()}
    Description: ${entry.getDescription()}
  `);
});
console.log('-------------------------');