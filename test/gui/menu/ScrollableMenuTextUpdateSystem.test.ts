import { EntityManager } from '../../../src/ecs/EntityManager';
import { ScrollableMenuTextUpdateSystem } from '../../../src/gui/menu/ScrollableMenuTextUpdateSystem';
import { ScrollableMenuComponent } from '../../../src/gui/menu/ScrollableMenuComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('ScrollableMenuTextUpdateSystem', () => {
    let entityManager: EntityManager;
    let system: ScrollableMenuTextUpdateSystem;

    beforeEach(() => {
        entityManager = EntityManager.create();
        system = ScrollableMenuTextUpdateSystem.create(entityManager);
    });

    test('updates text for visible scrollable menu', () => {
        const entity = entityManager.createEntity();
        const items = [
            new MenuItem('First Choice - A difficult decision', 'choice1', '1'),
            new MenuItem('Second Choice - Another option', 'choice2', '2'),
            new MenuItem('Third Choice - The final path', 'choice3', '3')
        ];
        
        entity.addComponent(new NameComponent('ChoicesScreen'));
        entity.addComponent(new ScrollableMenuComponent(items, 3));
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        system.update();

        const textComp = entity.getComponent(TextComponent);
        expect(textComp).toBeDefined();
        
        const text = textComp!.getText();
    // Header may include an availability suffix, so check the base phrase only
    expect(text).toContain('*** CHOOSE YOUR ACTION');
        expect(text).toContain('> [1] First Choice - A difficult decision');
        expect(text).toContain('  [2] Second Choice - Another option');
        expect(text).toContain('  [3] Third Choice - The final path');
        expect(text).toContain('Navigate: A/D keys, Select: Enter');
    });

    test('shows scroll indicators when needed', () => {
        const entity = entityManager.createEntity();
        const items = [
            new MenuItem('Choice 1', 'choice1', '1'),
            new MenuItem('Choice 2', 'choice2', '2'),
            new MenuItem('Choice 3', 'choice3', '3'),
            new MenuItem('Choice 4', 'choice4', '4'),
            new MenuItem('Choice 5', 'choice5', '5')
        ];
        
        const menu = new ScrollableMenuComponent(items, 3);
        entity.addComponent(new NameComponent('ChoicesScreen'));
        entity.addComponent(menu);
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        // Initially at top - should show scroll down indicator
        system.update();
        let text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('(Showing 1-3 of 5)');
        expect(text).toContain('↓ More below');
        expect(text).not.toContain('↑ More above');

        // Move to middle - should show both scroll indicators
        menu.setSelectedItemIndex(3);
        system.update();
        text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('(Showing 2-4 of 5)');
        expect(text).toContain('↓ More below');
        expect(text).toContain('↑ More above');

        // Move to bottom - should show scroll up indicator
        menu.setSelectedItemIndex(4);
        system.update();
        text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('(Showing 3-5 of 5)');
        expect(text).toContain('↑ More above');
        expect(text).not.toContain('↓ More below');
    });

    test('handles empty menu gracefully', () => {
        const entity = entityManager.createEntity();
        entity.addComponent(new ScrollableMenuComponent([], 3));
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        system.update();

        const textComp = entity.getComponent(TextComponent);
        expect(textComp!.getText()).toBe('No choices available');
    });

    test('does not update invisible menus', () => {
        const entity = entityManager.createEntity();
        const items = [new MenuItem('Choice 1', 'choice1', '1')];
        
        entity.addComponent(new ScrollableMenuComponent(items, 3));
        entity.addComponent(new TextComponent('initial'));
        entity.addComponent(new IsVisibleComponent(false));

        system.update();

        const textComp = entity.getComponent(TextComponent);
        expect(textComp!.getText()).toBe('');
    });

    test('does not update entities missing components', () => {
        // Entity with missing TextComponent
        const entity1 = entityManager.createEntity();
        entity1.addComponent(new ScrollableMenuComponent([new MenuItem('Test', 'test')], 3));
        entity1.addComponent(new IsVisibleComponent(true));
        // No TextComponent

        // Entity with missing IsVisibleComponent
        const entity2 = entityManager.createEntity();
        entity2.addComponent(new ScrollableMenuComponent([new MenuItem('Test', 'test')], 3));
        entity2.addComponent(new TextComponent(''));
        // No IsVisibleComponent

        // Entity with missing ScrollableMenuComponent
        const entity3 = entityManager.createEntity();
        entity3.addComponent(new TextComponent(''));
        entity3.addComponent(new IsVisibleComponent(true));
        // No ScrollableMenuComponent

        // Should not throw errors
        expect(() => system.update()).not.toThrow();
    });

    test('highlights selected item correctly', () => {
        const entity = entityManager.createEntity();
        const items = [
            new MenuItem('First', 'first', '1'),
            new MenuItem('Second', 'second', '2'),
            new MenuItem('Third', 'third', '3')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        entity.addComponent(menu);
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        // Test different selections
        menu.setSelectedItemIndex(0);
        system.update();
        let text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('> [1] First');
        expect(text).toContain('  [2] Second');

        menu.setSelectedItemIndex(1);
        system.update();
        text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('  [1] First');
        expect(text).toContain('> [2] Second');

        menu.setSelectedItemIndex(2);
        system.update();
        text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('  [2] Second');
        expect(text).toContain('> [3] Third');
    });

    test('formats menu with proper spacing and structure', () => {
        const entity = entityManager.createEntity();
        const items = [
            new MenuItem('Test Choice', 'test1', '1')
        ];
        
        entity.addComponent(new ScrollableMenuComponent(items, 3));
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        system.update();

        const text = entity.getComponent(TextComponent)!.getText();
        const lines = text.split('\n');
        
        // Should have header, empty line, choice line, empty line, footer
        expect(lines.length).toBeGreaterThan(3);
    // Header may include an availability suffix, so check the base phrase only
    expect(lines[0]).toContain('*** CHOOSE YOUR ACTION');
        expect(lines[1]).toBe(''); // Empty line after header
        expect(lines[2]).toContain('> [1] Test Choice');
        // Footer should be present
        expect(text).toContain('Navigate: A/D keys, Select: Enter');
    });

    test('handles very long choice text with proper display', () => {
        const entity = entityManager.createEntity();
        const longText = 'A'.repeat(100); // Very long choice name
        const items = [
            new MenuItem(longText, 'long', '1')
        ];
        
        entity.addComponent(new ScrollableMenuComponent(items, 3));
        entity.addComponent(new TextComponent(''));
        entity.addComponent(new IsVisibleComponent(true));

        system.update();

        const text = entity.getComponent(TextComponent)!.getText();
        expect(text).toContain('[1]');
        expect(text).toContain(longText); // Should display full text
    });
});
