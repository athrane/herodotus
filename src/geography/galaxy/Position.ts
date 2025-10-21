import { TypeUtils } from '../../util/TypeUtils';

/**
 * Represents a 3D position in the galaxy, measured in light years.
 * This is a value object representing coordinates in 3D space.
 */
export class Position {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;

    /**
     * Creates a new Position instance.
     * @param x - X-coordinate in light years.
     * @param y - Y-coordinate in light years.
     * @param z - Z-coordinate in light years.
     */
    constructor(x: number, y: number, z: number) {
        TypeUtils.ensureNumber(x, 'Position x must be a number.');
        TypeUtils.ensureNumber(y, 'Position y must be a number.');
        TypeUtils.ensureNumber(z, 'Position z must be a number.');

        this.x = x;
        this.y = y;
        this.z = z;

        Object.freeze(this);
    }

    /**
     * Gets the X-coordinate in light years.
     * @returns The X-coordinate.
     */
    getX(): number {
        return this.x;
    }

    /**
     * Gets the Y-coordinate in light years.
     * @returns The Y-coordinate.
     */
    getY(): number {
        return this.y;
    }

    /**
     * Gets the Z-coordinate in light years.
     * @returns The Z-coordinate.
     */
    getZ(): number {
        return this.z;
    }

    /**
     * Calculates the Euclidean distance from this position to another position.
     * @param other - The other position to calculate distance to.
     * @returns The distance in light years.
     */
    distanceFrom(other: Position): number {
        TypeUtils.ensureInstanceOf(other, Position, 'other must be a Position instance.');

        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /**
     * Serializes the position to a JSON object.
     * @returns A JSON object with x, y, z properties.
     */
    toJSON(): { x: number; y: number; z: number } {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    }

    /**
     * Static factory method to create a Position instance.
     * @param x - X-coordinate in light years.
     * @param y - Y-coordinate in light years.
     * @param z - Z-coordinate in light years.
     * @returns A new Position instance.
     */
    static create(x: number, y: number, z: number): Position {
        return new Position(x, y, z);
    }
}
