import { Simulation } from '../../../src/simulation/Simulation';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { DynamicTextComponent } from '../../../src/gui/rendering/DynamicTextComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { DynamicTextUpdateSystem } from '../../../src/gui/rendering/DynamicTextUpdateSystem';

describe('DynamicTextUpdateSystem', () => {
  test('updates text for visible entities using the simulation', () => {
    const sim = Simulation.create();
    const em = sim.getEntityManager();

    const entity = em.createEntity();

    const dynamic = new DynamicTextComponent((guiEM, simEM) => 'dynamic-text');
    const text = new TextComponent('initial');
    const visible = new IsVisibleComponent(true);

    entity.addComponent(dynamic).addComponent(text).addComponent(visible);

    const system = new DynamicTextUpdateSystem(em, sim.getEcs());
    system.update();

    expect(text.getText()).toBe('dynamic-text');
  });

  test('does not update text for invisible entities', () => {
    const sim = Simulation.create();
    const em = sim.getEntityManager();

    const entity = em.createEntity();

    const dynamic = new DynamicTextComponent((guiEM, simEM) => 'should-not-see');
    const text = new TextComponent('stay');
    const visible = new IsVisibleComponent(false);

    entity.addComponent(dynamic).addComponent(text).addComponent(visible);

    const system = new DynamicTextUpdateSystem(em, sim.getEcs());
    system.update();

    expect(text.getText()).toBe('stay');
  });

  test('invokes dynamic getText with simulation and updates TextComponent for visible entity', () => {
    const sim = Simulation.create();
    const em = sim.getEntityManager();

    const entity = em.createEntity();

    const spy = jest.fn((guiEM, simEM) => 'spy-text');
    const dynamic = new DynamicTextComponent(spy);
    const text = new TextComponent('before');
    const visible = new IsVisibleComponent(true);

    entity.addComponent(dynamic).addComponent(text).addComponent(visible);

    const system = new DynamicTextUpdateSystem(em, sim.getEcs());
    system.update();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(em, sim.getEntityManager());
    expect(text.getText()).toBe('spy-text');
  });
});
