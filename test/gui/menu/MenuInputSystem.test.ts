import { EntityManager } from '../../../src/ecs/EntityManager';
import { InputComponent } from '../../../src/gui/menu/InputComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { MenuInputSystem } from '../../../src/gui/menu/MenuInputSystem';
import { ActionSystem } from '../../../src/gui/menu/ActionSystem';
import { GuiEcsManager } from '../../../src/gui/GuiEcsManager';

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

    const fakeGui = {
      setActiveScreen: () => {},
      stop: () => {}
    } as unknown as GuiEcsManager;
    // Make the fake GUI manager pass the instanceof check
     
    Object.setPrototypeOf(fakeGui as any, (GuiEcsManager as any).prototype);

    const actionSystem = new ActionSystem(em, fakeGui);
    const system = new MenuInputSystem(em, actionSystem);

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

  test('enter triggers actionSystem.handleAction with selected action id', () => {
    const em = EntityManager.create();

    const inputEntity = em.createEntity();
    inputEntity.addComponent(new InputComponent());

    const menuEntity = em.createEntity();
    const items = [new MenuItem('One', 'ACTION_ONE')];
    menuEntity.addComponent(new MenuComponent(items));
    menuEntity.addComponent(new TextComponent(''));
    menuEntity.addComponent(new IsVisibleComponent(true));

    // Fake GuiEcsManager for ActionSystem
    const fakeGui = {
      setActiveScreen: jest.fn(),
      stop: jest.fn()
    } as unknown as GuiEcsManager;
    // Make the fake GUI manager pass the instanceof check
     
    Object.setPrototypeOf(fakeGui as any, (GuiEcsManager as any).prototype);

    const actionSystem = new ActionSystem(em, fakeGui);
    // spy on handleAction
    const spy = jest.spyOn(actionSystem, 'handleAction');

    const system = new MenuInputSystem(em, actionSystem);

    const inputComp = em.getSingletonComponent(InputComponent)!;
    inputComp.setLastInput('enter');
    system.update();

    expect(spy).toHaveBeenCalledWith('ACTION_ONE');
  });
});
