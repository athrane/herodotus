import { MarkovChain } from '../../src/naming/MarkovChain.ts';
import { createTestRandomComponent } from '../util/RandomTestUtils.ts';

describe('MarkovChain', () => {
    const trainingData = ['alpha', 'beta', 'gamma'];
    const order = 2;
    let markovChain;
    let randomComponent;

    beforeEach(() => {
        randomComponent = createTestRandomComponent('markov-chain-test-seed');
        markovChain = MarkovChain.create(trainingData, order, randomComponent);
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
            const emptyChain = MarkovChain.create([], 2, randomComponent);
            const name = emptyChain.generateName(3, 8);
            expect(name).toBe('');
        });
    });
});
