import { GuiRenderSystem } from '../../src/gui/GuiRenderSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { PositionComponent } from '../../src/gui/PositionComponent';
import { TextComponent } from '../../src/gui/TextComponent';
import { IsVisibleComponent } from '../../src/gui/IsVisibleComponent';
import { GuiHelper } from '../../src/gui/GuiHelper';
import { Simulation } from '../../src/simulation/Simulation';

describe('GuiRenderSystem', () => {
    let entityManager;
    let guiRenderSystem;
    let mockSimulation;
    let consoleSpy;
    let clearScreenSpy;

    beforeEach(() => {
        entityManager = new EntityManager();
        guiRenderSystem = new GuiRenderSystem(entityManager);
        mockSimulation = {};
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        clearScreenSpy = jest.spyOn(GuiHelper, 'clearScreen').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        clearScreenSpy.mockRestore();
    });

    test('should render text from entities with all required components', () => {
        // Create an entity with all required components
        const entity = entityManager.createEntity();
        entity.addComponent(new PositionComponent(10, 20));
        entity.addComponent(new TextComponent('Hello World'));
        entity.addComponent(new IsVisibleComponent(true));

        // Update the system
        guiRenderSystem.update(mockSimulation);

        // Verify console.log was called with the text
        expect(consoleSpy).toHaveBeenCalledWith('Hello World');
    });

    test('should not render text from invisible entities', () => {
        // Create an entity that is not visible
        const entity = entityManager.createEntity();
        entity.addComponent(new PositionComponent(10, 20));
        entity.addComponent(new TextComponent('Hidden Text'));
        entity.addComponent(new IsVisibleComponent(false));

        // Update the system
        guiRenderSystem.update(mockSimulation);

        // Verify console.log was not called
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('should not render entities missing required components', () => {
        // Create an entity with only some components
        const entity1 = entityManager.createEntity();
        entity1.addComponent(new TextComponent('Missing Position'));
        entity1.addComponent(new IsVisibleComponent(true));

        const entity2 = entityManager.createEntity();
        entity2.addComponent(new PositionComponent(5, 15));
        entity2.addComponent(new IsVisibleComponent(true));

        // Update the system
        guiRenderSystem.update(mockSimulation);

        // Verify console.log was not called
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('should render multiple entities with required components', () => {
        // Create multiple entities
        const entity1 = entityManager.createEntity();
        entity1.addComponent(new PositionComponent(0, 0));
        entity1.addComponent(new TextComponent('First Text'));
        entity1.addComponent(new IsVisibleComponent(true));

        const entity2 = entityManager.createEntity();
        entity2.addComponent(new PositionComponent(10, 10));
        entity2.addComponent(new TextComponent('Second Text'));
        entity2.addComponent(new IsVisibleComponent(true));

        // Update the system
        guiRenderSystem.update(mockSimulation);

        // Verify both texts were rendered
        expect(consoleSpy).toHaveBeenCalledWith('First Text');
        expect(consoleSpy).toHaveBeenCalledWith('Second Text');
        expect(consoleSpy).toHaveBeenCalledTimes(2);
    });

    test('should clear console at the beginning of update', () => {
        // Update the system
        guiRenderSystem.update(mockSimulation);

        // Verify clearScreen was called
        expect(clearScreenSpy).toHaveBeenCalledTimes(1);
    });
});
