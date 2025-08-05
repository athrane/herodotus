import { NameGenerator } from '../../src/naming/NameGenerator.js';

describe('NameGenerator', () => {
    let nameGenerator;

    beforeEach(() => {
        nameGenerator = NameGenerator.create();
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
});
