import { EntityManager } from '../../../src/ecs/EntityManager';
import { InputComponent } from '../../../src/gui/menu/InputComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { MenuInputSystem } from '../../../src/gui/menu/MenuInputSystem';
import { ActionQueueComponent } from '../../../src/gui/menu/ActionQueueComponent';
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
    menuEntity.addComponent(new IsVisibleComponent(true));

    // Create action queue entity
    const actionQueueEntity = em.createEntity();
    actionQueueEntity.addComponent(new NameComponent('ActionQueue'));
    actionQueueEntity.addComponent(new ActionQueueComponent());

    const system = new MenuInputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
    inputComp.setLastInput('s');
    system.update();
    const menu = menuEntity.getComponent(MenuComponent)!;
    expect(menu.getSelectedItemIndex()).toBe(1);

    inputComp.setLastInput('s');
    system.update();
    // wraps to 0
    expect(menu.getSelectedItemIndex()).toBe(0);

    inputComp.setLastInput('w');
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
    menuEntity.addComponent(new IsVisibleComponent(true));

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
    menuEntity.addComponent(new IsVisibleComponent(false)); // Not visible

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
    menuEntity.addComponent(new IsVisibleComponent(true));

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
    menuEntity.addComponent(new IsVisibleComponent(true));

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
    menuEntity.addComponent(new IsVisibleComponent(true));

    // No action queue entity created
    const system = new MenuInputSystem(em);

    const inputComp = em.getSingletonComponent(InputComponent)!;
    inputComp.setLastInput('enter');
    
    expect(() => {
      system.update();
    }).not.toThrow();
  });
});
