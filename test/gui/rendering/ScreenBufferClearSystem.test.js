import { EntityManager } from '../../../src/ecs/EntityManager';
import { ScreenBufferClearSystem } from '../../../src/gui/rendering/ScreenBufferClearSystem';
import { ScreenBufferComponent } from '../../../src/gui/rendering/ScreenBufferComponent';
import { Entity } from '../../../src/ecs/Entity';

describe('ScreenBufferClearSystem', () => {
    let entityManager;
    let system;
    let screenBufferComponent;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = new ScreenBufferClearSystem(entityManager);
        
        // Create an entity with screen buffer component (this acts as singleton)
        const screenBufferEntity = entityManager.createEntity();
        screenBufferComponent = new ScreenBufferComponent();
        screenBufferEntity.addComponent(screenBufferComponent);
    });

    test('should clear screen buffer when processing entity', () => {
        // Add some content to the buffer first
        screenBufferComponent.writeAt(0, 0, 'Test content');
        expect(screenBufferComponent.getRow(0).substring(0, 12)).toBe('Test content');

        // Create an entity with ScreenBufferComponent (the singleton entity)
        const entities = entityManager.getEntitiesWithComponents(ScreenBufferComponent);
        expect(entities).toHaveLength(1);
        
        // Process the entity
        system.processEntity(entities[0]);
        
        // Check that the buffer was cleared
        expect(screenBufferComponent.getRow(0).substring(0, 12)).toBe(' '.repeat(12));
    });

    test('should only clear buffer once per frame', () => {
        // Add some content to the buffer
        screenBufferComponent.writeAt(0, 0, 'Test content');
        
        // Mock the clear method to count calls
        const clearSpy = jest.spyOn(screenBufferComponent, 'clear');
        
        // Get the screen buffer entity
        const entities = entityManager.getEntitiesWithComponents(ScreenBufferComponent);
        const screenBufferEntity = entities[0];
        
        // Process the entity multiple times in the same frame
        system.processEntity(screenBufferEntity);
        system.processEntity(screenBufferEntity);
        system.processEntity(screenBufferEntity);
        
        // Clear should only be called once
        expect(clearSpy).toHaveBeenCalledTimes(1);
        
        clearSpy.mockRestore();
    });

    test('should reset clear flag on update for next frame', () => {
        // Get the screen buffer entity
        const entities = entityManager.getEntitiesWithComponents(ScreenBufferComponent);
        const screenBufferEntity = entities[0];
        
        // Mock the clear method to count calls
        const clearSpy = jest.spyOn(screenBufferComponent, 'clear');
        
        // Process entity in first frame
        system.processEntity(screenBufferEntity);
        expect(clearSpy).toHaveBeenCalledTimes(1);
        
        // Process entity again in same frame - should not clear again
        system.processEntity(screenBufferEntity);
        expect(clearSpy).toHaveBeenCalledTimes(1);
        
        // Simulate next frame by calling update
        system.update(16.67); // 60 FPS delta time
        
        // Process entity in new frame - should clear again
        system.processEntity(screenBufferEntity);
        expect(clearSpy).toHaveBeenCalledTimes(2);
        
        clearSpy.mockRestore();
    });

    test('should handle entities without ScreenBufferComponent gracefully', () => {
        // Create entity without ScreenBufferComponent
        const entity = new Entity();
        
        // This should not throw an error
        expect(() => {
            system.processEntity(entity);
        }).not.toThrow();
    });

    test('should return correct component types', () => {
        const componentTypes = system.getComponentTypes();
        expect(componentTypes).toEqual([ScreenBufferComponent]);
    });

    test('should create system instance via static factory method', () => {
        const createdSystem = ScreenBufferClearSystem.create(entityManager);
        expect(createdSystem).toBeInstanceOf(ScreenBufferClearSystem);
    });
});
