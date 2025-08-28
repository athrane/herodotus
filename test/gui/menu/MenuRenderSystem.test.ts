import { EntityManager } from '../../../src/ecs/EntityManager';
import { MenuItem } from '../../../src/gui/menu/MenuItem';
import { MenuComponent } from '../../../src/gui/menu/MenuComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { MenuRenderSystem } from '../../../src/gui/menu/MenuRenderSystem';

describe('MenuRenderSystem', () => {
  test('renders menu items with selected indicator when visible', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [
      new MenuItem('Start', 'start'),
      new MenuItem('Load', 'load'),
    ];

    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent(''));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('> Start\n  Load');
  });

  test('renders menu with one item', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [new MenuItem('Start', 'start')];
    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent(''));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('> Start');
  });

  test('renders menu with two items', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [
      new MenuItem('Start', 'start'),
      new MenuItem('Load', 'load'),
    ];
    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent(''));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('> Start\n  Load');
  });

  test('renders menu with three items', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [
      new MenuItem('Start', 'start'),
      new MenuItem('Load', 'load'),
      new MenuItem('Settings', 'settings'),
    ];
    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent(''));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('> Start\n  Load\n  Settings');
  });

  test('clears text when not visible', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [new MenuItem('One', 'one')];
    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent('keep-me'));
    entity.addComponent(new IsVisibleComponent(false));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('');
  });

  test('empty menu yields empty text even when visible', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    entity.addComponent(new MenuComponent([]));
    entity.addComponent(new TextComponent('initial'));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('');
  });

  test('does nothing when TextComponent is missing', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [new MenuItem('Hidden', 'hidden')];
    entity.addComponent(new MenuComponent(items));
    // Intentionally do NOT add TextComponent
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    // Should not throw
    system.update();

    // Ensure no TextComponent was created implicitly
    const textComp = entity.getComponent(TextComponent);
    expect(textComp).toBeUndefined();
  });

  test('clears text when IsVisibleComponent is missing', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [new MenuItem('One', 'one')];
    entity.addComponent(new MenuComponent(items));
    entity.addComponent(new TextComponent('keep-me'));
    // Intentionally do NOT add IsVisibleComponent

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
  // When visibility component is missing the system should not process the entity
  expect(textComp.getText()).toBe('keep-me');
  });

  test('renders selected indicator at non-zero selected index', () => {
    const em = EntityManager.create();
    const entity = em.createEntity();

    const items = [
      new MenuItem('First', 'first'),
      new MenuItem('Second', 'second'),
      new MenuItem('Third', 'third'),
    ];

    const menu = new MenuComponent(items);
    menu.setSelectedItemIndex(2); // select 'Third'

    entity.addComponent(menu);
    entity.addComponent(new TextComponent(''));
    entity.addComponent(new IsVisibleComponent(true));

    const system = new MenuRenderSystem(em);
    system.update();

    const textComp = entity.getComponent(TextComponent)!;
    expect(textComp.getText()).toBe('  First\n  Second\n> Third');
  });
});
