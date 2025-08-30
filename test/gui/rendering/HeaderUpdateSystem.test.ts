import { EntityManager } from '../../../src/ecs/EntityManager';
import { NameComponent } from '../../../src/ecs/NameComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { HeaderUpdateSystem } from '../../../src/gui/rendering/HeaderUpdateSystem';
import { Ecs } from '../../../src/ecs/Ecs';
import { TimeComponent } from '../../../src/time/TimeComponent';
import { Time } from '../../../src/time/Time';

describe('HeaderUpdateSystem', () => {
  test('updates header text for header entity', () => {
    const simulationEcs = Ecs.create();
    const guiEntityManager = EntityManager.create();

    // Create a time component in the simulation ECS
    const simulationEntityManager = simulationEcs.getEntityManager();
    const timeEntity = simulationEntityManager.createEntity();
    const time = new Time(2023);
    timeEntity.addComponent(new TimeComponent(time));

    // Create header entity in GUI ECS
    const headerEntity = guiEntityManager.createEntity();
    headerEntity.addComponent(new NameComponent(HeaderUpdateSystem.HEADER_ENTITY_NAME));
    headerEntity.addComponent(new TextComponent('initial'));

    const system = new HeaderUpdateSystem(guiEntityManager, simulationEcs);
    system.update();

    const textComponent = headerEntity.getComponent(TextComponent)!;
    expect(textComponent.getText()).toBe('Year: 2023 | Simulation: Running | Herodotus 1.0.0');
  });

  test('does not update non-header entities', () => {
    const simulationEcs = Ecs.create();
    const guiEntityManager = EntityManager.create();

    const nonHeaderEntity = guiEntityManager.createEntity();
    nonHeaderEntity.addComponent(new NameComponent('NotHeader'));
    nonHeaderEntity.addComponent(new TextComponent('original'));

    const system = new HeaderUpdateSystem(guiEntityManager, simulationEcs);
    system.update();

    const textComponent = nonHeaderEntity.getComponent(TextComponent)!;
    expect(textComponent.getText()).toBe('original');
  });

  test('handles missing time component gracefully', () => {
    const simulationEcs = Ecs.create();
    const guiEntityManager = EntityManager.create();

    const headerEntity = guiEntityManager.createEntity();
    headerEntity.addComponent(new NameComponent(HeaderUpdateSystem.HEADER_ENTITY_NAME));
    headerEntity.addComponent(new TextComponent('initial'));

    const system = new HeaderUpdateSystem(guiEntityManager, simulationEcs);
    system.update();

    const textComponent = headerEntity.getComponent(TextComponent)!;
    expect(textComponent.getText()).toBe('Year: 0000 | Simulation: Running | Herodotus 1.0.0');
  });

  test('factory method creates instance correctly', () => {
    const simulationEcs = Ecs.create();
    const guiEntityManager = EntityManager.create();

    const system = HeaderUpdateSystem.create(guiEntityManager, simulationEcs);

    expect(system).toBeInstanceOf(HeaderUpdateSystem);
  });
});
