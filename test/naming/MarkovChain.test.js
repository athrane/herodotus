import { MarkovChain } from '../../src/naming/MarkovChain.js';

describe('MarkovChain', () => {
    const trainingData = ['alpha', 'beta', 'gamma'];
    const order = 2;
    let markovChain;

    beforeEach(() => {
        markovChain = MarkovChain.create(trainingData, order);
    });

    describe('create', () => {
        it('should create a new MarkovChain instance', () => {
            expect(markovChain).toBeInstanceOf(MarkovChain);
        });
    });

    describe('generateName', () => {
        it('should generate a name within the specified length constraints', () => {
            const name = markovChain.generateName(3, 8);
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThanOrEqual(3);
            expect(name.length).toBeLessThanOrEqual(8);
        });

        it('should return an empty string if no starting grams are available', () => {
            const emptyChain = new MarkovChain([], 2);
            const name = emptyChain.generateName(3, 8);
            expect(name).toBe('');
        });
    });
});
