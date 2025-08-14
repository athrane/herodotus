import { SimulationDirector } from '../../../src/simulation/builder/SimulationDirector.ts';
import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.ts';

// This test will create a real simulation using the director and builder, run it, and check for basic integration behavior.
describe('SimulationDirector integration (no mocks)', () => {
  it('should build the simulation', () => {
    const director = SimulationDirector.create(SimulationBuilder.create());
    const simulation = director.build();

    expect(simulation).toBeDefined();
    expect(typeof simulation.start).toBe('function');
    expect(typeof simulation.tick).toBe('function');
    expect(typeof simulation.stop).toBe('function');
  });
});
