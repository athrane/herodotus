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
});
