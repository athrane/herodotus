import { EntityManager } from '../../../src/ecs/EntityManager';
import { InputComponent } from '../../../src/gui/menu/InputComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { MenuInputSystem } from '../../../src/gui/menu/MenuInputSystem';
import { ActionQueueComponent } from '../../../src/gui/controller/ActionQueueComponent';
import { NameComponent } from '../../../src/ecs/NameComponent';

describe('MenuInputSystem', () => {
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

    const system = new MenuInputSystem(em);

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

    const system = new MenuInputSystem(em);

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

    const system = new MenuInputSystem(em);

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

    const system = new MenuInputSystem(em);

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

    const system = new MenuInputSystem(em);

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
    const system = new MenuInputSystem(em);

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

    const system = new MenuInputSystem(em);
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

    const system = new MenuInputSystem(em);
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

    const system = new MenuInputSystem(em);
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

    const system = new MenuInputSystem(em);
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

    const system = new MenuInputSystem(em);
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
