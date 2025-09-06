import { ScreenBufferTextUpdateSystem } from '../../../src/gui/rendering/ScreenBufferTextUpdateSystem';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { Entity } from '../../../src/ecs/Entity';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { PositionComponent } from '../../../src/gui/rendering/PositionComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { ScreenBufferComponent } from '../../../src/gui/rendering/ScreenBufferComponent';

describe('ScreenBufferTextUpdateSystem', () => {
    let entityManager;
    let system;
    let screenBufferComponent;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = new ScreenBufferTextUpdateSystem(entityManager);
        
        // Create an entity with screen buffer component (this acts as singleton)
        const screenBufferEntity = entityManager.createEntity();
        screenBufferComponent = new ScreenBufferComponent();
        screenBufferEntity.addComponent(screenBufferComponent);
    });

    test('should render single line text correctly', () => {
        // Create an entity with text, position, and visibility components
        const entity = new Entity();
        const textComponent = new TextComponent('Hello World');
        const positionComponent = new PositionComponent(0, 0);
        const visibilityComponent = new IsVisibleComponent(true);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity
        system.processEntity(entity);
        
        // Check that the text was written to the screen buffer
        expect(screenBufferComponent.getRow(0).substring(0, 11)).toBe('Hello World');
    });

    test('should render multi-line text correctly', () => {
        // Create an entity with multi-line text
        const entity = new Entity();
        const textComponent = new TextComponent('Line 1\nLine 2\nLine 3');
        const positionComponent = new PositionComponent(0, 0);
        const visibilityComponent = new IsVisibleComponent(true);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity
        system.processEntity(entity);
        
        // Check that each line was written to the correct row
        expect(screenBufferComponent.getRow(0).substring(0, 6)).toBe('Line 1');
        expect(screenBufferComponent.getRow(1).substring(0, 6)).toBe('Line 2');
        expect(screenBufferComponent.getRow(2).substring(0, 6)).toBe('Line 3');
    });

    test('should render text at specified position', () => {
        // Create an entity with text at position (5, 10)
        const entity = new Entity();
        const textComponent = new TextComponent('Positioned Text');
        const positionComponent = new PositionComponent(10, 5); // x=10, y=5
        const visibilityComponent = new IsVisibleComponent(true);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity
        system.processEntity(entity);
        
        // Check that the text was written at the correct position
        expect(screenBufferComponent.getRow(5).substring(10, 25)).toBe('Positioned Text');
    });

    test('should not render invisible text', () => {
        // Create an entity with invisible text
        const entity = new Entity();
        const textComponent = new TextComponent('Invisible Text');
        const positionComponent = new PositionComponent(0, 0);
        const visibilityComponent = new IsVisibleComponent(false);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity
        system.processEntity(entity);
        
        // Check that the text was not written to the screen buffer
        expect(screenBufferComponent.getRow(0).substring(0, 14)).not.toBe('Invisible Text');
    });

    test('should skip entities without required components', () => {
        // Create entities missing various components
        const entityNoText = new Entity();
        entityNoText.addComponent(new PositionComponent(0, 0));
        entityNoText.addComponent(new IsVisibleComponent(true));
        
        const entityNoPosition = new Entity();
        entityNoPosition.addComponent(new TextComponent('Test'));
        entityNoPosition.addComponent(new IsVisibleComponent(true));
        
        const entityNoVisibility = new Entity();
        entityNoVisibility.addComponent(new TextComponent('Test'));
        entityNoVisibility.addComponent(new PositionComponent(0, 0));
        
        // Process entities - should not throw errors
        expect(() => {
            system.processEntity(entityNoText);
            system.processEntity(entityNoPosition);
            system.processEntity(entityNoVisibility);
        }).not.toThrow();
    });

    test('should handle empty text correctly', () => {
        // Create an entity with empty text
        const entity = new Entity();
        const textComponent = new TextComponent('');
        const positionComponent = new PositionComponent(0, 0);
        const visibilityComponent = new IsVisibleComponent(true);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity - should not throw
        expect(() => system.processEntity(entity)).not.toThrow();
    });

    test('should handle header-like text with special characters correctly', () => {
        // Test the specific case that was causing the bug
        const entity = new Entity();
        const headerText = 'Year: 0003 | Simulation: Running | Herodotus 1.0.0';
        const textComponent = new TextComponent(headerText);
        const positionComponent = new PositionComponent(0, 0);
        const visibilityComponent = new IsVisibleComponent(true);
        
        entity.addComponent(textComponent);
        entity.addComponent(positionComponent);
        entity.addComponent(visibilityComponent);
        
        // Process the entity
        system.processEntity(entity);
        
        // Check that the entire header is on one line, not character by character
        const renderedText = screenBufferComponent.getRow(0).substring(0, headerText.length);
        expect(renderedText).toBe(headerText);
        
        // Ensure no characters from the header are on subsequent lines (the bug was putting each char on a new line)
        expect(screenBufferComponent.getRow(1).substring(0, 10)).toBe('.'.repeat(10));  // Should be default buffer content
    });
});
