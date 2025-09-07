import { EntityManager } from '../../../src/ecs/EntityManager';
import { NameComponent } from '../../../src/ecs/NameComponent';
import { TextComponent } from '../../../src/gui/rendering/TextComponent';
import { FooterViewSystem } from '../../../src/gui/view/FooterViewSystem';

describe('FooterViewSystem', () => {
  test('updates footer text for footer entity', () => {
    const guiEntityManager = EntityManager.create();

    // Create footer entity in GUI ECS
    const footerEntity = guiEntityManager.createEntity();
    footerEntity.addComponent(new NameComponent(FooterViewSystem.FOOTER_ENTITY_NAME));
    footerEntity.addComponent(new TextComponent('initial'));

    const system = new FooterViewSystem(guiEntityManager);
    system.update();

    const textComponent = footerEntity.getComponent(TextComponent)!;
    expect(textComponent.getText()).toMatch(/^\[[\.\+]+\]$/);
  });

  test('does not update non-footer entities', () => {
    const guiEntityManager = EntityManager.create();

    const nonFooterEntity = guiEntityManager.createEntity();
    nonFooterEntity.addComponent(new NameComponent('NotFooter'));
    nonFooterEntity.addComponent(new TextComponent('original'));

    const system = new FooterViewSystem(guiEntityManager);
    system.update();

    const textComponent = nonFooterEntity.getComponent(TextComponent)!;
    expect(textComponent.getText()).toBe('original');
  });

  test('heartbeat animates between different positions', () => {
    const guiEntityManager = EntityManager.create();

    const footerEntity = guiEntityManager.createEntity();
    footerEntity.addComponent(new NameComponent(FooterViewSystem.FOOTER_ENTITY_NAME));
    footerEntity.addComponent(new TextComponent('initial'));

    const system = new FooterViewSystem(guiEntityManager);
    
    // Run multiple updates and collect the results
    const results: string[] = [];
    for (let i = 0; i < 6; i++) {
      system.update();
      const textComponent = footerEntity.getComponent(TextComponent)!;
      results.push(textComponent.getText());
    }

    // Check that we see different positions of the '+' character
    const uniqueResults = new Set(results);
    expect(uniqueResults.size).toBeGreaterThan(1);
    
    // Check that all results are valid heartbeat patterns
    results.forEach(result => {
      expect(result).toMatch(/^\[[\.\+]+\]$/);
      expect(result.split('+').length).toBe(2); // Should have exactly one '+'
    });
  });

  test('factory method creates instance correctly', () => {
    const guiEntityManager = EntityManager.create();

    const system = FooterViewSystem.create(guiEntityManager);

    expect(system).toBeInstanceOf(FooterViewSystem);
  });
});
