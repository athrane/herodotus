import { WorldComponent } from '../../src/geography/WorldComponent.js';
import { World } from '../../src/geography/World.js';

describe('WorldComponent', () => {
    let mockWorld;

    beforeEach(() => {
        // Create a mock World object for testing
        mockWorld = new World('TestWorld'); 
    });

    test('should construct with a valid World object', () => {
        const worldComponent = new WorldComponent(mockWorld);
        expect(worldComponent).toBeInstanceOf(WorldComponent);
        expect(worldComponent.get()).toBe(mockWorld);
    });

    test('should throw error if constructed without a World object', () => {
        expect(() => new WorldComponent(null)).toThrow(TypeError);
        expect(() => new WorldComponent({})).toThrow('Expected instance of World, but got object');
    });

    test('should return the world object via get()', () => {
        const worldComponent = new WorldComponent(mockWorld);
        expect(worldComponent.get()).toBe(mockWorld);
    });
});
