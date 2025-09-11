import { EntityManager } from '../../../src/ecs/EntityManager';
import { InputComponent } from '../../../src/gui/view/InputComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { ScrollStrategy } from '../../../src/gui/menu/ScrollStrategy';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { InputSystem } from '../../../src/gui/view/InputSystem';
import { ActionQueueComponent } from '../../../src/gui/controller/ActionQueueComponent';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('InputSystem', () => {
  test('navigates up and down with wrap-around', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one'), new MenuItem('Two', 'two')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
  inputComp.setLastInput('d');
    system.update();
    const menu = menuEntity.getComponent(MenuComponent)!;
    expect(menu.getSelectedItemIndex()).toBe(1);

  inputComp.setLastInput('d');
    system.update();
    // wraps to 0
    expect(menu.getSelectedItemIndex()).toBe(0);

  inputComp.setLastInput('a');
    system.update();
    // wraps to last index
    expect(menu.getSelectedItemIndex()).toBe(1);
  });

  test('enter triggers action queue with selected action id', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'ACTION_ONE')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
  inputComp.setLastInput('enter');
    system.update();

    expect(actionQueue.getActions()).toContain('ACTION_ONE');
  });

  test('does nothing when no visible menu exists', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(false)); // Not visible

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
  inputComp.setLastInput('enter');
    const initialSelectedIndex = menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex();
    
    system.update();

    // Menu should remain unchanged and no action should be queued
    expect(menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex()).toBe(initialSelectedIndex);
    expect(actionQueue.getActions()).toHaveLength(0);
  });

  test('does nothing when no input exists', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);

    // No input set
    const initialSelectedIndex = menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex();
    
    system.update();

    // Menu should remain unchanged and no action should be queued
    expect(menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex()).toBe(initialSelectedIndex);
    expect(actionQueue.getActions()).toHaveLength(0);
  });

  test('handles unknown input gracefully', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
  inputComp.setLastInput('unknown');
    const initialSelectedIndex = menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex();
    
    system.update();

    // Menu should remain unchanged and no action should be queued
    expect(menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex()).toBe(initialSelectedIndex);
    expect(actionQueue.getActions()).toHaveLength(0);
  });

  test('does nothing when action queue is missing', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'ACTION_ONE')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    // No action queue entity created
    const system = new InputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
  inputComp.setLastInput('enter');
    
    expect(() => {
      system.update();
    }).not.toThrow();
  });

  test('handles menu with single item', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('Single Item', 'SINGLE_ACTION')];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;
    const menu = menuEntity.getComponent(MenuComponent)!;

    // Test down/up navigation on single item (should do nothing)
  inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);

  inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);

    // Test enter on single item
    inputComp.setLastInput('enter');
    system.update();
    expect(actionQueue.getActions()).toContain('SINGLE_ACTION');
  });

  test('handles menu with many items navigation', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('Item 1', 'ACTION_1'),
      new MenuItem('Item 2', 'ACTION_2'),
      new MenuItem('Item 3', 'ACTION_3'),
      new MenuItem('Item 4', 'ACTION_4'),
      new MenuItem('Item 5', 'ACTION_5')
    ];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;
    const menu = menuEntity.getComponent(MenuComponent)!;

    // Navigate through all items down
    expect(menu.getSelectedItemIndex()).toBe(0); // Start at first item
    for (let i = 0; i < items.length; i++) {
      inputComp.setLastInput('d');
      system.update();
      expect(menu.getSelectedItemIndex()).toBe((i + 1) % items.length);
    }
    // Should wrap to first item
    expect(menu.getSelectedItemIndex()).toBe(0);

    // Navigate left/up to last item
    inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(items.length - 1);
  });

  test('handles rapid input changes', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('Item 1', 'ACTION_1'),
      new MenuItem('Item 2', 'ACTION_2'),
      new MenuItem('Item 3', 'ACTION_3')
    ];
    menuEntity.addComponent(new MenuComponent(items));
  menuEntity.addComponent(new TextComponent(''));
  menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;
    const menu = menuEntity.getComponent(MenuComponent)!;

    // Check initial state
    expect(menu.getSelectedItemIndex()).toBe(0);

    // Step-by-step navigation to debug the logic
  inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1); // After first down

  inputComp.setLastInput('d');
    system.update(); 
    expect(menu.getSelectedItemIndex()).toBe(2); // After second down

  inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1); // After up - should be back to index 1

    inputComp.setLastInput('enter');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1); // Should still be at index 1 after enter
    expect(actionQueue.getActions()).toContain('ACTION_2'); // Should queue ACTION_2
  });

  test('preserves menu state when no visible menus', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('Item 1', 'ACTION_1'),
      new MenuItem('Item 2', 'ACTION_2')
    ];
    const menu = new MenuComponent(items);
    menu.setSelectedItemIndex(1); // Set to second item
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(new IsVisibleComponent(false)); // Not visible

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

  inputComp.setLastInput('d');
    system.update();

    // Menu state should remain unchanged
    expect(menu.getSelectedItemIndex()).toBe(1);
    expect(actionQueue.getActions()).toHaveLength(0);
  });

  test('handles empty input gracefully', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('Item', 'ACTION')];
    menuEntity.addComponent(new MenuComponent(items));
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(new IsVisibleComponent(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    // Set empty input
    inputComp.setLastInput('');
    const initialState = menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex();
    
    system.update();

    // Nothing should change
    expect(menuEntity.getComponent(MenuComponent)!.getSelectedItemIndex()).toBe(initialState);
    expect(actionQueue.getActions()).toHaveLength(0);
  });
});

describe('InputSystem with scroll strategies', () => {
  test('navigates vertically with VERTICAL scroll strategy using w/s keys', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('One', 'one'), 
      new MenuItem('Two', 'two'), 
      new MenuItem('Three', 'three')
    ];
    const menu = new MenuComponent(items, ScrollStrategy.VERTICAL);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    // Test 's' (down) navigation
    inputComp.setLastInput('s');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1);

    inputComp.setLastInput('s');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(2);

    inputComp.setLastInput('s');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0); // wrap around

    // Test 'w' (up) navigation
    inputComp.setLastInput('w');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(2); // wrap to last
  });

  test('navigates vertically with VERTICAL scroll strategy using arrow keys', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('One', 'one'), 
      new MenuItem('Two', 'two')
    ];
    const menu = new MenuComponent(items, ScrollStrategy.VERTICAL);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    // Test 'down' arrow navigation
    inputComp.setLastInput('down');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1);

    // Test 'up' arrow navigation
    inputComp.setLastInput('up');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);
  });

  test('does not respond to horizontal keys with VERTICAL scroll strategy', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one'), new MenuItem('Two', 'two')];
    const menu = new MenuComponent(items, ScrollStrategy.VERTICAL);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    const initialIndex = menu.getSelectedItemIndex();

    // Test that horizontal keys don't work
    inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('left');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('right');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);
  });

  test('navigates horizontally with HORIZONTAL scroll strategy (default behavior)', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [
      new MenuItem('One', 'one'), 
      new MenuItem('Two', 'two'), 
      new MenuItem('Three', 'three')
    ];
    const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    // Test 'd' (right) navigation
    inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1);

    inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(2);

    inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0); // wrap around

    // Test 'a' (left) navigation
    inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(2); // wrap to last
  });

  test('does not respond to vertical keys with HORIZONTAL scroll strategy', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one'), new MenuItem('Two', 'two')];
    const menu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    const initialIndex = menu.getSelectedItemIndex();

    // Test that vertical keys don't work
    inputComp.setLastInput('w');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('s');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('up');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);

    inputComp.setLastInput('down');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(initialIndex);
  });

  test('enter key works with both scroll strategies', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    // Test VERTICAL strategy
    const verticalMenuEntity = em.createEntity();
    const verticalItems = [new MenuItem('Vertical Item', 'VERTICAL_ACTION')];
    verticalMenuEntity.addComponent(new MenuComponent(verticalItems, ScrollStrategy.VERTICAL));
    verticalMenuEntity.addComponent(new TextComponent(''));
    verticalMenuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    const actionQueue = new ActionQueueComponent();
    actionQueueEntity.addComponent(actionQueue);

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    inputComp.setLastInput('enter');
    system.update();
    expect(actionQueue.getActions()).toContain('VERTICAL_ACTION');

    // Clear the action queue and test HORIZONTAL strategy
    actionQueue.getActions().length = 0;
    
    // Hide vertical menu and show horizontal menu
    verticalMenuEntity.getComponent(IsVisibleComponent)!.setVisibility(false);
    
    const horizontalMenuEntity = em.createEntity();
    const horizontalItems = [new MenuItem('Horizontal Item', 'HORIZONTAL_ACTION')];
    horizontalMenuEntity.addComponent(new MenuComponent(horizontalItems, ScrollStrategy.HORIZONTAL));
    horizontalMenuEntity.addComponent(new TextComponent(''));
    horizontalMenuEntity.addComponent(IsVisibleComponent.create(true));

    inputComp.setLastInput('enter');
    system.update();
    expect(actionQueue.getActions()).toContain('HORIZONTAL_ACTION');
  });

  test('backward compatibility: menu without scroll strategy defaults to HORIZONTAL', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'one'), new MenuItem('Two', 'two')];
    // Create menu without specifying scroll strategy
    const menu = new MenuComponent(items);
    menuEntity.addComponent(menu);
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(IsVisibleComponent.create(true));

    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new InputSystem(em);
    const inputComp = em.getSingletonComponent(InputComponent)!;

    // Should behave like horizontal navigation (existing behavior)
    inputComp.setLastInput('d');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(1);

    inputComp.setLastInput('a');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);

    // Vertical keys should not work
    inputComp.setLastInput('w');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);

    inputComp.setLastInput('s');
    system.update();
    expect(menu.getSelectedItemIndex()).toBe(0);
  });
});
