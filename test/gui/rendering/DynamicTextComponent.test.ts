import { DynamicTextComponent } from '../../../src/gui/rendering/DynamicTextComponent';
import { Simulation } from '../../../src/simulation/Simulation';

describe('DynamicTextComponent', () => {
  test('getText is called with simulation and returns expected string', () => {
    const sim = Simulation.create();

    // create getText function that uses simulation state
    const getText = (s: Simulation) => (s.getIsRunning() ? 'running' : 'stopped');

    const comp = new DynamicTextComponent(getText);

    // Initially simulation is not running
    expect(comp.getText(sim)).toBe('stopped');

    // Start the simulation and expect the text to change
    sim.start();
    expect(comp.getText(sim)).toBe('running');
  });

  test('provided getText function is invoked with the same Simulation instance on each call', () => {
    const sim = Simulation.create();

    const spy = jest.fn(() => 'ok');
    const comp = new DynamicTextComponent(spy);

    // call getText multiple times
    expect(comp.getText(sim)).toBe('ok');
    expect(comp.getText(sim)).toBe('ok');

    // spy should have been called twice with the same simulation instance
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(sim);
  });

  test('constructor throws when getText is not a function', () => {
    // @ts-expect-error - intentionally passing wrong type
    expect(() => new DynamicTextComponent(null)).toThrow(TypeError);
    // @ts-expect-error - testing with number
    expect(() => new DynamicTextComponent(123)).toThrow(TypeError);
  });
});
