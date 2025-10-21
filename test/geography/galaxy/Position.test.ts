import { Position } from '../../../src/geography/galaxy/Position';

describe('Position', () => {
    it('creates position with correct coordinates', () => {
        const position = Position.create(1.5, 2.5, 3.5);

        expect(position.getX()).toBe(1.5);
        expect(position.getY()).toBe(2.5);
        expect(position.getZ()).toBe(3.5);
    });

    it('validates numeric inputs for x coordinate', () => {
        expect(() => {
            Position.create('invalid' as any, 0, 0);
        }).toThrow(TypeError);
    });

    it('validates numeric inputs for y coordinate', () => {
        expect(() => {
            Position.create(0, 'invalid' as any, 0);
        }).toThrow(TypeError);
    });

    it('validates numeric inputs for z coordinate', () => {
        expect(() => {
            Position.create(0, 0, 'invalid' as any);
        }).toThrow(TypeError);
    });

    it('calculates distance correctly', () => {
        const pos1 = Position.create(0, 0, 0);
        const pos2 = Position.create(3, 4, 0);

        const distance = pos1.distanceFrom(pos2);
        expect(distance).toBe(5);
    });

    it('calculates distance in 3D space', () => {
        const pos1 = Position.create(1, 2, 3);
        const pos2 = Position.create(4, 6, 8);

        const distance = pos1.distanceFrom(pos2);
        // sqrt((4-1)^2 + (6-2)^2 + (8-3)^2) = sqrt(9 + 16 + 25) = sqrt(50)
        expect(distance).toBeCloseTo(7.071, 3);
    });

    it('calculates distance to itself as zero', () => {
        const position = Position.create(5, 10, 15);

        const distance = position.distanceFrom(position);
        expect(distance).toBe(0);
    });

    it('serializes to JSON correctly', () => {
        const position = Position.create(1.5, 2.5, 3.5);

        const json = position.toJSON();
        expect(json).toEqual({
            x: 1.5,
            y: 2.5,
            z: 3.5
        });
    });

    it('is immutable', () => {
        const position = Position.create(1, 2, 3);

        expect(Object.isFrozen(position)).toBe(true);
    });

    it('validates Position instance for distance calculation', () => {
        const position = Position.create(0, 0, 0);

        expect(() => {
            position.distanceFrom('invalid' as any);
        }).toThrow(TypeError);
    });
});
