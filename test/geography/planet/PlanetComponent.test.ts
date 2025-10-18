import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { Continent } from '../../../src/geography/planet/Continent';
import { createTestRandomComponent } from '../../util/RandomTestUtils';
import { RandomComponent } from '../../../src/random/RandomComponent';

describe('PlanetComponent continents', () => {
  let randomComponent: RandomComponent;

  beforeEach(() => {
    randomComponent = createTestRandomComponent('planet-component-test-seed');
  });
  it('stores provided continents without sharing the original array', () => {
    const continents = [Continent.create('Alpha')];

    const planet = PlanetComponent.create(
      'planet-1',
      'Test Planet',
      'sector-1',
      'Owner',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      continents
    );

    expect(planet.getContinents()).toHaveLength(1);
    continents.push(Continent.create('Beta'));
    expect(planet.getContinents()).toHaveLength(1);
  });

  it('returns copies of the continents array and allows adding new continents', () => {
    const initialContinent = Continent.create('Alpha');
    const planet = PlanetComponent.create(
      'planet-2',
      'Test Planet 2',
      'sector-9',
      'Owner',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      [initialContinent]
    );

    const snapshot = planet.getContinents();
    snapshot.push(Continent.create('Gamma'));
    expect(planet.getContinents()).toHaveLength(1);

    const newContinent = Continent.create('Delta');
    planet.addContinent(newContinent);

    const updated = planet.getContinents();
    expect(updated).toHaveLength(2);
    expect(updated[1]).toBe(newContinent);
  });

  it('returns the null continent when no continents are defined', () => {
    const planet = PlanetComponent.create(
      'planet-3',
      'Empty Planet',
      'sector-3',
      'Owner',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      []
    );

    const continent = planet.getRandomContinent(randomComponent);
    expect(continent).toBe(Continent.createNullContinent());
  });

  it('returns a continent when continents are defined', () => {
    const continent1 = Continent.create('Alpha');
    const continent2 = Continent.create('Beta');
    const continent3 = Continent.create('Gamma');
    
    const planet = PlanetComponent.create(
      'planet-4',
      'Multi-Continent Planet',
      'sector-4',
      'Owner',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      [continent1, continent2, continent3]
    );

    const randomContinent = planet.getRandomContinent(randomComponent);
    expect([continent1, continent2, continent3]).toContain(randomContinent);
  });

  it('returns different continents over multiple calls (probabilistic)', () => {
    const continent1 = Continent.create('Alpha');
    const continent2 = Continent.create('Beta');
    const continent3 = Continent.create('Gamma');
    
    const planet = PlanetComponent.create(
      'planet-5',
      'Random Test Planet',
      'sector-5',
      'Owner',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      [continent1, continent2, continent3]
    );

    // Get multiple random continents
    const results = new Set();
    for (let i = 0; i < 20; i++) {
      results.add(planet.getRandomContinent(randomComponent).getName());
    }

    // With 20 iterations on 3 continents, we should get at least 2 different ones
    // This is probabilistic but extremely unlikely to fail
    expect(results.size).toBeGreaterThanOrEqual(2);
  });
});

describe('PlanetComponent core properties', () => {
  const baseArgs = {
    id: 'planet-core',
    name: 'Core World',
    sectorId: 'sector-core',
    ownership: 'Initial Faction',
    status: PlanetStatus.NORMAL,
    developmentLevel: 7,
    fortificationLevel: 3,
    resourceSpecialization: PlanetResourceSpecialization.INDUSTRY,
    continents: [Continent.create('Mainland')]
  };

  const createPlanet = (overrides: Partial<typeof baseArgs> = {}): PlanetComponent => {
    const args = { ...baseArgs, ...overrides };
    return PlanetComponent.create(
      args.id,
      args.name,
      args.sectorId,
      args.ownership,
      args.status,
      args.developmentLevel,
      args.fortificationLevel,
      args.resourceSpecialization,
      args.continents
    );
  };

  it('clamps development and fortification levels on creation', () => {
    const planet = createPlanet({ developmentLevel: 25, fortificationLevel: 12 });

    expect(planet.getDevelopmentLevel()).toBe(10);
    expect(planet.getFortificationLevel()).toBe(5);
  });

  it('clamps development and fortification levels when updated', () => {
    const planet = createPlanet();

    planet.setDevelopmentLevel(0.2);
    planet.setFortificationLevel(-4);
    expect(planet.getDevelopmentLevel()).toBe(1);
    expect(planet.getFortificationLevel()).toBe(0);

    planet.setDevelopmentLevel(9.6);
    planet.setFortificationLevel(7.8);
    expect(planet.getDevelopmentLevel()).toBe(10);
    expect(planet.getFortificationLevel()).toBe(5);
  });

  it('updates ownership and resource specialization', () => {
    const planet = createPlanet();

    planet.setOwnership('New Faction');
    planet.setResourceSpecialization(PlanetResourceSpecialization.MILITARY);
    planet.setStatus(PlanetStatus.BESIEGED);

    expect(planet.getOwnership()).toBe('New Faction');
    expect(planet.getResourceSpecialization()).toBe(PlanetResourceSpecialization.MILITARY);
    expect(planet.getStatus()).toBe(PlanetStatus.BESIEGED);
  });
});
