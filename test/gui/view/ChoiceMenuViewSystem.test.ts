import { EntityManager } from '../../../src/ecs/EntityManager';
import { ChoiceMenuViewSystem as ChoiceMenuSystem } from '../../../src/gui/view/ChoiceMenuViewSystem';
import { ScrollableMenuComponent } from '../../../src/gui/menu/ScrollableMenuComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { PlayerComponent } from '../../../src/ecs/PlayerComponent';
import { DilemmaComponent } from '../../../src/behaviour/DilemmaComponent';
import { DataSetEvent } from '../../../src/data/DataSetEvent';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('ChoiceMenuViewSystem', () => {
    let guiEntityManager: EntityManager;
    let simulationEntityManager: EntityManager;
    let system: ChoiceMenuSystem;

    beforeEach(() => {
        guiEntityManager = EntityManager.create();
        simulationEntityManager = EntityManager.create();
        system = ChoiceMenuSystem.create(guiEntityManager, simulationEntityManager);
    });

    function createTestDataSetEvent(name: string, description?: string): DataSetEvent {
        return new DataSetEvent({
            "Event Name": name,
            "Description": description || "",
            "Event Type": "Test",
            "Event Trigger": "Test Trigger",
            "Event Consequence": "Test Consequence",
            "Heading": "Test Heading",
            "Place": "Test Place",
            "Primary Actor": "Test Actor",
            "Secondary Actor": "Test Secondary",
            "Motive": "Test Motive",
            "Consequence": "Test Result",
            "Tags": "test"
        });
    }

    test('populates menu from player dilemma choices', () => {
        // Create GUI entity with scrollable menu
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(new NameComponent('ChoicesScreen'));
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        // Create simulation player with dilemma choices
        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        
        const choices = [
            createTestDataSetEvent("Economic Reform", "Reform the kingdom's economy"),
            createTestDataSetEvent("Military Campaign", "Launch a military expedition"),
            createTestDataSetEvent("Diplomatic Mission", "Send diplomatic envoys")
        ];
        playerEntity.addComponent(new DilemmaComponent(choices));

        // Run system
        system.update();

        // Check that menu was populated
        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu).toBeDefined();
        
        const menuItems = menu!.getItems();
        expect(menuItems).toHaveLength(3);
        
        expect(menuItems[0].getText()).toBe("Economic Reform - Reform the kingdom's economy");
        expect(menuItems[0].getActionID()).toBe("CHOICE_SELECT_0");
        expect(menuItems[0].getHotkey()).toBe("1");
        
        expect(menuItems[1].getText()).toBe("Military Campaign - Launch a military expedition");
        expect(menuItems[1].getActionID()).toBe("CHOICE_SELECT_1");
        expect(menuItems[1].getHotkey()).toBe("2");
        
        expect(menuItems[2].getText()).toBe("Diplomatic Mission - Send diplomatic envoys");
        expect(menuItems[2].getActionID()).toBe("CHOICE_SELECT_2");
        expect(menuItems[2].getHotkey()).toBe("3");
    });

    test('handles no player entity gracefully', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([/* some initial items */], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        // No player entity in simulation
        system.update();

        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu!.getItems()).toHaveLength(0);
    });

    test('handles player without dilemma component', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([/* some initial items */], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        // Create player without DilemmaComponent
        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());

        system.update();

        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu!.getItems()).toHaveLength(0);
    });

    test('handles empty dilemma choices', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([/* some initial items */], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        playerEntity.addComponent(new DilemmaComponent([])); // Empty choices

        system.update();

        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu!.getItems()).toHaveLength(0);
    });

    test('does not update invisible menu entities', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        const initialItems = [new MenuItem('Initial', 'initial')];
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create(initialItems, 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(false)); // Not visible

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        const choices = [createTestDataSetEvent("Should not appear")];
        playerEntity.addComponent(new DilemmaComponent(choices));

        system.update();

        // Menu should remain unchanged
        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu!.getItems()).toHaveLength(1);
        expect(menu!.getItems()[0].getText()).toBe('Initial');
    });

    test('formats choice text correctly', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        
        const choices = [
            createTestDataSetEvent("Short Name", "Short description"),
            createTestDataSetEvent("Name Only", ""), // Empty description
            createTestDataSetEvent("", "Description only"), // Empty name
            createTestDataSetEvent("Very Long Choice Name", "This is a very long description that should be truncated because it exceeds the maximum length limit for display in the menu interface")
        ];
        playerEntity.addComponent(new DilemmaComponent(choices));

        system.update();

        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        const menuItems = menu!.getItems();
        
        expect(menuItems[0].getText()).toBe("Short Name - Short description");
        expect(menuItems[1].getText()).toBe("Name Only"); // No description
        expect(menuItems[2].getText()).toBe("Unnamed Choice - Description only"); // Default name
        expect(menuItems[3].getText()).toContain("Very Long Choice Name");
        expect(menuItems[3].getText()).toContain("..."); // Should be truncated
        expect(menuItems[3].getText().length).toBeLessThan(150); // Should be reasonably short
    });

    test('preserves selection when items change', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        const initialItems = [
            new MenuItem('Choice A', 'CHOICE_SELECT_0', '1'),
            new MenuItem('Choice B', 'CHOICE_SELECT_1', '2')
        ];
        const menu = ScrollableMenuComponent.create(initialItems, 3);
        menu.setSelectedItemIndex(1); // Select second item
        choiceMenuEntity.addComponent(menu);
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        
        // Same choices, different text (simulating update)
        const choices = [
            createTestDataSetEvent("Updated Choice A"),
            createTestDataSetEvent("Updated Choice B")
        ];
        playerEntity.addComponent(new DilemmaComponent(choices));

        system.update();

        // Should preserve selection of second item
        expect(menu.getSelectedItemIndex()).toBe(1);
        expect(menu.getItems()[1].getActionID()).toBe('CHOICE_SELECT_1');
    });

    test('handles selection when item count changes', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        const initialItems = [
            new MenuItem('Choice A', 'CHOICE_SELECT_0', '1'),
            new MenuItem('Choice B', 'CHOICE_SELECT_1', '2'),
            new MenuItem('Choice C', 'CHOICE_SELECT_2', '3')
        ];
        const menu = ScrollableMenuComponent.create(initialItems, 3);
        menu.setSelectedItemIndex(2); // Select last item
        choiceMenuEntity.addComponent(menu);
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        
        // Fewer choices now
        const choices = [
            createTestDataSetEvent("New Choice A"),
            createTestDataSetEvent("New Choice B")
        ];
        playerEntity.addComponent(new DilemmaComponent(choices));

        system.update();

        // Should adjust selection to valid range
        expect(menu.getSelectedItemIndex()).toBe(1); // Last valid index
        expect(menu.getItems()).toHaveLength(2);
    });

    test('avoids unnecessary updates when items unchanged', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        const menu = ScrollableMenuComponent.create([], 3);
        choiceMenuEntity.addComponent(menu);
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        const playerEntity = simulationEntityManager.createEntity();
        playerEntity.addComponent(new PlayerComponent());
        const choices = [createTestDataSetEvent("Stable Choice")];
        playerEntity.addComponent(new DilemmaComponent(choices));

        // First update
        system.update();
        const firstUpdateItems = [...menu.getItems()];

        // Second update with same data
        system.update();
        const secondUpdateItems = menu.getItems();

        // Items should be structurally the same
        expect(secondUpdateItems).toHaveLength(firstUpdateItems.length);
        expect(secondUpdateItems[0].getText()).toBe(firstUpdateItems[0].getText());
        expect(secondUpdateItems[0].getActionID()).toBe(firstUpdateItems[0].getActionID());
    });

    test('handles multiple players by using first one', () => {
        const choiceMenuEntity = guiEntityManager.createEntity();
        choiceMenuEntity.addComponent(ScrollableMenuComponent.create([], 3));
        choiceMenuEntity.addComponent(IsVisibleComponent.create(true));

        // Create two players
        const player1 = simulationEntityManager.createEntity();
        player1.addComponent(new PlayerComponent());
        const choices1 = [createTestDataSetEvent("Player 1 Choice")];
        player1.addComponent(new DilemmaComponent(choices1));

        const player2 = simulationEntityManager.createEntity();
        player2.addComponent(new PlayerComponent());
        const choices2 = [createTestDataSetEvent("Player 2 Choice")];
        player2.addComponent(new DilemmaComponent(choices2));

        system.update();

        // Should use first player's choices
        const menu = choiceMenuEntity.getComponent(ScrollableMenuComponent);
        expect(menu!.getItems()).toHaveLength(1);
        expect(menu!.getItems()[0].getText()).toContain("Player 1 Choice");
    });
});
