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

  test('constructor throws when getText is not a function', () => {
    // @ts-expect-error - intentionally passing wrong type
    expect(() => new DynamicTextComponent(null)).toThrow(TypeError);
    // @ts-expect-error - testing with number
    expect(() => new DynamicTextComponent(123)).toThrow(TypeError);
  });
});
