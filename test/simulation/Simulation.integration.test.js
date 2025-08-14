import { Simulation } from '../../src/simulation/Simulation.ts';
import { SimulationDirector } from '../../src/simulation/builder/SimulationDirector.ts';
import { SimulationBuilder } from '../../src/simulation/builder/SimulationBuilder.ts';

describe('Simulation integration (no mocks)', () => {
  it('should run and stop a real simulation', () => {
    const simulation = Simulation.create();

    // Should not be running initially
    expect(simulation.isRunning()).toBe(false);

    simulation.start();
    expect(simulation.isRunning()).toBe(true);

    // Run a few ticks
    for (let i = 0; i < 5; i++) {
      simulation.tick();
    }

    simulation.stop();
    expect(simulation.isRunning()).toBe(false);
  });

  it('should allow multiple start/stop cycles', () => {
    const simulation = Simulation.create();
    for (let cycle = 0; cycle < 3; cycle++) {
      simulation.start();
      expect(simulation.isRunning()).toBe(true);
      simulation.tick();
      simulation.stop();
      expect(simulation.isRunning()).toBe(false);
    }
  });

  it('should build and run the simulation', () => {
    const director = SimulationDirector.create(SimulationBuilder.create());
    const simulation = director.build();

    expect(simulation).toBeDefined();
    expect(typeof simulation.start).toBe('function');
    expect(typeof simulation.tick).toBe('function');
    expect(typeof simulation.stop).toBe('function');

    // Start, tick, and stop the simulation
    simulation.start();
    expect(simulation.isRunning()).toBe(true);
    for (let i = 0; i < 3; i++) {
      simulation.tick();
    }
    simulation.stop();
    expect(simulation.isRunning()).toBe(false);
  });

  it('should simulate 5 ticks and then stop', () => {
    const simulation = Simulation.create();
    simulation.start();

    for (let i = 0; i < 5; i++) {
      simulation.tick();
    }

    simulation.stop();
    expect(simulation.isRunning()).toBe(false);
  });

});
