import { GalaxyMapComponent } from '../../../src/geography/galaxy/GalaxyMapComponent';
import { Sector } from '../../../src/geography/galaxy/Sector';
import { Position } from '../../../src/geography/galaxy/Position';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { Continent } from '../../../src/geography/planet/Continent';
import { createTestRandomComponent } from '../../util/RandomTestUtils';
import { RandomComponent } from '../../../src/random/RandomComponent';

describe('GalaxyMapComponent', () => {
  let galaxy: GalaxyMapComponent;
  let randomComponent: RandomComponent;

  const createPlanet = (id: string, sectorId = 'sector-1'): PlanetComponent =>
    PlanetComponent.create(
      id,
      `Planet-${id}`,
      sectorId,
      'Faction',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      [Continent.create('Alpha')]
    );

  beforeEach(() => {
    galaxy = GalaxyMapComponent.create();
    randomComponent = createTestRandomComponent('galaxy-map-test-seed');
  });

  it('registers sectors and planets and associates them correctly', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);

    const planet = createPlanet('planet-a');
    galaxy.registerPlanet(planet);

    expect(galaxy.getSectorCount()).toBe(1);
    expect(galaxy.getPlanetCount()).toBe(1);
    expect(galaxy.getSectorById('sector-1')).toBe(sector);
    expect(galaxy.getPlanetById('planet-a')).toBe(planet);
    expect(galaxy.getPlanetsInSector('sector-1')).toEqual([planet]);
    expect(sector.hasPlanet('planet-a')).toBe(true);
  });

  it('connects planets bidirectionally', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);
    const planetA = createPlanet('planet-a');
    const planetB = createPlanet('planet-b');
    galaxy.registerPlanet(planetA);
    galaxy.registerPlanet(planetB);

    galaxy.connectPlanets('planet-a', 'planet-b');

    expect(galaxy.getConnectedPlanets('planet-a')).toEqual(['planet-b']);
    expect(galaxy.getConnectedPlanets('planet-b')).toEqual(['planet-a']);
  });

  it('returns an empty array when no connections exist', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);
    const planet = createPlanet('planet-a');
    galaxy.registerPlanet(planet);

    expect(galaxy.getConnectedPlanets('planet-a')).toEqual([]);
    expect(galaxy.getConnectedPlanets('unknown')).toEqual([]);
  });

  it('throws when registering a planet with an unknown sector', () => {
    const planet = createPlanet('planet-x', 'missing-sector');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const traceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});

    expect(() => galaxy.registerPlanet(planet)).toThrow(
      'Planet planet-x references unknown sector missing-sector.'
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Planet planet-x references unknown sector missing-sector.'
    );
    expect(traceSpy).toHaveBeenCalledWith('registerPlanet');

    errorSpy.mockRestore();
    traceSpy.mockRestore();
  });

  it('throws when connecting unknown planets', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);
    galaxy.registerPlanet(createPlanet('planet-a'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const traceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});

    expect(() => galaxy.connectPlanets('planet-a', 'planet-missing')).toThrow(
      'Cannot connect unknown planets planet-a and planet-missing.'
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Cannot connect unknown planets planet-a and planet-missing.'
    );
    expect(traceSpy).toHaveBeenCalledWith('connectPlanets');

    errorSpy.mockRestore();
    traceSpy.mockRestore();
  });

  it('clears all data when reset is called', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);
    galaxy.registerPlanet(createPlanet('planet-a'));

    galaxy.reset();

    expect(galaxy.getSectorCount()).toBe(0);
    expect(galaxy.getPlanetCount()).toBe(0);
    expect(galaxy.getSectors()).toEqual([]);
    expect(galaxy.getPlanetById('planet-a')).toBeUndefined();
  });

  it('returns null planet when getting random planet from empty galaxy', () => {
    const nullPlanet = galaxy.getRandomPlanet(randomComponent);
    expect(nullPlanet).toBeDefined();
    expect(nullPlanet.getId()).toBe('NULL_PLANET');
    expect(nullPlanet.getName()).toBe('Null Planet');
    expect(nullPlanet.getSectorId()).toBe('NULL_SECTOR');
  });

  it('returns the same null planet instance for consecutive calls on empty galaxy', () => {
    const nullPlanet1 = galaxy.getRandomPlanet(randomComponent);
    const nullPlanet2 = galaxy.getRandomPlanet(randomComponent);
    expect(nullPlanet1).toBe(nullPlanet2);
  });

  it('returns a random planet from the galaxy', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', Position.create(0, 0, 0));
    galaxy.addSector(sector);
    const planetA = createPlanet('planet-a');
    const planetB = createPlanet('planet-b');
    const planetC = createPlanet('planet-c');
    galaxy.registerPlanet(planetA);
    galaxy.registerPlanet(planetB);
    galaxy.registerPlanet(planetC);

    const randomPlanet = galaxy.getRandomPlanet(randomComponent);

    expect(randomPlanet).toBeDefined();
    expect([planetA, planetB, planetC]).toContain(randomPlanet);
  });
});
