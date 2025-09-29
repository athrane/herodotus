import { Simulation } from '../../src/simulation/Simulation.ts';
import { SimulationBuilder } from '../../src/simulation/builder/SimulationBuilder.ts';
import { GeographicalFeatureTypeRegistry } from '../../src/geography/feature/GeographicalFeatureTypeRegistry.ts';

describe('Simulation integration (no mocks)', () => {
  beforeEach(() => {
    // Clear registry state between tests to avoid conflicts
    GeographicalFeatureTypeRegistry.clear();
  });

  afterEach(() => {
    // Clean up registry after each test
    GeographicalFeatureTypeRegistry.clear();
  });

  it('should run and stop a real simulation', () => {
    const builder = SimulationBuilder.create();
    builder.build();
    builder.buildData();
    builder.buildComponents();
    builder.buildSystems();
    builder.buildEntities();
    const ecs = builder.getEcs();
    const simulation = Simulation.create(ecs);

    // Should not be running initially
    expect(simulation.getIsRunning()).toBe(false);

    simulation.start();
    expect(simulation.getIsRunning()).toBe(true);

    // Run a few ticks
    for (let i = 0; i < 5; i++) {
      simulation.tick();
    }

    simulation.stop();
    expect(simulation.getIsRunning()).toBe(false);
  });

  it('should allow multiple start/stop cycles', () => {
    const builder = SimulationBuilder.create();
    builder.build();
    builder.buildData();
    builder.buildComponents();
    builder.buildSystems();
    builder.buildEntities();
    const ecs = builder.getEcs();
    const simulation = Simulation.create(ecs);
    for (let cycle = 0; cycle < 3; cycle++) {
      simulation.start();
      expect(simulation.getIsRunning()).toBe(true);
      simulation.tick();
      simulation.stop();
      expect(simulation.getIsRunning()).toBe(false);
    }
  });

  it('should build and run the simulation', () => {
    const builder = SimulationBuilder.create();
    builder.build();
    builder.buildData();
    builder.buildComponents();
    builder.buildSystems();
    builder.buildEntities();
    const ecs = builder.getEcs();
    const simulation = Simulation.create(ecs);

    expect(simulation).toBeDefined();
    expect(typeof simulation.start).toBe('function');
    expect(typeof simulation.tick).toBe('function');
    expect(typeof simulation.stop).toBe('function');

    // Start, tick, and stop the simulation
    simulation.start();
    expect(simulation.getIsRunning()).toBe(true);
    for (let i = 0; i < 3; i++) {
      simulation.tick();
    }
    simulation.stop();
    expect(simulation.getIsRunning()).toBe(false);
  });

  it('should simulate 5 ticks and then stop', () => {
    const builder = SimulationBuilder.create();
    builder.build();
    builder.buildData();
    builder.buildComponents();
    builder.buildSystems();
    builder.buildEntities();
    const ecs = builder.getEcs();
    const simulation = Simulation.create(ecs);
    simulation.start();

    for (let i = 0; i < 5; i++) {
      simulation.tick();
    }

    simulation.stop();
    expect(simulation.getIsRunning()).toBe(false);
  });

});
