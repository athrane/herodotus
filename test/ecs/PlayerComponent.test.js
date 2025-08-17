import { PlayerComponent } from '../../src/ecs/PlayerComponent';
import { Component } from '../../src/ecs/Component';

describe('PlayerComponent', () => {
    describe('constructor', () => {
        test('should create PlayerComponent instance', () => {
            const playerComponent = new PlayerComponent();
            expect(playerComponent).toBeInstanceOf(PlayerComponent);
            expect(playerComponent).toBeInstanceOf(Component);
        });

        test('should be a marker component with no additional properties', () => {
            const playerComponent = new PlayerComponent();
            
            // Should have no own properties - it's a pure marker component
            const ownProperties = Object.getOwnPropertyNames(playerComponent);
            expect(ownProperties).toEqual([]);
        });
    });

    describe('create factory method', () => {
        test('should create PlayerComponent instance using factory method', () => {
            const playerComponent = PlayerComponent.create();
            expect(playerComponent).toBeInstanceOf(PlayerComponent);
            expect(playerComponent).toBeInstanceOf(Component);
        });

        test('should create new instances each time', () => {
            const component1 = PlayerComponent.create();
            const component2 = PlayerComponent.create();
            
            expect(component1).not.toBe(component2);
            expect(component1).toBeInstanceOf(PlayerComponent);
            expect(component2).toBeInstanceOf(PlayerComponent);
        });
    });

    describe('marker component behavior', () => {
        test('should function as a simple marker component', () => {
            const playerComponent = new PlayerComponent();
            
            // Should be a pure marker with no own properties
            expect(Object.getOwnPropertyNames(playerComponent)).toEqual([]);
            expect(playerComponent).toBeInstanceOf(Component);
        });

        test('should be distinguishable from other components', () => {
            const playerComponent = new PlayerComponent();
            const genericComponent = new Component();
            
            expect(playerComponent).toBeInstanceOf(PlayerComponent);
            expect(genericComponent).not.toBeInstanceOf(PlayerComponent);
        });
    });
});
