import { RenderSystem } from '../../src/gui/rendering/RenderSystem';
import { ScreenBufferComponent } from '../../src/gui/rendering/ScreenBufferComponent';
import { EntityManager } from '../../src/ecs/EntityManager';

describe('RenderSystem', () => {
    let entityManager;
    let renderSystem;
    let mockSimulation;
    let stdoutWriteSpy;
    let consoleWarnSpy;

    beforeEach(() => {
        entityManager = new EntityManager();
        renderSystem = new RenderSystem(entityManager);
        mockSimulation = {};
        stdoutWriteSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        stdoutWriteSpy.mockRestore();
        consoleWarnSpy.mockRestore();
    });

    test('should do nothing when no screen buffer entity exists', () => {
        renderSystem.update(mockSimulation);
        
        expect(stdoutWriteSpy).not.toHaveBeenCalled();
    });

    test('should warn when multiple screen buffer entities exist', () => {
        // Create two entities with screen buffer components
        entityManager.createEntity(new ScreenBufferComponent());
        entityManager.createEntity(new ScreenBufferComponent());

        renderSystem.update(mockSimulation);
        
        expect(consoleWarnSpy).toHaveBeenCalledWith('Multiple screen buffer entities found, using the first one');
    });

    test('should render screen buffer on first update', () => {
        const screenBuffer = new ScreenBufferComponent();
        screenBuffer.write('Hello, World!');
        entityManager.createEntity(screenBuffer);

        renderSystem.update(mockSimulation);
        
        // Should clear screen and render buffer
        expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1b[2J\x1b[H'); // Clear screen
        expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1b[1;1HHello, World!' + '.'.repeat(67)); // First row
        expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1b[1;14H'); // Cursor position after "Hello, World!"
    });

    test('should not re-render if buffer has not changed', () => {
        const screenBuffer = new ScreenBufferComponent();
        screenBuffer.write('Static text');
        entityManager.createEntity(screenBuffer);

        // First update should render
        renderSystem.update(mockSimulation);
        expect(stdoutWriteSpy).toHaveBeenCalled();
        
        stdoutWriteSpy.mockClear();
        
        // Second update should not render (no changes)
        renderSystem.update(mockSimulation);
        expect(stdoutWriteSpy).not.toHaveBeenCalled();
    });

    test('should re-render when buffer changes', () => {
        const screenBuffer = new ScreenBufferComponent();
        screenBuffer.write('Initial text');
        entityManager.createEntity(screenBuffer);

        // First update
        renderSystem.update(mockSimulation);
        stdoutWriteSpy.mockClear();
        
        // Modify buffer
        screenBuffer.clear();
        screenBuffer.write('Modified text');
        
        // Second update should render
        renderSystem.update(mockSimulation);
        expect(stdoutWriteSpy).toHaveBeenCalled();
    });

    test('should get screen buffer entity', () => {
        const screenBuffer = new ScreenBufferComponent();
        const entity = entityManager.createEntity(screenBuffer);

        const retrievedEntity = renderSystem.getScreenBufferEntity();
        expect(retrievedEntity).toBe(entity);
    });

    test('should return null when no screen buffer entity exists', () => {
        const retrievedEntity = renderSystem.getScreenBufferEntity();
        expect(retrievedEntity).toBeNull();
    });

    test('should get screen buffer component', () => {
        const screenBuffer = new ScreenBufferComponent();
        entityManager.createEntity(screenBuffer);

        const retrievedBuffer = renderSystem.getScreenBuffer();
        expect(retrievedBuffer).toBe(screenBuffer);
    });

    test('should return null when no screen buffer component exists', () => {
        const retrievedBuffer = renderSystem.getScreenBuffer();
        expect(retrievedBuffer).toBeNull();
    });

    test('should force render even when buffer has not changed', () => {
        const screenBuffer = new ScreenBufferComponent();
        screenBuffer.write('Test content');
        entityManager.createEntity(screenBuffer);

        // First update
        renderSystem.update(mockSimulation);
        stdoutWriteSpy.mockClear();
        
        // Force render should work even without changes
        renderSystem.forceRender();
        expect(stdoutWriteSpy).toHaveBeenCalled();
    });

    test('should render cursor at correct position', () => {
        const screenBuffer = new ScreenBufferComponent();
        screenBuffer.setCursor(5, 10);
        entityManager.createEntity(screenBuffer);

        renderSystem.update(mockSimulation);
        
        // Should position cursor at row 6, col 11 (1-based indexing for ANSI)
        expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1b[6;11H');
    });

    test('should render all 24 rows of the buffer', () => {
        const screenBuffer = new ScreenBufferComponent();
        
        // Fill some rows with content
        for (let i = 0; i < 5; i++) {
            screenBuffer.writeAt(i, 0, `Row ${i}`);
        }
        
        entityManager.createEntity(screenBuffer);

        renderSystem.update(mockSimulation);
        
        // Should render all 24 rows
        for (let row = 1; row <= 24; row++) {
            expect(stdoutWriteSpy).toHaveBeenCalledWith(expect.stringContaining(`\x1b[${row};1H`));
        }
    });
});
