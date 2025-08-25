import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { ScreenBufferComponent } from './ScreenBufferComponent';
import { Simulation } from '../../simulation/Simulation';

/**
 * System responsible for rendering the screen buffer to the terminal.
 * Handles a singleton entity that contains a ScreenBufferComponent for TTY rendering.
 */
export class RenderSystem extends System {
    private lastRenderedBuffer: string[] | null = null;

    constructor(entityManager: EntityManager) {
        super(entityManager, [ScreenBufferComponent]);
    }

    /**
     * Updates the render system. Renders the screen buffer if it has changed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(simulation: Simulation): void {
        const entities = this.getEntityManager().getEntitiesWithComponents(ScreenBufferComponent);
        
        // Should be a singleton entity with screen buffer
        if (entities.length === 0) {
            return; // No screen buffer entity found
        }

        if (entities.length > 1) {
            console.warn('Multiple screen buffer entities found, using the first one');
        }

        const entity = entities[0];
        const screenBuffer = entity.getComponent(ScreenBufferComponent);
        
        if (screenBuffer) {
            this.renderBuffer(screenBuffer);
        }
    }

    /**
     * Renders the screen buffer to the console if it has changed.
     */
    private renderBuffer(screenBuffer: ScreenBufferComponent): void {
        const currentBuffer = screenBuffer.getBuffer();
        
        // Only render if the buffer has changed
        if (this.hasBufferChanged(currentBuffer)) {
            this.clearScreen();
            this.drawBuffer(currentBuffer);
            this.drawCursor(screenBuffer);
            this.lastRenderedBuffer = [...currentBuffer];
        }
    }

    /**
     * Checks if the buffer has changed since the last render.
     */
    private hasBufferChanged(currentBuffer: string[]): boolean {
        if (!this.lastRenderedBuffer) {
            return true;
        }

        if (this.lastRenderedBuffer.length !== currentBuffer.length) {
            return true;
        }

        for (let i = 0; i < currentBuffer.length; i++) {
            if (this.lastRenderedBuffer[i] !== currentBuffer[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Clears the terminal screen.
     */
    private clearScreen(): void {
        // ANSI escape sequence to clear screen and move cursor to home
        process.stdout.write('\x1b[2J\x1b[H');
    }

    /**
     * Draws the buffer contents to the terminal.
     */
    private drawBuffer(buffer: string[]): void {
        for (let row = 0; row < buffer.length; row++) {
            // Move cursor to the beginning of the row and write the line
            process.stdout.write(`\x1b[${row + 1};1H${buffer[row]}`);
        }
    }

    /**
     * Draws the cursor at its current position.
     */
    private drawCursor(screenBuffer: ScreenBufferComponent): void {
        const cursor = screenBuffer.getCursor();
        // Move cursor to the specified position (ANSI uses 1-based indexing)
        process.stdout.write(`\x1b[${cursor.row + 1};${cursor.col + 1}H`);
    }

    /**
     * Forces a full re-render of the screen buffer.
     */
    forceRender(): void {
        this.lastRenderedBuffer = null;
        const entities = this.getEntityManager().getEntitiesWithComponents(ScreenBufferComponent);
        
        if (entities.length > 0) {
            const entity = entities[0];
            const screenBuffer = entity.getComponent(ScreenBufferComponent);
            
            if (screenBuffer) {
                this.renderBuffer(screenBuffer);
            }
        }
    }

    /**
     * Gets the singleton screen buffer entity.
     */
    getScreenBufferEntity(): any | null {
        const entities = this.getEntityManager().getEntitiesWithComponents(ScreenBufferComponent);
        return entities.length > 0 ? entities[0] : null;
    }

    /**
     * Gets the screen buffer component from the singleton entity.
     */
    getScreenBuffer(): ScreenBufferComponent | null {
        const entity = this.getScreenBufferEntity();
        return entity ? entity.getComponent(ScreenBufferComponent) : null;
    }

    /**
     * Creates a new instance of the RenderSystem.
     * @param EntityManager The entity manager to use.
     * @returns A new instance of the RenderSystem.
     */
    static create(EntityManager: EntityManager): RenderSystem {
        return new RenderSystem(EntityManager);
    }

}
