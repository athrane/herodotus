import { DynamicTextComponent } from '../../../src/gui/rendering/DynamicTextComponent';
import { Simulation } from '../../../src/simulation/Simulation';
import { EntityManager } from '../../../src/ecs/EntityManager';

describe('DynamicTextComponent', () => {
  test('getText is called with entity managers and returns expected string', () => {
    const sim = Simulation.create();
    const guiEM = EntityManager.create();
    const simEM = sim.getEntityManager();

    // create getText function that uses simulation state
    const getText = (guiEntityManager: EntityManager, simulationEntityManager: EntityManager) => {
      // For this test, we'll just return a simple string based on the presence of entity managers
      return guiEntityManager && simulationEntityManager ? 'managers-available' : 'no-managers';
    };

    const comp = new DynamicTextComponent(getText);

    // Call getText with both entity managers
    expect(comp.getText(guiEM, simEM)).toBe('managers-available');
  });

  test('provided getText function is invoked with the same EntityManager instances on each call', () => {
    const guiEM = EntityManager.create();
    const simEM = EntityManager.create();

    const spy = jest.fn((guiEntityManager: EntityManager, simulationEntityManager: EntityManager) => 'ok');
    const comp = new DynamicTextComponent(spy);

    // call getText multiple times
    expect(comp.getText(guiEM, simEM)).toBe('ok');
    expect(comp.getText(guiEM, simEM)).toBe('ok');

    // spy should have been called twice with the same entity manager instances
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(guiEM, simEM);
  });

  test('constructor throws when getText is not a function', () => {
    // @ts-expect-error - intentionally passing wrong type
    expect(() => new DynamicTextComponent(null)).toThrow(TypeError);
    // @ts-expect-error - testing with number
    expect(() => new DynamicTextComponent(123)).toThrow(TypeError);
  });
});
