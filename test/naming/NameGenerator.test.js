import { NameGenerator } from '../../src/naming/NameGenerator.ts';
import { createTestRandomComponent } from '../util/RandomTestUtils.ts';

describe('NameGenerator', () => {
    let nameGenerator;
    let randomComponent;

    beforeEach(() => {
        randomComponent = createTestRandomComponent('name-generator-test-seed');
        nameGenerator = NameGenerator.create(randomComponent);
    });

    describe('create', () => {
        it('should create a new NameGenerator instance', () => {
            expect(nameGenerator).toBeInstanceOf(NameGenerator);
        });
    });

    describe('generateSyllableName', () => {
        it('should generate a name from the specified syllable set', () => {
            const name = nameGenerator.generateSyllableName('GENERIC');
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
        });

        it('should throw an error for a non-existent syllable set', () => {
            expect(() => nameGenerator.generateSyllableName('NON_EXISTENT')).toThrow();
        });
    });

    describe('addMarkovChain and generateMarkovName', () => {
        beforeEach(() => {
            const trainingData = ['alpha', 'beta', 'gamma'];
            nameGenerator.addMarkovChain('greek', trainingData, 2);
        });

        it('should generate a name using the specified Markov chain', () => {
            const name = nameGenerator.generateMarkovName('greek', 3, 8);
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThanOrEqual(3);
            expect(name.length).toBeLessThanOrEqual(8);
        });

        it('should throw an error for a non-existent Markov chain', () => {
            expect(() => nameGenerator.generateMarkovName('NON_EXISTENT', 3, 8)).toThrow();
        });
    });

    describe('Determinism', () => {
        it('should generate identical syllable names with same seed', () => {
            const random1 = createTestRandomComponent('syllable-test');
            const random2 = createTestRandomComponent('syllable-test');
            
            const gen1 = NameGenerator.create(random1);
            const gen2 = NameGenerator.create(random2);
            
            const name1 = gen1.generateSyllableName('GENERIC');
            const name2 = gen2.generateSyllableName('GENERIC');
            
            expect(name1).toBe(name2);
        });

        it('should generate identical Markov names with same seed', () => {
            const random1 = createTestRandomComponent('markov-test');
            const random2 = createTestRandomComponent('markov-test');
            
            const gen1 = NameGenerator.create(random1);
            const gen2 = NameGenerator.create(random2);
            
            const trainingData = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
            gen1.addMarkovChain('test', trainingData, 2);
            gen2.addMarkovChain('test', trainingData, 2);
            
            const name1 = gen1.generateMarkovName('test', 3, 8);
            const name2 = gen2.generateMarkovName('test', 3, 8);
            
            expect(name1).toBe(name2);
        });

        it('should generate identical historical figure names with same seed', () => {
            const random1 = createTestRandomComponent('historical-test');
            const random2 = createTestRandomComponent('historical-test');
            
            const gen1 = NameGenerator.create(random1);
            const gen2 = NameGenerator.create(random2);
            
            const name1 = gen1.generateHistoricalFigureName('GENERIC', 4, 10);
            const name2 = gen2.generateHistoricalFigureName('GENERIC', 4, 10);
            
            expect(name1).toBe(name2);
        });

        it('should use RandomComponent for syllable selection', () => {
            const random = createTestRandomComponent('syllable-selection-test');
            const gen = NameGenerator.create(random);
            
            // Generate multiple names to verify consistent selection
            const names = [];
            for (let i = 0; i < 5; i++) {
                names.push(gen.generateSyllableName('GENERIC'));
            }
            
            // Verify with a second generator using same seed
            const random2 = createTestRandomComponent('syllable-selection-test');
            const gen2 = NameGenerator.create(random2);
            
            for (let i = 0; i < 5; i++) {
                expect(gen2.generateSyllableName('GENERIC')).toBe(names[i]);
            }
        });

        it('should use RandomComponent for training data generation in historical figures', () => {
            const random1 = createTestRandomComponent('training-data-test');
            const random2 = createTestRandomComponent('training-data-test');
            
            const gen1 = NameGenerator.create(random1);
            const gen2 = NameGenerator.create(random2);
            
            // Both should generate identical training data internally
            const name1 = gen1.generateHistoricalFigureName('GENERIC', 4, 10);
            const name2 = gen2.generateHistoricalFigureName('GENERIC', 4, 10);
            
            // Verify the entire chain produces deterministic results
            expect(name1).toBe(name2);
        });
    });
});
