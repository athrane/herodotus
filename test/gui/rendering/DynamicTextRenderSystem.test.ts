import { Simulation } from '../../../src/simulation/Simulation';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { DynamicTextComponent } from '../../../src/gui/rendering/DynamicTextComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';
import { DynamicTextRenderSystem } from '../../../src/gui/rendering/DynamicTextRenderSystem';

describe('DynamicTextRenderSystem', () => {
  test('updates text for visible entities using the simulation', () => {
    const sim = Simulation.create();
    const em = sim.getEntityManager();

    const entity = em.createEntity();

    const dynamic = new DynamicTextComponent(() => 'dynamic-text');
    const text = new TextComponent('initial');
    const visible = new IsVisibleComponent(true);

    entity.addComponent(dynamic).addComponent(text).addComponent(visible);

    const system = new DynamicTextRenderSystem(em, sim);
    system.update();

    expect(text.getText()).toBe('dynamic-text');
  });

  test('does not update text for invisible entities', () => {
    const sim = Simulation.create();
    const em = sim.getEntityManager();

    const entity = em.createEntity();

    const dynamic = new DynamicTextComponent(() => 'should-not-see');
    const text = new TextComponent('stay');
    const visible = new IsVisibleComponent(false);

    entity.addComponent(dynamic).addComponent(text).addComponent(visible);

    const system = new DynamicTextRenderSystem(em, sim);
    system.update();

    expect(text.getText()).toBe('stay');
  });
});
