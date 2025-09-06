import { EntityManager } from '../../../src/ecs/EntityManager';
import { ScreenBufferTextUpdateSystem } from '../../../src/gui/rendering/ScreenBufferTextUpdateSystem';
import { PositionComponent } from '../../../src/gui/rendering/PositionComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { ScreenBufferComponent } from '../../../src/gui/rendering/ScreenBufferComponent';

describe('ScreenBufferTextUpdateSystem Integration Tests', () => {
    let entityManager;
    let system;
    let screenBufferEntity;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = ScreenBufferTextUpdateSystem.create(entityManager);
        
        // Create screen buffer entity (acts as singleton)
        screenBufferEntity = entityManager.createEntity();
        const screenBuffer = new ScreenBufferComponent();
        screenBufferEntity.addComponent(screenBuffer);
    });

    test('should integrate with real components to render single line text', () => {
        // Create text entity with real components
        const textEntity = entityManager.createEntity();
        textEntity.addComponent(new PositionComponent(5, 2));
        textEntity.addComponent(new TextComponent('Hello World'));
        textEntity.addComponent(IsVisibleComponent.create(true));

        // Process the system with all entities
        system.update();

        // Verify integration worked through the actual screen buffer
        const screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        expect(screenBuffer.getRow(2).substring(5, 16)).toBe('Hello World');
    });

    test('should integrate with real components to render multi-line text', () => {
        // Create text entity with multi-line content
        const textEntity = entityManager.createEntity();
        textEntity.addComponent(new PositionComponent(0, 0));
        textEntity.addComponent(new TextComponent('Line 1\nLine 2\nLine 3'));
        textEntity.addComponent(IsVisibleComponent.create(true));

        // Process the system
        system.update();

        // Verify each line rendered correctly
        const screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        expect(screenBuffer.getRow(0).substring(0, 6)).toBe('Line 1');
        expect(screenBuffer.getRow(1).substring(0, 6)).toBe('Line 2');
        expect(screenBuffer.getRow(2).substring(0, 6)).toBe('Line 3');
    });

    test('should integrate with multiple text entities without conflicts', () => {
        // Create multiple text entities at different positions
        const entity1 = entityManager.createEntity();
        entity1.addComponent(new PositionComponent(0, 0));
        entity1.addComponent(new TextComponent('Top Left'));
        entity1.addComponent(IsVisibleComponent.create(true));

        const entity2 = entityManager.createEntity();
        entity2.addComponent(new PositionComponent(10, 5));
        entity2.addComponent(new TextComponent('Middle'));
        entity2.addComponent(IsVisibleComponent.create(true));

        const entity3 = entityManager.createEntity();
        entity3.addComponent(new PositionComponent(70, 23));
        entity3.addComponent(new TextComponent('Bottom'));
        entity3.addComponent(IsVisibleComponent.create(true));

        // Process the system
        system.update();

        // Verify all entities rendered without interfering with each other
        const screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        expect(screenBuffer.getRow(0).substring(0, 8)).toBe('Top Left');
        expect(screenBuffer.getRow(5).substring(10, 16)).toBe('Middle');
        expect(screenBuffer.getRow(23).substring(70, 76)).toBe('Bottom');
    });

    test('should handle visibility changes in real workflow', () => {
        // Create text entity
        const textEntity = entityManager.createEntity();
        textEntity.addComponent(new PositionComponent(0, 0));
        textEntity.addComponent(new TextComponent('Visible Text'));
        const visibilityComponent = IsVisibleComponent.create(true);
        textEntity.addComponent(visibilityComponent);

        // First update - should render
        system.update();
        let screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        expect(screenBuffer.getRow(0).substring(0, 12)).toBe('Visible Text');

        // Clear buffer and make invisible
        screenBufferEntity.removeComponent(ScreenBufferComponent);
        screenBufferEntity.addComponent(new ScreenBufferComponent());
        visibilityComponent.setVisibility(false);

        // Second update - should not render
        system.update();
        screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        expect(screenBuffer.getRow(0).substring(0, 12)).toBe('.'.repeat(12));
    });

    test('should handle real header scenario that caused the original bug', () => {
        // Simulate the header entity that was causing character-by-character rendering
        const headerEntity = entityManager.createEntity();
        headerEntity.addComponent(new PositionComponent(0, 0));
        headerEntity.addComponent(new TextComponent('Year: 0003 | Simulation: Running | Herodotus 1.0.0'));
        headerEntity.addComponent(IsVisibleComponent.create(true));

        // Process the system
        system.update();

        // Verify the header renders as a single line, not character by character
        const screenBuffer = screenBufferEntity.getComponent(ScreenBufferComponent);
        const headerText = 'Year: 0003 | Simulation: Running | Herodotus 1.0.0';
        expect(screenBuffer.getRow(0).substring(0, headerText.length)).toBe(headerText);
        
        // Verify no header content leaked to subsequent lines (this was the bug)
        expect(screenBuffer.getRow(1).substring(0, 10)).toBe('.'.repeat(10));
        expect(screenBuffer.getRow(2).substring(0, 10)).toBe('.'.repeat(10));
    });
});
