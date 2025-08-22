import { Ecs } from '../../src/ecs/Ecs';
import { EntityManager } from '../../src/ecs/EntityManager';
import { SystemManager } from '../../src/ecs/SystemManager';
import { System } from '../../src/ecs/System';
import { Component } from '../../src/ecs/Component';

// Mock system for testing
class MockSystem extends System {
    public updateCallCount = 0;

    constructor(entityManager: EntityManager, requiredComponents: Array<new (...args: any[]) => Component> = []) {
        super(entityManager, requiredComponents);
    }

    update(deltaTime: number): void {
        this.updateCallCount++;
    }
}

// Another mock system for testing
class AnotherMockSystem extends System {
    public updateCallCount = 0;

    constructor(entityManager: EntityManager, requiredComponents: Array<new (...args: any[]) => Component> = []) {
        super(entityManager, requiredComponents);
    }

    update(deltaTime: number): void {
        this.updateCallCount++;
    }
}

// Mock component for testing
class MockComponent extends Component {
    constructor(public value: number = 0) {
        super();
    }
}

describe('Ecs', () => {
    let ecs: Ecs;
    let mockSystem: MockSystem;
    let anotherMockSystem: AnotherMockSystem;

    beforeEach(() => {
        ecs = Ecs.create();
        mockSystem = new MockSystem(ecs.getEntityManager());
        anotherMockSystem = new AnotherMockSystem(ecs.getEntityManager());
    });

    describe('constructor', () => {
        it('should create an Ecs instance with default EntityManager', () => {
            const ecsInstance = new Ecs();
            
            expect(ecsInstance).toBeInstanceOf(Ecs);
            expect(ecsInstance.getEntityManager()).toBeInstanceOf(EntityManager);
            expect(ecsInstance.getSystemManager()).toBeInstanceOf(SystemManager);
        });

        it('should create an Ecs instance with custom EntityManager', () => {
            const customEntityManager = EntityManager.create();
            const ecsInstance = new Ecs(customEntityManager);
            
            expect(ecsInstance).toBeInstanceOf(Ecs);
            expect(ecsInstance.getEntityManager()).toBe(customEntityManager);
            expect(ecsInstance.getSystemManager()).toBeInstanceOf(SystemManager);
        });

        it('should create an Ecs instance using static factory method', () => {
            const ecsInstance = Ecs.create();
            
            expect(ecsInstance).toBeInstanceOf(Ecs);
            expect(ecsInstance.getEntityManager()).toBeInstanceOf(EntityManager);
            expect(ecsInstance.getSystemManager()).toBeInstanceOf(SystemManager);
        });

        it('should create an Ecs instance using static factory method with custom EntityManager', () => {
            const customEntityManager = EntityManager.create();
            const ecsInstance = Ecs.create(customEntityManager);
            
            expect(ecsInstance).toBeInstanceOf(Ecs);
            expect(ecsInstance.getEntityManager()).toBe(customEntityManager);
            expect(ecsInstance.getSystemManager()).toBeInstanceOf(SystemManager);
        });
    });

    describe('manager access', () => {
        it('should return the EntityManager instance', () => {
            const entityManager = ecs.getEntityManager();
            
            expect(entityManager).toBeInstanceOf(EntityManager);
        });

        it('should return the SystemManager instance', () => {
            const systemManager = ecs.getSystemManager();
            
            expect(systemManager).toBeInstanceOf(SystemManager);
        });
    });

    describe('system management', () => {
        it('should register a system', () => {
            expect(() => ecs.registerSystem(mockSystem)).not.toThrow();
            
            expect(ecs.hasSystem('MockSystem')).toBe(true);
            expect(ecs.hasSystemByClass(MockSystem)).toBe(true);
        });

        it('should throw error when registering duplicate system', () => {
            ecs.registerSystem(mockSystem);
            const duplicateSystem = new MockSystem(ecs.getEntityManager());
            
            expect(() => ecs.registerSystem(duplicateSystem)).toThrow("System 'MockSystem' is already registered.");
        });

        it('should throw error when registering invalid system', () => {
            expect(() => ecs.registerSystem(null as any)).toThrow();
            expect(() => ecs.registerSystem({} as any)).toThrow();
        });

        it('should retrieve registered system by name', () => {
            ecs.registerSystem(mockSystem);
            
            const retrievedSystem = ecs.getSystem('MockSystem');
            
            expect(retrievedSystem).toBe(mockSystem);
            expect(retrievedSystem).toBeInstanceOf(MockSystem);
        });

        it('should retrieve registered system by class', () => {
            ecs.registerSystem(mockSystem);
            
            const retrievedSystem = ecs.getSystemByClass(MockSystem);
            
            expect(retrievedSystem).toBe(mockSystem);
            expect(retrievedSystem).toBeInstanceOf(MockSystem);
        });

        it('should return undefined for non-existent system by name', () => {
            const retrievedSystem = ecs.getSystem('NonExistentSystem');
            
            expect(retrievedSystem).toBeUndefined();
        });

        it('should return undefined for non-existent system by class', () => {
            const retrievedSystem = ecs.getSystemByClass(MockSystem);
            
            expect(retrievedSystem).toBeUndefined();
        });

        it('should check if system exists by name', () => {
            expect(ecs.hasSystem('MockSystem')).toBe(false);
            
            ecs.registerSystem(mockSystem);
            expect(ecs.hasSystem('MockSystem')).toBe(true);
        });

        it('should check if system exists by class', () => {
            expect(ecs.hasSystemByClass(MockSystem)).toBe(false);
            
            ecs.registerSystem(mockSystem);
            expect(ecs.hasSystemByClass(MockSystem)).toBe(true);
        });

        it('should unregister system by name', () => {
            ecs.registerSystem(mockSystem);
            expect(ecs.hasSystemByClass(MockSystem)).toBe(true);
            
            ecs.unregisterSystem('MockSystem');
            expect(ecs.hasSystemByClass(MockSystem)).toBe(false);
        });

        it('should unregister system by class', () => {
            ecs.registerSystem(mockSystem);
            expect(ecs.hasSystemByClass(MockSystem)).toBe(true);
            
            ecs.unregisterSystemByClass(MockSystem);
            expect(ecs.hasSystemByClass(MockSystem)).toBe(false);
        });

        it('should throw error when unregistering non-existent system by name', () => {
            expect(() => ecs.unregisterSystem('NonExistentSystem')).toThrow("System 'NonExistentSystem' is not registered.");
        });

        it('should throw error when unregistering non-existent system by class', () => {
            expect(() => ecs.unregisterSystemByClass(MockSystem)).toThrow("System 'MockSystem' is not registered.");
        });
    });

    describe('system updates', () => {
        it('should update all registered systems', () => {
            ecs.registerSystem(mockSystem);
            ecs.registerSystem(anotherMockSystem);
            
            ecs.update(0.016);
            
            expect(mockSystem.updateCallCount).toBe(1);
            expect(anotherMockSystem.updateCallCount).toBe(1);
        });

        it('should update systems multiple times', () => {
            ecs.registerSystem(mockSystem);
            ecs.registerSystem(anotherMockSystem);
            
            ecs.update(0.016);
            ecs.update(0.016);
            ecs.update(0.016);
            
            expect(mockSystem.updateCallCount).toBe(3);
            expect(anotherMockSystem.updateCallCount).toBe(3);
        });

        it('should not throw when updating with no systems', () => {
            expect(() => ecs.update(0.016)).not.toThrow();
        });
    });

    describe('utility methods', () => {
        it('should return entity count', () => {
            expect(ecs.getEntityCount()).toBe(0);
            
            ecs.getEntityManager().createEntity();
            expect(ecs.getEntityCount()).toBe(1);
            
            ecs.getEntityManager().createEntity();
            expect(ecs.getEntityCount()).toBe(2);
        });

        it('should get all entities', () => {
            const entities = ecs.getAllEntities();
            expect(entities).toEqual([]);
            expect(Array.isArray(entities)).toBe(true);
        });

        it('should clear all entities', () => {
            ecs.getEntityManager().createEntity();
            ecs.getEntityManager().createEntity();
            expect(ecs.getEntityCount()).toBe(2);
            
            ecs.clearEntities();
            expect(ecs.getEntityCount()).toBe(0);
        });

        it('should return string representation', () => {
            ecs.registerSystem(mockSystem);
            ecs.getEntityManager().createEntity();
            
            const stringRep = ecs.toString();
            expect(stringRep).toContain('Ecs');
            expect(stringRep).toContain('Entities: 1');
            expect(stringRep).toContain('Systems: 1');
        });
    });

    describe('type safety', () => {
        it('should maintain type safety when retrieving systems by class', () => {
            ecs.registerSystem(mockSystem);
            
            const retrievedSystem = ecs.getSystemByClass(MockSystem);
            
            expect(retrievedSystem).toBeInstanceOf(MockSystem);
            if (retrievedSystem) {
                expect(retrievedSystem.updateCallCount).toBe(0);
            }
        });

        it('should handle multiple system types correctly', () => {
            ecs.registerSystem(mockSystem);
            ecs.registerSystem(anotherMockSystem);
            
            const mockSystemRetrieved = ecs.getSystemByClass(MockSystem);
            const anotherMockSystemRetrieved = ecs.getSystemByClass(AnotherMockSystem);
            
            expect(mockSystemRetrieved).toBe(mockSystem);
            expect(anotherMockSystemRetrieved).toBe(anotherMockSystem);
            expect(mockSystemRetrieved).not.toBe(anotherMockSystemRetrieved);
        });
    });
});
