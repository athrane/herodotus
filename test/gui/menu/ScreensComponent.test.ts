import { ScreensComponent } from '../../../src/gui/menu/ScreensComponent';
import { Entity } from '../../../src/ecs/Entity';
import { ScreenComponent } from '../../../src/gui/ScreenComponent';
import { Simulation } from '../../../src/simulation/Simulation';

describe('ScreensComponent', () => {
  test('add, get, has and remove screens', async () => {
    const sim = Simulation.create();

    const render = async () => {};
    const handle = async () => false;

  const screenEntity1 = Entity.create(new ScreenComponent(render, handle));
  const screenEntity2 = Entity.create(new ScreenComponent(render, handle));

    const screens = ScreensComponent.create();

    expect(screens.hasScreen('main')).toBe(false);

  screens.addScreen('main', screenEntity1.getId());
  screens.addScreen('help', screenEntity2.getId());

  expect(screens.hasScreen('main')).toBe(true);
  expect(screens.getScreen('main')).toBe(screenEntity1.getId());
  expect(screens.getScreen('help')).toBe(screenEntity2.getId());

    const all = screens.getAllScreens();
    expect(all.size).toBe(2);

    expect(screens.removeScreen('help')).toBe(true);
    expect(screens.hasScreen('help')).toBe(false);
  });
});
