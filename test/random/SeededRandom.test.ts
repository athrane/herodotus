import { SeededRandom } from '../../src/random/SeededRandom';

describe('SeededRandom', () => {
    describe('constructor', () => {
        it('should create PRNG with string seed', () => {
            const rng = new SeededRandom('test-seed');
            expect(rng).toBeDefined();
        });

        it('should throw for empty seed', () => {
            expect(() => new SeededRandom('')).toThrow(TypeError);
        });

        it('should throw for non-string seed', () => {
            expect(() => new SeededRandom(123 as any)).toThrow(TypeError);
        });
    });

    describe('next()', () => {
        it('should return values in [0, 1) range', () => {
            const rng = SeededRandom.create('test');
            for (let i = 0; i < 100; i++) {
                const value = rng.next();
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(1);
            }
        });

        it('should return different values on successive calls', () => {
            const rng = SeededRandom.create('test');
            const first = rng.next();
            const second = rng.next();
            expect(first).not.toBe(second);
        });

        it('should return identical sequences for same seed', () => {
            const rng1 = SeededRandom.create('identical-seed');
            const rng2 = SeededRandom.create('identical-seed');

            const sequence1 = [];
            const sequence2 = [];

            for (let i = 0; i < 100; i++) {
                sequence1.push(rng1.next());
                sequence2.push(rng2.next());
            }

            expect(sequence1).toEqual(sequence2);
        });

        it('should return different sequences for different seeds', () => {
            const rng1 = SeededRandom.create('seed-one');
            const rng2 = SeededRandom.create('seed-two');

            const sequence1 = [];
            const sequence2 = [];

            for (let i = 0; i < 100; i++) {
                sequence1.push(rng1.next());
                sequence2.push(rng2.next());
            }

            expect(sequence1).not.toEqual(sequence2);
        });

        it('should generate 10000 values without exact repetition', () => {
            const rng = SeededRandom.create('uniqueness-test');
            const values = new Set();

            for (let i = 0; i < 10000; i++) {
                values.add(rng.next());
            }

            // Allow some collisions due to floating point precision, but expect high uniqueness
            expect(values.size).toBeGreaterThan(9900);
        });

        it('should pass basic runs test for randomness', () => {
            const rng = SeededRandom.create('runs-test');
            let runsAboveMedian = 0;
            let runsBelowMedian = 0;
            let currentlyAbove = null;

            for (let i = 0; i < 1000; i++) {
                const value = rng.next();
                const isAbove = value >= 0.5;

                if (currentlyAbove === null) {
                    currentlyAbove = isAbove;
                } else if (currentlyAbove !== isAbove) {
                    if (currentlyAbove) {
                        runsAboveMedian++;
                    } else {
                        runsBelowMedian++;
                    }
                    currentlyAbove = isAbove;
                }
            }

            // For truly random data, expect roughly equal runs above and below
            const totalRuns = runsAboveMedian + runsBelowMedian;
            expect(totalRuns).toBeGreaterThan(400); // Should have decent number of runs
            expect(totalRuns).toBeLessThan(600);
        });

        it('should have roughly uniform distribution (chi-square test)', () => {
            const rng = SeededRandom.create('chi-square-test');
            const buckets = 10;
            const samples = 10000;
            const counts = new Array(buckets).fill(0);

            for (let i = 0; i < samples; i++) {
                const value = rng.next();
                const bucket = Math.floor(value * buckets);
                counts[bucket]++;
            }

            // Each bucket should have roughly samples/buckets values
            const expected = samples / buckets;
            
            // Chi-square statistic
            let chiSquare = 0;
            for (let i = 0; i < buckets; i++) {
                const diff = counts[i] - expected;
                chiSquare += (diff * diff) / expected;
            }

            // For 10 buckets (9 degrees of freedom), critical value at 95% confidence is ~16.92
            // We use a looser threshold for the test
            expect(chiSquare).toBeLessThan(20);
        });
    });

    describe('hashString()', () => {
        it('should hash string to 32-bit integer', () => {
            const hash = SeededRandom.hashString('test');
            expect(typeof hash).toBe('number');
            expect(hash).toBeGreaterThanOrEqual(0);
            expect(hash).toBeLessThanOrEqual(0xFFFFFFFF);
        });

        it('should produce different hashes for different strings', () => {
            const hash1 = SeededRandom.hashString('seed-one');
            const hash2 = SeededRandom.hashString('seed-two');
            expect(hash1).not.toBe(hash2);
        });

        it('should produce same hash for same string', () => {
            const hash1 = SeededRandom.hashString('consistent');
            const hash2 = SeededRandom.hashString('consistent');
            expect(hash1).toBe(hash2);
        });

        it('should handle Unicode characters', () => {
            const hash = SeededRandom.hashString('テスト-🎲');
            expect(typeof hash).toBe('number');
            expect(hash).toBeGreaterThanOrEqual(0);
        });

        it('should throw for empty string', () => {
            expect(() => SeededRandom.hashString('')).toThrow(TypeError);
        });
    });

    describe('state management', () => {
        it('should get internal state', () => {
            const rng = SeededRandom.create('state-test');
            const state = rng.getState();
            expect(typeof state).toBe('number');
        });

        it('should set internal state', () => {
            const rng = SeededRandom.create('state-test');
            const originalState = rng.getState();
            
            rng.next(); // Advance state
            const newState = rng.getState();
            expect(newState).not.toBe(originalState);

            rng.setState(originalState); // Restore
            expect(rng.getState()).toBe(originalState);
        });

        it('should continue sequence from restored state', () => {
            const rng1 = SeededRandom.create('sequence-test');
            const rng2 = SeededRandom.create('sequence-test');

            // Advance rng1
            for (let i = 0; i < 50; i++) {
                rng1.next();
            }

            // Capture state
            const state = rng1.getState();

            // Advance both further
            const sequence1 = [];
            for (let i = 0; i < 50; i++) {
                sequence1.push(rng1.next());
            }

            // Restore rng2 to captured state and generate same sequence
            rng2.setState(state);
            const sequence2 = [];
            for (let i = 0; i < 50; i++) {
                sequence2.push(rng2.next());
            }

            expect(sequence1).toEqual(sequence2);
        });

        it('should throw for non-number state', () => {
            const rng = SeededRandom.create('type-test');
            expect(() => rng.setState('invalid' as any)).toThrow(TypeError);
        });
    });

    describe('factory methods', () => {
        it('should create instance via create()', () => {
            const rng = SeededRandom.create('factory-test');
            expect(rng).toBeInstanceOf(SeededRandom);
            expect(rng.next()).toBeGreaterThanOrEqual(0);
            expect(rng.next()).toBeLessThan(1);
        });
    });
});
