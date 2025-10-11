import { RandomComponent } from '../../src/random/RandomComponent';
import { RandomSeedData } from '../../src/data/random/RandomSeedData';

describe('RandomComponent', () => {
    describe('constructor', () => {
        it('should create component with valid seed data', () => {
            const seedData = RandomSeedData.create({ seed: 'test-seed' });
            const component = new RandomComponent(seedData);
            expect(component).toBeDefined();
            expect(component.getSeed()).toBe('test-seed');
            expect(component.getCallCount()).toBe(0);
        });

        it('should throw TypeError for invalid seed data', () => {
            expect(() => new RandomComponent('invalid' as any)).toThrow(TypeError);
        });

        it('should throw TypeError for null seed data', () => {
            expect(() => new RandomComponent(null as any)).toThrow(TypeError);
        });
    });

    describe('next()', () => {
        it('should return values in [0, 1) range', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'range-test' }));
            for (let i = 0; i < 100; i++) {
                const value = component.next();
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(1);
            }
        });

        it('should return different values on successive calls', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'succession-test' }));
            const first = component.next();
            const second = component.next();
            expect(first).not.toBe(second);
        });

        it('should return identical sequences for same seed', () => {
            const component1 = RandomComponent.create(RandomSeedData.create({ seed: 'identical-seed' }));
            const component2 = RandomComponent.create(RandomSeedData.create({ seed: 'identical-seed' }));

            const sequence1 = [];
            const sequence2 = [];

            for (let i = 0; i < 100; i++) {
                sequence1.push(component1.next());
                sequence2.push(component2.next());
            }

            expect(sequence1).toEqual(sequence2);
        });

        it('should return different sequences for different seeds', () => {
            const component1 = RandomComponent.create(RandomSeedData.create({ seed: 'seed-alpha' }));
            const component2 = RandomComponent.create(RandomSeedData.create({ seed: 'seed-beta' }));

            const sequence1 = [];
            const sequence2 = [];

            for (let i = 0; i < 100; i++) {
                sequence1.push(component1.next());
                sequence2.push(component2.next());
            }

            expect(sequence1).not.toEqual(sequence2);
        });

        it('should increment call count', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'count-test' }));
            expect(component.getCallCount()).toBe(0);
            
            component.next();
            expect(component.getCallCount()).toBe(1);
            
            component.next();
            component.next();
            expect(component.getCallCount()).toBe(3);
        });
    });

    describe('nextInt()', () => {
        it('should return integers within [min, max] range', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'int-test' }));
            
            for (let i = 0; i < 100; i++) {
                const value = component.nextInt(1, 10);
                expect(value).toBeGreaterThanOrEqual(1);
                expect(value).toBeLessThanOrEqual(10);
                expect(Number.isInteger(value)).toBe(true);
            }
        });

        it('should return min when min == max', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'equal-test' }));
            const value = component.nextInt(5, 5);
            expect(value).toBe(5);
        });

        it('should throw for min > max', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'invalid-range' }));
            expect(() => component.nextInt(10, 5)).toThrow(TypeError);
        });

        it('should handle negative ranges', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'negative-test' }));
            
            for (let i = 0; i < 50; i++) {
                const value = component.nextInt(-10, -1);
                expect(value).toBeGreaterThanOrEqual(-10);
                expect(value).toBeLessThanOrEqual(-1);
            }
        });

        it('should handle ranges crossing zero', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'zero-crossing' }));
            
            for (let i = 0; i < 50; i++) {
                const value = component.nextInt(-5, 5);
                expect(value).toBeGreaterThanOrEqual(-5);
                expect(value).toBeLessThanOrEqual(5);
            }
        });

        it('should have uniform distribution', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'uniform-int-test' }));
            const min = 1;
            const max = 6; // Simulate a 6-sided die
            const counts = new Map();
            const samples = 6000;

            for (let i = min; i <= max; i++) {
                counts.set(i, 0);
            }

            for (let i = 0; i < samples; i++) {
                const value = component.nextInt(min, max);
                counts.set(value, counts.get(value) + 1);
            }

            // Each value should appear roughly samples / (max - min + 1) times
            const expected = samples / (max - min + 1);
            
            for (let i = min; i <= max; i++) {
                const count = counts.get(i);
                // Allow 20% deviation from expected
                expect(count).toBeGreaterThan(expected * 0.8);
                expect(count).toBeLessThan(expected * 1.2);
            }
        });

        it('should throw for non-number min', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'type-test' }));
            expect(() => component.nextInt('5' as any, 10)).toThrow(TypeError);
        });

        it('should throw for non-number max', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'type-test' }));
            expect(() => component.nextInt(5, '10' as any)).toThrow(TypeError);
        });
    });

    describe('nextBool()', () => {
        it('should return true or false', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'bool-test' }));
            
            for (let i = 0; i < 100; i++) {
                const value = component.nextBool();
                expect(typeof value).toBe('boolean');
            }
        });

        it('should have ~50% distribution over large sample', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'bool-distribution' }));
            let trueCount = 0;
            const samples = 10000;

            for (let i = 0; i < samples; i++) {
                if (component.nextBool()) {
                    trueCount++;
                }
            }

            const ratio = trueCount / samples;
            // Expect roughly 50% with some statistical variance
            expect(ratio).toBeGreaterThan(0.45);
            expect(ratio).toBeLessThan(0.55);
        });
    });

    describe('nextChoice()', () => {
        it('should return element from array', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'choice-test' }));
            const array = ['A', 'B', 'C', 'D', 'E'];
            
            for (let i = 0; i < 50; i++) {
                const choice = component.nextChoice(array);
                expect(array).toContain(choice);
            }
        });

        it('should throw for empty array', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'empty-array' }));
            expect(() => component.nextChoice([])).toThrow(TypeError);
        });

        it('should return only element for single-element array', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'single-element' }));
            const array = ['OnlyOne'];
            expect(component.nextChoice(array)).toBe('OnlyOne');
        });

        it('should have uniform distribution over array elements', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'choice-distribution' }));
            const array = ['A', 'B', 'C', 'D'];
            const counts = new Map(array.map(item => [item, 0]));
            const samples = 4000;

            for (let i = 0; i < samples; i++) {
                const choice = component.nextChoice(array);
                counts.set(choice, counts.get(choice)! + 1);
            }

            const expected = samples / array.length;
            
            for (const item of array) {
                const count = counts.get(item)!;
                // Allow 20% deviation from expected
                expect(count).toBeGreaterThan(expected * 0.8);
                expect(count).toBeLessThan(expected * 1.2);
            }
        });

        it('should work with arrays of different types', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'type-variety' }));
            
            const numbers = component.nextChoice([1, 2, 3, 4, 5]);
            expect(typeof numbers).toBe('number');
            
            const objects = component.nextChoice([{id: 1}, {id: 2}, {id: 3}]);
            expect(typeof objects).toBe('object');
            expect(objects).toHaveProperty('id');
        });

        it('should throw for non-array input', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'non-array' }));
            expect(() => component.nextChoice('not an array' as any)).toThrow(TypeError);
        });
    });

    describe('state management', () => {
        it('should save and restore state correctly', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'state-save-test' }));
            
            // Advance state
            for (let i = 0; i < 50; i++) {
                component.next();
            }

            // Save state
            const state = component.getState();
            expect(state.seed).toBe('state-save-test');
            expect(state.callCount).toBe(50);
            expect(typeof state.internalState).toBe('number');
        });

        it('should continue sequence after state restoration', () => {
            const component1 = RandomComponent.create(RandomSeedData.create({ seed: 'restore-test' }));
            const component2 = RandomComponent.create(RandomSeedData.create({ seed: 'different-seed' }));

            // Advance component1
            for (let i = 0; i < 50; i++) {
                component1.next();
            }

            // Capture state
            const state = component1.getState();

            // Continue component1
            const sequence1 = [];
            for (let i = 0; i < 50; i++) {
                sequence1.push(component1.next());
            }

            // Restore component2 to same state and verify same sequence
            component2.setState(state);
            const sequence2 = [];
            for (let i = 0; i < 50; i++) {
                sequence2.push(component2.next());
            }

            expect(sequence1).toEqual(sequence2);
            expect(component2.getSeed()).toBe('restore-test');
            expect(component2.getCallCount()).toBe(100);
        });

        it('should track call count accurately', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'count-accuracy' }));
            
            component.next();
            component.next();
            component.nextInt(1, 10);
            component.nextBool();
            component.nextChoice(['A', 'B', 'C']);

            // All methods use next() internally
            expect(component.getCallCount()).toBe(5);
        });

        it('should serialize to RandomState interface', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'serialize-test' }));
            const state = component.getState();

            expect(state).toHaveProperty('seed');
            expect(state).toHaveProperty('internalState');
            expect(state).toHaveProperty('callCount');
            expect(typeof state.seed).toBe('string');
            expect(typeof state.internalState).toBe('number');
            expect(typeof state.callCount).toBe('number');
        });

        it('should throw for invalid state seed', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'invalid-state' }));
            const invalidState = {
                seed: '',
                internalState: 12345,
                callCount: 10
            };
            expect(() => component.setState(invalidState)).toThrow(TypeError);
        });

        it('should throw for invalid state internalState', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'invalid-state' }));
            const invalidState = {
                seed: 'valid',
                internalState: 'not-a-number' as any,
                callCount: 10
            };
            expect(() => component.setState(invalidState)).toThrow(TypeError);
        });

        it('should throw for invalid state callCount', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'invalid-state' }));
            const invalidState = {
                seed: 'valid',
                internalState: 12345,
                callCount: 'not-a-number' as any
            };
            expect(() => component.setState(invalidState)).toThrow(TypeError);
        });
    });

    describe('factory methods', () => {
        it('should create component via create()', () => {
            const component = RandomComponent.create(RandomSeedData.create({ seed: 'factory-test' }));
            expect(component).toBeInstanceOf(RandomComponent);
            expect(component.getSeed()).toBe('factory-test');
        });

        it('should return singleton null instance', () => {
            const null1 = RandomComponent.createNull();
            const null2 = RandomComponent.createNull();
            expect(null1).toBe(null2); // Same reference
        });

        it('should have null instance return fixed values', () => {
            const nullComponent = RandomComponent.createNull();
            expect(nullComponent.getSeed()).toBe('default-null-seed');
            
            // Null instance should still generate values (for compatibility)
            const value = nullComponent.next();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        });
    });
});
